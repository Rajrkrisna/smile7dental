import React, { useState, useEffect } from 'react';
import { DentalProvider, useDental } from './context/DentalContext';
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
import { AdminLogin } from './components/auth/AdminLogin';
import { PatientInvoiceView } from './components/patient-portal/PatientInvoiceView';
import { decodeInvoicePayload } from './utils/shareUtils';
import type { Invoice, ClinicProfile } from './types';

const DentalAppContent: React.FC = () => {
  const { isAuthenticated, getInvoiceById, clinicProfile } = useDental();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Public Patient Portal State (URL param based)
  const [patientPortalData, setPatientPortalData] = useState<{
    invoice: Invoice;
    clinic: ClinicProfile;
  } | null>(null);

  // Check URL on load for patient download link: ?view=invoice&id=...&token=...
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isInvoiceView = urlParams.get('view') === 'invoice';
      const token = urlParams.get('token');
      const invoiceId = urlParams.get('id') || urlParams.get('invoice_id');

      if (isInvoiceView || token) {
        if (token) {
          const decoded = decodeInvoicePayload(token);
          if (decoded) {
            setPatientPortalData(decoded);
            return;
          }
        }
        
        if (invoiceId) {
          const localInv = getInvoiceById(invoiceId);
          if (localInv) {
            setPatientPortalData({ invoice: localInv, clinic: clinicProfile });
            return;
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse patient portal URL:', e);
    }
  }, [getInvoiceById, clinicProfile]);

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

  // If a patient is viewing their invoice link, show the Patient Portal directly without admin login
  if (patientPortalData) {
    return (
      <PatientInvoiceView
        invoice={patientPortalData.invoice}
        clinic={patientPortalData.clinic}
        onAdminLoginClick={() => {
          // Clear query params and show doctor admin login
          window.history.replaceState({}, '', window.location.pathname);
          setPatientPortalData(null);
        }}
      />
    );
  }

  // If unauthorized, show Admin security portal
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setActiveTab('dashboard')} />;
  }

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
