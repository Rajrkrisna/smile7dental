import type { ClinicProfile, DentalProcedure, Patient, ToothInfo, Invoice, AdminAuthConfig } from '../types';

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
  name: 'Smile7 Dental Clinic',
  tagline: 'Precision Dental Care Redefined for Comfort',
  dentistInCharge: 'Dr. P. Manickapriya (BDS)',
  registrationNumber: 'TNDC-DEN/2018/24892',
  dentalCouncilNumber: 'Tamil Nadu Dental Council Reg. #24892',
  taxId: '33AAFPS7777D1Z5',
  phone: '+91 97908 62510',
  email: 'care@smile7dental.com',
  website: 'https://smile7dental.com',
  addressLine1: 'No. 1/2, Alapakkam Main Road, Janaki Nagar',
  addressLine2: 'Maduravoyal',
  city: 'Chennai',
  state: 'Tamil Nadu',
  zipCode: '600095',
  currencySymbol: '₹',
  currencyCode: 'INR',
  defaultTaxRate: 0,
  defaultToothNotation: 'fdi',
  invoicePrefix: 'S7D',
  invoiceFooterNote: 'Thank you for choosing Smile7 Dental Clinic. Please keep this invoice for warranty and medical records. For appointments or post-treatment queries, call +91 97908 62510.',
  bankDetails: {
    accountName: 'Smile7 Dental Clinic - Dr. P. Manickapriya',
    accountNumber: '389201948201',
    ifscOrRouting: 'SBIN0012845',
    bankName: 'State Bank of India, Maduravoyal Branch',
    upiId: '9790862510@okaxis'
  }
};

export const INITIAL_ADMIN_AUTH: AdminAuthConfig = {
  adminEmail: 'care@smile7dental.com',
  adminPin: '7777',
  adminPassword: 'Smile7@Admin2026',
  subdomainUrl: 'billing.smile7dental.com',
  autoLockTimeoutMinutes: 15
};

