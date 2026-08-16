import type { ClinicProfile, DentalProcedure, Patient, ToothInfo, Invoice } from '../types';

export const DENTAL_TEETH_MAP: ToothInfo[] = [
  // Upper Right Quadrant (Maxillary Right / UR) - Teeth 1 to 8 (Universal) / 18 to 11 (FDI)
  { universal: 1, fdi: 18, name: 'Upper Right 3rd Molar (Wisdom)', quadrant: 'UR', arch: 'maxillary', isAnterior: false, isMolar: true },
  { universal: 2, fdi: 17, name: 'Upper Right 2nd Molar', quadrant: 'UR', arch: 'maxillary', isAnterior: false, isMolar: true },
  { universal: 3, fdi: 16, name: 'Upper Right 1st Molar', quadrant: 'UR', arch: 'maxillary', isAnterior: false, isMolar: true },
  { universal: 4, fdi: 15, name: 'Upper Right 2nd Premolar', quadrant: 'UR', arch: 'maxillary', isAnterior: false, isMolar: false },
  { universal: 5, fdi: 14, name: 'Upper Right 1st Premolar', quadrant: 'UR', arch: 'maxillary', isAnterior: false, isMolar: false },
  { universal: 6, fdi: 13, name: 'Upper Right Canine (Cuspid)', quadrant: 'UR', arch: 'maxillary', isAnterior: true, isMolar: false },
  { universal: 7, fdi: 12, name: 'Upper Right Lateral Incisor', quadrant: 'UR', arch: 'maxillary', isAnterior: true, isMolar: false },
  { universal: 8, fdi: 11, name: 'Upper Right Central Incisor', quadrant: 'UR', arch: 'maxillary', isAnterior: true, isMolar: false },

  // Upper Left Quadrant (Maxillary Left / UL) - Teeth 9 to 16 (Universal) / 21 to 28 (FDI)
  { universal: 9, fdi: 21, name: 'Upper Left Central Incisor', quadrant: 'UL', arch: 'maxillary', isAnterior: true, isMolar: false },
  { universal: 10, fdi: 22, name: 'Upper Left Lateral Incisor', quadrant: 'UL', arch: 'maxillary', isAnterior: true, isMolar: false },
  { universal: 11, fdi: 23, name: 'Upper Left Canine (Cuspid)', quadrant: 'UL', arch: 'maxillary', isAnterior: true, isMolar: false },
  { universal: 12, fdi: 24, name: 'Upper Left 1st Premolar', quadrant: 'UL', arch: 'maxillary', isAnterior: false, isMolar: false },
  { universal: 13, fdi: 25, name: 'Upper Left 2nd Premolar', quadrant: 'UL', arch: 'maxillary', isAnterior: false, isMolar: false },
  { universal: 14, fdi: 26, name: 'Upper Left 1st Molar', quadrant: 'UL', arch: 'maxillary', isAnterior: false, isMolar: true },
  { universal: 15, fdi: 27, name: 'Upper Left 2nd Molar', quadrant: 'UL', arch: 'maxillary', isAnterior: false, isMolar: true },
  { universal: 16, fdi: 28, name: 'Upper Left 3rd Molar (Wisdom)', quadrant: 'UL', arch: 'maxillary', isAnterior: false, isMolar: true },

  // Lower Left Quadrant (Mandibular Left / LL) - Teeth 17 to 24 (Universal) / 38 to 31 (FDI)
  { universal: 17, fdi: 38, name: 'Lower Left 3rd Molar (Wisdom)', quadrant: 'LL', arch: 'mandibular', isAnterior: false, isMolar: true },
  { universal: 18, fdi: 37, name: 'Lower Left 2nd Molar', quadrant: 'LL', arch: 'mandibular', isAnterior: false, isMolar: true },
  { universal: 19, fdi: 36, name: 'Lower Left 1st Molar', quadrant: 'LL', arch: 'mandibular', isAnterior: false, isMolar: true },
  { universal: 20, fdi: 35, name: 'Lower Left 2nd Premolar', quadrant: 'LL', arch: 'mandibular', isAnterior: false, isMolar: false },
  { universal: 21, fdi: 34, name: 'Lower Left 1st Premolar', quadrant: 'LL', arch: 'mandibular', isAnterior: false, isMolar: false },
  { universal: 22, fdi: 33, name: 'Lower Left Canine (Cuspid)', quadrant: 'LL', arch: 'mandibular', isAnterior: true, isMolar: false },
  { universal: 23, fdi: 32, name: 'Lower Left Lateral Incisor', quadrant: 'LL', arch: 'mandibular', isAnterior: true, isMolar: false },
  { universal: 24, fdi: 31, name: 'Lower Left Central Incisor', quadrant: 'LL', arch: 'mandibular', isAnterior: true, isMolar: false },

  // Lower Right Quadrant (Mandibular Right / LR) - Teeth 25 to 32 (Universal) / 41 to 48 (FDI)
  { universal: 25, fdi: 41, name: 'Lower Right Central Incisor', quadrant: 'LR', arch: 'mandibular', isAnterior: true, isMolar: false },
  { universal: 26, fdi: 42, name: 'Lower Right Lateral Incisor', quadrant: 'LR', arch: 'mandibular', isAnterior: true, isMolar: false },
  { universal: 27, fdi: 43, name: 'Lower Right Canine (Cuspid)', quadrant: 'LR', arch: 'mandibular', isAnterior: true, isMolar: false },
  { universal: 28, fdi: 44, name: 'Lower Right 1st Premolar', quadrant: 'LR', arch: 'mandibular', isAnterior: false, isMolar: false },
  { universal: 29, fdi: 45, name: 'Lower Right 2nd Premolar', quadrant: 'LR', arch: 'mandibular', isAnterior: false, isMolar: false },
  { universal: 30, fdi: 46, name: 'Lower Right 1st Molar', quadrant: 'LR', arch: 'mandibular', isAnterior: false, isMolar: true },
  { universal: 31, fdi: 47, name: 'Lower Right 2nd Molar', quadrant: 'LR', arch: 'mandibular', isAnterior: false, isMolar: true },
  { universal: 32, fdi: 48, name: 'Lower Right 3rd Molar (Wisdom)', quadrant: 'LR', arch: 'mandibular', isAnterior: false, isMolar: true }
];

