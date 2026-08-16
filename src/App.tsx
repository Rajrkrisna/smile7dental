import React, { useState, useEffect, useCallback } from 'react';
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
import { InstantInvoiceDownloader } from './components/patient-portal/InstantInvoiceDownloader';
import { MainClinicWebsite } from './components/website/MainClinicWebsite';
import { decodeInvoicePayload } from './utils/shareUtils';
import type { Invoice, ClinicProfile } from './types';

// Helper to determine if we should open the Billing Suite or Main Website
const isBillingRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const path = window.location.pathname.toLowerCase();

  // Subdomain detection: e.g. billing.smile7dental.com or billing.localhost
  if (host.startsWith('billing.') || host.includes('billing.')) return true;

  // Query parameter or hash triggers
  if (
    search.includes('portal=billing') ||
    search.includes('billing')
  ) {
    return true;
  }

  // Path or hash
  if (path.includes('/billing') || hash.includes('billing') || hash.includes('portal')) {
    return true;
  }

  return false;
};

interface DentalAppContentProps {
  onBackToWebsite: () => void;
}

const DentalAppContent: React.FC<DentalAppContentProps> = ({ onBackToWebsite }) => {
  const { isAuthenticated } = useDental();
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

  // If unauthorized, show Admin security portal
  if (!isAuthenticated) {
    return (
      <AdminLogin 
        onLoginSuccess={() => setActiveTab('dashboard')} 
        onBackToWebsite={onBackToWebsite}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation Bar with Back to Main Website button */}
      <Navbar
        onOpenCreateInvoice={() => handleOpenCreateInvoice()}
        activeTab={activeTab}
        onBackToWebsite={onBackToWebsite}
      />

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'website') {
              onBackToWebsite();
              return;
            }
            setActiveTab(tab);
            setInvoicePreselectedPatientId(undefined);
          }}
          onOpenCreateInvoice={() => handleOpenCreateInvoice()}
          onBackToWebsite={onBackToWebsite}
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
  // Direct Download Detection: if short param ?d= or ?token= or ?download= is present in URL
  const [directDownloadData] = useState<{
    invoice: Invoice;
    clinic: ClinicProfile;
  } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('d') || urlParams.get('token') || urlParams.get('payload');
      
      // Also check hash for #d=... or #/d/...
      const hash = window.location.hash;
      const hashToken = hash.includes('d=') 
        ? hash.split('d=')[1]?.split('&')[0] 
        : hash.startsWith('#/d/') 
        ? hash.replace('#/d/', '') 
        : null;

      const effectiveToken = token || hashToken;

      if (effectiveToken) {
        const decoded = decodeInvoicePayload(effectiveToken);
        if (decoded) return decoded;
      }
    } catch (e) {
      console.error('Failed to parse download payload:', e);
    }
    return null;
  });

  const [isBilling, setIsBilling] = useState<boolean>(() => isBillingRoute());

  // Listen to hash change / popstate for seamless browser navigation
  useEffect(() => {
    const handleNavigation = () => {
      setIsBilling(isBillingRoute());
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, []);

  const handleOpenBillingPortal = useCallback(() => {
    window.location.hash = 'billing';
    setIsBilling(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackToWebsite = useCallback(() => {
    window.location.hash = '';
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setIsBilling(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // If patient opened a direct invoice download link, directly render the Instant Downloader!
  if (directDownloadData) {
    return (
      <InstantInvoiceDownloader
        invoice={directDownloadData.invoice}
        clinic={directDownloadData.clinic}
      />
    );
  }

  return (
    <DentalProvider>
      {isBilling ? (
        <DentalAppContent onBackToWebsite={handleBackToWebsite} />
      ) : (
        <MainClinicWebsite onOpenBillingPortal={handleOpenBillingPortal} />
      )}
    </DentalProvider>
  );
}

export default App;


