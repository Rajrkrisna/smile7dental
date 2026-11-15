import React, { useState, useRef } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { X, Plus, Trash2, CreditCard, RotateCcw, AlertCircle, Search, Check, Sparkles } from 'lucide-react';
import type { Invoice, InvoiceItem } from '../../types';

interface NewInvoiceModalProps {
  onClose: () => void;
  preselectedPatientId?: string;
  onInvoiceCreated?: (invoice: Invoice) => void;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  onClose,
  preselectedPatientId,
  onInvoiceCreated
}) => {
  const { patients, procedures, clinicProfile, createInvoice } = useClinic();

  const [patientId, setPatientId] = useState(preselectedPatientId || patients[0]?.id || '');
  const [selectedProcId, setSelectedProcId] = useState(procedures[0]?.id || '');
  const [customProcName, setCustomProcName] = useState('');
  const [customTooth, setCustomTooth] = useState('16');
  const [customSurface, setCustomSurface] = useState('');
  
  // Treatment search & category filter state
  const [treatmentSearchQuery, setTreatmentSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Manual amount input - starts empty or 0, never locked to a fixed price
  const [manualPrice, setManualPrice] = useState<number | ''>('');
  const [amountError, setAmountError] = useState<string | null>(null);
  const manualAmountInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(clinicProfile.defaultTaxRate || 0);
  const [paidAmount, setPaidAmount] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI / QR' | 'Bank Transfer' | 'Insurance'>('UPI / QR');
  const [notes, setNotes] = useState('');

  const selectedPatient = patients.find(p => p.id === patientId);

  // Dynamic category list from catalog
  const categories = ['All', ...Array.from(new Set(procedures.map(p => p.category)))];

  // Live filtered procedures based on search query and category
  const filteredProcedures = procedures.filter(proc => {
    const matchesCategory = selectedCategory === 'All' || proc.category === selectedCategory;
    const q = treatmentSearchQuery.trim().toLowerCase();
    if (!q) return matchesCategory;
    const matches = 
      proc.name.toLowerCase().includes(q) ||
      proc.code.toLowerCase().includes(q) ||
      proc.category.toLowerCase().includes(q);
    return matchesCategory && matches;
  });

  const selectedProc = procedures.find(p => p.id === selectedProcId);

  // Popular quick procedures with real codes and multi-keyword fallbacks
  const popularTreatments = [
    { label: 'Consultation', code: 'CONS-01', keywords: ['consultation', 'oral exam', 'checkup'] },
    { label: 'Scaling & Cleaning', code: 'SCL-01', keywords: ['scaling', 'polishing', 'ultrasonic'] },
    { label: 'Root Canal (RCT)', code: 'RCT-MOL', keywords: ['root canal', 'rct', 'endodontic'] },
    { label: 'Composite Filling', code: 'COMP-01', keywords: ['composite', 'filling', 'restoration'] },
    { label: 'Zirconia Crown', code: 'ZIRC-01', keywords: ['zirconia', 'crown', 'cad/cam'] },
    { label: 'PFM Crown', code: 'PFM-01', keywords: ['pfm', 'ceramic crown'] },
    { label: 'Extraction', code: 'EXT-01', keywords: ['extraction', 'removal', 'tooth extraction'] },
    { label: 'Wisdom Surgery', code: 'IMPACT-01', keywords: ['impaction', 'wisdom', 'third molar'] },
    { label: 'RVG X-Ray', code: 'RVG-01', keywords: ['rvg', 'iopa', 'radiograph', 'x-ray'] }
  ];

  const findProcedureForQuickOption = (pt: typeof popularTreatments[0]) => {
    // 1. Direct code match
    let match = procedures.find(p => p.code.toLowerCase() === pt.code.toLowerCase());
    if (match) return match;
    // 2. Starts with code prefix (e.g. RCT)
    const prefix = pt.code.split('-')[0].toLowerCase();
    match = procedures.find(p => p.code.toLowerCase().startsWith(prefix));
    if (match) return match;
    // 3. Keyword matching in name or category
    match = procedures.find(p =>
      pt.keywords.some(k => p.name.toLowerCase().includes(k) || p.category.toLowerCase().includes(k))
    );
    return match || procedures[0];
  };

  const handleSelectProcedure = (procId: string) => {
    setSelectedProcId(procId);
    setCustomProcName('');
    setAmountError(null);
  };

  const handleQuickSelect = (pt: typeof popularTreatments[0]) => {
    const match = findProcedureForQuickOption(pt);
    if (match) {
      setSelectedCategory('All');
      setTreatmentSearchQuery('');
      setSelectedProcId(match.id);
      setCustomProcName('');
      setAmountError(null);
      // Auto-focus manual amount input so doctor can immediately type the price
      setTimeout(() => {
        manualAmountInputRef.current?.focus();
        manualAmountInputRef.current?.select();
      }, 50);
    }
  };

  const handleAddItem = () => {
    if (manualPrice === '' || (typeof manualPrice === 'number' && manualPrice < 0)) {
      setAmountError('Please enter an agreed amount in Rs. before adding this treatment.');
      return;
    }
    setAmountError(null);

    const proc = procedures.find(p => p.id === selectedProcId);
    const procName = customProcName.trim() || proc?.name || 'Dental Procedure';
    const cost = Number(manualPrice);

    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      procedureId: proc?.id || 'custom-proc',
      procedureName: procName,
      procedureCode: proc?.code || 'CUSTOM',
      teeth: customTooth.trim() ? [customTooth.trim()] : ['Full Mouth'],
      surfaces: customSurface.trim() || undefined,
      cost: cost
    };

    const newItems = [...items, newItem];
    setItems(newItems);

    // Reset procedure input fields for next entry
    setManualPrice('');
    setCustomSurface('');
    setCustomProcName('');

    // Update paid amount suggestion to match full subtotal by default
    const sub = newItems.reduce((acc, i) => acc + i.cost, 0);
    setPaidAmount(sub);
  };

  const handleRemoveItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    const sub = updated.reduce((acc, i) => acc + i.cost, 0);
    setPaidAmount(sub);
  };

  const handleUpdateItemCost = (id: string, newCost: number) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, cost: Math.max(0, newCost) } : item
    );
    setItems(updated);
    const sub = updated.reduce((acc, i) => acc + i.cost, 0);
    setPaidAmount(sub);
  };

  const handleClearAllItems = () => {
    setItems([]);
    setPaidAmount(0);
    setDiscount(0);
  };

  const subtotal = items.reduce((acc, i) => acc + i.cost, 0);
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = (taxableAmount * taxRate) / 100;
  const grandTotal = taxableAmount + taxAmount;
  const effectivePaid = typeof paidAmount === 'number' ? paidAmount : 0;
  const balance = Math.max(0, grandTotal - effectivePaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalItems = [...items];

    // If doctor typed an amount in the manual price box and clicked "Save & Finalize Invoice" directly
    if (typeof manualPrice === 'number' && manualPrice >= 0) {
      const proc = procedures.find(p => p.id === selectedProcId);
      const procName = customProcName.trim() || proc?.name || 'Dental Procedure';
      finalItems.push({
        id: `item-${Date.now()}`,
        procedureId: proc?.id || 'custom-proc',
        procedureName: procName,
        procedureCode: proc?.code || 'CUSTOM',
        teeth: customTooth.trim() ? [customTooth.trim()] : ['Full Mouth'],
        surfaces: customSurface.trim() || undefined,
        cost: manualPrice
      });
    }

    if (!selectedPatient) {
      alert('Please select a patient.');
      return;
    }

    if (finalItems.length === 0) {
      setAmountError('Please enter the procedure amount in Rs. and add the treatment.');
      return;
    }

    const calculatedSubtotal = finalItems.reduce((acc, i) => acc + i.cost, 0);
    const calculatedTaxable = Math.max(0, calculatedSubtotal - discount);
    const calculatedTax = (calculatedTaxable * taxRate) / 100;
    const calculatedGrandTotal = calculatedTaxable + calculatedTax;
    const finalPaid = typeof paidAmount === 'number' ? paidAmount : calculatedGrandTotal;
    const calculatedBalance = Math.max(0, calculatedGrandTotal - finalPaid);
    const status = calculatedBalance === 0 ? 'Paid' : finalPaid > 0 ? 'Partial' : 'Unpaid';

    const newInv = createInvoice({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientPhone: selectedPatient.phone,
      date: new Date().toISOString().split('T')[0],
      doctor: clinicProfile.doctorName,
      items: finalItems,
      subtotal: calculatedSubtotal,
      discount,
      taxRate,
      taxAmount: calculatedTax,
      total: calculatedGrandTotal,
      paidAmount: finalPaid,
      balance: calculatedBalance,
      paymentMethod,
      status,
      notes: notes.trim() || undefined
    });

    if (onInvoiceCreated) onInvoiceCreated(newInv);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Generate Dental Bill (Rs. / ₹)
            </h3>
            <p className="text-xs text-slate-500">
              Add treatments with custom agreed amounts entered manually per procedure.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg leading-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Patient Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Select Patient *
            </label>
            <select
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#004884]/20"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.patientId} - {p.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Add Treatment Line Item Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                + Add Treatment Procedure & Enter Manual Amount
              </span>
              <span className="text-[11px] font-bold text-[#004884] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Manual Fee Entry
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-slate-700 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-[#004884]" />
                  <span>Search Treatment Procedure Catalog</span>
                </label>
                <span className="text-[10px] text-slate-500 font-medium">
                  {filteredProcedures.length} {filteredProcedures.length === 1 ? 'treatment' : 'treatments'} found
                </span>
              </div>

              {/* Instant Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={treatmentSearchQuery}
                  onChange={e => {
                    const val = e.target.value;
                    setTreatmentSearchQuery(val);
                    if (val.trim()) {
                      const firstMatch = procedures.find(p => 
                        p.name.toLowerCase().includes(val.toLowerCase()) ||
                        p.code.toLowerCase().includes(val.toLowerCase()) ||
                        p.category.toLowerCase().includes(val.toLowerCase())
                      );
                      if (firstMatch) {
                        setSelectedProcId(firstMatch.id);
                        setCustomProcName('');
                      }
                    }
                  }}
                  placeholder="Type to search (e.g. RCT, Crown, Scaling, Extraction, Composite, X-Ray, Denture...)"
                  className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#004884]/20 focus:border-[#004884] font-medium shadow-2xs"
                />
                {treatmentSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setTreatmentSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 text-[11px]">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#004884] text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Quick Treatment Shortcuts - Always Available */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3 text-amber-500" /> 1-Click Quick Options:
                </span>
                {popularTreatments.map(pt => {
                  const match = findProcedureForQuickOption(pt);
                  const isSelected = match && selectedProcId === match.id && !customProcName;
                  return (
                    <button
                      key={pt.code}
                      type="button"
                      onClick={() => handleQuickSelect(pt)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                        isSelected
                          ? 'bg-[#004884] text-white border-[#004884] ring-2 ring-sky-200 font-black'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/60 hover:text-[#004884]'
                      }`}
                      title={`Select ${pt.label} (${match?.code || pt.code})`}
                    >
                      {isSelected ? '✓ ' : '+ '}{pt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Procedure Dropdown & Custom Option */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Selected Procedure Catalog Item
                </label>
                {filteredProcedures.length > 0 ? (
                  <select
                    value={selectedProcId}
                    onChange={e => handleSelectProcedure(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#004884]/20 focus:border-[#004884]"
                  >
                    {filteredProcedures.map(proc => (
                      <option key={proc.id} value={proc.id}>
                        [{proc.category}] {proc.code} — {proc.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                    <span>No matches in catalog.</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomProcName(treatmentSearchQuery);
                        setTreatmentSearchQuery('');
                      }}
                      className="font-bold underline text-[#004884] cursor-pointer"
                    >
                      Use as Custom Name
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Or Custom Procedure Description
                </label>
                <input
                  type="text"
                  value={customProcName}
                  onChange={e => setCustomProcName(e.target.value)}
                  placeholder="e.g. Zirconia Bridge (3 units) or Special Aligners"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#004884]/20 focus:border-[#004884]"
                />
              </div>
            </div>

            {/* Active Selection Confirmation Pill */}
            <div className="bg-sky-50/70 border border-sky-200 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-extrabold text-[#004884] truncate">
                  {customProcName.trim() ? customProcName.trim() : (selectedProc?.name || 'Procedure Selected')}
                </span>
                {!customProcName && selectedProc && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-[#004884] border border-sky-200 shrink-0">
                    {selectedProc.code}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-500 shrink-0">
                Enter fee amount below
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Tooth Number(s)</label>
                <input
                  type="text"
                  value={customTooth}
                  onChange={e => setCustomTooth(e.target.value)}
                  placeholder="e.g. 16, 26 or Full Mouth"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Surfaces (Optional)</label>
                <input
                  type="text"
                  value={customSurface}
                  onChange={e => setCustomSurface(e.target.value)}
                  placeholder="e.g. MOD, O, B"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              {/* MANUAL AMOUNT INPUT - PROMINENT */}
              <div>
                <label className="text-[11px] font-black text-[#004884] block mb-1">
                  Manual Amount (Rs. / ₹) *
                </label>
                <input
                  ref={manualAmountInputRef}
                  type="number"
                  min={0}
                  step={1}
                  value={manualPrice}
                  onChange={e => {
                    setAmountError(null);
                    setManualPrice(e.target.value === '' ? '' : Number(e.target.value));
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddItem();
                    }
                  }}
                  placeholder="e.g. 1500"
                  className={`w-full text-xs p-2 rounded-lg border-2 ${
                    amountError ? 'border-rose-500 bg-rose-50/40 text-rose-900' : 'border-[#004884] bg-white text-[#002244]'
                  } font-black focus:outline-none focus:ring-2 focus:ring-[#004884]/20`}
                />
                {amountError && (
                  <p className="text-[10px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{amountError}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleAddItem}
                className="px-4 py-2 rounded-lg bg-[#004884] hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Treatment To Bill
              </button>
            </div>
          </div>

          {/* Current Items Table with Inline Manual Amount Editing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Bill Items ({items.length}) — Amounts Editable
              </span>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllItems}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear All
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No procedures added yet. Select a procedure, enter the agreed amount in Rs., and click "Add Treatment To Bill".
              </p>
            ) : (
              <div className="space-y-1.5">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-xs gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-extrabold text-slate-900 block truncate">{item.procedureName}</span>
                      <span className="text-slate-500 text-[11px]">
                        Tooth: <strong className="text-[#004884]">{item.teeth.join(', ')}</strong> {item.surfaces ? `(${item.surfaces})` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs font-bold text-slate-500">Rs.</span>
                      <input
                        type="number"
                        min={0}
                        value={item.cost}
                        onChange={e => handleUpdateItemCost(item.id, Number(e.target.value))}
                        title="Edit amount manually"
                        className="w-24 p-1.5 rounded-lg border border-slate-300 font-black text-slate-900 text-right bg-slate-50 focus:bg-white focus:border-[#004884]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals & Payment Breakdown */}
          {items.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Discount (Rs.)</label>
                  <input
                    type="number"
                    min={0}
                    value={discount}
                    onChange={e => setDiscount(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    min={0}
                    value={taxRate}
                    onChange={e => setTaxRate(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Amount Paid (Rs.)</label>
                  <input
                    type="number"
                    min={0}
                    value={paidAmount}
                    onChange={e => setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Payment Mode</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white font-bold"
                  >
                    <option value="UPI / QR">UPI / QR (GPay / PhonePe / Paytm)</option>
                    <option value="Cash">Cash Counter</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Bank Transfer">Bank Wire / IMPS</option>
                    <option value="Insurance">Insurance</option>
                  </select>
                </div>
              </div>

              {/* Total Summary Banner in Rs. - Smile7 Signature Gradient */}
              <div className="bg-gradient-to-r from-[#002244] via-[#004884] to-[#0284c7] text-white p-4 rounded-xl flex items-center justify-between text-xs shadow-xs">
                <div>
                  <span className="text-sky-200 block text-[10px] uppercase font-bold">Grand Total</span>
                  <span className="text-lg font-black text-white">
                    Rs. {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-sky-200 block text-[10px] uppercase font-bold">Paid Now</span>
                  <span className="text-lg font-black text-emerald-300">
                    Rs. {effectivePaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-sky-200 block text-[10px] uppercase font-bold">Balance Due</span>
                  <span className={`text-lg font-black ${balance > 0 ? 'text-amber-300' : 'text-sky-100'}`}>
                    Rs. {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={items.length === 0 && (manualPrice === '' || typeof manualPrice !== 'number')}
              className="px-5 py-2.5 text-xs font-bold bg-[#004884] hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl shadow-xs shadow-[#004884]/20 cursor-pointer"
            >
              Save & Finalize Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
