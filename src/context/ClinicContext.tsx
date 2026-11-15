import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Patient, 
  Appointment, 
  ClinicalNote, 
  Prescription, 
  Invoice, 
  Procedure, 
  ClinicProfile, 
  ToothNotation, 
  ToothFinding,
  AppointmentStatus,
  ConsultantPayout,
  LabWorkOrder,
  GeneralExpense,
  PatientVisit
} from '../types';
import { 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_CLINICAL_NOTES, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_INVOICES, 
  INITIAL_PROCEDURES, 
  INITIAL_CLINIC_PROFILE,
  INITIAL_CONSULTANT_PAYOUTS,
  INITIAL_LAB_ORDERS,
  INITIAL_EXPENSES,
  INITIAL_VISITS
} from '../data/initialData';
import { arePhonesEqual } from '../utils/phone';
import { 
  getSyncConfig, 
  saveSyncConfig, 
  fetchFromGitHub, 
  pushToGitHub, 
  mergeDatabases,
  type GitHubSyncConfig 
} from '../utils/githubSync';

interface ClinicContextType {
  clinicProfile: ClinicProfile;
  updateClinicProfile: (profile: ClinicProfile) => void;
  notation: ToothNotation;
  setNotation: (notation: ToothNotation) => void;

  // GitHub Cloud Sync
  syncConfig: GitHubSyncConfig;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncTime: string | null;
  lastSyncError: string | null;
  updateSyncConfig: (config: Partial<GitHubSyncConfig>) => void;
  triggerSync: (direction?: 'bidirectional' | 'push' | 'pull') => Promise<{ success: boolean; message: string }>;
  
  // Patients
  patients: Patient[];
  addPatient: (data: Omit<Patient, 'id' | 'patientId' | 'totalBilled' | 'totalPaid' | 'balanceDue' | 'dentalChart' | 'createdAt' | 'updatedAt'>) => Patient;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  getPatientById: (id: string) => Patient | undefined;
  findPatientByPhone: (phone: string, excludeId?: string) => Patient | undefined;
  updateToothFinding: (patientId: string, finding: ToothFinding) => void;
  clearToothFinding: (patientId: string, toothNumber: number) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (data: Omit<Appointment, 'id'>) => Appointment;
  updateAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  deleteAppointment: (id: string) => void;

  // Clinical Notes (SOAP)
  clinicalNotes: ClinicalNote[];
  addClinicalNote: (note: Omit<ClinicalNote, 'id'>) => ClinicalNote;
  getNotesByPatient: (patientId: string) => ClinicalNote[];

  // Prescriptions (Rx)
  prescriptions: Prescription[];
  addPrescription: (rx: Omit<Prescription, 'id' | 'prescriptionNumber' | 'createdAt'>) => Prescription;
  getPrescriptionsByPatient: (patientId: string) => Prescription[];

  // Billing & Invoices
  invoices: Invoice[];
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => Invoice;
  recordPayment: (invoiceId: string, amount: number) => void;

  // Procedures
  procedures: Procedure[];
  addProcedure: (proc: Omit<Procedure, 'id'>) => void;

  // Finance: Consultant Doctor Payouts
  consultantPayouts: ConsultantPayout[];
  addConsultantPayout: (payout: Omit<ConsultantPayout, 'id' | 'createdAt'>) => ConsultantPayout;
  updateConsultantPayout: (payout: ConsultantPayout) => void;
  deleteConsultantPayout: (id: string) => void;

  // Finance: Dental Lab Work Orders & Charges
  labWorkOrders: LabWorkOrder[];
  addLabWorkOrder: (order: Omit<LabWorkOrder, 'id' | 'createdAt'>) => LabWorkOrder;
  updateLabWorkOrder: (order: LabWorkOrder) => void;
  deleteLabWorkOrder: (id: string) => void;

  // Finance: Clinic Operational Expenses
  generalExpenses: GeneralExpense[];
  addGeneralExpense: (expense: Omit<GeneralExpense, 'id' | 'createdAt'>) => GeneralExpense;
  updateGeneralExpense: (expense: GeneralExpense) => void;
  deleteGeneralExpense: (id: string) => void;