export const PRIMARY_TEETH_MAP: ToothInfo[] = [
  // Upper Right (UR - Quadrant 5) A-E / 55-51
  { universal: 101, fdi: 55, primaryUniversal: 'A', primaryFdi: 55, name: 'Primary Upper Right 2nd Molar', quadrant: 'UR', arch: 'maxillary', isAnterior: false, isMolar: true },
  { universal: 102, fdi: 54, primaryUniversal: 'B', primaryFdi: 54, name: 'Primary Upper Right 1st Molar', quadrant: 'UR', arch: 'maxillary', isAnterior: false, isMolar: true },
  { universal: 103, fdi: 53, primaryUniversal: 'C', primaryFdi: 53, name: 'Primary Upper Right Canine', quadrant: 'UR', arch: 'maxillary', isAnterior: true, isMolar: false },
  { universal: 104, fdi: 52, primaryUniversal: 'D', primaryFdi: 52, name: 'Primary Upper Right Lateral Incisor', quadrant: 'UR', arch: 'maxillary', isAnterior: true, isMolar: false },
  { universal: 105, fdi: 51, primaryUniversal: 'E', primaryFdi: 51, name: 'Primary Upper Right Central Incisor', quadrant: 'UR', arch: 'maxillary', isAnterior: true, isMolar: false },

  // Upper Left (UL - Quadrant 6) F-J / 61-65
  { universal: 106, fdi: 61, primaryUniversal: 'F', primaryFdi: 61, name: 'Primary Upper Left Central Incisor', quadrant: 'UL', arch: 'maxillary', isAnterior: true, isMolar: false },
  { universal: 107, fdi: 62, primaryUniversal: 'G', primaryFdi: 62, name: 'Primary Upper Left Lateral Incisor', quadrant: 'UL', arch: 'maxillary', isAnterior: true, isMolar: false },
  { universal: 108, fdi: 63, primaryUniversal: 'H', primaryFdi: 63, name: 'Primary Upper Left Canine', quadrant: 'UL', arch: 'maxillary', isAnterior: true, isMolar: false },
  { universal: 109, fdi: 64, primaryUniversal: 'I', primaryFdi: 64, name: 'Primary Upper Left 1st Molar', quadrant: 'UL', arch: 'maxillary', isAnterior: false, isMolar: true },
  { universal: 110, fdi: 65, primaryUniversal: 'J', primaryFdi: 65, name: 'Primary Upper Left 2nd Molar', quadrant: 'UL', arch: 'maxillary', isAnterior: false, isMolar: true },

  // Lower Left (LL - Quadrant 7) K-O / 75-71
  { universal: 111, fdi: 75, primaryUniversal: 'K', primaryFdi: 75, name: 'Primary Lower Left 2nd Molar', quadrant: 'LL', arch: 'mandibular', isAnterior: false, isMolar: true },
  { universal: 112, fdi: 74, primaryUniversal: 'L', primaryFdi: 74, name: 'Primary Lower Left 1st Molar', quadrant: 'LL', arch: 'mandibular', isAnterior: false, isMolar: true },
  { universal: 113, fdi: 73, primaryUniversal: 'M', primaryFdi: 73, name: 'Primary Lower Left Canine', quadrant: 'LL', arch: 'mandibular', isAnterior: true, isMolar: false },
  { universal: 114, fdi: 72, primaryUniversal: 'N', primaryFdi: 72, name: 'Primary Lower Left Lateral Incisor', quadrant: 'LL', arch: 'mandibular', isAnterior: true, isMolar: false },
  { universal: 115, fdi: 71, primaryUniversal: 'O', primaryFdi: 71, name: 'Primary Lower Left Central Incisor', quadrant: 'LL', arch: 'mandibular', isAnterior: true, isMolar: false },

  // Lower Right (LR - Quadrant 8) P-T / 81-85
  { universal: 116, fdi: 81, primaryUniversal: 'P', primaryFdi: 81, name: 'Primary Lower Right Central Incisor', quadrant: 'LR', arch: 'mandibular', isAnterior: true, isMolar: false },
  { universal: 117, fdi: 82, primaryUniversal: 'Q', primaryFdi: 82, name: 'Primary Lower Right Lateral Incisor', quadrant: 'LR', arch: 'mandibular', isAnterior: true, isMolar: false },
  { universal: 118, fdi: 83, primaryUniversal: 'R', primaryFdi: 83, name: 'Primary Lower Right Canine', quadrant: 'LR', arch: 'mandibular', isAnterior: true, isMolar: false },
  { universal: 119, fdi: 84, primaryUniversal: 'S', primaryFdi: 84, name: 'Primary Lower Right 1st Molar', quadrant: 'LR', arch: 'mandibular', isAnterior: false, isMolar: true },
  { universal: 120, fdi: 85, primaryUniversal: 'T', primaryFdi: 85, name: 'Primary Lower Right 2nd Molar', quadrant: 'LR', arch: 'mandibular', isAnterior: false, isMolar: true }
];

