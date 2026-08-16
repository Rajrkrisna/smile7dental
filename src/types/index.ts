export type ToothNotation = 'universal' | 'fdi';
export type PaymentStatus = 'paid' | 'partial' | 'unpaid' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'insurance' | 'bank_transfer' | 'other';
export type ProcedureCategory = 
  | 'Diagnostic'
  | 'Preventive'
  | 'Restorative'
  | 'Endodontics'
  | 'Periodontics'
  | 'Prosthodontics'
  | 'Oral Surgery'
  | 'Orthodontics'
  | 'Pediatric'
  | 'Cosmetic';

export interface AdminAuthConfig {
  adminEmail: string;
  adminPin: string;
  adminPassword: string;
  subdomainUrl: string;
  autoLockTimeoutMinutes: number; // e.g. 15 mins (0 for disabled)
  isConfigured?: boolean;
  lastLoginAt?: string;
  failedAttempts?: number;
  lockedUntil?: string;
}

export interface AdminUser {
  name: string;
  email: string;
  role: 'Lead Dentist & Practice Director' | 'Administrator' | 'Associate Dentist';
  avatarInitials: string;
}

export interface ClinicProfile {
  name: string;
  tagline: string;
  logoUrl?: string;
  dentistInCharge: string;
  registrationNumber: string;
  dentalCouncilNumber: string;
  taxId: string; // GSTIN or Tax Reg No.
  phone: string;
  email: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  currencySymbol: string;
  currencyCode: string;
  defaultTaxRate: number; // e.g. 0, 5, 12, 18
  defaultToothNotation: ToothNotation;
  invoicePrefix: string;
  invoiceFooterNote: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifscOrRouting: string;
    bankName: string;
    upiId?: string;
  };
}

export interface Patient {
  id: string;
  patientNumber: string; // e.g. PAT-1001
  fullName: string;
  phone: string;
  email?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  address?: string;
  bloodGroup?: string;
  medicalAlerts: string[]; // e.g. ["Hypertension", "Penicillin Allergy", "Diabetic"]
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  totalBilled: number;
  totalPaid: number;
  outstandingBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface DentalProcedure {
  id: string;
  code: string; // e.g. CDT D0120 or S7-RCT
  name: string;
  category: ProcedureCategory;
  description?: string;
  defaultCost: number;
  standardDurationMin: number;
  isToothSpecific: boolean; // True if applies to specific tooth/teeth
  taxRatePercent: number;
  isActive: boolean;
}

export interface InvoiceItem {
  id: string;
  procedureId: string;
  procedureCode: string;
  procedureName: string;
  category: ProcedureCategory;
  toothNumbers: string[]; // e.g. ["11", "12"] or ["#18"] or ["Full Mouth"]
  surface?: string; // e.g. "MOD", "O", "B", "L", "M", "D"
  quantity: number;
  unitPrice: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  taxPercent: number;
  notes?: string;
  lineTotal: number;
}

export interface PaymentTransaction {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  referenceNumber?: string;
  receivedBy?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. S7D-2026-0001
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  patientAddress?: string;
  doctorName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  totalItemDiscount: number;
  additionalDiscountType: 'percentage' | 'fixed';
  additionalDiscountValue: number;
  totalTax: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  status: PaymentStatus;
  payments: PaymentTransaction[];
  clinicalNotes?: string;
  nextAppointmentDate?: string;
  prescriptions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToothInfo {
  universal: number; // 1-32
  fdi: number; // 11-48
  primaryUniversal?: string; // A-T
  primaryFdi?: number; // 51-85
  name: string;
  quadrant: 'UR' | 'UL' | 'LL' | 'LR';
  arch: 'maxillary' | 'mandibular';
  isAnterior: boolean;
  isMolar: boolean;
}
