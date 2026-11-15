export type ToothNotation = 'fdi' | 'universal' | 'palmer';

export type ToothQuadrant = 'UR' | 'UL' | 'LL' | 'LR';
export type ToothArch = 'maxillary' | 'mandibular';
export type ToothSurface = 'occlusal' | 'mesial' | 'distal' | 'buccal' | 'lingual';

export type ToothConditionType = 
  | 'sound'        // Healthy
  | 'caries'       // Cavity / Decay
  | 'restored'     // Filling / Restoration
  | 'crown'        // Crown / Cap
  | 'rct'          // Root Canal Treated
  | 'implant'      // Dental Implant
  | 'missing'      // Extracted / Missing
  | 'impacted'     // Impacted / Unerupted
  | 'fractured';   // Chipped / Fractured

export interface ToothFinding {
  toothNumber: number; // Stored primarily as FDI for universal mapping
  condition: ToothConditionType;
  surfaces?: ToothSurface[]; // Applicable for caries/restorations (e.g., MOD)
  notes?: string;
  updatedAt: string;
}

export interface ToothInfo {
  fdi: number;
  universal: number;
  palmerNumber: number; // 1-8
  palmerQuadrant: ToothQuadrant;
  primaryFdi?: number;
  primaryUniversal?: string;
  primaryPalmerLetter?: string; // A-E
  name: string;
  quadrant: ToothQuadrant;
  arch: ToothArch;
  isAnterior: boolean;
  isMolar: boolean;
}

export interface Patient {
  id: string;
  patientId: string; // e.g. "PAT-1001"
  name: string;
  phone: string;
  email?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  address?: string;
  chiefComplaint?: string; // Initial visit reason / symptoms recorded at registration
  medicalAlerts: string[]; // e.g. ["Penicillin Allergy", "Hypertension", "Diabetes"]
  dentalChart: Record<string, ToothFinding>; // Keyed by FDI tooth number string e.g. "16", "21"
  totalBilled: number;
  totalPaid: number;
  balanceDue: number;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 
  | 'Scheduled'
  | 'Confirmed'
  | 'Checked-In'
  | 'In-Chair'
  | 'Completed'
  | 'Cancelled'
  | 'No-Show';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  durationMin: number;
  chair: string; // e.g. "Dental Chair"
  doctor: string;
  procedure: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  date: string;
  doctor: string;
  toothNumbers?: string[];
  subjective: string; // Chief Complaint & History of present illness
  objective: string;  // Intraoral exam & investigations
  assessment: string; // Clinical diagnosis
  plan: string;       // Treatment performed / planned
}

export interface PrescriptionItem {
  name: string;
  dosage: string;
  frequency: string; // e.g. "1 - 0 - 1 (Twice daily after food)"
  duration: string;  // e.g. "5 Days"
  instructions: string; // e.g. "Take after food with water"
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  date: string;
  doctor: string;
  diagnosis: string;
  medications: PrescriptionItem[];
  specialAdvice?: string;
  createdAt: string;
}

export interface Procedure {
  id: string;
  code: string;
  name: string;
  category: 
    | 'Diagnostic'
    | 'Preventive'
    | 'Restorative'
    | 'Endodontics'
    | 'Periodontics'
    | 'Oral Surgery'
    | 'Prosthodontics'
    | 'Orthodontics'
    | 'Pediatric'
    | 'Cosmetic';
  defaultFee: number;
  durationMin: number;
  isToothSpecific: boolean;
}

export interface InvoiceItem {
  id: string;
  procedureId: string;
  procedureName: string;
  procedureCode: string;
  teeth: string[];
  surfaces?: string;
  cost: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  doctor: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  paidAmount: number;
  balance: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI / QR' | 'Bank Transfer' | 'Insurance';
  status: 'Paid' | 'Partial' | 'Unpaid';
  notes?: string;
  createdAt: string;
}