export const INITIAL_CLINIC_PROFILE: ClinicProfile = {
  name: 'Smile7dental Clinic & Implant Center',
  tagline: 'Precision Dental Care & Advanced Aesthetic Dentistry',
  dentistInCharge: 'Dr. Sarah Jenkins, BDS, MDS (Prosthodontics)',
  registrationNumber: 'MED-REG/DEN-2024-8841',
  dentalCouncilNumber: 'DCI-99420-A',
  taxId: 'GSTIN27AABCS7777D1Z9',
  phone: '+1 (555) 764-5377',
  email: 'care@smile7dental.com',
  website: 'www.smile7dental.com',
  addressLine1: 'Suite 701, Healthscape Tower, 45 Dental Avenue',
  addressLine2: 'Medical Arts District, Floor 7',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  currencySymbol: '$',
  currencyCode: 'USD',
  defaultTaxRate: 0,
  defaultToothNotation: 'fdi',
  invoicePrefix: 'S7D',
  invoiceFooterNote: 'Thank you for choosing Smile7dental. Please keep this invoice for warranty and insurance claims. Follow prescribed post-op care.',
  bankDetails: {
    accountName: 'Smile7dental Private Healthcare LLC',
    accountNumber: '4490081290334',
    ifscOrRouting: 'CHASUS33XXX',
    bankName: 'Chase Commercial Bank, 5th Ave Branch',
    upiId: 'smile7dental@okaxis'
  }
};