  // Patient Visits & Sitting History
  patientVisits: PatientVisit[];
  addPatientVisit: (visit: Omit<PatientVisit, 'id' | 'visitNumber' | 'createdAt'>) => PatientVisit;
  updatePatientVisit: (visit: PatientVisit) => void;
  deletePatientVisit: (id: string) => void;
  getVisitsByPatient: (patientId: string) => PatientVisit[];

  // Data Portability
  exportDatabase: () => string;
  importDatabase: (jsonString: string) => boolean;
  resetDatabase: () => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'dentistry_pro_v2_clinic_profile',
  NOTATION: 'dentistry_pro_v2_tooth_notation',
  PATIENTS: 'dentistry_pro_v2_patients',
  APPOINTMENTS: 'dentistry_pro_v2_appointments',
  NOTES: 'dentistry_pro_v2_clinical_notes',
  RX: 'dentistry_pro_v2_prescriptions',
  INVOICES: 'dentistry_pro_v2_invoices',
  PROCEDURES: 'dentistry_pro_v2_procedures',
  CONSULTANTS: 'dentistry_pro_v2_consultants',
  LAB_ORDERS: 'dentistry_pro_v2_lab_orders',
  EXPENSES: 'dentistry_pro_v2_expenses',
  VISITS: 'dentistry_pro_v2_patient_visits',
};

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clinic Profile
  const [clinicProfile, setClinicProfile] = useState<ClinicProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.clinicName = 'Smile7 Dental Clinic';
        parsed.doctorName = 'Dr. P. Manickapriya';
        parsed.doctorQualification = 'B.D.S., FCD. • General Dental Surgeon, Aesthetic & Restorative Dentist';
        parsed.registrationNumber = 'TNDC-DEN/2018/24892 (DCI Reg: 26448)';
        parsed.dentalCouncil = 'Tamil Nadu Dental Council Reg. #24892';
        parsed.currencySymbol = '₹';
        parsed.currencyCode = 'INR';
        parsed.phone = '+91 97908 62510';
        if (!parsed.tagline || parsed.tagline.includes('Precision Dental Care')) {
          parsed.tagline = 'Prevent Now! Smile Forever!';
        }
        if (!parsed.address || parsed.address.includes('Golden Gates')) {
          parsed.address = 'No. 1/2, Alapakkam Main Road, Janaki Nagar, Maduravoyal';
        }
        parsed.city = parsed.city || 'Chennai, Tamil Nadu - 600095';
        return parsed;
      }
      return INITIAL_CLINIC_PROFILE;
    } catch {
      return INITIAL_CLINIC_PROFILE;
    }
  });

  // Tooth Numbering Notation - FDI (Federation Dentaire Internationale / DCI) is standard in India
  const [notation, setNotation] = useState<ToothNotation>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTATION);
      // Ensure Indian Dental Council standard (FDI) is the default
      if (saved === 'palmer' || !saved) {
        localStorage.setItem(STORAGE_KEYS.NOTATION, 'fdi');
        return 'fdi';
      }
      return (saved as ToothNotation) || 'fdi';
    } catch {
      return 'fdi';
    }
  });

  // Patients
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (saved) {
        const parsed: Appointment[] = JSON.parse(saved);
        return parsed.map(a => ({
          ...a,
          chair: 'Dental Chair'
        }));
      }
      return INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  // Clinical Notes
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : INITIAL_CLINICAL_NOTES;
    } catch {
      return INITIAL_CLINICAL_NOTES;
    }
  });

  // Prescriptions
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RX);
      return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
    } catch {
      return INITIAL_PRESCRIPTIONS;
    }
  });

  // Invoices
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  // Procedures
  const [procedures, setProcedures] = useState<Procedure[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROCEDURES);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically migrate to Indian dental clinic procedure terminology if older ADA codes are detected
        if (Array.isArray(parsed) && parsed.some((p: any) => p.code?.startsWith('D0') || p.code?.startsWith('D1') || p.code?.startsWith('D2') || p.code?.startsWith('D3'))) {
          localStorage.setItem(STORAGE_KEYS.PROCEDURES, JSON.stringify(INITIAL_PROCEDURES));
          return INITIAL_PROCEDURES;
        }
        return parsed;
      }
      return INITIAL_PROCEDURES;
    } catch {
      return INITIAL_PROCEDURES;
    }
  });

  // Finance: Consultant Payouts
  const [consultantPayouts, setConsultantPayouts] = useState<ConsultantPayout[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONSULTANTS);
      return saved ? JSON.parse(saved) : INITIAL_CONSULTANT_PAYOUTS;
    } catch {
      return INITIAL_CONSULTANT_PAYOUTS;
    }
  });

  // Finance: Lab Work Orders
  const [labWorkOrders, setLabWorkOrders] = useState<LabWorkOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAB_ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_LAB_ORDERS;
    } catch {
      return INITIAL_LAB_ORDERS;
    }
  });

  // Finance: General Expenses
  const [generalExpenses, setGeneralExpenses] = useState<GeneralExpense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  // Patient Visits & Sitting History
  const [patientVisits, setPatientVisits] = useState<PatientVisit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VISITS);
      return saved ? JSON.parse(saved) : INITIAL_VISITS;
    } catch {
      return INITIAL_VISITS;
    }
  });

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(clinicProfile));
  }, [clinicProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTATION, notation);
  }, [notation]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(clinicalNotes));
  }, [clinicalNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RX, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROCEDURES, JSON.stringify(procedures));
  }, [procedures]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONSULTANTS, JSON.stringify(consultantPayouts));
  }, [consultantPayouts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAB_ORDERS, JSON.stringify(labWorkOrders));
  }, [labWorkOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(generalExpenses));
  }, [generalExpenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(patientVisits));
  }, [patientVisits]);

  // Methods
  const updateClinicProfile = (profile: ClinicProfile) => {
    setClinicProfile(profile);
  };

  const findPatientByPhone = (phone: string, excludeId?: string) => {
    if (!phone) return undefined;
    return patients.find(p => p.id !== excludeId && arePhonesEqual(p.phone, phone));
  };

  const addPatient = (data: Omit<Patient, 'id' | 'patientId' | 'totalBilled' | 'totalPaid' | 'balanceDue' | 'dentalChart' | 'createdAt' | 'updatedAt'>) => {
    // Duplicate Prevention Check by Mobile Number
    const existing = findPatientByPhone(data.phone);
    if (existing) {
      throw new Error(`Duplicate entry blocked: Patient "${existing.name}" is already registered with mobile number ${data.phone} (${existing.patientId}).`);
    }

    const nextNum = 1000 + patients.length + 1;
    const newPatient: Patient = {
      ...data,
      id: `pat-${Date.now()}`,
      patientId: `PAT-${nextNum}`,
      dentalChart: {},
      totalBilled: 0,
      totalPaid: 0,
      balanceDue: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPatients(prev => [newPatient, ...prev]);
    return newPatient;
  };

  const updatePatient = (patient: Patient) => {
    const existing = findPatientByPhone(patient.phone, patient.id);
    if (existing) {
      throw new Error(`Duplicate entry blocked: Mobile number ${patient.phone} is already registered to "${existing.name}" (${existing.patientId}).`);
    }
    setPatients(prev => prev.map(p => p.id === patient.id ? { ...patient, updatedAt: new Date().toISOString() } : p));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setAppointments(prev => prev.filter(a => a.patientId !== id));
    setClinicalNotes(prev => prev.filter(n => n.patientId !== id));
    setPrescriptions(prev => prev.filter(r => r.patientId !== id));
    setInvoices(prev => prev.filter(i => i.patientId !== id));
    setPatientVisits(prev => prev.filter(v => v.patientId !== id));
  };

  const getPatientById = (id: string) => {
    return patients.find(p => p.id === id);
  };

  const updateToothFinding = (patientId: string, finding: ToothFinding) => {
    setPatients(prev => prev.map(pat => {
      if (pat.id !== patientId) return pat;
      return {
        ...pat,
        dentalChart: {
          ...pat.dentalChart,
          [String(finding.toothNumber)]: finding
        },
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const clearToothFinding = (patientId: string, toothNumber: number) => {
    setPatients(prev => prev.map(pat => {
      if (pat.id !== patientId) return pat;
      const updatedChart = { ...pat.dentalChart };
      delete updatedChart[String(toothNumber)];
      return {
        ...pat,
        dentalChart: updatedChart,
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const addAppointment = (data: Omit<Appointment, 'id'>) => {
    const newAppt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`
    };
    setAppointments(prev => [newAppt, ...prev]);
    return newAppt;
  };

  const updateAppointment = (appointment: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === appointment.id ? appointment : a));
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const addClinicalNote = (data: Omit<ClinicalNote, 'id'>) => {
    const newNote: ClinicalNote = {
      ...data,
      id: `note-${Date.now()}`
    };
    setClinicalNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const getNotesByPatient = (patientId: string) => {
    return clinicalNotes.filter(n => n.patientId === patientId);
  };

  const addPrescription = (data: Omit<Prescription, 'id' | 'prescriptionNumber' | 'createdAt'>) => {
    const rxNumber = `RX-${new Date().getFullYear()}-${String(prescriptions.length + 1).padStart(4, '0')}`;
    const newRx: Prescription = {
      ...data,
      id: `rx-${Date.now()}`,
      prescriptionNumber: rxNumber,
      createdAt: new Date().toISOString()
    };
    setPrescriptions(prev => [newRx, ...prev]);
    return newRx;
  };

  const getPrescriptionsByPatient = (patientId: string) => {
    return prescriptions.filter(rx => rx.patientId === patientId);
  };

  const createInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => {
    const invNumber = `${clinicProfile.invoicePrefix || 'DP-INV'}-${String(invoices.length + 1001)}`;
    const newInv: Invoice = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
      createdAt: new Date().toISOString()
    };
    setInvoices(prev => [newInv, ...prev]);

    // Update patient totals
    setPatients(prev => prev.map(p => {
      if (p.id !== data.patientId) return p;
      const billed = p.totalBilled + data.total;
      const paid = p.totalPaid + data.paidAmount;
      return {
        ...p,
        totalBilled: billed,
        totalPaid: paid,
        balanceDue: Math.max(0, billed - paid)
      };
    }));

    return newInv;
  };

  const recordPayment = (invoiceId: string, amount: number) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      const newPaid = inv.paidAmount + amount;
      const newBalance = Math.max(0, inv.total - newPaid);
      const newStatus = newBalance === 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Unpaid';
      return {
        ...inv,
        paidAmount: newPaid,
        balance: newBalance,
        status: newStatus
      };
    }));
  };

  const addProcedure = (data: Omit<Procedure, 'id'>) => {
    const newProc: Procedure = {
      ...data,
      id: `proc-${Date.now()}`
    };
    setProcedures(prev => [...prev, newProc]);
  };

  // Finance: Consultant Payouts CRUD
  const addConsultantPayout = (data: Omit<ConsultantPayout, 'id' | 'createdAt'>) => {
    const newPayout: ConsultantPayout = {
      ...data,
      id: `con-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setConsultantPayouts(prev => [newPayout, ...prev]);
    return newPayout;
  };

  const updateConsultantPayout = (payout: ConsultantPayout) => {
    setConsultantPayouts(prev => prev.map(p => p.id === payout.id ? payout : p));
  };

  const deleteConsultantPayout = (id: string) => {
    setConsultantPayouts(prev => prev.filter(p => p.id !== id));
  };

  // Finance: Lab Work Orders CRUD
  const addLabWorkOrder = (data: Omit<LabWorkOrder, 'id' | 'createdAt'>) => {
    const newOrder: LabWorkOrder = {
      ...data,
      id: `lab-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setLabWorkOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateLabWorkOrder = (order: LabWorkOrder) => {
    setLabWorkOrders(prev => prev.map(o => o.id === order.id ? order : o));
  };

  const deleteLabWorkOrder = (id: string) => {
    setLabWorkOrders(prev => prev.filter(o => o.id !== id));
  };

  // Finance: General Expenses CRUD
  const addGeneralExpense = (data: Omit<GeneralExpense, 'id' | 'createdAt'>) => {
    const newExpense: GeneralExpense = {
      ...data,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setGeneralExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  };

  const updateGeneralExpense = (expense: GeneralExpense) => {
    setGeneralExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
  };

  const deleteGeneralExpense = (id: string) => {
    setGeneralExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Patient Visits & Sitting History CRUD
  const addPatientVisit = (data: Omit<PatientVisit, 'id' | 'visitNumber' | 'createdAt'>): PatientVisit => {
    const existingVisits = patientVisits.filter(v => v.patientId === data.patientId);
    const visitNumber = existingVisits.length + 1;
    const newVisit: PatientVisit = {
      ...data,
      id: `vis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      visitNumber,
      createdAt: new Date().toISOString()
    };
    setPatientVisits(prev => [newVisit, ...prev]);

    // If a fee or payment was recorded on the visit, update patient billing totals
    if (data.feeCharged > 0 || data.amountPaid > 0) {
      setPatients(prev => prev.map(p => {
        if (p.id !== data.patientId) return p;
        const newTotalBilled = p.totalBilled + data.feeCharged;
        const newTotalPaid = p.totalPaid + data.amountPaid;
        return {
          ...p,
          totalBilled: newTotalBilled,
          totalPaid: newTotalPaid,
          balanceDue: Math.max(0, newTotalBilled - newTotalPaid),
          updatedAt: new Date().toISOString()
        };
      }));
    }

    return newVisit;
  };

  const updatePatientVisit = (visit: PatientVisit) => {
    setPatientVisits(prev => prev.map(v => v.id === visit.id ? visit : v));
  };

  const deletePatientVisit = (id: string) => {
    setPatientVisits(prev => prev.filter(v => v.id !== id));
  };

  const getVisitsByPatient = (patientId: string): PatientVisit[] => {
    return patientVisits
      .filter(v => v.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const exportDatabase = (): string => {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      clinicProfile,
      notation,
      patients,
      appointments,
      clinicalNotes,
      prescriptions,
      invoices,
      procedures,
      consultantPayouts,
      labWorkOrders,
      generalExpenses,
      patientVisits
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDatabase = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.clinicProfile) setClinicProfile(data.clinicProfile);
      if (data.notation) setNotation(data.notation);
      if (Array.isArray(data.patients)) setPatients(data.patients);
      if (Array.isArray(data.appointments)) setAppointments(data.appointments);
      if (Array.isArray(data.clinicalNotes)) setClinicalNotes(data.clinicalNotes);
      if (Array.isArray(data.prescriptions)) setPrescriptions(data.prescriptions);
      if (Array.isArray(data.invoices)) setInvoices(data.invoices);
      if (Array.isArray(data.procedures)) setProcedures(data.procedures);
      if (Array.isArray(data.consultantPayouts)) setConsultantPayouts(data.consultantPayouts);
      if (Array.isArray(data.labWorkOrders)) setLabWorkOrders(data.labWorkOrders);
      if (Array.isArray(data.generalExpenses)) setGeneralExpenses(data.generalExpenses);
      if (Array.isArray(data.patientVisits)) setPatientVisits(data.patientVisits);
      return true;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
    }
  };

  const resetDatabase = () => {
    localStorage.clear();
    setClinicProfile(INITIAL_CLINIC_PROFILE);
    setNotation('fdi');
    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setClinicalNotes(INITIAL_CLINICAL_NOTES);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setInvoices(INITIAL_INVOICES);
    setProcedures(INITIAL_PROCEDURES);
    setConsultantPayouts(INITIAL_CONSULTANT_PAYOUTS);
    setLabWorkOrders(INITIAL_LAB_ORDERS);
    setGeneralExpenses(INITIAL_EXPENSES);
    setPatientVisits(INITIAL_VISITS);
  };

  // GitHub Cloud Database Sync State
  const [syncConfig, setSyncConfigState] = useState<GitHubSyncConfig>(() => getSyncConfig());
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>(syncConfig.lastSyncStatus || 'idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(syncConfig.lastSyncTime || null);
  const [lastSyncError, setLastSyncError] = useState<string | null>(syncConfig.lastError || null);

  const updateSyncConfig = (newConfig: Partial<GitHubSyncConfig>) => {
    const updated = saveSyncConfig(newConfig);
    setSyncConfigState(updated);
  };

  const triggerSync = async (direction: 'bidirectional' | 'push' | 'pull' = 'bidirectional'): Promise<{ success: boolean; message: string }> => {
    if (!syncConfig.token) {
      return { success: false, message: 'GitHub token not configured. Please enter your token in Settings.' };
    }

    setSyncStatus('syncing');
    setLastSyncError(null);

    try {
      const localData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        clinicProfile,
        notation,
        patients,
        appointments,
        clinicalNotes,
        prescriptions,
        invoices,
        procedures,
        consultantPayouts,
        labWorkOrders,
        generalExpenses,
        patientVisits
      };

      if (direction === 'push') {
        // Direct Push
        await pushToGitHub(JSON.stringify(localData, null, 2), syncConfig, 'sync: manual push from local database');
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setSyncStatus('success');
        setLastSyncTime(now);
        updateSyncConfig({ lastSyncStatus: 'success', lastSyncTime: now, lastError: undefined });
        return { success: true, message: 'Local database uploaded to GitHub successfully!' };
      }

      // Fetch remote database
      const remote = await fetchFromGitHub(syncConfig);

      if (direction === 'pull') {
        // Direct Pull
        if (!remote.exists || !remote.data) {
          throw new Error('Remote database file does not exist on GitHub yet.');
        }
        importDatabase(remote.rawJson || JSON.stringify(remote.data));
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setSyncStatus('success');
        setLastSyncTime(now);
        updateSyncConfig({ lastSyncStatus: 'success', lastSyncTime: now, lastError: undefined });
        return { success: true, message: 'Database refreshed from GitHub!' };
      }

      // Bidirectional Smart Merge
      if (!remote.exists || !remote.data) {
        // Initialize remote database on GitHub
        await pushToGitHub(JSON.stringify(localData, null, 2), syncConfig, 'init: initialize clinic database on GitHub');
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setSyncStatus('success');
        setLastSyncTime(now);
        updateSyncConfig({ lastSyncStatus: 'success', lastSyncTime: now, lastError: undefined });
        return { success: true, message: 'GitHub database initialized with local records!' };
      }

      // Merge local with remote
      const merged = mergeDatabases(localData, remote.data);
      importDatabase(JSON.stringify(merged));

      // Push merged copy back to GitHub so both mobile and laptop are in parity
      await pushToGitHub(JSON.stringify(merged, null, 2), syncConfig, 'sync: merged clinic database update');

      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSyncStatus('success');
      setLastSyncTime(now);
      updateSyncConfig({ lastSyncStatus: 'success', lastSyncTime: now, lastError: undefined });
      return { success: true, message: 'Synced seamlessly with GitHub! All records up to date.' };
    } catch (err: any) {
      console.error('GitHub Sync Error:', err);
      const errMsg = err.message || 'Failed to sync with GitHub';
      setSyncStatus('error');
      setLastSyncError(errMsg);
      updateSyncConfig({ lastSyncStatus: 'error', lastError: errMsg });
      return { success: false, message: errMsg };
    }
  };

  // Background auto-sync (on startup and periodic)
  useEffect(() => {
    if (!syncConfig.token || !syncConfig.autoSync) return;

    const initialTimer = setTimeout(() => {
      triggerSync('bidirectional');
    }, 2500);

    const interval = setInterval(() => {
      triggerSync('bidirectional');
    }, 180000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [syncConfig.token, syncConfig.autoSync]);

  return (
    <ClinicContext.Provider
      value={{
        clinicProfile,
        updateClinicProfile,
        notation,
        setNotation,
        syncConfig,
        syncStatus,
        lastSyncTime,
        lastSyncError,
        updateSyncConfig,
        triggerSync,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        getPatientById,
        findPatientByPhone,
        updateToothFinding,
        clearToothFinding,
        appointments,
        addAppointment,
        updateAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        clinicalNotes,
        addClinicalNote,
        getNotesByPatient,
        prescriptions,
        addPrescription,
        getPrescriptionsByPatient,
        invoices,
        createInvoice,
        recordPayment,
        procedures,
        addProcedure,
        consultantPayouts,
        addConsultantPayout,
        updateConsultantPayout,
        deleteConsultantPayout,
        labWorkOrders,
        addLabWorkOrder,
        updateLabWorkOrder,
        deleteLabWorkOrder,
        generalExpenses,
        addGeneralExpense,
        updateGeneralExpense,
        deleteGeneralExpense,
        patientVisits,
        addPatientVisit,
        updatePatientVisit,
        deletePatientVisit,
        getVisitsByPatient,
        exportDatabase,
        importDatabase,
        resetDatabase
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};

