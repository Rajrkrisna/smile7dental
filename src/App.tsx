import React, { useState } from 'react';
import { DentalProvider } from './context/DentalContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ClinicDashboard } from './components/dashboard/ClinicDashboard';
import { InvoiceList } from './components/invoices/InvoiceList';
import { InvoiceBuilder } from './components/invoices/InvoiceBuilder';
import { InvoiceDetailModal } from './components/invoices/InvoiceDetailModal';
import { PatientList } from './components/patients/PatientList';
import { PatientDetailModal } from './components/patients/PatientDetailModal';
import { AddPatientModal } from './components/patients/AddPatientModal';
import { TreatmentCatalog } from './components/treatments/TreatmentCatalog';
import { PaymentHistory } from './components/payments/PaymentHistory';
import { ClinicSettings } from './components/settings/ClinicSettings';

const DentalAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Modals & Sub-views State
  const [viewInvoiceId, setViewInvoiceId] = useState<string | null>(null);
  const [invoicePrintMode, setInvoicePrintMode] = useState<'none' | 'a4' | 'thermal'>('none');
  
  const [viewPatientId, setViewPatientId] = useState<string | null>(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState<boolean>(false);
  const [invoicePreselectedPatientId, setInvoicePreselectedPatientId] = useState<string | undefined>(undefined);

  // Handlers
  const handleOpenCreateInvoice = (patientId?: string) => {
    setInvoicePreselectedPatientId(patientId);
    setActiveTab('new-invoice');
  };

  const handleInvoiceCreated = (invoiceId: string) => {
    setActiveTab('invoices');
    setViewInvoiceId(invoiceId);
    setInvoicePrintMode('none');
  };

  const handlePrintA4 = (invoiceId: string) => {
    setViewInvoiceId(invoiceId);
    setInvoicePrintMode('a4');
  };

  const handlePrintThermal = (invoiceId: string) => {
    setViewInvoiceId(invoiceId);
    setInvoicePrintMode('thermal');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenCreateInvoice={() => handleOpenCreateInvoice()}
        activeTab={activeTab}
      />

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setInvoicePreselectedPatientId(undefined);
          }}
          onOpenCreateInvoice={() => handleOpenCreateInvoice()}
        />

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <ClinicDashboard
              onOpenCreateInvoice={() => handleOpenCreateInvoice()}
              onOpenAddPatient={() => setIsAddPatientOpen(true)}
              onViewInvoice={(id) => {
                setViewInvoiceId(id);
                setInvoicePrintMode('none');
              }}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'invoices' && (
            <InvoiceList
              onOpenCreateInvoice={() => handleOpenCreateInvoice()}
              onViewInvoice={(id) => {
                setViewInvoiceId(id);
                setInvoicePrintMode('none');
              }}
              onPrintInvoiceA4={handlePrintA4}
              onPrintThermal={handlePrintThermal}
            />
          )}

          {activeTab === 'new-invoice' && (
            <InvoiceBuilder
              preselectedPatientId={invoicePreselectedPatientId}
              onSuccess={handleInvoiceCreated}
              onCancel={() => setActiveTab('invoices')}
              onOpenAddPatient={() => setIsAddPatientOpen(true)}
            />
          )}

          {activeTab === 'patients' && (
            <PatientList
              onOpenAddPatient={() => setIsAddPatientOpen(true)}
              onSelectPatient={(id) => setViewPatientId(id)}
              onCreateInvoiceForPatient={(patientId) => handleOpenCreateInvoice(patientId)}
            />
          )}

          {activeTab === 'treatments' && (
            <TreatmentCatalog />
          )}

          {activeTab === 'payments' && (
            <PaymentHistory
              onViewInvoice={(id) => {
                setViewInvoiceId(id);
                setInvoicePrintMode('none');
              }}
            />
          )}

          {activeTab === 'settings' && (
            <ClinicSettings />
          )}
        </div>
      </main>

      {/* Global Invoice Detail / Print Modal */}
      {viewInvoiceId && (
        <InvoiceDetailModal
          invoiceId={viewInvoiceId}
          initialPrintMode={invoicePrintMode}
          onClose={() => {
            setViewInvoiceId(null);
            setInvoicePrintMode('none');
          }}
        />
      )}

      {/* Global Patient Dossier Modal */}
      {viewPatientId && (
        <PatientDetailModal
          patientId={viewPatientId}
          onClose={() => setViewPatientId(null)}
          onCreateInvoiceForPatient={(patientId) => handleOpenCreateInvoice(patientId)}
          onViewInvoice={(id) => {
            setViewInvoiceId(id);
            setInvoicePrintMode('none');
          }}
        />
      )}

      {/* Quick Add Patient Modal */}
      {isAddPatientOpen && (
        <AddPatientModal
          onClose={() => setIsAddPatientOpen(false)}
          onPatientAdded={(newPat) => {
            if (activeTab === 'new-invoice') {
              setInvoicePreselectedPatientId(newPat.id);
            }
          }}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <DentalProvider>
      <DentalAppContent />
    </DentalProvider>
  );
}

export default App;
