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
  CLINIC: 'smile7dental_clinic_profile',
  PATIENTS: 'smile7dental_patients',
  PROCEDURES: 'smile7dental_procedures',
  INVOICES: 'smile7dental_invoices',
  NOTATION: 'smile7dental_tooth_notation'
};

export const DentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load clinic profile
  const [clinicProfile, setClinicProfile] = useState<ClinicProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLINIC);
    return saved ? JSON.parse(saved) : INITIAL_CLINIC_PROFILE;
  });

  // Load patients
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  // Load procedures
  const [procedures, setProcedures] = useState<DentalProcedure[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROCEDURES);
    return saved ? JSON.parse(saved) : INITIAL_PROCEDURES;
  });

  // Load invoices
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
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

  const updateClinicProfile = (newProfile: ClinicProfile) => {
    setClinicProfile(newProfile);
  };

  // Recalculate patient balances based on all current invoices
  const recalculatePatientFinancials = (patientList: Patient[], invoiceList: Invoice[]): Patient[] => {
    return patientList.map(pat => {
      const patientInvoices = invoiceList.filter(inv => inv.patientId === pat.id);
      const totalBilled = patientInvoices.reduce((acc, inv) => acc + (inv.grandTotal || 0), 0);
      const totalPaid = patientInvoices.reduce((acc, inv) => acc + (inv.amountPaid || 0), 0);
      const outstandingBalance = Math.max(0, totalBilled - totalPaid);
      return {
        ...pat,
        totalBilled,
        totalPaid,
        outstandingBalance
      };
    });
  };

  // Patient Actions
  const addPatient = (patientData: Omit<Patient, 'id' | 'patientNumber' | 'totalBilled' | 'totalPaid' | 'outstandingBalance' | 'createdAt' | 'updatedAt'>): Patient => {
    const newId = `pat-${Date.now()}`;
    const patientNumber = `PAT-${1001 + patients.length}`;
    const now = new Date().toISOString();
    
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      patientNumber,
      totalBilled: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      createdAt: now,
      updatedAt: now
    };

    setPatients(prev => [newPatient, ...prev]);
    return newPatient;
  };

  const updatePatient = (updated: Patient) => {
    setPatients(prev => prev.map(p => (p.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : p)));
    // Also update patient details in active invoices
    setInvoices(prev => prev.map(inv => {
      if (inv.patientId === updated.id) {
        return {
          ...inv,
          patientName: updated.fullName,
          patientPhone: updated.phone,
          patientAge: updated.age,
          patientGender: updated.gender,
          patientAddress: updated.address
        };
      }
      return inv;
    }));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const getPatientById = (id: string) => {
    return patients.find(p => p.id === id);
  };

  // Procedure Actions
  const addProcedure = (procData: Omit<DentalProcedure, 'id'>) => {
    const newProc: DentalProcedure = {
      ...procData,
      id: `proc-${Date.now()}`
    };
    setProcedures(prev => [...prev, newProc]);
  };

  const updateProcedure = (updated: DentalProcedure) => {
    setProcedures(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const deleteProcedure = (id: string) => {
    setProcedures(prev => prev.filter(p => p.id !== id));
  };

  const toggleProcedureActive = (id: string) => {
    setProcedures(prev => prev.map(p => (p.id === id ? { ...p, isActive: !p.isActive } : p)));
  };

  // Invoice Actions
  const createInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Invoice => {
    const currentYear = new Date().getFullYear();
    const seqNumber = String(invoices.length + 1).padStart(4, '0');
    const invoiceNumber = `${clinicProfile.invoicePrefix || 'S7D'}-${currentYear}-${seqNumber}`;
    const now = new Date().toISOString();
    const newId = `inv-${Date.now()}`;

    const newInvoice: Invoice = {
      ...invoiceData,
      id: newId,
      invoiceNumber,
      createdAt: now,
      updatedAt: now
    };

    const nextInvoices = [newInvoice, ...invoices];
    setInvoices(nextInvoices);
    setPatients(prev => recalculatePatientFinancials(prev, nextInvoices));

    return newInvoice;
  };

  const updateInvoice = (updated: Invoice) => {
    const nextInvoices = invoices.map(inv => (inv.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : inv));
    setInvoices(nextInvoices);
    setPatients(prev => recalculatePatientFinancials(prev, nextInvoices));
  };

  const recordPayment = (invoiceId: string, paymentData: Omit<PaymentTransaction, 'id' | 'invoiceId'>) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    const newPayment: PaymentTransaction = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      invoiceId
    };

    const newAmountPaid = (inv.amountPaid || 0) + paymentData.amount;
    const newBalanceDue = Math.max(0, (inv.grandTotal || 0) - newAmountPaid);
    const newStatus = newBalanceDue === 0 ? 'paid' : (newAmountPaid > 0 ? 'partial' : 'unpaid');

    const updatedInvoice: Invoice = {
      ...inv,
      amountPaid: newAmountPaid,
      balanceDue: newBalanceDue,
      status: newStatus,
      payments: [...(inv.payments || []), newPayment],
      updatedAt: new Date().toISOString()
    };

    const nextInvoices = invoices.map(i => (i.id === invoiceId ? updatedInvoice : i));
    setInvoices(nextInvoices);
    setPatients(prev => recalculatePatientFinancials(prev, nextInvoices));
  };

  const deleteInvoice = (id: string) => {
    const nextInvoices = invoices.filter(inv => inv.id !== id);
    setInvoices(nextInvoices);
    setPatients(prev => recalculatePatientFinancials(prev, nextInvoices));
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(inv => inv.id === id);
  };

  // Dashboard Stats calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7); // 'YYYY-MM'

  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.amountPaid || 0), 0);
  const totalPendingDues = invoices.reduce((acc, inv) => acc + (inv.balanceDue || 0), 0);
  
  const todayRevenue = invoices.reduce((acc, inv) => {
    const todayPayments = (inv.payments || []).filter(p => p.date && p.date.startsWith(todayStr));
    return acc + todayPayments.reduce((pAcc, p) => pAcc + p.amount, 0);
  }, 0);

  const monthRevenue = invoices.reduce((acc, inv) => {
    const monthPayments = (inv.payments || []).filter(p => p.date && p.date.startsWith(currentMonthStr));
    return acc + monthPayments.reduce((pAcc, p) => pAcc + p.amount, 0);
  }, 0);

  const totalPaidInvoices = invoices.filter(i => i.status === 'paid').length;
  const totalPartialInvoices = invoices.filter(i => i.status === 'partial').length;
  const totalUnpaidInvoices = invoices.filter(i => i.status === 'unpaid').length;

  const stats: DashboardStats = {
    totalRevenue,
    monthRevenue,
    todayRevenue,
    totalPendingDues,
    totalPaidInvoices,
    totalPartialInvoices,
    totalUnpaidInvoices,
    totalPatientsCount: patients.length,
    totalInvoicesCount: invoices.length
  };

  const resetToDefaults = () => {
    setClinicProfile(INITIAL_CLINIC_PROFILE);
    setPatients(INITIAL_PATIENTS);
    setProcedures(INITIAL_PROCEDURES);
    setInvoices(INITIAL_INVOICES);
    setToothNotationState(INITIAL_CLINIC_PROFILE.defaultToothNotation);
    localStorage.removeItem(STORAGE_KEYS.CLINIC);
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.PROCEDURES);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.NOTATION);
  };

  const exportDatabase = () => {
    return {
      clinicProfile,
      patients,
      procedures,
      invoices
    };
  };

  const importDatabase = (data: { clinicProfile?: ClinicProfile; patients?: Patient[]; procedures?: DentalProcedure[]; invoices?: Invoice[] }) => {
    try {
      if (data.clinicProfile) setClinicProfile(data.clinicProfile);
      if (data.patients && Array.isArray(data.patients)) setPatients(data.patients);
      if (data.procedures && Array.isArray(data.procedures)) setProcedures(data.procedures);
      if (data.invoices && Array.isArray(data.invoices)) setInvoices(data.invoices);
      return true;
    } catch (e) {
      console.error('Failed to import database:', e);
      return false;
    }
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

export const useDental = () => {
  const context = useContext(DentalContext);
  if (!context) {
    throw new Error('useDental must be used within a DentalProvider');
  }
  return context;
};