export const INITIAL_PROCEDURES: DentalProcedure[] = [
  // Diagnostic
  { id: 'proc-1', code: 'D0120', name: 'Digital RVG Radiography & Comprehensive Clinical Exam', category: 'Diagnostic', defaultCost: 300, standardDurationMin: 30, isToothSpecific: false, taxRatePercent: 0, isActive: true, description: 'High-definition digital RVG X-rays with low radiation & personalized treatment plan.' },
  { id: 'proc-2', code: 'D0210', name: 'Intraoral Digital Radiograph (IOPA / Bitewing)', category: 'Diagnostic', defaultCost: 200, standardDurationMin: 15, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Targeted single-tooth digital RVG image for root & decay isolation.' },
  { id: 'proc-3', code: 'D0330', name: 'Panoramic Digital X-Ray (OPG)', category: 'Diagnostic', defaultCost: 700, standardDurationMin: 20, isToothSpecific: false, taxRatePercent: 0, isActive: true, description: 'Full mouth 2D panoramic radiography for jaw, wisdom tooth, & bone assessment.' },

  // Preventive & Hygiene
  { id: 'proc-5', code: 'D1110', name: 'Ultrasonic Plaque Scaling & Micro-Polishing', category: 'Preventive', defaultCost: 850, standardDurationMin: 45, isToothSpecific: false, taxRatePercent: 0, isActive: true, description: 'Gentle ultrasonic scaling removes calculus, stains, and plaque followed by fine enamel polish.' },
  { id: 'proc-6', code: 'D1206', name: 'Painless Topical Fluoride Varnish Application', category: 'Pediatric', defaultCost: 500, standardDurationMin: 15, isToothSpecific: false, taxRatePercent: 0, isActive: true, description: 'Protective remineralizing fluoride layer for child cavity resistance.' },
  { id: 'proc-7', code: 'D1351', name: 'Pit & Fissure Cavity Sealant (Per Tooth)', category: 'Pediatric', defaultCost: 600, standardDurationMin: 20, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'BPA-free resin sealant in deep molar grooves to prevent child tooth decay.' },
  { id: 'proc-8', code: 'D4341', name: 'Deep Root Planing & Periodontal Curettage (Per Quadrant)', category: 'Periodontics', defaultCost: 1500, standardDurationMin: 45, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Subgingival calculus removal for bleeding gums and periodontitis.' },

  // Restorative
  { id: 'proc-9', code: 'D2391', name: 'Tooth-Colored Light-Cure Composite Laser Restoration (1 Surface)', category: 'Restorative', defaultCost: 900, standardDurationMin: 30, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Invisible natural shade matched nano-hybrid composite filling.' },
  { id: 'proc-10', code: 'D2392', name: 'Complex Composite Restoration (2 Surfaces - MOD)', category: 'Restorative', defaultCost: 1400, standardDurationMin: 45, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Multi-surface structural composite restoration.' },
  { id: 'proc-12', code: 'D2950', name: 'Fiber Post & Core Build-Up Reinforcement', category: 'Restorative', defaultCost: 1200, standardDurationMin: 45, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Biocompatible glass fiber post inserted for crown retention.' },

  // Painless Root Canal Therapy (Endodontics)
  { id: 'proc-13', code: 'D3310', name: 'Painless Rotary Root Canal Therapy (Anterior Tooth)', category: 'Endodontics', defaultCost: 2800, standardDurationMin: 60, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Single/dual sitting painless rotary RCT with laser disinfection for front teeth.' },
  { id: 'proc-14', code: 'D3320', name: 'Painless Rotary Root Canal Therapy (Premolar Tooth)', category: 'Endodontics', defaultCost: 3400, standardDurationMin: 60, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Painless rotary root canal for 2-canal bicuspids.' },
  { id: 'proc-15', code: 'D3330', name: 'Painless Rotary Microscope Root Canal Therapy (Molar Tooth)', category: 'Endodontics', defaultCost: 4200, standardDurationMin: 75, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: '3-4 canal complex molar RCT with thermal gutta-percha 3D hermetic sealing.' },
  { id: 'proc-16', code: 'D3346', name: 'Re-treatment of Previous Failed Root Canal', category: 'Endodontics', defaultCost: 4800, standardDurationMin: 90, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Removal of old filling, ultrasonic disinfection, and resealing.' },

  // Crowns & Prosthodontics
  { id: 'proc-17', code: 'D2740', name: 'CAD/CAM Monolithic High-Translucent Zirconia Crown (15 Yr Warranty)', category: 'Prosthodontics', defaultCost: 6500, standardDurationMin: 45, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Precision digitally milled unbreakable zirconia with warranty card.' },
  { id: 'proc-18', code: 'D2750', name: 'Porcelain Fused to Metal (PFM) Ceramic Crown', category: 'Prosthodontics', defaultCost: 3200, standardDurationMin: 45, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Standard high-strength ceramic crown.' },
  { id: 'proc-19', code: 'D2962', name: 'Cosmetic Porcelain Veneers & Smile Design (Per Unit)', category: 'Cosmetic', defaultCost: 7000, standardDurationMin: 60, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Ultra-thin E-Max aesthetic ceramic veneer for gap closure and smile makeover.' },
  { id: 'proc-20', code: 'D6010', name: 'Keyhole Titanium Dental Implant Fixture (Straumann / Osstem)', category: 'Prosthodontics', defaultCost: 22000, standardDurationMin: 60, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Keyhole titanium implant placement under local anesthesia.' },
  { id: 'proc-21', code: 'D6057', name: 'Custom Implant Abutment & Screw-Retained Ceramic Crown', category: 'Prosthodontics', defaultCost: 10000, standardDurationMin: 45, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Final custom ceramic crown attachment & bite calibration.' },
  { id: 'proc-22', code: 'D5110', name: 'Complete Acrylic Denture (Single Arch)', category: 'Prosthodontics', defaultCost: 8500, standardDurationMin: 45, isToothSpecific: false, taxRatePercent: 0, isActive: true, description: 'Custom fabricated full dental arch replacement.' },

  // Oral Surgery
  { id: 'proc-23', code: 'D7140', name: 'Simple Extraction under Local Anaesthesia', category: 'Oral Surgery', defaultCost: 600, standardDurationMin: 30, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Painless atraumatic tooth removal.' },
  { id: 'proc-24', code: 'D7240', name: 'Surgical Impaction Wisdom Tooth Removal', category: 'Oral Surgery', defaultCost: 3500, standardDurationMin: 60, isToothSpecific: true, taxRatePercent: 0, isActive: true, description: 'Minor surgical removal of bony impacted 3rd molar.' },

  // Clear Aligners & Whitening
  { id: 'proc-26', code: 'D8080', name: 'Conventional Orthodontic Braces (Full Dual-Arch)', category: 'Orthodontics', defaultCost: 25000, standardDurationMin: 90, isToothSpecific: false, taxRatePercent: 0, isActive: true, description: 'Ceramic/Metal brackets with orthodontic wire alignment.' },
  { id: 'proc-27', code: 'D8090', name: 'Invisalign & Clear Aligners Therapy (Full Treatment)', category: 'Orthodontics', defaultCost: 45000, standardDurationMin: 60, isToothSpecific: false, taxRatePercent: 0, isActive: true, description: 'Virtually invisible, removable custom aligner trays with digital 3D outcome mapping.' },
  { id: 'proc-28', code: 'D9972', name: 'Laser Teeth Whitening & Cleaning (Cold-Light Activation)', category: 'Cosmetic', defaultCost: 4500, standardDurationMin: 60, isToothSpecific: false, taxRatePercent: 0, isActive: true, description: 'Brighten smile up to 8 shades in 45 minutes using cold-light laser activation.' },
  { id: 'proc-29', code: 'D9944', name: 'Custom Occlusal Nightguard / Bruxism Splint', category: 'Preventive', defaultCost: 1800, standardDurationMin: 30, isToothSpecific: false, taxRatePercent: 0, isActive: true, description: 'Protective custom molded guard for night grinding and TMJ relief.' }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-101',
    patientNumber: 'PAT-1001',
    fullName: 'Kavitha Ramesh',
    phone: '+91 98401 23891',
    email: 'kavitha.ramesh@gmail.com',
    age: 32,
    gender: 'female',
    dateOfBirth: '1994-05-14',
    address: 'Plot 42, Janaki Nagar, Maduravoyal, Chennai',
    bloodGroup: 'O+',
    medicalAlerts: ['Penicillin Allergy'],
    emergencyContact: {
      name: 'Ramesh Sundaram',
      relationship: 'Spouse',
      phone: '+91 98401 23892'
    },
    totalBilled: 12500,
    totalPaid: 12500,
    outstandingBalance: 0,
    createdAt: '2026-07-10T10:30:00Z',
    updatedAt: '2026-08-10T14:15:00Z'
  },
  {
    id: 'pat-102',
    patientNumber: 'PAT-1002',
    fullName: 'Senthil Kumar',
    phone: '+91 97890 55412',
    email: 'senthil.k@autotech.in',
    age: 46,
    gender: 'male',
    dateOfBirth: '1980-11-20',
    address: '18/4, Alapakkam Main Road, Maduravoyal, Chennai',
    bloodGroup: 'A+',
    medicalAlerts: ['Hypertension (Controlled)'],
    emergencyContact: {
      name: 'Radha Senthil',
      relationship: 'Spouse',
      phone: '+91 97890 55413'
    },
    totalBilled: 32000,
    totalPaid: 22000,
    outstandingBalance: 10000,
    createdAt: '2026-07-18T11:00:00Z',
    updatedAt: '2026-08-12T16:45:00Z'
  },
  {
    id: 'pat-103',
    patientNumber: 'PAT-1003',
    fullName: 'Ananya Sundaram',
    phone: '+91 94441 87654',
    email: 'ananya.sundaram@tcs.com',
    age: 26,
    gender: 'female',
    dateOfBirth: '2000-03-12',
    address: 'Flat 3B, Sunshine Apartments, Mount Poonamallee Road, Porur, Chennai',
    bloodGroup: 'B+',
    medicalAlerts: [],
    emergencyContact: {
      name: 'Sundaram Natarajan',
      relationship: 'Father',
      phone: '+91 94441 87650'
    },
    totalBilled: 5350,
    totalPaid: 5350,
    outstandingBalance: 0,
    createdAt: '2026-08-01T09:15:00Z',
    updatedAt: '2026-08-14T11:20:00Z'
  },
  {
    id: 'pat-104',
    patientNumber: 'PAT-1004',
    fullName: 'Rajesh Varadarajan',
    phone: '+91 98840 33219',
    email: 'rajesh.v@chennaifinance.co.in',
    age: 54,
    gender: 'male',
    dateOfBirth: '1972-08-28',
    address: '67, 2nd Avenue, Anna Nagar West, Chennai',
    bloodGroup: 'AB+',
    medicalAlerts: ['Type 2 Diabetes (HbA1c 6.8)'],
    emergencyContact: {
      name: 'Gayatri Rajesh',
      relationship: 'Spouse',
      phone: '+91 98840 33220'
    },
    totalBilled: 4200,
    totalPaid: 0,
    outstandingBalance: 4200,
    createdAt: '2026-08-15T15:00:00Z',
    updatedAt: '2026-08-15T15:00:00Z'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1001',
    invoiceNumber: 'S7D-2026-0001',
    patientId: 'pat-101',
    patientName: 'Kavitha Ramesh',
    patientPhone: '+91 98401 23891',
    patientAge: 32,
    patientGender: 'Female',
    patientAddress: 'Plot 42, Janaki Nagar, Maduravoyal, Chennai',
    doctorName: 'Dr. P. Manickapriya (BDS)',
    date: '2026-08-10',
    dueDate: '2026-08-10',
    items: [
      {
        id: 'item-1',
        procedureId: 'proc-15',
        procedureCode: 'D3330',
        procedureName: 'Painless Rotary Microscope Root Canal Therapy (Molar Tooth)',
        category: 'Endodontics',
        toothNumbers: ['16 (FDI: 26)'],
        surface: 'Occlusal',
        quantity: 1,
        unitPrice: 4200,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: '3 root canals disinfected with cold laser and sealed with thermal gutta-percha',
        lineTotal: 4200
      },
      {
        id: 'item-2',
        procedureId: 'proc-12',
        procedureCode: 'D2950',
        procedureName: 'Fiber Post & Core Build-Up Reinforcement',
        category: 'Restorative',
        toothNumbers: ['16 (FDI: 26)'],
        surface: 'MOD',
        quantity: 1,
        unitPrice: 1200,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'Glass fiber post luted with dual cure adhesive',
        lineTotal: 1200
      },
      {
        id: 'item-3',
        procedureId: 'proc-17',
        procedureCode: 'D2740',
        procedureName: 'CAD/CAM Monolithic High-Translucent Zirconia Crown (15 Yr Warranty)',
        category: 'Prosthodontics',
        toothNumbers: ['16 (FDI: 26)'],
        surface: 'Full Crown',
        quantity: 1,
        unitPrice: 6500,
        discountType: 'fixed',
        discountValue: 250,
        taxPercent: 0,
        notes: 'Shade A2 monolithic translucent zirconia with 15 year warranty card',
        lineTotal: 6250
      },
      {
        id: 'item-4',
        procedureId: 'proc-5',
        procedureCode: 'D1110',
        procedureName: 'Ultrasonic Plaque Scaling & Micro-Polishing',
        category: 'Preventive',
        toothNumbers: ['Full Mouth'],
        quantity: 1,
        unitPrice: 850,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'Complete supra and subgingival calculus removal',
        lineTotal: 850
      }
    ],
    subtotal: 12750,
    totalItemDiscount: 250,
    additionalDiscountType: 'fixed',
    additionalDiscountValue: 0,
    totalTax: 0,
    grandTotal: 12500,
    amountPaid: 12500,
    balanceDue: 0,
    status: 'paid',
    payments: [
      {
        id: 'pay-1',
        invoiceId: 'inv-1001',
        amount: 12500,
        date: '2026-08-10',
        method: 'upi',
        referenceNumber: 'UPI-9840123891@ybl-8894',
        receivedBy: 'Dr. P. Manickapriya',
        notes: 'Settled in full via GPay UPI instant scan'
      }
    ],
    clinicalNotes: 'Painless RCT completed on tooth #26 with zirconia crown cementation. Patient instructed on oral hygiene & warm saline rinses. Review in 6 months.',
    nextAppointmentDate: '2027-02-10',
    prescriptions: 'Cap. Amoxicillin 500mg (1-1-1 x 5 days), Tab. Zerodol-SP (1-0-1 after food x 3 days)',
    createdAt: '2026-08-10T14:15:00Z',
    updatedAt: '2026-08-10T14:15:00Z'
  },
  {
    id: 'inv-1002',
    invoiceNumber: 'S7D-2026-0002',
    patientId: 'pat-102',
    patientName: 'Senthil Kumar',
    patientPhone: '+91 97890 55412',
    patientAge: 46,
    patientGender: 'Male',
    patientAddress: '18/4, Alapakkam Main Road, Maduravoyal, Chennai',
    doctorName: 'Dr. P. Manickapriya (BDS)',
    date: '2026-08-12',
    dueDate: '2026-08-26',
    items: [
      {
        id: 'item-201',
        procedureId: 'proc-20',
        procedureCode: 'D6010',
        procedureName: 'Keyhole Titanium Dental Implant Fixture (Straumann / Osstem)',
        category: 'Prosthodontics',
        toothNumbers: ['19 (FDI: 36)'],
        surface: 'Bone Site',
        quantity: 1,
        unitPrice: 22000,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'Keyhole surgical placement of 4.5 x 10mm titanium fixture under local anesthesia',
        lineTotal: 22000
      },
      {
        id: 'item-202',
        procedureId: 'proc-21',
        procedureCode: 'D6057',
        procedureName: 'Custom Implant Abutment & Screw-Retained Ceramic Crown',
        category: 'Prosthodontics',
        toothNumbers: ['19 (FDI: 36)'],
        surface: 'Abutment',
        quantity: 1,
        unitPrice: 10000,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'CAD/CAM customized titanium abutment with monolithic zirconia crown',
        lineTotal: 10000
      }
    ],
    subtotal: 32000,
    totalItemDiscount: 0,
    additionalDiscountType: 'fixed',
    additionalDiscountValue: 0,
    totalTax: 0,
    grandTotal: 32000,
    amountPaid: 22000,
    balanceDue: 10000,
    status: 'partial',
    payments: [
      {
        id: 'pay-2',
        invoiceId: 'inv-1002',
        amount: 22000,
        date: '2026-08-12',
        method: 'card',
        referenceNumber: 'POS-HDFC-99321',
        receivedBy: 'Dr. P. Manickapriya',
        notes: 'Stage 1 implant surgery deposit received via Card'
      }
    ],
    clinicalNotes: 'Implant stage 1 completed successfully with primary stability 45 Ncm. Stage 2 prosthesis scheduled in 12 weeks after osseointegration.',
    nextAppointmentDate: '2026-11-12',
    prescriptions: 'Tab. Augmentin 625mg (1-0-1 x 5d), Tab. Enzoflam (1-0-1 x 3d), Betadine 2% Oral Rinse',
    createdAt: '2026-08-12T16:45:00Z',
    updatedAt: '2026-08-12T16:45:00Z'
  },
  {
    id: 'inv-1003',
    invoiceNumber: 'S7D-2026-0003',
    patientId: 'pat-103',
    patientName: 'Ananya Sundaram',
    patientPhone: '+91 94441 87654',
    patientAge: 26,
    patientGender: 'Female',
    patientAddress: 'Flat 3B, Sunshine Apartments, Mount Poonamallee Road, Porur, Chennai',
    doctorName: 'Dr. P. Manickapriya (BDS)',
    date: '2026-08-14',
    dueDate: '2026-08-14',
    items: [
      {
        id: 'item-301',
        procedureId: 'proc-28',
        procedureCode: 'D9972',
        procedureName: 'Laser Teeth Whitening & Cleaning (Cold-Light Activation)',
        category: 'Cosmetic',
        toothNumbers: ['Full Mouth'],
        quantity: 1,
        unitPrice: 4500,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'In-office cold light laser activation (3 cycles x 15 mins). Pre-shade A3 to Post-shade B1.',
        lineTotal: 4500
      },
      {
        id: 'item-302',
        procedureId: 'proc-5',
        procedureCode: 'D1110',
        procedureName: 'Ultrasonic Plaque Scaling & Micro-Polishing',
        category: 'Preventive',
        toothNumbers: ['Full Mouth'],
        quantity: 1,
        unitPrice: 850,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'Pre-whitening calculus and coffee stain debridement',
        lineTotal: 850
      }
    ],
    subtotal: 5350,
    totalItemDiscount: 0,
    additionalDiscountType: 'fixed',
    additionalDiscountValue: 0,
    totalTax: 0,
    grandTotal: 5350,
    amountPaid: 5350,
    balanceDue: 0,
    status: 'paid',
    payments: [
      {
        id: 'pay-3',
        invoiceId: 'inv-1003',
        amount: 5350,
        date: '2026-08-14',
        method: 'card',
        referenceNumber: 'TXN-ICICI-44129',
        receivedBy: 'Dr. P. Manickapriya',
        notes: 'Settled via ICICI Bank Debit Card'
      }
    ],
    clinicalNotes: 'Cold-light laser whitening achieved 6 shades improvement. Post-care instructions given (no dark liquids/coffee for 48 hrs).',
    nextAppointmentDate: '2027-02-14',
    prescriptions: 'Sensodent-K Toothpaste for 2 weeks if mild sensitivity occurs',
    createdAt: '2026-08-14T11:20:00Z',
    updatedAt: '2026-08-14T11:20:00Z'
  },
  {
    id: 'inv-1004',
    invoiceNumber: 'S7D-2026-0004',
    patientId: 'pat-104',
    patientName: 'Rajesh Varadarajan',
    patientPhone: '+91 98840 33219',
    patientAge: 54,
    patientGender: 'Male',
    patientAddress: '67, 2nd Avenue, Anna Nagar West, Chennai',
    doctorName: 'Dr. P. Manickapriya (BDS)',
    date: '2026-08-15',
    dueDate: '2026-08-22',
    items: [
      {
        id: 'item-401',
        procedureId: 'proc-15',
        procedureCode: 'D3330',
        procedureName: 'Painless Rotary Microscope Root Canal Therapy (Molar Tooth)',
        category: 'Endodontics',
        toothNumbers: ['31 (FDI: 47)'],
        surface: 'Occlusal',
        quantity: 1,
        unitPrice: 4200,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0,
        notes: 'Emergency access opening, chemo-mechanical rotary debridement & medication placement',
        lineTotal: 4200
      }
    ],
    subtotal: 4200,
    totalItemDiscount: 0,
    additionalDiscountType: 'fixed',
    additionalDiscountValue: 0,
    totalTax: 0,
    grandTotal: 4200,
    amountPaid: 0,
    balanceDue: 4200,
    status: 'unpaid',
    payments: [],
    clinicalNotes: 'Acute irreversible pulpitis tooth #47. Access opened, canals instrumented with rotary files. Temp seal placed with Cavit. Final obturation on next visit.',
    nextAppointmentDate: '2026-08-20',
    prescriptions: 'Tab. Taxim-O 200mg (1-0-1 x 5d), Tab. Zerodol-P (1-0-1 PRN x 3d)',
    createdAt: '2026-08-15T15:00:00Z',
    updatedAt: '2026-08-15T15:00:00Z'
  }
];