export const INITIAL_PROCEDURES: DentalProcedure[] = [
  // Diagnostic
  { id: 'proc-1', code: 'D0120', name: 'Periodic Comprehensive Oral Evaluation', category: 'Diagnostic', defaultCost: 50, standardDurationMin: 30, isToothSpecific: false, taxRatePercent: 0, isActive: true },
  { id: 'proc-2', code: 'D0210', name: 'Intraoral Digital Radiograph (IOPA / Bitewing)', category: 'Diagnostic', defaultCost: 25, standardDurationMin: 15, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-3', code: 'D0330', name: 'Panoramic Digital X-Ray (OPG)', category: 'Diagnostic', defaultCost: 80, standardDurationMin: 20, isToothSpecific: false, taxRatePercent: 0, isActive: true },
  { id: 'proc-4', code: 'D0367', name: 'Cone Beam CT (CBCT) 3D Scan - Single Arch', category: 'Diagnostic', defaultCost: 180, standardDurationMin: 30, isToothSpecific: false, taxRatePercent: 0, isActive: true },

  // Preventive
  { id: 'proc-5', code: 'D1110', name: 'Ultrasonic Scaling & Polishing (Full Mouth Cleaning)', category: 'Preventive', defaultCost: 100, standardDurationMin: 45, isToothSpecific: false, taxRatePercent: 0, isActive: true },
  { id: 'proc-6', code: 'D1206', name: 'Topical Fluoride Varnish Application', category: 'Preventive', defaultCost: 40, standardDurationMin: 15, isToothSpecific: false, taxRatePercent: 0, isActive: true },
  { id: 'proc-7', code: 'D1351', name: 'Pit & Fissure Sealant (Per Tooth)', category: 'Preventive', defaultCost: 45, standardDurationMin: 20, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-8', code: 'D4341', name: 'Deep Root Planing & Periodontal Curettage (Per Quadrant)', category: 'Periodontics', defaultCost: 150, standardDurationMin: 45, isToothSpecific: true, taxRatePercent: 0, isActive: true },

  // Restorative
  { id: 'proc-9', code: 'D2391', name: 'Tooth Colored Composite Restoration (1 Surface)', category: 'Restorative', defaultCost: 85, standardDurationMin: 30, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-10', code: 'D2392', name: 'Tooth Colored Composite Restoration (2 Surfaces - MOD)', category: 'Restorative', defaultCost: 120, standardDurationMin: 45, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-11', code: 'D2393', name: 'Complex Composite Core Build-up (3+ Surfaces)', category: 'Restorative', defaultCost: 160, standardDurationMin: 60, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-12', code: 'D2950', name: 'Fiber Post & Core Build-Up', category: 'Restorative', defaultCost: 130, standardDurationMin: 45, isToothSpecific: true, taxRatePercent: 0, isActive: true },

  // Endodontics
  { id: 'proc-13', code: 'D3310', name: 'Root Canal Treatment (Anterior Tooth)', category: 'Endodontics', defaultCost: 220, standardDurationMin: 60, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-14', code: 'D3320', name: 'Root Canal Treatment (Premolar Tooth)', category: 'Endodontics', defaultCost: 280, standardDurationMin: 60, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-15', code: 'D3330', name: 'Root Canal Treatment - Rotary Microscope (Molar Tooth)', category: 'Endodontics', defaultCost: 380, standardDurationMin: 75, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-16', code: 'D3346', name: 'Re-treatment of Previous Failed Root Canal', category: 'Endodontics', defaultCost: 450, standardDurationMin: 90, isToothSpecific: true, taxRatePercent: 0, isActive: true },

  // Prosthodontics & Crowns
  { id: 'proc-17', code: 'D2740', name: 'CAD/CAM Monolithic Zirconia Crown (15 Year Warranty)', category: 'Prosthodontics', defaultCost: 420, standardDurationMin: 45, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-18', code: 'D2750', name: 'Porcelain Fused to Metal (PFM) Crown', category: 'Prosthodontics', defaultCost: 260, standardDurationMin: 45, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-19', code: 'D2962', name: 'E-Max High Aesthetic Ceramic Veneer', category: 'Cosmetic', defaultCost: 480, standardDurationMin: 60, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-20', code: 'D6010', name: 'Titanium Dental Implant Fixture (Straumann / Nobel)', category: 'Prosthodontics', defaultCost: 950, standardDurationMin: 60, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-21', code: 'D6057', name: 'Custom Implant Abutment & Screw Retained Crown', category: 'Prosthodontics', defaultCost: 550, standardDurationMin: 45, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-22', code: 'D5110', name: 'Complete Acrylic Denture (Upper or Lower Arch)', category: 'Prosthodontics', defaultCost: 650, standardDurationMin: 45, isToothSpecific: false, taxRatePercent: 0, isActive: true },

  // Oral Surgery
  { id: 'proc-23', code: 'D7140', name: 'Simple Extraction (Erupted Tooth)', category: 'Oral Surgery', defaultCost: 90, standardDurationMin: 30, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-24', code: 'D7240', name: 'Surgical Impaction Extraction (Impacted Wisdom Tooth)', category: 'Oral Surgery', defaultCost: 280, standardDurationMin: 60, isToothSpecific: true, taxRatePercent: 0, isActive: true },
  { id: 'proc-25', code: 'D7953', name: 'Socket Bone Grafting & PRF Membrane Placement', category: 'Oral Surgery', defaultCost: 250, standardDurationMin: 45, isToothSpecific: true, taxRatePercent: 0, isActive: true },

  // Orthodontics & Cosmetic
  { id: 'proc-26', code: 'D8080', name: 'Comprehensive Orthodontic Brackets (Full Treatment Stage 1)', category: 'Orthodontics', defaultCost: 1800, standardDurationMin: 90, isToothSpecific: false, taxRatePercent: 0, isActive: true },
  { id: 'proc-27', code: 'D8090', name: 'Clear Aligners Therapy (Full Dual-Arch Pack)', category: 'Orthodontics', defaultCost: 2400, standardDurationMin: 60, isToothSpecific: false, taxRatePercent: 0, isActive: true },
  { id: 'proc-28', code: 'D9972', name: 'In-Office Laser Teeth Whitening (Zoom 3-Cycle Session)', category: 'Cosmetic', defaultCost: 350, standardDurationMin: 60, isToothSpecific: false, taxRatePercent: 0, isActive: true },
  { id: 'proc-29', code: 'D9944', name: 'Custom Occlusal Nightguard / Bruxism Splint', category: 'Preventive', defaultCost: 180, standardDurationMin: 30, isToothSpecific: false, taxRatePercent: 0, isActive: true }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-101',
    patientNumber: 'PAT-1001',
    fullName: 'Eleanor Vance',
    phone: '+1 (555) 234-8901',
    email: 'eleanor.vance@example.com',
    age: 34,
    gender: 'female',
    dateOfBirth: '1992-04-12',
    address: '142 Riverside Blvd, Apt 4B, New York, NY',
    bloodGroup: 'O+',
    medicalAlerts: ['Penicillin Allergy'],
    emergencyContact: {
      name: 'Thomas Vance',
      relationship: 'Spouse',
      phone: '+1 (555) 234-8902'
    },
    totalBilled: 1080,
    totalPaid: 1080,
    outstandingBalance: 0,
    createdAt: '2026-07-10T10:30:00Z',
    updatedAt: '2026-08-10T14:15:00Z'
  },
  {
    id: 'pat-102',
    patientNumber: 'PAT-1002',
    fullName: 'Marcus Sterling',
    phone: '+1 (555) 872-4419',
    email: 'm.sterling@financecorp.net',
    age: 48,
    gender: 'male',
    dateOfBirth: '1978-11-23',
    address: '88 Wall Street, Penthouse C, New York, NY',
    bloodGroup: 'A+',
    medicalAlerts: ['Hypertension', 'Takes Aspirin 75mg'],
    emergencyContact: {
      name: 'Claire Sterling',
      relationship: 'Spouse',
      phone: '+1 (555) 872-4420'
    },
    totalBilled: 1500,
    totalPaid: 950,
    outstandingBalance: 550,
    createdAt: '2026-07-18T11:00:00Z',
    updatedAt: '2026-08-12T16:45:00Z'
  },
  {
    id: 'pat-103',
    patientNumber: 'PAT-1003',
    fullName: 'Sophia Chen',
    phone: '+1 (555) 345-6789',
    email: 'sophia.chen@techstartup.io',
    age: 27,
    gender: 'female',
    dateOfBirth: '1999-02-18',
    address: '520 8th Ave, Brooklyn, NY',
    bloodGroup: 'B+',
    medicalAlerts: ['Latex Sensitivity'],
    emergencyContact: {
      name: 'David Chen',
      relationship: 'Father',
      phone: '+1 (555) 345-6780'
    },
    totalBilled: 730,
    totalPaid: 730,
    outstandingBalance: 0,
    createdAt: '2026-08-01T09:15:00Z',
    updatedAt: '2026-08-14T11:20:00Z'
  },
  {
    id: 'pat-104',
    patientNumber: 'PAT-1004',
    fullName: 'Robert Hayes',
    phone: '+1 (555) 609-3122',
    email: 'rhayes99@gmail.com',
    age: 52,
    gender: 'male',
    dateOfBirth: '1974-06-30',
    address: '77 Lexington Ave, Manhattan, NY',
    bloodGroup: 'AB+',
    medicalAlerts: ['Type 2 Diabetic (Controlled)'],
    emergencyContact: {
      name: 'Jessica Hayes',
      relationship: 'Daughter',
      phone: '+1 (555) 609-3125'
    },
    totalBilled: 380,
    totalPaid: 0,
    outstandingBalance: 380,
    createdAt: '2026-08-15T15:00:00Z',
    updatedAt: '2026-08-15T15:00:00Z'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1001',
    invoiceNumber: 'S7D-2026-0001',
    patientId: 'pat-101',
    patientName: 'Eleanor Vance',
    patientPhone: '+1 (555) 234-8901',
    patientAge: 34,
    patientGender: 'Female',
    patientAddress: '142 Riverside Blvd, Apt 4B, New York, NY',
    doctorName: 'Dr. Sarah Jenkins',
    date: '2026-08-10',
    dueDate: '2026-08-10',
    items: [
      {
        id: 'item-1',
        procedureId: 'proc-15',
        procedureCode: 'D3330',
        procedureName: 'Root Canal Treatment - Rotary Microscope (Molar Tooth)',
        category: 'Endodontics',
        toothNumbers: ['16 (FDI: 26)'],
        surface: 'Occlusal',
        quantity: 1,
        unitPrice: 380,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: '3 root canals obturated with warm gutta-percha',
        lineTotal: 380
      },
      {
        id: 'item-2',
        procedureId: 'proc-12',
        procedureCode: 'D2950',
        procedureName: 'Fiber Post & Core Build-Up',
        category: 'Restorative',
        toothNumbers: ['16 (FDI: 26)'],
        surface: 'MOD',
        quantity: 1,
        unitPrice: 130,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'Dual cure composite core build-up',
        lineTotal: 130
      },
      {
        id: 'item-3',
        procedureId: 'proc-17',
        procedureCode: 'D2740',
        procedureName: 'CAD/CAM Monolithic Zirconia Crown (15 Year Warranty)',
        category: 'Prosthodontics',
        toothNumbers: ['16 (FDI: 26)'],
        surface: 'Full Crown',
        quantity: 1,
        unitPrice: 420,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'Shade A2 monolithic translucent zirconia',
        lineTotal: 420
      },
      {
        id: 'item-4',
        procedureId: 'proc-5',
        procedureCode: 'D1110',
        procedureName: 'Ultrasonic Scaling & Polishing (Full Mouth Cleaning)',
        category: 'Preventive',
        toothNumbers: ['Full Mouth'],
        quantity: 1,
        unitPrice: 150,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'Supra & subgingival plaque removal',
        lineTotal: 150
      }
    ],
    subtotal: 1080,
    totalItemDiscount: 0,
    additionalDiscountType: 'fixed',
    additionalDiscountValue: 0,
    totalTax: 0,
    grandTotal: 1080,
    amountPaid: 1080,
    balanceDue: 0,
    status: 'paid',
    payments: [
      {
        id: 'pay-1',
        invoiceId: 'inv-1001',
        amount: 1080,
        date: '2026-08-10',
        method: 'card',
        referenceNumber: 'TXN-99823-VISA',
        receivedBy: 'Dr. Sarah Jenkins',
        notes: 'Paid in full via Visa Platinum Card'
      }
    ],
    clinicalNotes: 'Successful root canal treatment with crown cementation. Patient tolerated procedure well. Review in 6 months.',
    nextAppointmentDate: '2027-02-10',
    prescriptions: 'Amoxicillin 500mg (1 TDS x 5 days), Ibuprofen 400mg PRN for discomfort',
    createdAt: '2026-08-10T14:15:00Z',
    updatedAt: '2026-08-10T14:15:00Z'
  },
  {
    id: 'inv-1002',
    invoiceNumber: 'S7D-2026-0002',
    patientId: 'pat-102',
    patientName: 'Marcus Sterling',
    patientPhone: '+1 (555) 872-4419',
    patientAge: 48,
    patientGender: 'Male',
    patientAddress: '88 Wall Street, Penthouse C, New York, NY',
    doctorName: 'Dr. Sarah Jenkins',
    date: '2026-08-12',
    dueDate: '2026-08-26',
    items: [
      {
        id: 'item-201',
        procedureId: 'proc-20',
        procedureCode: 'D6010',
        procedureName: 'Titanium Dental Implant Fixture (Straumann / Nobel)',
        category: 'Prosthodontics',
        toothNumbers: ['19 (FDI: 36)'],
        quantity: 1,
        unitPrice: 950,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'Straumann SLA Bone Level Implant 4.1mm x 10mm',
        lineTotal: 950
      },
      {
        id: 'item-202',
        procedureId: 'proc-21',
        procedureCode: 'D6057',
        procedureName: 'Custom Implant Abutment & Screw Retained Crown',
        category: 'Prosthodontics',
        toothNumbers: ['19 (FDI: 36)'],
        quantity: 1,
        unitPrice: 550,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'Stage 2 Crown component (Scheduled post osseointegration)',
        lineTotal: 550
      }
    ],
    subtotal: 1500,
    totalItemDiscount: 0,
    additionalDiscountType: 'fixed',
    additionalDiscountValue: 0,
    totalTax: 0,
    grandTotal: 1500,
    amountPaid: 950,
    balanceDue: 550,
    status: 'partial',
    payments: [
      {
        id: 'pay-2',
        invoiceId: 'inv-1002',
        amount: 950,
        date: '2026-08-12',
        method: 'bank_transfer',
        referenceNumber: 'WIRE-881920',
        receivedBy: 'Front Desk',
        notes: 'Initial implant fixture surgical placement stage deposit'
      }
    ],
    clinicalNotes: 'Implant placed with torque > 35 Ncm. Primary stability achieved. Suture removal scheduled in 10 days.',
    nextAppointmentDate: '2026-08-22',
    prescriptions: 'Augmentin 625mg 1 BD x 5 days, Chlorhexidine 0.2% mouthwash',
    createdAt: '2026-08-12T16:45:00Z',
    updatedAt: '2026-08-12T16:45:00Z'
  },
  {
    id: 'inv-1003',
    invoiceNumber: 'S7D-2026-0003',
    patientId: 'pat-103',
    patientName: 'Sophia Chen',
    patientPhone: '+1 (555) 345-6789',
    patientAge: 27,
    patientGender: 'Female',
    patientAddress: '520 8th Ave, Brooklyn, NY',
    doctorName: 'Dr. Sarah Jenkins',
    date: '2026-08-14',
    dueDate: '2026-08-14',
    items: [
      {
        id: 'item-301',
        procedureId: 'proc-28',
        procedureCode: 'D9972',
        procedureName: 'In-Office Laser Teeth Whitening (Zoom 3-Cycle Session)',
        category: 'Cosmetic',
        toothNumbers: ['Full Mouth (Anterior 20)'],
        quantity: 1,
        unitPrice: 350,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'Achieved 5 shades lighter on VITA guide (from A3 to B1)',
        lineTotal: 350
      },
      {
        id: 'item-302',
        procedureId: 'proc-9',
        procedureCode: 'D2391',
        procedureName: 'Tooth Colored Composite Restoration (1 Surface)',
        category: 'Restorative',
        toothNumbers: ['8 (FDI: 11)', '9 (FDI: 21)'],
        surface: 'Mesial Incisal Edge',
        quantity: 2,
        unitPrice: 85,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'Aesthetic edge smoothing and composite bonding',
        lineTotal: 170
      },
      {
        id: 'item-303',
        procedureId: 'proc-5',
        procedureCode: 'D1110',
        procedureName: 'Ultrasonic Scaling & Polishing (Full Mouth Cleaning)',
        category: 'Preventive',
        toothNumbers: ['Full Mouth'],
        quantity: 1,
        unitPrice: 100,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        lineTotal: 100
      },
      {
        id: 'item-304',
        procedureId: 'proc-2',
        procedureCode: 'D0210',
        procedureName: 'Intraoral Digital Radiograph (IOPA / Bitewing)',
        category: 'Diagnostic',
        toothNumbers: ['8 (FDI: 11)', '9 (FDI: 21)'],
        quantity: 2,
        unitPrice: 25,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        lineTotal: 50
      },
      {
        id: 'item-305',
        procedureId: 'proc-6',
        procedureCode: 'D1206',
        procedureName: 'Topical Fluoride Varnish Application',
        category: 'Preventive',
        toothNumbers: ['Full Mouth'],
        quantity: 1,
        unitPrice: 60,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        lineTotal: 60
      }
    ],
    subtotal: 730,
    totalItemDiscount: 0,
    additionalDiscountType: 'fixed',
    additionalDiscountValue: 0,
    totalTax: 0,
    grandTotal: 730,
    amountPaid: 730,
    balanceDue: 0,
    status: 'paid',
    payments: [
      {
        id: 'pay-3',
        invoiceId: 'inv-1003',
        amount: 730,
        date: '2026-08-14',
        method: 'upi',
        referenceNumber: 'UPI/29930182449',
        receivedBy: 'Front Desk',
        notes: 'Instant QR code scan payment'
      }
    ],
    clinicalNotes: 'Cosmetic enhancement complete. Avoid tea/coffee/red wine for 48 hours to preserve whitening results.',
    nextAppointmentDate: '2027-02-14',
    createdAt: '2026-08-14T11:20:00Z',
    updatedAt: '2026-08-14T11:20:00Z'
  },
  {
    id: 'inv-1004',
    invoiceNumber: 'S7D-2026-0004',
    patientId: 'pat-104',
    patientName: 'Robert Hayes',
    patientPhone: '+1 (555) 609-3122',
    patientAge: 52,
    patientGender: 'Male',
    patientAddress: '77 Lexington Ave, Manhattan, NY',
    doctorName: 'Dr. Sarah Jenkins',
    date: '2026-08-15',
    dueDate: '2026-08-29',
    items: [
      {
        id: 'item-401',
        procedureId: 'proc-15',
        procedureCode: 'D3330',
        procedureName: 'Root Canal Treatment - Rotary Microscope (Molar Tooth)',
        category: 'Endodontics',
        toothNumbers: ['31 (FDI: 47)'],
        surface: 'Occlusal',
        quantity: 1,
        unitPrice: 380,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'Access cavity prepared, biomechanical preparation completed under rubber dam',
        lineTotal: 380
      }
    ],
    subtotal: 380,
    totalItemDiscount: 0,
    additionalDiscountType: 'fixed',
    additionalDiscountValue: 0,
    totalTax: 0,
    grandTotal: 380,
    amountPaid: 0,
    balanceDue: 380,
    status: 'unpaid',
    payments: [],
    clinicalNotes: 'Initial visit for lower right 2nd molar severe pulpitis. Temporary restoration placed. Next visit for canal obturation.',
    nextAppointmentDate: '2026-08-20',
    prescriptions: 'Cefixime 200mg BD x 3 days, Ketorolac 10mg PRN for pain',
    createdAt: '2026-08-15T15:00:00Z',
    updatedAt: '2026-08-15T15:00:00Z'
  }
];
