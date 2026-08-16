import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import type { ClinicProfile, ToothNotation } from '../../types';
import { exportToJSON } from '../../utils/printUtils';
import { 
  Building2, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2
} from 'lucide-react';

export const ClinicSettings: React.FC = () => {
  const { 
    clinicProfile, 
    updateClinicProfile, 
    resetToDefaults, 
    exportDatabase, 
    importDatabase, 
    setToothNotation 
  } = useDental();

  const [formData, setFormData] = useState<ClinicProfile>({ ...clinicProfile });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string>('');

  const handleChange = (field: keyof ClinicProfile, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBankChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      bankDetails: {
        accountName: prev.bankDetails?.accountName || '',
        accountNumber: prev.bankDetails?.accountNumber || '',
        ifscOrRouting: prev.bankDetails?.ifscOrRouting || '',
        bankName: prev.bankDetails?.bankName || '',
        upiId: prev.bankDetails?.upiId || '',
        [field]: value
      }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateClinicProfile(formData);
    setToothNotation(formData.defaultToothNotation);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const data = exportDatabase();
    const dateStr = new Date().toISOString().split('T')[0];
    exportToJSON(data, `Smile7dental_Full_Backup_${dateStr}.json`);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const success = importDatabase(json);
        if (success) {
          setImportStatus('Backup restored successfully!');
          if (json.clinicProfile) setFormData(json.clinicProfile);
        } else {
          setImportStatus('Failed to restore backup: Invalid format.');
        }
      } catch {
        setImportStatus('Error reading JSON file.');
      }
      setTimeout(() => setImportStatus(''), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl flex items-center justify-center shadow-inner">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Clinic Profile & Practice Configuration</h1>
            <p className="text-xs text-slate-500">
              Customize practice letterhead details, currency symbols, dental numbering, and system backups
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Changes Saved
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Practice Identity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            1. Practice & Letterhead Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Clinic Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tagline / Specialization</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dentist in Charge / Medical Director</label>
              <input
                type="text"
                required
                value={formData.dentistInCharge}
                onChange={(e) => handleChange('dentistInCharge', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tax ID / GSTIN / VAT Reg No.</label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => handleChange('taxId', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dental Council License No.</label>
              <input
                type="text"
                value={formData.dentalCouncilNumber}
                onChange={(e) => handleChange('dentalCouncilNumber', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Clinic Registration No.</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => handleChange('registrationNumber', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Address Line 1</label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => handleChange('addressLine1', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">State & Zip Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
                <input
                  type="text"
                  placeholder="Zip"
                  value={formData.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Currency, Tooth Notation & Billing Preferences */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            2. Billing & Notation Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                placeholder="$, ₹, £, €, AED"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Default Tooth Notation</label>
              <select
                value={formData.defaultToothNotation}
                onChange={(e) => handleChange('defaultToothNotation', e.target.value as ToothNotation)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                <option value="fdi">FDI Two-Digit (11-48 / 51-85)</option>
                <option value="universal">Universal System (1-32 / A-T)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Invoice Prefix</label>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 font-bold"
                placeholder="e.g. S7D"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="font-bold text-slate-700 block mb-1">Invoice Footer / Legal Terms</label>
              <textarea
                rows={2}
                value={formData.invoiceFooterNote}
                onChange={(e) => handleChange('invoiceFooterNote', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Bank & Settlement Details */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            3. Bank Account & Digital QR Settlement
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Account Beneficiary Name</label>
              <input
                type="text"
                value={formData.bankDetails?.accountName || ''}
                onChange={(e) => handleBankChange('accountName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Bank Name & Branch</label>
              <input
                type="text"
                value={formData.bankDetails?.bankName || ''}
                onChange={(e) => handleBankChange('bankName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Account Number</label>
              <input
                type="text"
                value={formData.bankDetails?.accountNumber || ''}
                onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">IFSC / Routing / Swift Code</label>
              <input
                type="text"
                value={formData.bankDetails?.ifscOrRouting || ''}
                onChange={(e) => handleBankChange('ifscOrRouting', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">UPI ID / Digital QR Handle</label>
              <input
                type="text"
                placeholder="smile7dental@upi"
                value={formData.bankDetails?.upiId || ''}
                onChange={(e) => handleBankChange('upiId', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-teal-800 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Clinic Settings
          </button>
        </div>
      </form>

      {/* Database Management & Portability */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>Data Portability & Database Management</span>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
            100% Offline LocalStorage
          </span>
        </h2>

        <p className="text-slate-500">
          Smile7dental stores all clinical data securely in your browser's persistent local storage. Export backup JSON files periodically or restore on a new terminal.
        </p>

        {importStatus && (
          <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl font-bold">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Full Database (JSON)
          </button>

          <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Restore Backup JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all patients, procedures, and invoices to initial demo data? This will overwrite existing records.')) {
                resetToDefaults();
                setFormData(clinicProfile);
                alert('Database reset to defaults.');
              }
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold flex items-center gap-1.5 transition-colors ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Sample Demo
          </button>
        </div>
      </div>
    </div>
  );
};
