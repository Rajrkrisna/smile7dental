import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Settings as SettingsIcon, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  HardDrive,
  ShieldCheck
} from 'lucide-react';
import type { ClinicProfile, ToothNotation } from '../../types';

export const SettingsView: React.FC = () => {
  const { 
    clinicProfile, 
    updateClinicProfile, 
    notation, 
    setNotation, 
    exportDatabase, 
    importDatabase, 
    resetDatabase 
  } = useClinic();

  const [formData, setFormData] = useState<ClinicProfile>(clinicProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClinicProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    const jsonStr = exportDatabase();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dental_clinic_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDatabase(content);
        if (success) {
          setImportStatus('Database successfully restored!');
        } else {
          setImportStatus('Failed to restore database. Invalid file format.');
        }
        setTimeout(() => setImportStatus(null), 3500);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="font-black text-lg text-slate-900 tracking-tight">
          Clinic Settings & Offline Backups
        </h2>
        <p className="text-xs text-slate-500">
          Configure clinician credentials, tax rates, tooth numbering preference, and export database files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Practice Profile Form (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900">
              Clinic & Clinician Information
            </h3>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved Successfully
              </span>
            )}
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Clinic Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clinicName}
                  onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Clinic Tagline / Specialty
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Principal Dentist Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.doctorName}
                  onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Degrees & Qualifications
                </label>
                <input
                  type="text"
                  value={formData.doctorQualification}
                  onChange={e => setFormData({ ...formData, doctorQualification: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Dental Council Registration #
                </label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={e => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  State / National Dental Council
                </label>
                <input
                  type="text"
                  value={formData.dentalCouncil}
                  onChange={e => setFormData({ ...formData, dentalCouncil: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Clinic Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Clinic Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Physical Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={formData.currencySymbol}
                  onChange={e => setFormData({ ...formData, currencySymbol: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Default Tooth Chart Notation
                </label>
                <select
                  value={notation}
                  onChange={e => setNotation(e.target.value as ToothNotation)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="fdi">FDI Two-Digit (11-48) - Dental Council of India (DCI) Standard</option>
                  <option value="universal">Universal System (1-32 / A-T)</option>
                  <option value="palmer">Palmer Notation (8┘..1┘ / └1..└8)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Invoice Number Prefix
                </label>
                <input
                  type="text"
                  value={formData.invoicePrefix}
                  onChange={e => setFormData({ ...formData, invoicePrefix: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Invoice Footer Notice / Warranty Disclaimer
              </label>
              <textarea
                rows={2}
                value={formData.footerNote}
                onChange={e => setFormData({ ...formData, footerNote: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold bg-[#004884] hover:bg-sky-700 text-white rounded-xl shadow-xs shadow-[#004884]/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save Practice Settings
              </button>
            </div>
          </form>
        </div>

        {/* Data Portability & Backup Manager (1 Col) */}
        <div className="space-y-4">
          {/* Backup & Disaster Recovery */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#004884]" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Local Database & Backup
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Your software runs 100% locally on this machine without internet. Save a JSON backup file to your laptop or USB drive at any time.
            </p>

            {importStatus && (
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-[#004884] text-xs font-bold">
                {importStatus}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#004884] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#004884]" />
                Export Database Backup (.JSON)
              </button>

              <label className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer block text-center">
                <Upload className="w-4 h-4 text-slate-500 inline" />
                <span>Restore From Backup File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset Database */}
          <div className="bg-white rounded-2xl border border-rose-200 shadow-2xs p-6 space-y-3">
            <h3 className="font-extrabold text-xs text-rose-800 uppercase tracking-wider">
              Danger Zone
            </h3>
            <p className="text-[11px] text-slate-500">
              Reset database will clear all current records and reload the clean demo dataset.
            </p>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset the database? Make sure you have exported a backup first!')) {
                  resetDatabase();
                }
              }}
              className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset To Clean Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

