import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  ClinicProfile, 
  Patient, 
  DentalProcedure, 
  Invoice, 
  PaymentTransaction, 
  ToothNotation 
} from '../types';
import { 
  INITIAL_CLINIC_PROFILE, 
  INITIAL_PROCEDURES, 
  INITIAL_PATIENTS, 
  INITIAL_INVOICES 
} from '../data/initialData';

interface DashboardStats {
  totalRevenue: number;
  monthRevenue: number;
  todayRevenue: number;
  totalPendingDues: number;
  totalPaidInvoices: number;
  totalPartialInvoices: number;
  totalUnpaidInvoices: number;
  totalPatientsCount: number;
  totalInvoicesCount: number;
}

interface DentalContextType {
  clinicProfile: ClinicProfile;
  updateClinicProfile: (profile: ClinicProfile) => void;
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'patientNumber' | 'totalBilled' | 'totalPaid' | 'outstandingBalance' | 'createdAt' | 'updatedAt'>) => Patient;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  getPatientById: (id: string) => Patient | undefined;
  procedures: DentalProcedure[];
  addProcedure: (procedure: Omit<DentalProcedure, 'id'>) => void;
  updateProcedure: (procedure: DentalProcedure) => void;
  deleteProcedure: (id: string) => void;
  toggleProcedureActive: (id: string) => void;
  invoices: Invoice[];
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => Invoice;
  updateInvoice: (invoice: Invoice) => void;
  recordPayment: (invoiceId: string, payment: Omit<PaymentTransaction, 'id' | 'invoiceId'>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  activeToothNotation: ToothNotation;
  setToothNotation: (notation: ToothNotation) => void;
  stats: DashboardStats;
  resetToDefaults: () => void;
  importDatabase: (data: { clinicProfile?: ClinicProfile; patients?: Patient[]; procedures?: DentalProcedure[]; invoices?: Invoice[] }) => boolean;
  exportDatabase: () => { clinicProfile: ClinicProfile; patients: Patient[]; procedures: DentalProcedure[]; invoices: Invoice[] };
}

const DentalContext = createContext<DentalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VERSION: 'smile7dental_data_version_v2',
  CLINIC: 'smile7dental_v2_clinic_profile',
  PATIENTS: 'smile7dental_v2_patients',
  PROCEDURES: 'smile7dental_v2_procedures',
  INVOICES: 'smile7dental_v2_invoices',
  NOTATION: 'smile7dental_v2_tooth_notation'
};