export interface ClinicProfile {
  clinicName: string;
  tagline: string;
  doctorName: string;
  doctorQualification: string;
  registrationNumber: string;
  dentalCouncil: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  currencySymbol: string;
  currencyCode: string;
  defaultNotation: ToothNotation;
  defaultTaxRate: number;
  invoicePrefix: string;
  footerNote: string;
}

// -------------------------------------------------------------
// FINANCE MANAGEMENT: CONSULTANT PAYOUTS, LAB WORK & EXPENSES
// -------------------------------------------------------------

export type ConsultantSpecialty =
  | 'Orthodontist'
  | 'Oral & Maxillofacial Surgeon'
  | 'Endodontist'
  | 'Periodontist'
  | 'Prosthodontist / Implantologist'
  | 'Pedodontist'
  | 'Aesthetic Dentist'
  | 'General Dental Surgeon'
  | 'Other Specialist';

export interface ConsultantPayout {
  id: string;
  consultantName: string;
  consultantPhone?: string;
  specialty: ConsultantSpecialty;
  patientId?: string;
  patientName?: string;
  procedure: string;
  date: string; // YYYY-MM-DD
  caseFee: number;
  amountPaid: number;
  balanceDue: number;
  paymentMethod: 'UPI / GPay' | 'Cash' | 'Bank Transfer / IMPS' | 'Cheque';
  status: 'Paid' | 'Pending' | 'Partial';
  notes?: string;
  createdAt: string;
}

export type LabWorkStatus = 
  | 'In-Lab'
  | 'Delivered'
  | 'Fitted in Patient'
  | 'Sent for Remake'
  | 'Cancelled';

export interface LabWorkOrder {
  id: string;
  labName: string;
  labPhone?: string;
  workType: string; // e.g. "CAD/CAM Zirconia Crown", "PFM Cap", "Complete Denture", "Aligner"
  patientId?: string;
  patientName: string;
  teeth?: string; // e.g. "16 (FDI)", "21-23"
  shade?: string; // e.g. "A2", "A1", "3M Bleach"
  sentDate: string; // YYYY-MM-DD
  expectedDeliveryDate: string; // YYYY-MM-DD
  deliveredDate?: string;
  workStatus: LabWorkStatus;
  labCharge: number;
  amountPaid: number;
  balanceDue: number;
  paymentMethod: 'UPI / GPay' | 'Cash' | 'Bank Transfer / IMPS' | 'Cheque';
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  notes?: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'Dental Materials & Consumables'
  | 'Clinic Rent'
  | 'Electricity & TNEB'
  | 'Staff & Assistant Salary'
  | 'Bio-Medical Waste Disposal'
  | 'Equipment Servicing & Maintenance'
  | 'Marketing & Printing'
  | 'Tea, Coffee & Patient Hospitality'
  | 'Miscellaneous';

export interface GeneralExpense {
  id: string;
  category: ExpenseCategory;
  title: string;
  date: string; // YYYY-MM-DD
  amount: number;
  paidTo: string;
  paymentMethod: 'UPI / GPay' | 'Cash' | 'Bank Transfer / IMPS' | 'Card';
  invoiceNumber?: string;
  notes?: string;
  createdAt: string;
}

export type VisitType =
  | 'Routine Consultation'
  | 'Treatment Sitting'
  | 'Emergency / Pain'
  | 'Post-Op Review'
  | 'Recall / Maintenance';

export interface PatientVisit {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  visitNumber: number; // 1, 2, 3...
  visitType: VisitType;
  chiefComplaint: string;
  doctor: string;
  chair: string;
  proceduresDone: string[];
  teethTreated: string[];
  clinicalDiagnosis?: string;
  treatmentSummary?: string;
  prescriptionsIssued?: string[];
  feeCharged: number;
  amountPaid: number;
  paymentMode: 'UPI / QR' | 'Cash' | 'Card' | 'Bank Transfer' | 'None';
  nextVisitDate?: string;
  nextVisitPlan?: string;
  status: 'Completed' | 'In-Progress' | 'Follow-up Due';
  createdAt: string;
}


