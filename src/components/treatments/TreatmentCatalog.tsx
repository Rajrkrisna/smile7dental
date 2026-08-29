import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import type { DentalProcedure, ProcedureCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { exportToCSV } from '../../utils/printUtils';
import { 
  Search, 
  Plus, 
  Download, 
  Edit3, 
  Trash2, 
  Clock, 
  X,
  Stethoscope 
} from 'lucide-react';

export const TreatmentCatalog: React.FC = () => {
  const { procedures, addProcedure, updateProcedure, deleteProcedure, toggleProcedureActive, clinicProfile } = useDental();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // New / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<DentalProcedure | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProcedureCategory>('Restorative');
  const [defaultCost, setDefaultCost] = useState<number>(100);
  const [standardDurationMin, setStandardDurationMin] = useState<number>(30);
  const [isToothSpecific, setIsToothSpecific] = useState<boolean>(true);
  const [taxRatePercent, setTaxRatePercent] = useState<number>(0);
  const [description, setDescription] = useState('');

  const categories: string[] = [
    'All',
    'Diagnostic',
    'Preventive',
    'Restorative',
    'Endodontics',
    'Periodontics',
    'Prosthodontics',
    'Oral Surgery',
    'Orthodontics',
    'Pediatric',
    'Cosmetic'
  ];

  const filteredProcedures = procedures.filter(proc => {
    const matchesSearch = 
      proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (proc.description && proc.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || proc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = () => {
    setEditingProcedure(null);
    setCode(`S7-${Math.floor(100 + Math.random() * 900)}`);
    setName('');
    setCategory('Restorative');
    setDefaultCost(100);
    setStandardDurationMin(30);
    setIsToothSpecific(true);
    setTaxRatePercent(0);
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proc: DentalProcedure) => {
    setEditingProcedure(proc);
    setCode(proc.code);
    setName(proc.name);
    setCategory(proc.category);
    setDefaultCost(proc.defaultCost);
    setStandardDurationMin(proc.standardDurationMin);
    setIsToothSpecific(proc.isToothSpecific);
    setTaxRatePercent(proc.taxRatePercent);
    setDescription(proc.description || '');
    setIsModalOpen(true);
  };

  const handleSaveProcedure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter procedure name.');
      return;
    }

    if (editingProcedure) {
      updateProcedure({
        ...editingProcedure,
        code: code.trim(),
        name: name.trim(),
        category,
        defaultCost: Number(defaultCost) || 0,
        standardDurationMin: Number(standardDurationMin) || 0,
        isToothSpecific,
        taxRatePercent: Number(taxRatePercent) || 0,
        description: description.trim() || undefined
      });
    } else {
      addProcedure({
        code: code.trim() || `S7-${Date.now().toString().slice(-4)}`,
        name: name.trim(),
        category,
        defaultCost: Number(defaultCost) || 0,
        standardDurationMin: Number(standardDurationMin) || 0,
        isToothSpecific,
        taxRatePercent: Number(taxRatePercent) || 0,
        description: description.trim() || undefined,
        isActive: true
      });
    }

    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const data = filteredProcedures.map(p => ({
      Code: p.code,
      ProcedureName: p.name,
      Category: p.category,
      DefaultCost: p.defaultCost,
      DurationMinutes: p.standardDurationMin,
      ToothSpecific: p.isToothSpecific ? 'Yes' : 'No',
      Status: p.isActive ? 'Active' : 'Inactive'
    }));
    exportToCSV(data, `Smile7dental_Procedure_Catalog_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl flex items-center justify-center shadow-inner">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Procedure & Fee Schedule</h1>
            <p className="text-xs text-slate-500">
              Manage dental treatment catalog, CDT codes, standard fees, and tooth mapping rules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Price List
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-sm shadow-teal-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            + Add New Procedure
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search procedures by code (e.g. D2740, D3330) or treatment name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-xs"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat} {cat !== 'All' ? `(${procedures.filter(p => p.category === cat).length})` : `(${procedures.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Procedure Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProcedures.map((proc) => (
          <div
            key={proc.id}
            className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-xs ${
              proc.isActive ? 'border-slate-200 hover:border-teal-400' : 'border-slate-200 opacity-60 bg-slate-50/70'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                  {proc.code}
                </span>
                {proc.defaultCost > 0 ? (
                  <span className="text-base font-black text-slate-900">
                    {formatCurrency(proc.defaultCost, clinicProfile.currencySymbol)}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                    Manual Fee
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-sm mb-1">{proc.name}</h3>
              {proc.description && (
                <p className="text-xs text-slate-500 line-clamp-2 mb-2">{proc.description}</p>
              )}

              <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 mt-2">
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                  {proc.category}
                </span>
                <span className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                  <Clock className="w-3 h-3" />
                  {proc.standardDurationMin} mins
                </span>
                {proc.isToothSpecific ? (
                  <span className="bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded-md">
                    Tooth Specific
                  </span>
                ) : (
                  <span className="bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded-md">
                    Arch / Full Mouth
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => toggleProcedureActive(proc.id)}
                className={`font-semibold text-[11px] flex items-center gap-1 ${
                  proc.isActive ? 'text-emerald-700 hover:text-emerald-900' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${proc.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                {proc.isActive ? 'Active' : 'Disabled'}
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(proc)}
                  className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                  title="Edit Procedure"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete ${proc.name}?`)) {
                      deleteProcedure(proc.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Procedure"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <h2 className="text-base font-bold text-slate-900">
                {editingProcedure ? 'Edit Dental Procedure' : 'Add New Dental Procedure'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProcedure} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">CDT / Clinic Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProcedureCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Procedure / Treatment Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Porcelain Veneer, Zirconia Crown"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Standard Fee ({clinicProfile.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={defaultCost}
                    onChange={(e) => setDefaultCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={standardDurationMin}
                    onChange={(e) => setStandardDurationMin(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isToothSpecific}
                    onChange={(e) => setIsToothSpecific(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span>Tooth Specific Procedure (Requires Tooth Number Selection)</span>
                </label>
                <p className="text-[11px] text-slate-400 ml-6">
                  When enabled, billing this procedure prompts the interactive dental chart for tooth mapping.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Clinical Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details, material specifications, warranty terms..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Procedure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
