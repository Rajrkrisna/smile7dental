import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import type { InvoiceItem, ProcedureCategory, PaymentMethod } from '../../types';
import { DentalChart } from '../dental-chart/DentalChart';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import { 
  Trash2, 
  UserPlus, 
  Search, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  Stethoscope
} from 'lucide-react';

interface InvoiceBuilderProps {
  onSuccess: (invoiceId: string) => void;
  onCancel: () => void;
  preselectedPatientId?: string;
  onOpenAddPatient: () => void;
}

export const InvoiceBuilder: React.FC<InvoiceBuilderProps> = ({
  onSuccess,
  onCancel,
  preselectedPatientId,
  onOpenAddPatient
}) => {
  const { 
    clinicProfile, 
    patients, 
    procedures, 
    createInvoice, 
    activeToothNotation 
  } = useDental();

  // Selected Patient
  const [selectedPatientId, setSelectedPatientId] = useState<string>(preselectedPatientId || '');
  const [patientSearch, setPatientSearch] = useState<string>('');

  // Invoice Meta
  const [doctorName, setDoctorName] = useState<string>(clinicProfile.dentistInCharge);
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [nextAppointmentDate, setNextAppointmentDate] = useState<string>('');
  const [prescriptions, setPrescriptions] = useState<string>('');

  // Items State
  const [items, setItems] = useState<InvoiceItem[]>([]);

  // Item Builder Modal / Temporary State
  const [activeItemIndexForToothPicker, setActiveItemIndexForToothPicker] = useState<number | null>(null);
  const [procedureSearchTerm, setProcedureSearchTerm] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Overall Discount & Tax
  const [additionalDiscountType, setAdditionalDiscountType] = useState<'percentage' | 'fixed'>('fixed');
  const [additionalDiscountValue, setAdditionalDiscountValue] = useState<number>(0);
  const [overallTaxRate, setOverallTaxRate] = useState<number>(clinicProfile.defaultTaxRate || 0);

  // Initial Payment Recording
  const [recordInitialPayment, setRecordInitialPayment] = useState<boolean>(true);
  const [initialPaymentAmount, setInitialPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentRefNumber, setPaymentRefNumber] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('Initial consultation & procedure payment');

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Filtered patients for dropdown search
  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.phone.includes(patientSearch) ||
    p.patientNumber.toLowerCase().includes(patientSearch.toLowerCase())
  );

  // Filtered procedures
  const filteredProcedures = procedures.filter(proc => {
    const matchesSearch = proc.name.toLowerCase().includes(procedureSearchTerm.toLowerCase()) ||
                          proc.code.toLowerCase().includes(procedureSearchTerm.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'All' || proc.category === selectedCategoryFilter;
    return matchesSearch && matchesCat && proc.isActive;
  });

  const categories: string[] = ['All', ...Array.from(new Set(procedures.map(p => p.category)))];

  // Helper to add procedure as line item with 0 default cost (manual pricing)
  const handleAddProcedureItem = (proc: typeof procedures[0]) => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      procedureId: proc.id,
      procedureCode: proc.code,
      procedureName: proc.name,
      category: proc.category as ProcedureCategory,
      toothNumbers: [],
      surface: '',
      quantity: 1,
      unitPrice: 0,
      discountType: 'fixed',
      discountValue: 0,
      taxPercent: 0,
      notes: '',
      lineTotal: 0
    };

    const nextItems = [...items, newItem];
    setItems(nextItems);
    
    // If it's tooth specific, automatically open tooth selector for this newly added item
    if (proc.isToothSpecific) {
      setActiveItemIndexForToothPicker(nextItems.length - 1);
    }
  };

  // Helper to update specific line item
  const updateItem = (index: number, updates: Partial<InvoiceItem>) => {
    setItems(prev => {
      const copy = [...prev];
      const current = { ...copy[index], ...updates };

      // Calculate line total
      const rawTotal = current.quantity * current.unitPrice;
      const discount = current.discountType === 'percentage' 
        ? (rawTotal * (current.discountValue || 0)) / 100 
        : (current.discountValue || 0);
      
      const discounted = Math.max(0, rawTotal - discount);
      const tax = (discounted * (current.taxPercent || 0)) / 100;
      current.lineTotal = Math.round((discounted + tax) * 100) / 100;

      copy[index] = current;
      return copy;
    });
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    setActiveItemIndexForToothPicker(null);
  };

  const clearAllItems = () => {
    if (window.confirm('Remove all added procedures from this invoice?')) {
      setItems([]);
      setActiveItemIndexForToothPicker(null);
    }
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const totalItemDiscount = items.reduce((acc, item) => {
    const raw = item.quantity * item.unitPrice;
    return acc + (item.discountType === 'percentage' ? (raw * item.discountValue) / 100 : item.discountValue);
  }, 0);

  const subtotalAfterItemDiscounts = Math.max(0, subtotal - totalItemDiscount);
  
  const additionalDiscountAmt = additionalDiscountType === 'percentage'
    ? (subtotalAfterItemDiscounts * (additionalDiscountValue || 0)) / 100
    : (additionalDiscountValue || 0);

  const netAfterAllDiscounts = Math.max(0, subtotalAfterItemDiscounts - additionalDiscountAmt);
  const totalTax = (netAfterAllDiscounts * (overallTaxRate || 0)) / 100;
  const grandTotal = Math.round((netAfterAllDiscounts + totalTax) * 100) / 100;

  const effectiveInitialPayment = recordInitialPayment ? Math.min(grandTotal, initialPaymentAmount) : 0;
  const balanceDue = Math.max(0, grandTotal - effectiveInitialPayment);

  // Quick set full payment
  const handlePayInFull = () => {
    setRecordInitialPayment(true);
    setInitialPaymentAmount(grandTotal);
  };

  // Submission handler
  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert('Please select a patient or create a new patient record.');
      return;
    }

    if (items.length === 0) {
      alert('Please add at least one dental procedure to the invoice.');
      return;
    }

    const payments = [];
    if (recordInitialPayment && initialPaymentAmount > 0) {
      payments.push({
        id: `pay-${Date.now()}`,
        invoiceId: '',
        amount: initialPaymentAmount,
        date: new Date().toISOString(),
        method: paymentMethod,
        referenceNumber: paymentRefNumber,
        notes: paymentNotes,
        receivedBy: doctorName || clinicProfile.dentistInCharge
      });
    }

    const newInvoice = createInvoice({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      patientPhone: selectedPatient.phone,
      patientAge: selectedPatient.age,
      patientGender: selectedPatient.gender,
      patientAddress: selectedPatient.address,
      doctorName: doctorName || clinicProfile.dentistInCharge,
      date: invoiceDate,
      dueDate: dueDate || invoiceDate,
      items,
      subtotal,
      totalItemDiscount,
      additionalDiscountType,
      additionalDiscountValue,
      totalTax,
      grandTotal,
      amountPaid: effectiveInitialPayment,
      balanceDue,
      status: balanceDue === 0 ? 'paid' : (effectiveInitialPayment > 0 ? 'partial' : 'unpaid'),
      payments,
      clinicalNotes,
      nextAppointmentDate,
      prescriptions
    });

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    onSuccess(newInvoice.id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl flex items-center justify-center shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Dental Invoice</h1>
            <p className="text-xs text-slate-500">
              {clinicProfile.name} • Tooth Mapping & Treatment Ledger
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSubmitInvoice}
            className="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-sm shadow-teal-600/30 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Generate & Finalize Bill
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmitInvoice} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT TWO COLUMNS: Patient Details & Treatment Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Selection Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                1. Patient Information
              </h2>
              <button
                type="button"
                onClick={onOpenAddPatient}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 flex items-center gap-1.5 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                + Quick Add Patient
              </button>
            </div>

            {/* Patient Search / Selector */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search patient by name, phone (+1...), or ID (PAT-1001)..."
                  value={patientSearch}
                  onChange={(e) => {
                    setPatientSearch(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                />
              </div>

              {/* Patient Suggestions or Current selection */}
              {patientSearch && (
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl bg-white divide-y divide-slate-100 shadow-lg z-20">
                  {filteredPatients.length === 0 ? (
                    <div className="p-3 text-xs text-slate-500 text-center">
                      No patients found matching "{patientSearch}".
                      <button
                        type="button"
                        onClick={onOpenAddPatient}
                        className="ml-2 font-bold text-teal-600 underline"
                      >
                        Create New?
                      </button>
                    </div>
                  ) : (
                    filteredPatients.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPatientId(p.id);
                          setPatientSearch('');
                        }}
                        className="w-full text-left p-3 hover:bg-teal-50/60 flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{p.fullName} <span className="text-slate-400 font-mono font-normal">({p.patientNumber})</span></p>
                          <p className="text-slate-500">{p.phone} • {p.age} Yrs • {p.gender}</p>
                        </div>
                        {p.outstandingBalance > 0 && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Due: {formatCurrency(p.outstandingBalance, clinicProfile.currencySymbol)}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Selected Patient Banner */}
              {selectedPatient ? (
                <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-base">{selectedPatient.fullName}</span>
                      <span className="bg-teal-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {selectedPatient.patientNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold">Phone:</span> {selectedPatient.phone} &nbsp;|&nbsp; 
                      <span className="font-semibold">Age/Sex:</span> {selectedPatient.age}Y, {selectedPatient.gender}
                    </p>
                    {selectedPatient.address && (
                      <p className="text-xs text-slate-500 truncate max-w-md">{selectedPatient.address}</p>
                    )}
                  </div>

                  {/* Medical Alerts pill */}
                  {selectedPatient.medicalAlerts && selectedPatient.medicalAlerts.length > 0 && (
                    <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg text-xs flex items-center gap-1.5 text-rose-900">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <div>
                        <span className="font-bold text-[10px] uppercase tracking-wide block text-rose-700">Medical Alerts</span>
                        <span>{selectedPatient.medicalAlerts.join(', ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                  Select an existing patient above or click "+ Quick Add Patient" to start billing.
                </div>
              )}
            </div>

            {/* Doctor & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Attending Clinician</label>
                <div className="relative">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Doctor Name"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Invoice Date</label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Due Date</label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Treatment & Procedure Catalog Picker */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                2. Dental Procedures & Treatment Catalogue
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Click any procedure below to add to invoice
              </span>
            </div>

            {/* Categories & Search */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search dental treatments by name or CDT code (e.g. D3330, Scaling, Extraction)..."
                    value={procedureSearchTerm}
                    onChange={(e) => setProcedureSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === cat
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Fast Procedure Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredProcedures.slice(0, 15).map(proc => (
                <button
                  key={proc.id}
                  type="button"
                  onClick={() => handleAddProcedureItem(proc)}
                  className="group text-left p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 bg-white hover:bg-teal-50/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                        {proc.code}
                      </span>
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50/80 border border-teal-200 px-2 py-0.5 rounded-md group-hover:bg-teal-100 transition-colors">
                        ₹ Enter Amount
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-2 mt-1">
                      {proc.name}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                    <span>{proc.category}</span>
                    <span className="text-teal-600 font-bold group-hover:translate-x-0.5 transition-transform">
                      + Add to Bill
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Invoice Line Items Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                3. Billed Treatments ({items.length})
              </h2>

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllItems}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Items</span>
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">No procedures added yet</p>
                <p className="text-xs text-slate-400">
                  Select treatments from the catalogue above to add them to this bill with custom manual pricing.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className={`p-4 rounded-xl border transition-all ${
                      activeItemIndexForToothPicker === index
                        ? 'border-teal-500 bg-teal-50/20 ring-2 ring-teal-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 pb-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-slate-800 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                            {index + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">{item.procedureName}</span>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {item.procedureCode}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block">{item.category}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveItemIndexForToothPicker(
                              activeItemIndexForToothPicker === index ? null : index
                            );
                          }}
                          className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                            activeItemIndexForToothPicker === index
                              ? 'bg-teal-600 text-white border-teal-700'
                              : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          {item.toothNumbers && item.toothNumbers.length > 0
                            ? `Teeth: ${item.toothNumbers.join(', ')}`
                            : 'Select Teeth / Arch'}
                        </button>

                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="px-3 py-1 text-xs font-bold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                          title="Remove this treatment from bill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Tooth Picker Drawer for this line item */}
                    {activeItemIndexForToothPicker === index && (
                      <div className="my-3 pt-3 border-t border-teal-200/60">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-teal-900">
                            Map Tooth Numbers for "{item.procedureName}"
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveItemIndexForToothPicker(null)}
                            className="text-xs text-teal-700 font-semibold hover:underline"
                          >
                            Done Mapping ✓
                          </button>
                        </div>
                        <DentalChart
                          selectedTeeth={item.toothNumbers || []}
                          onChange={(teeth) => updateItem(index, { toothNumbers: teeth })}
                          notation={activeToothNotation}
                          isCompact={true}
                        />
                      </div>
                    )}

                    {/* Line Item Pricing & Surface inputs */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">Tooth Surface / Note</label>
                        <input
                          type="text"
                          placeholder="e.g. MOD, Buccal, Incisal"
                          value={item.surface || ''}
                          onChange={(e) => updateItem(index, { surface: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-amber-900 block mb-1">
                          Amount / Rate ({clinicProfile.currencySymbol})
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          placeholder="Enter fee (₹)..."
                          value={item.unitPrice === 0 ? '' : item.unitPrice}
                          onChange={(e) => updateItem(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2.5 py-1.5 bg-amber-50/70 border-2 border-amber-300 focus:border-teal-500 rounded-lg text-slate-900 font-black text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, { quantity: parseInt(e.target.value, 10) || 1 })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-center font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">Item Discount</label>
                        <div className="flex">
                          <input
                            type="number"
                            min="0"
                            value={item.discountValue || 0}
                            onChange={(e) => updateItem(index, { discountValue: parseFloat(e.target.value) || 0 })}
                            className="w-full px-2 py-1.5 bg-slate-50 border border-r-0 border-slate-200 rounded-l-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                          <select
                            value={item.discountType}
                            onChange={(e) => updateItem(index, { discountType: e.target.value as 'fixed' | 'percentage' })}
                            className="bg-slate-100 border border-slate-200 rounded-r-lg px-1.5 text-[11px] font-semibold text-slate-700"
                          >
                            <option value="fixed">{clinicProfile.currencySymbol}</option>
                            <option value="percentage">%</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-right flex flex-col justify-end">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">Item Total</span>
                        <span className="text-sm font-black text-slate-900">
                          {formatCurrency(item.lineTotal, clinicProfile.currencySymbol)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clinical Instructions, Rx & Follow Up */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              4. Clinical Observations & Next Appointment
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinical Treatment Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Successful 3 canal obturation, composite shade A2, post-op instructions delivered..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Prescriptions / Medication (Rx)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Amoxicillin 500mg (1 TDS x 5d), Ibuprofen 400mg PRN..."
                  value={prescriptions}
                  onChange={(e) => setPrescriptions(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Follow-up / Next Visit Date</label>
              <input
                type="date"
                value={nextAppointmentDate}
                onChange={(e) => setNextAppointmentDate(e.target.value)}
                className="w-full sm:w-64 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Financial Summary & Immediate Payment */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 sticky top-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-100 flex justify-between items-center">
              <span>Bill Summary</span>
              <span className="text-[11px] font-mono text-teal-700 font-bold">
                {clinicProfile.invoicePrefix}-DRAFT
              </span>
            </h2>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold text-slate-800">
                  {formatCurrency(subtotal, clinicProfile.currencySymbol)}
                </span>
              </div>

              {totalItemDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Item Discounts</span>
                  <span>-{formatCurrency(totalItemDiscount, clinicProfile.currencySymbol)}</span>
                </div>
              )}

              {/* Special Invoice Discount */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Special Discount:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      value={additionalDiscountValue || ''}
                      onChange={(e) => setAdditionalDiscountValue(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-right font-bold text-slate-800"
                    />
                    <select
                      value={additionalDiscountType}
                      onChange={(e) => setAdditionalDiscountType(e.target.value as 'fixed' | 'percentage')}
                      className="bg-slate-100 border border-slate-200 rounded px-1.5 py-1 text-xs font-semibold"
                    >
                      <option value="fixed">{clinicProfile.currencySymbol}</option>
                      <option value="percentage">%</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tax Rate Setting */}
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-semibold">Tax / GST Rate:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={overallTaxRate}
                    onChange={(e) => setOverallTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-14 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-right font-bold text-slate-800"
                  />
                  <span className="text-slate-500 font-bold">%</span>
                </div>
              </div>

              {totalTax > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax</span>
                  <span className="font-semibold">{formatCurrency(totalTax, clinicProfile.currencySymbol)}</span>
                </div>
              )}

              {/* Grand Total Highlight */}
              <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900 uppercase">Grand Total</span>
                <span className="text-2xl font-black text-teal-900">
                  {formatCurrency(grandTotal, clinicProfile.currencySymbol)}
                </span>
              </div>
            </div>

            {/* Payment Collection Section */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 pt-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recordInitialPayment}
                    onChange={(e) => {
                      setRecordInitialPayment(e.target.checked);
                      if (e.target.checked && initialPaymentAmount === 0) {
                        setInitialPaymentAmount(grandTotal);
                      }
                    }}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-xs font-bold text-slate-800">Collect Payment Now</span>
                </label>

                {recordInitialPayment && (
                  <button
                    type="button"
                    onClick={handlePayInFull}
                    className="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline"
                  >
                    Pay in Full
                  </button>
                )}
              </div>

              {recordInitialPayment && (
                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Payment Amount Received ({clinicProfile.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={grandTotal}
                      step="any"
                      value={initialPaymentAmount || ''}
                      onChange={(e) => setInitialPaymentAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['card', 'cash', 'upi', 'insurance', 'bank_transfer'] as PaymentMethod[]).map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setPaymentMethod(m)}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold uppercase transition-colors border ${
                            paymentMethod === m
                              ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {m === 'bank_transfer' ? 'Wire' : m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Txn / Auth / UPI Reference No.</label>
                    <input
                      type="text"
                      placeholder="e.g. TXN-998342 / UPI Ref"
                      value={paymentRefNumber}
                      onChange={(e) => setPaymentRefNumber(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Payment Receipt Note</label>
                    <input
                      type="text"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* Balance Due Notification */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Remaining Balance:</span>
                <span className={`font-black text-sm ${balanceDue > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {formatCurrency(balanceDue, clinicProfile.currencySymbol)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                Generate & Save Invoice
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
