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
  ShieldCheck,
  Cloud,
  RefreshCw,
  ExternalLink,
  Eye,
  EyeOff,
  AlertTriangle,
  Lock,
  Database,
  Smartphone,
  Laptop
} from 'lucide-react';
import type { ClinicProfile, ToothNotation } from '../../types';
import { testGitHubConnection, type GitHubSyncConfig } from '../../utils/githubSync';

export const SettingsView: React.FC = () => {
  const { 
    clinicProfile, 
    updateClinicProfile, 
    notation, 
    setNotation, 
    exportDatabase, 
    importDatabase, 
    resetDatabase,
    syncConfig,
    syncStatus,
    lastSyncTime,
    lastSyncError,
    updateSyncConfig,
    triggerSync
  } = useClinic();

  const [formData, setFormData] = useState<ClinicProfile>(clinicProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // GitHub Sync State
  const [syncForm, setSyncForm] = useState<GitHubSyncConfig>(syncConfig);
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [syncActionMessage, setSyncActionMessage] = useState<string | null>(null);
  const [isSyncingAction, setIsSyncingAction] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClinicProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveSyncConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSyncConfig(syncForm);
    setSyncActionMessage('Cloud sync configuration saved!');
    setTimeout(() => setSyncActionMessage(null), 3000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await testGitHubConnection(syncForm);
    setIsTesting(false);
    setTestResult(result);
  };

  const handleManualSync = async (direction: 'bidirectional' | 'push' | 'pull') => {
    setIsSyncingAction(true);
    setSyncActionMessage(null);
    // Ensure form values are saved first
    updateSyncConfig(syncForm);
    const result = await triggerSync(direction);
    setIsSyncingAction(false);
    setSyncActionMessage(result.message);
    setTimeout(() => setSyncActionMessage(null), 4500);
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

      {/* GitHub Cloud Database Sync Section */}
      <div className="bg-gradient-to-br from-white via-slate-50/50 to-sky-50/30 rounded-2xl border border-sky-100 shadow-xs p-6 space-y-6">
        {/* Header & Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-[#004884] shadow-xs shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-slate-900 tracking-tight">
                  GitHub Cloud Database & Real-Time Sync
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#004884] text-white">
                  Laptop &larr;&rarr; Mobile
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Synchronize patients, invoices, odontograms, appointments, and prescriptions seamlessly between your Laptop and Mobile phone.
              </p>
            </div>
          </div>

          {/* Sync Status Badge */}
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
              syncStatus === 'syncing' || isSyncingAction
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : syncStatus === 'success'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : syncStatus === 'error'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : syncForm.token
                ? 'bg-sky-50 text-[#004884] border-sky-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {syncStatus === 'syncing' || isSyncingAction ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
              ) : syncStatus === 'success' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : syncStatus === 'error' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              ) : (
                <Database className="w-3.5 h-3.5 text-[#004884]" />
              )}
              <span>
                {syncStatus === 'syncing' || isSyncingAction
                  ? 'Syncing In Progress...'
                  : syncStatus === 'success'
                  ? `In Sync (${lastSyncTime || 'Recently'})`
                  : syncStatus === 'error'
                  ? 'Sync Error'
                  : syncForm.token
                  ? 'Configured (Idle)'
                  : 'Not Connected'}
              </span>
            </div>
          </div>
        </div>

        {/* Sync Status Notifications */}
        {syncActionMessage && (
          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-[#004884] text-xs font-bold flex items-center justify-between">
            <span>{syncActionMessage}</span>
          </div>
        )}

        {lastSyncError && syncStatus === 'error' && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{lastSyncError}</span>
          </div>
        )}

        {/* Connection Form */}
        <form onSubmit={handleSaveSyncConfig} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GitHub Personal Access Token */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  GitHub Personal Access Token (PAT) *
                </label>
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#004884] hover:underline flex items-center gap-1"
                >
                  Generate Token <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_xxxx"
                  value={syncForm.token}
                  onChange={e => setSyncForm({ ...syncForm, token: e.target.value })}
                  className="w-full text-xs p-2.5 pr-10 rounded-xl border border-slate-200 font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#004884]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Needs <span className="font-mono font-bold">repo</span> permission (to read/write database in your GitHub repository).
              </p>
            </div>

            {/* Optional Master Encryption PIN */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Medical Data Encryption PIN (Optional)
              </label>
              <input
                type="password"
                placeholder="e.g. 24892 (Doctor's private PIN)"
                value={syncForm.encryptionPin || ''}
                onChange={e => setSyncForm({ ...syncForm, encryptionPin: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#004884]/20"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                When set, all data stored on GitHub is encrypted with client-side AES-256-GCM.
              </p>
            </div>
          </div>

          {/* Repo & Branch Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Repository (Owner/Repo)
              </label>
              <input
                type="text"
                value={syncForm.owner + '/' + syncForm.repo}
                readOnly
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Database Branch
              </label>
              <input
                type="text"
                value={syncForm.branch}
                onChange={e => setSyncForm({ ...syncForm, branch: e.target.value })}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Database File Path
              </label>
              <input
                type="text"
                value={syncForm.filePath}
                onChange={e => setSyncForm({ ...syncForm, filePath: e.target.value })}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white font-mono"
              />
            </div>
          </div>

          {/* Auto-Sync Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="autoSync"
              checked={syncForm.autoSync}
              onChange={e => setSyncForm({ ...syncForm, autoSync: e.target.checked })}
              className="w-4 h-4 rounded text-[#004884] cursor-pointer"
            />
            <label htmlFor="autoSync" className="text-xs font-bold text-slate-700 cursor-pointer">
              Enable Auto-Sync (Automatically syncs on app open and every 3 minutes)
            </label>
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {testResult.success ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !syncForm.token}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />}
                Test Connection
              </button>

              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-[#004884] hover:bg-sky-700 rounded-xl transition-all cursor-pointer shadow-xs shadow-[#004884]/20 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save Sync Settings
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleManualSync('bidirectional')}
                disabled={isSyncingAction || !syncForm.token}
                className="px-4 py-2 text-xs font-bold text-[#004884] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#004884] ${isSyncingAction ? 'animate-spin' : ''}`} />
                Sync Now (Smart Merge)
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Upload local database to GitHub? This will update the cloud database with all local records.')) {
                    handleManualSync('push');
                  }
                }}
                disabled={isSyncingAction || !syncForm.token}
                className="px-3 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                title="Force push local database to GitHub"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                Push to Cloud
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Download database from GitHub? This will overwrite local records with cloud data.')) {
                    handleManualSync('pull');
                  }
                }}
                disabled={isSyncingAction || !syncForm.token}
                className="px-3 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                title="Force pull database from GitHub to this device"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Pull from Cloud
              </button>
            </div>
          </div>
        </form>

        {/* Quick Sync Guide Info Box */}
        <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/80 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#004884]" />
            <span><strong>Mobile & Laptop Sync:</strong> Paste your GitHub Token into Settings on both your phone app and laptop app. They will automatically stay in sync through GitHub!</span>
          </div>
        </div>
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