export const DentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if legacy storage exists and initialize with official Smile7 Dental profile
  const [clinicProfile, setClinicProfile] = useState<ClinicProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLINIC);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.dentistInCharge && !parsed.dentistInCharge.includes('Jenkins')) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_CLINIC_PROFILE;
  });

  // Load patients
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].fullName?.includes('Eleanor')) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_PATIENTS;
  });

  // Load procedures
  const [procedures, setProcedures] = useState<DentalProcedure[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROCEDURES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PROCEDURES;
  });

  // Load invoices
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].patientName?.includes('Eleanor')) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_INVOICES;
  });

  // Tooth notation
  const [activeToothNotation, setToothNotationState] = useState<ToothNotation>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTATION);
    return (saved as ToothNotation) || clinicProfile.defaultToothNotation || 'fdi';
  });

  // Persist whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLINIC, JSON.stringify(clinicProfile));
  }, [clinicProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROCEDURES, JSON.stringify(procedures));
  }, [procedures]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTATION, activeToothNotation);
  }, [activeToothNotation]);

  const setToothNotation = (notation: ToothNotation) => {
    setToothNotationState(notation);
  };

  const updateClinicProfile = (profile: ClinicProfile) => {
    setClinicProfile(profile);
  };

  // Patient Actions
  const addPatient = (patientData: Omit<Patient, 'id' | 'patientNumber' | 'totalBilled' | 'totalPaid' | 'outstandingBalance' | 'createdAt' | 'updatedAt'>): Patient => {
    const newCount = patients.length + 1;
    const patientNumber = `PAT-${(1000 + newCount).toString()}`;
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      patientNumber,
      totalBilled: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPatients(prev => [newPatient, ...prev]);
    return newPatient;
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? { ...updatedPatient, updatedAt: new Date().toISOString() } : p));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const getPatientById = (id: string) => {
    return patients.find(p => p.id === id);
  };

  // Procedure Actions
  const addProcedure = (procedureData: Omit<DentalProcedure, 'id'>) => {
    const newProcedure: DentalProcedure = {
      ...procedureData,
      id: `proc-${Date.now()}`
    };
    setProcedures(prev => [...prev, newProcedure]);
  };

  const updateProcedure = (updatedProcedure: DentalProcedure) => {
    setProcedures(prev => prev.map(p => p.id === updatedProcedure.id ? updatedProcedure : p));
  };

  const deleteProcedure = (id: string) => {
    setProcedures(prev => prev.filter(p => p.id !== id));
  };

  const toggleProcedureActive = (id: string) => {
    setProcedures(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  // Invoice Actions
  const createInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Invoice => {
    const currentYear = new Date().getFullYear();
    const invoiceCount = invoices.length + 1;
    const formattedIndex = String(invoiceCount).padStart(4, '0');
    const invoiceNumber = `${clinicProfile.invoicePrefix || 'S7D'}-${currentYear}-${formattedIndex}`;

    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      invoiceNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // Recalculate and update the patient's balance ledger
    if (newInvoice.patientId) {
      setPatients(prev => prev.map(patient => {
        if (patient.id === newInvoice.patientId) {
          const totalBilled = Math.round((patient.totalBilled + newInvoice.grandTotal) * 100) / 100;
          const totalPaid = Math.round((patient.totalPaid + newInvoice.amountPaid) * 100) / 100;
          const outstandingBalance = Math.max(0, Math.round((totalBilled - totalPaid) * 100) / 100);
          return {
            ...patient,
            totalBilled,
            totalPaid,
            outstandingBalance,
            updatedAt: new Date().toISOString()
          };
        }
        return patient;
      }));
    }

    return newInvoice;
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? { ...updatedInvoice, updatedAt: new Date().toISOString() } : inv));
  };

  const recordPayment = (invoiceId: string, paymentData: Omit<PaymentTransaction, 'id' | 'invoiceId'>) => {
    const newPayment: PaymentTransaction = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      invoiceId
    };

    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const currentPayments = inv.payments || [];
        const updatedPayments = [...currentPayments, newPayment];
        const amountPaid = Math.round((inv.amountPaid + newPayment.amount) * 100) / 100;
        const balanceDue = Math.max(0, Math.round((inv.grandTotal - amountPaid) * 100) / 100);
        const status = balanceDue === 0 ? 'paid' : (amountPaid > 0 ? 'partial' : 'unpaid');

        // Also update patient totalPaid & balance
        if (inv.patientId) {
          setPatients(patientsPrev => patientsPrev.map(p => {
            if (p.id === inv.patientId) {
              const newTotalPaid = Math.round((p.totalPaid + newPayment.amount) * 100) / 100;
              const newOutstanding = Math.max(0, Math.round((p.totalBilled - newTotalPaid) * 100) / 100);
              return {
                ...p,
                totalPaid: newTotalPaid,
                outstandingBalance: newOutstanding,
                updatedAt: new Date().toISOString()
              };
            }
            return p;
          }));
        }

        return {
          ...inv,
          payments: updatedPayments,
          amountPaid,
          balanceDue,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return inv;
    }));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(inv => inv.id === id);
  };

  // Reset to default sample
  const resetToDefaults = () => {
    setClinicProfile(INITIAL_CLINIC_PROFILE);
    setPatients(INITIAL_PATIENTS);
    setProcedures(INITIAL_PROCEDURES);
    setInvoices(INITIAL_INVOICES);
    setToothNotationState(INITIAL_CLINIC_PROFILE.defaultToothNotation);
    
    localStorage.setItem(STORAGE_KEYS.CLINIC, JSON.stringify(INITIAL_CLINIC_PROFILE));
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    localStorage.setItem(STORAGE_KEYS.PROCEDURES, JSON.stringify(INITIAL_PROCEDURES));
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
    localStorage.setItem(STORAGE_KEYS.NOTATION, INITIAL_CLINIC_PROFILE.defaultToothNotation);
  };

  // Import JSON backup
  const importDatabase = (data: { clinicProfile?: ClinicProfile; patients?: Patient[]; procedures?: DentalProcedure[]; invoices?: Invoice[] }): boolean => {
    try {
      if (data.clinicProfile) setClinicProfile(data.clinicProfile);
      if (data.patients && Array.isArray(data.patients)) setPatients(data.patients);
      if (data.procedures && Array.isArray(data.procedures)) setProcedures(data.procedures);
      if (data.invoices && Array.isArray(data.invoices)) setInvoices(data.invoices);
      return true;
    } catch {
      return false;
    }
  };

  // Export JSON backup
  const exportDatabase = () => {
    return {
      clinicProfile,
      patients,
      procedures,
      invoices
    };
  };

  // Calculate live financial KPIs
  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.amountPaid || 0), 0);
  const totalPendingDues = invoices.reduce((acc, inv) => acc + (inv.balanceDue || 0), 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);

  const monthRevenue = invoices.reduce((acc, inv) => {
    const invPayments = inv.payments || [];
    const monthPayments = invPayments.filter(p => p.date.startsWith(currentMonthStr));
    return acc + monthPayments.reduce((pAcc, p) => pAcc + p.amount, 0);
  }, 0);

  const todayRevenue = invoices.reduce((acc, inv) => {
    const invPayments = inv.payments || [];
    const todayPayments = invPayments.filter(p => p.date.startsWith(todayStr));
    return acc + todayPayments.reduce((pAcc, p) => pAcc + p.amount, 0);
  }, 0);

  const totalPaidInvoices = invoices.filter(i => i.status === 'paid').length;
  const totalPartialInvoices = invoices.filter(i => i.status === 'partial').length;
  const totalUnpaidInvoices = invoices.filter(i => i.status === 'unpaid').length;

  const stats: DashboardStats = {
    totalRevenue,
    monthRevenue: monthRevenue || totalRevenue,
    todayRevenue,
    totalPendingDues,
    totalPaidInvoices,
    totalPartialInvoices,
    totalUnpaidInvoices,
    totalPatientsCount: patients.length,
    totalInvoicesCount: invoices.length
  };

  return (
    <DentalContext.Provider
      value={{
        clinicProfile,
        updateClinicProfile,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        getPatientById,
        procedures,
        addProcedure,
        updateProcedure,
        deleteProcedure,
        toggleProcedureActive,
        invoices,
        createInvoice,
        updateInvoice,
        recordPayment,
        deleteInvoice,
        getInvoiceById,
        activeToothNotation,
        setToothNotation,
        stats,
        resetToDefaults,
        importDatabase,
        exportDatabase
      }}
    >
      {children}
    </DentalContext.Provider>
  );
};

export const useDental = (): DentalContextType => {
  const context = useContext(DentalContext);
  if (!context) {
    throw new Error('useDental must be used within a DentalProvider');
  }
  return context;
};
