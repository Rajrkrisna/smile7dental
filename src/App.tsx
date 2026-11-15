import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { OdontogramStudio } from './components/odontogram/OdontogramStudio';
import { PatientDirectory } from './components/patients/PatientDirectory';
import { AppointmentCalendar } from './components/appointments/AppointmentCalendar';
import { VisitHistoryView } from './components/visits/VisitHistoryView';
import { ClinicalNotesView } from './components/clinical-notes/ClinicalNotesView';
import { PrescriptionGenerator } from './components/prescriptions/PrescriptionGenerator';
import { BillingView } from './components/billing/BillingView';
import { FinanceView } from './components/finance/FinanceView';
import { SettingsView } from './components/settings/SettingsView';

import { NewPatientModal } from './components/patients/NewPatientModal';
import { PatientProfileModal } from './components/patients/PatientProfileModal';
import { NewAppointmentModal } from './components/appointments/NewAppointmentModal';
import { NewInvoiceModal } from './components/billing/NewInvoiceModal';
import { InvoicePrintModal } from './components/billing/InvoicePrintModal';
import { Check, X } from 'lucide-react';

import type { Invoice, Patient } from './types';

const DentalAppMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modal states
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [preselectedPatientForInvoice, setPreselectedPatientForInvoice] = useState<string | undefined>(undefined);
  const [preselectedPatientForAppt, setPreselectedPatientForAppt] = useState<string | undefined>(undefined);
  const [toastNotification, setToastNotification] = useState<{ message: string; sub?: string } | null>(null);

  const showToast = (message: string, sub?: string) => {
    setToastNotification({ message, sub });
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  const handleOpenNewInvoice = (patientId?: string) => {
    setPreselectedPatientForInvoice(patientId);
    setIsNewInvoiceOpen(true);
  };

  const handleOpenNewAppointment = (patientId?: string) => {
    setPreselectedPatientForAppt(patientId);
    setIsNewAppointmentOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        onOpenNewPatient={() => setIsNewPatientOpen(true)}
        onOpenNewAppointment={() => handleOpenNewAppointment()}
        onOpenNewInvoice={() => handleOpenNewInvoice()}
        onNavigateTab={setActiveTab}
      />

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Dynamic Content Views */}
        <div className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard
              onNavigateTab={setActiveTab}
              onOpenNewPatient={() => setIsNewPatientOpen(true)}
              onOpenNewAppointment={() => handleOpenNewAppointment()}
              onOpenNewInvoice={() => handleOpenNewInvoice()}
              onSelectPatient={id => setSelectedPatientId(id)}
            />
          )}

          {activeTab === 'odontogram' && (
            <OdontogramStudio
              onOpenPatientDossier={id => setSelectedPatientId(id)}
              onOpenNewInvoice={id => handleOpenNewInvoice(id)}
            />
          )}

          {activeTab === 'patients' && (
            <PatientDirectory
              onOpenNewPatient={() => setIsNewPatientOpen(true)}
              onSelectPatient={id => setSelectedPatientId(id)}
              onOpenNewInvoiceForPatient={id => handleOpenNewInvoice(id)}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentCalendar
              onOpenNewAppointment={() => handleOpenNewAppointment()}
              onSelectPatient={id => setSelectedPatientId(id)}
            />
          )}

          {activeTab === 'visits' && (
            <VisitHistoryView
              onSelectPatient={id => setSelectedPatientId(id)}
              onOpenNewInvoice={id => handleOpenNewInvoice(id)}
            />
          )}

          {activeTab === 'clinical-notes' && (
            <ClinicalNotesView
              onSelectPatient={id => setSelectedPatientId(id)}
            />
          )}

          {activeTab === 'prescriptions' && (
            <PrescriptionGenerator />
          )}

          {activeTab === 'billing' && (
            <BillingView
              onOpenNewInvoice={() => handleOpenNewInvoice()}
              onViewInvoice={inv => setViewingInvoice(inv)}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceView />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}
        </div>
      </main>

      {/* MODAL: Register New Patient */}
      {isNewPatientOpen && (
        <NewPatientModal
          onClose={() => setIsNewPatientOpen(false)}
          onPatientAdded={pat => {
            // STRICT REQUIREMENT: Do NOT navigate to the patient profile / odontogram page.
            // Keep the user right on their current view and show a clear toast.
            showToast(
              `Patient "${pat.name}" registered successfully`,
              `ID: ${pat.patientId} • Phone: ${pat.phone}. Tap name anytime to chart or map treatments.`
            );
          }}
          onOpenExistingPatient={pat => {
            // Only if user explicitly clicked "Open Dossier" on a duplicate match
            setSelectedPatientId(pat.id);
          }}
        />
      )}

      {/* MODAL: Full Patient Dossier (Odontogram, SOAP, Rx, Dues) */}
      {selectedPatientId && (
        <PatientProfileModal
          patientId={selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
          onOpenNewInvoiceForPatient={id => handleOpenNewInvoice(id)}
          onOpenNewAppointmentForPatient={id => handleOpenNewAppointment(id)}
        />
      )}

      {/* MODAL: Schedule Chair Appointment */}
      {isNewAppointmentOpen && (
        <NewAppointmentModal
          preselectedPatientId={preselectedPatientForAppt}
          onClose={() => {
            setIsNewAppointmentOpen(false);
            setPreselectedPatientForAppt(undefined);
          }}
        />
      )}

      {/* MODAL: New Invoice Builder */}
      {isNewInvoiceOpen && (
        <NewInvoiceModal
          preselectedPatientId={preselectedPatientForInvoice}
          onClose={() => {
            setIsNewInvoiceOpen(false);
            setPreselectedPatientForInvoice(undefined);
          }}
          onInvoiceCreated={inv => {
            setViewingInvoice(inv);
          }}
        />
      )}

      {/* MODAL: Invoice Print / Thermal Receipt View */}
      {viewingInvoice && (
        <InvoicePrintModal
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
        />
      )}

      {/* TOAST NOTIFICATION: Patient Registration / System Feedback */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/60 max-w-sm flex items-start gap-3 backdrop-blur-md">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white leading-tight">
                {toastNotification.message}
              </p>
              {toastNotification.sub && (
                <p className="text-[11px] text-slate-300 mt-1">
                  {toastNotification.sub}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setToastNotification(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <ClinicProvider>
      <DentalAppMain />
    </ClinicProvider>
  );
}

export default App;

