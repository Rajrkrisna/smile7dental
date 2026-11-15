import type { 
  ToothInfo, 
  ClinicProfile, 
  Procedure, 
  Patient, 
  Appointment, 
  ClinicalNote, 
  Prescription, 
  Invoice,
  ConsultantPayout,
  LabWorkOrder,
  GeneralExpense,
  PatientVisit
} from '../types';

export const ADULT_TEETH_MAP: ToothInfo[] = [
  // Upper Right (Maxillary Right - UR) : Teeth 18 to 11 (FDI), 1 to 8 (Universal), Palmer 8 to 1
  { fdi: 18, universal: 1, palmerNumber: 8, palmerQuadrant: 'UR', name: 'Upper Right 3rd Molar (Wisdom)', quadrant: 'UR', arch: 'maxillary', isAnterior: false, isMolar: true },
  { fdi: 17, universal: 2, palmerNumber: 7, palmerQuadrant: 'UR', name: 'Upper Right 2nd Molar', quadrant: 'UR', arch: 'maxillary', isAnterior: false, isMolar: true },
  { fdi: 16, universal: 3, palmerNumber: 6, palmerQuadrant: 'UR', name: 'Upper Right 1st Molar', quadrant: 'UR', arch: 'maxillary', isAnterior: false, isMolar: true },
  { fdi: 15, universal: 4, palmerNumber: 5, palmerQuadrant: 'UR', name: 'Upper Right 2nd Premolar', quadrant: 'UR', arch: 'maxillary', isAnterior: false, isMolar: false },
  { fdi: 14, universal: 5, palmerNumber: 4, palmerQuadrant: 'UR', name: 'Upper Right 1st Premolar', quadrant: 'UR', arch: 'maxillary', isAnterior: false, isMolar: false },
  { fdi: 13, universal: 6, palmerNumber: 3, palmerQuadrant: 'UR', name: 'Upper Right Canine (Cuspid)', quadrant: 'UR', arch: 'maxillary', isAnterior: true, isMolar: false },
  { fdi: 12, universal: 7, palmerNumber: 2, palmerQuadrant: 'UR', name: 'Upper Right Lateral Incisor', quadrant: 'UR', arch: 'maxillary', isAnterior: true, isMolar: false },
  { fdi: 11, universal: 8, palmerNumber: 1, palmerQuadrant: 'UR', name: 'Upper Right Central Incisor', quadrant: 'UR', arch: 'maxillary', isAnterior: true, isMolar: false },

  // Upper Left (Maxillary Left - UL) : Teeth 21 to 28 (FDI), 9 to 16 (Universal), Palmer 1 to 8
  { fdi: 21, universal: 9, palmerNumber: 1, palmerQuadrant: 'UL', name: 'Upper Left Central Incisor', quadrant: 'UL', arch: 'maxillary', isAnterior: true, isMolar: false },
  { fdi: 22, universal: 10, palmerNumber: 2, palmerQuadrant: 'UL', name: 'Upper Left Lateral Incisor', quadrant: 'UL', arch: 'maxillary', isAnterior: true, isMolar: false },
  { fdi: 23, universal: 11, palmerNumber: 3, palmerQuadrant: 'UL', name: 'Upper Left Canine (Cuspid)', quadrant: 'UL', arch: 'maxillary', isAnterior: true, isMolar: false },
  { fdi: 24, universal: 12, palmerNumber: 4, palmerQuadrant: 'UL', name: 'Upper Left 1st Premolar', quadrant: 'UL', arch: 'maxillary', isAnterior: false, isMolar: false },
  { fdi: 25, universal: 13, palmerNumber: 5, palmerQuadrant: 'UL', name: 'Upper Left 2nd Premolar', quadrant: 'UL', arch: 'maxillary', isAnterior: false, isMolar: false },
  { fdi: 26, universal: 14, palmerNumber: 6, palmerQuadrant: 'UL', name: 'Upper Left 1st Molar', quadrant: 'UL', arch: 'maxillary', isAnterior: false, isMolar: true },
  { fdi: 27, universal: 15, palmerNumber: 7, palmerQuadrant: 'UL', name: 'Upper Left 2nd Molar', quadrant: 'UL', arch: 'maxillary', isAnterior: false, isMolar: true },
  { fdi: 28, universal: 16, palmerNumber: 8, palmerQuadrant: 'UL', name: 'Upper Left 3rd Molar (Wisdom)', quadrant: 'UL', arch: 'maxillary', isAnterior: false, isMolar: true },

  // Lower Left (Mandibular Left - LL) : Teeth 38 to 31 (FDI), 17 to 24 (Universal), Palmer 8 to 1
  { fdi: 38, universal: 17, palmerNumber: 8, palmerQuadrant: 'LL', name: 'Lower Left 3rd Molar (Wisdom)', quadrant: 'LL', arch: 'mandibular', isAnterior: false, isMolar: true },
  { fdi: 37, universal: 18, palmerNumber: 7, palmerQuadrant: 'LL', name: 'Lower Left 2nd Molar', quadrant: 'LL', arch: 'mandibular', isAnterior: false, isMolar: true },
  { fdi: 36, universal: 19, palmerNumber: 6, palmerQuadrant: 'LL', name: 'Lower Left 1st Molar', quadrant: 'LL', arch: 'mandibular', isAnterior: false, isMolar: true },
  { fdi: 35, universal: 20, palmerNumber: 5, palmerQuadrant: 'LL', name: 'Lower Left 2nd Premolar', quadrant: 'LL', arch: 'mandibular', isAnterior: false, isMolar: false },
  { fdi: 34, universal: 21, palmerNumber: 4, palmerQuadrant: 'LL', name: 'Lower Left 1st Premolar', quadrant: 'LL', arch: 'mandibular', isAnterior: false, isMolar: false },
  { fdi: 33, universal: 22, palmerNumber: 3, palmerQuadrant: 'LL', name: 'Lower Left Canine (Cuspid)', quadrant: 'LL', arch: 'mandibular', isAnterior: true, isMolar: false },
  { fdi: 32, universal: 23, palmerNumber: 2, palmerQuadrant: 'LL', name: 'Lower Left Lateral Incisor', quadrant: 'LL', arch: 'mandibular', isAnterior: true, isMolar: false },
  { fdi: 31, universal: 24, palmerNumber: 1, palmerQuadrant: 'LL', name: 'Lower Left Central Incisor', quadrant: 'LL', arch: 'mandibular', isAnterior: true, isMolar: false },

  // Lower Right (Mandibular Right - LR) : Teeth 41 to 48 (FDI), 25 to 32 (Universal), Palmer 1 to 8
  { fdi: 41, universal: 25, palmerNumber: 1, palmerQuadrant: 'LR', name: 'Lower Right Central Incisor', quadrant: 'LR', arch: 'mandibular', isAnterior: true, isMolar: false },
  { fdi: 42, universal: 26, palmerNumber: 2, palmerQuadrant: 'LR', name: 'Lower Right Lateral Incisor', quadrant: 'LR', arch: 'mandibular', isAnterior: true, isMolar: false },
  { fdi: 43, universal: 27, palmerNumber: 3, palmerQuadrant: 'LR', name: 'Lower Right Canine (Cuspid)', quadrant: 'LR', arch: 'mandibular', isAnterior: true, isMolar: false },
  { fdi: 44, universal: 28, palmerNumber: 4, palmerQuadrant: 'LR', name: 'Lower Right 1st Premolar', quadrant: 'LR', arch: 'mandibular', isAnterior: false, isMolar: false },
  { fdi: 45, universal: 29, palmerNumber: 5, palmerQuadrant: 'LR', name: 'Lower Right 2nd Premolar', quadrant: 'LR', arch: 'mandibular', isAnterior: false, isMolar: false },
  { fdi: 46, universal: 30, palmerNumber: 6, palmerQuadrant: 'LR', name: 'Lower Right 1st Molar', quadrant: 'LR', arch: 'mandibular', isAnterior: false, isMolar: true },
  { fdi: 47, universal: 31, palmerNumber: 7, palmerQuadrant: 'LR', name: 'Lower Right 2nd Molar', quadrant: 'LR', arch: 'mandibular', isAnterior: false, isMolar: true },
  { fdi: 48, universal: 32, palmerNumber: 8, palmerQuadrant: 'LR', name: 'Lower Right 3rd Molar (Wisdom)', quadrant: 'LR', arch: 'mandibular', isAnterior: false, isMolar: true }
];

export const PEDIATRIC_TEETH_MAP: ToothInfo[] = [
  // Upper Right (UR): 55 to 51 (FDI), A to E (Univ), E to A (Palmer)
  { fdi: 55, universal: 101, palmerNumber: 5, palmerQuadrant: 'UR', primaryFdi: 55, primaryUniversal: 'A', primaryPalmerLetter: 'E', name: 'Primary Upper Right 2nd Molar', quadrant: 'UR', arch: 'maxillary', isAnterior: false, isMolar: true },
  { fdi: 54, universal: 102, palmerNumber: 4, palmerQuadrant: 'UR', primaryFdi: 54, primaryUniversal: 'B', primaryPalmerLetter: 'D', name: 'Primary Upper Right 1st Molar', quadrant: 'UR', arch: 'maxillary', isAnterior: false, isMolar: true },
  { fdi: 53, universal: 103, palmerNumber: 3, palmerQuadrant: 'UR', primaryFdi: 53, primaryUniversal: 'C', primaryPalmerLetter: 'C', name: 'Primary Upper Right Canine', quadrant: 'UR', arch: 'maxillary', isAnterior: true, isMolar: false },
  { fdi: 52, universal: 104, palmerNumber: 2, palmerQuadrant: 'UR', primaryFdi: 52, primaryUniversal: 'D', primaryPalmerLetter: 'B', name: 'Primary Upper Right Lateral Incisor', quadrant: 'UR', arch: 'maxillary', isAnterior: true, isMolar: false },
  { fdi: 51, universal: 105, palmerNumber: 1, palmerQuadrant: 'UR', primaryFdi: 51, primaryUniversal: 'E', primaryPalmerLetter: 'A', name: 'Primary Upper Right Central Incisor', quadrant: 'UR', arch: 'maxillary', isAnterior: true, isMolar: false },

  // Upper Left (UL): 61 to 65 (FDI), F to J (Univ), A to E (Palmer)
  { fdi: 61, universal: 106, palmerNumber: 1, palmerQuadrant: 'UL', primaryFdi: 61, primaryUniversal: 'F', primaryPalmerLetter: 'A', name: 'Primary Upper Left Central Incisor', quadrant: 'UL', arch: 'maxillary', isAnterior: true, isMolar: false },
  { fdi: 62, universal: 107, palmerNumber: 2, palmerQuadrant: 'UL', primaryFdi: 62, primaryUniversal: 'G', primaryPalmerLetter: 'B', name: 'Primary Upper Left Lateral Incisor', quadrant: 'UL', arch: 'maxillary', isAnterior: true, isMolar: false },
  { fdi: 63, universal: 108, palmerNumber: 3, palmerQuadrant: 'UL', primaryFdi: 63, primaryUniversal: 'H', primaryPalmerLetter: 'C', name: 'Primary Upper Left Canine', quadrant: 'UL', arch: 'maxillary', isAnterior: true, isMolar: false },
  { fdi: 64, universal: 109, palmerNumber: 4, palmerQuadrant: 'UL', primaryFdi: 64, primaryUniversal: 'I', primaryPalmerLetter: 'D', name: 'Primary Upper Left 1st Molar', quadrant: 'UL', arch: 'maxillary', isAnterior: false, isMolar: true },
  { fdi: 65, universal: 110, palmerNumber: 5, palmerQuadrant: 'UL', primaryFdi: 65, primaryUniversal: 'J', primaryPalmerLetter: 'E', name: 'Primary Upper Left 2nd Molar', quadrant: 'UL', arch: 'maxillary', isAnterior: false, isMolar: true },

  // Lower Left (LL): 75 to 71 (FDI), K to O (Univ), E to A (Palmer)
  { fdi: 75, universal: 111, palmerNumber: 5, palmerQuadrant: 'LL', primaryFdi: 75, primaryUniversal: 'K', primaryPalmerLetter: 'E', name: 'Primary Lower Left 2nd Molar', quadrant: 'LL', arch: 'mandibular', isAnterior: false, isMolar: true },
  { fdi: 74, universal: 112, palmerNumber: 4, palmerQuadrant: 'LL', primaryFdi: 74, primaryUniversal: 'L', primaryPalmerLetter: 'D', name: 'Primary Lower Left 1st Molar', quadrant: 'LL', arch: 'mandibular', isAnterior: false, isMolar: true },
  { fdi: 73, universal: 113, palmerNumber: 3, palmerQuadrant: 'LL', primaryFdi: 73, primaryUniversal: 'M', primaryPalmerLetter: 'C', name: 'Primary Lower Left Canine', quadrant: 'LL', arch: 'mandibular', isAnterior: true, isMolar: false },
  { fdi: 72, universal: 114, palmerNumber: 2, palmerQuadrant: 'LL', primaryFdi: 72, primaryUniversal: 'N', primaryPalmerLetter: 'B', name: 'Primary Lower Left Lateral Incisor', quadrant: 'LL', arch: 'mandibular', isAnterior: true, isMolar: false },
  { fdi: 71, universal: 115, palmerNumber: 1, palmerQuadrant: 'LL', primaryFdi: 71, primaryUniversal: 'O', primaryPalmerLetter: 'A', name: 'Primary Lower Left Central Incisor', quadrant: 'LL', arch: 'mandibular', isAnterior: true, isMolar: false },

  // Lower Right (LR): 81 to 85 (FDI), P to T (Univ), A to E (Palmer)
  { fdi: 81, universal: 116, palmerNumber: 1, palmerQuadrant: 'LR', primaryFdi: 81, primaryUniversal: 'P', primaryPalmerLetter: 'A', name: 'Primary Lower Right Central Incisor', quadrant: 'LR', arch: 'mandibular', isAnterior: true, isMolar: false },
  { fdi: 82, universal: 117, palmerNumber: 2, palmerQuadrant: 'LR', primaryFdi: 82, primaryUniversal: 'Q', primaryPalmerLetter: 'B', name: 'Primary Lower Right Lateral Incisor', quadrant: 'LR', arch: 'mandibular', isAnterior: true, isMolar: false },
  { fdi: 83, universal: 118, palmerNumber: 3, palmerQuadrant: 'LR', primaryFdi: 83, primaryUniversal: 'R', primaryPalmerLetter: 'C', name: 'Primary Lower Right Canine', quadrant: 'LR', arch: 'mandibular', isAnterior: true, isMolar: false },
  { fdi: 84, universal: 119, palmerNumber: 4, palmerQuadrant: 'LR', primaryFdi: 84, primaryUniversal: 'S', primaryPalmerLetter: 'D', name: 'Primary Lower Right 1st Molar', quadrant: 'LR', arch: 'mandibular', isAnterior: false, isMolar: true },
  { fdi: 85, universal: 120, palmerNumber: 5, palmerQuadrant: 'LR', primaryFdi: 85, primaryUniversal: 'T', primaryPalmerLetter: 'E', name: 'Primary Lower Right 2nd Molar', quadrant: 'LR', arch: 'mandibular', isAnterior: false, isMolar: true }
];

export const INITIAL_CLINIC_PROFILE: ClinicProfile = {
  clinicName: 'Smile7 Dental Clinic',
  tagline: 'Prevent Now! Smile Forever!',
  doctorName: 'Dr. P. Manickapriya',
  doctorQualification: 'B.D.S., FCD. • General Dental Surgeon, Aesthetic & Restorative Dentist',
  registrationNumber: 'TNDC-DEN/2018/24892 (DCI Reg: 26448)',
  dentalCouncil: 'Tamil Nadu Dental Council Reg. #24892',
  phone: '+91 97908 62510',
  email: 'care@smile7dental.com',
  address: 'No. 1/2, Alapakkam Main Road, Janaki Nagar, Maduravoyal',
  city: 'Chennai, Tamil Nadu - 600095',
  currencySymbol: '₹',
  currencyCode: 'INR',
  defaultNotation: 'fdi',
  defaultTaxRate: 0,
  invoicePrefix: 'S7D',
  footerNote: 'Thank you for choosing Smile7 Dental Clinic. Please keep this invoice for warranty and medical records. For appointments or post-treatment queries, call +91 97908 62510.'
};

export const INITIAL_PROCEDURES: Procedure[] = [
  // Diagnostic & Radiology
  { id: 'proc-1', code: 'CONS-01', name: 'Consultation & Clinical Oral Examination', category: 'Diagnostic', defaultFee: 0, durationMin: 20, isToothSpecific: false },
  { id: 'proc-2', code: 'RVG-01', name: 'Digital Intraoral Radiograph (RVG / IOPA)', category: 'Diagnostic', defaultFee: 0, durationMin: 15, isToothSpecific: true },
  { id: 'proc-3', code: 'OPG-01', name: 'Panoramic Digital X-Ray (OPG Referral)', category: 'Diagnostic', defaultFee: 0, durationMin: 20, isToothSpecific: false },

  // Preventive & Hygiene (Cleaning)
  { id: 'proc-5', code: 'SCL-01', name: 'Full Mouth Ultrasonic Scaling & Teeth Polishing', category: 'Preventive', defaultFee: 0, durationMin: 35, isToothSpecific: false },
  { id: 'proc-6', code: 'CURR-01', name: 'Deep Subgingival Curettage & Root Planing (Per Quadrant)', category: 'Periodontics', defaultFee: 0, durationMin: 40, isToothSpecific: true },
  { id: 'proc-7', code: 'FLUO-01', name: 'Painless Topical Fluoride Varnish Application', category: 'Pediatric', defaultFee: 0, durationMin: 15, isToothSpecific: false },
  { id: 'proc-8', code: 'SEAL-01', name: 'Pit & Fissure Cavity Sealant (Per Tooth)', category: 'Pediatric', defaultFee: 0, durationMin: 20, isToothSpecific: true },

  // Restorative (Fillings)
  { id: 'proc-9', code: 'COMP-01', name: 'Tooth-Colored Light-Cure Composite Laser Restoration (1 Surface)', category: 'Restorative', defaultFee: 0, durationMin: 30, isToothSpecific: true },
  { id: 'proc-10', code: 'COMP-02', name: 'Multi-Surface Posterior Composite Laser Restoration (MOD)', category: 'Restorative', defaultFee: 0, durationMin: 40, isToothSpecific: true },
  { id: 'proc-11', code: 'GIC-01', name: 'Glass Ionomer Cement (GIC) Fluoride-Releasing Restoration', category: 'Restorative', defaultFee: 0, durationMin: 25, isToothSpecific: true },
  { id: 'proc-12', code: 'POST-01', name: 'Fiber Post & Core Build-Up Reinforcement', category: 'Restorative', defaultFee: 0, durationMin: 45, isToothSpecific: true },

  // Endodontics (Painless Root Canal Treatment)
  { id: 'proc-13', code: 'RCT-ANT', name: 'Single-Sitting Rotary Root Canal Treatment (Anterior Tooth)', category: 'Endodontics', defaultFee: 0, durationMin: 45, isToothSpecific: true },
  { id: 'proc-14', code: 'RCT-PRE', name: 'Single-Sitting Rotary Root Canal Treatment (Premolar Tooth)', category: 'Endodontics', defaultFee: 0, durationMin: 50, isToothSpecific: true },
  { id: 'proc-15', code: 'RCT-MOL', name: 'Microscope Rotary Root Canal Treatment (Molar Tooth)', category: 'Endodontics', defaultFee: 0, durationMin: 60, isToothSpecific: true },
  { id: 'proc-16', code: 'RERCT-01', name: 'Re-Root Canal Treatment (Re-RCT for Failed RCT)', category: 'Endodontics', defaultFee: 0, durationMin: 75, isToothSpecific: true },

  // Crowns & Fixed Prosthodontics (Caps)
  { id: 'proc-17', code: 'ZIRC-01', name: 'CAD/CAM Monolithic High-Translucent Zirconia Crown', category: 'Restorative', defaultFee: 0, durationMin: 30, isToothSpecific: true },
  { id: 'proc-18', code: 'PFM-01', name: 'Porcelain Fused to Metal (PFM) Ceramic Crown', category: 'Restorative', defaultFee: 0, durationMin: 30, isToothSpecific: true },
  { id: 'proc-19', code: 'EMAX-01', name: 'E-Max Aesthetic Lithium Disilicate Cosmetic Crown / Veneer', category: 'Cosmetic', defaultFee: 0, durationMin: 45, isToothSpecific: true },
  { id: 'proc-20', code: 'MET-01', name: 'Full Metal Crown / Cast Cap', category: 'Restorative', defaultFee: 0, durationMin: 30, isToothSpecific: true },

  // Oral Surgery & Extractions
  { id: 'proc-21', code: 'EXT-01', name: 'Routine Tooth Extraction under Local Anaesthesia', category: 'Oral Surgery', defaultFee: 0, durationMin: 25, isToothSpecific: true },
  { id: 'proc-22', code: 'EXT-SURG', name: 'Surgical Extraction / Root Tip Removal', category: 'Oral Surgery', defaultFee: 0, durationMin: 40, isToothSpecific: true },
  { id: 'proc-23', code: 'IMPACT-01', name: 'Surgical Impaction Third Molar Removal (Wisdom Tooth Surgery)', category: 'Oral Surgery', defaultFee: 0, durationMin: 50, isToothSpecific: true },

  // Dental Implants & Dentures
  { id: 'proc-24', code: 'IMP-01', name: 'Titanium Dental Implant (Fixture Placement)', category: 'Restorative', defaultFee: 0, durationMin: 60, isToothSpecific: true },
  { id: 'proc-25', code: 'IMP-CRW', name: 'Custom Implant Abutment & Screw-Retained Crown', category: 'Restorative', defaultFee: 0, durationMin: 40, isToothSpecific: true },
  { id: 'proc-26', code: 'RPD-01', name: 'Removable Partial Denture (Acrylic / Cast Partial)', category: 'Prosthodontics', defaultFee: 0, durationMin: 40, isToothSpecific: false },
  { id: 'proc-27', code: 'CD-01', name: 'Complete Denture (Single Arch / Dual-Arch)', category: 'Prosthodontics', defaultFee: 0, durationMin: 60, isToothSpecific: false },

  // Orthodontics & Aligners
  { id: 'proc-28', code: 'ORTH-01', name: 'Conventional Orthodontic Braces (Metal Dual-Arch)', category: 'Orthodontics', defaultFee: 0, durationMin: 60, isToothSpecific: false },
  { id: 'proc-29', code: 'ORTH-CER', name: 'Ceramic Tooth-Colored Aesthetic Braces', category: 'Orthodontics', defaultFee: 0, durationMin: 60, isToothSpecific: false },
  { id: 'proc-30', code: 'ALIGN-01', name: 'Clear Aligners Therapy (Invisible Braces)', category: 'Orthodontics', defaultFee: 0, durationMin: 45, isToothSpecific: false },

  // Cosmetic & Pediatric
  { id: 'proc-31', code: 'WHITE-01', name: 'In-Office Laser Teeth Whitening / Bleaching', category: 'Cosmetic', defaultFee: 0, durationMin: 60, isToothSpecific: false },
  { id: 'proc-32', code: 'PEDO-01', name: 'Pediatric Pulpectomy & Stainless Steel Crown', category: 'Pediatric', defaultFee: 0, durationMin: 40, isToothSpecific: true }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-101',
    patientId: 'PAT-1001',
    name: 'Kavitha Ramesh',
    phone: '+91 98401 23891',
    email: 'kavitha.ramesh@gmail.com',
    age: 32,
    gender: 'Female',
    bloodGroup: 'O+',
    address: 'Plot 42, Janaki Nagar, Maduravoyal, Chennai',
    chiefComplaint: 'Sensitivity to cold water on upper right back tooth',
    medicalAlerts: ['Penicillin Allergy'],
    dentalChart: {
      '16': { toothNumber: 16, condition: 'caries', surfaces: ['occlusal', 'mesial'], updatedAt: '2026-11-10T10:00:00Z', notes: 'Class II occlusal-mesial decay' },
      '26': { toothNumber: 26, condition: 'restored', surfaces: ['occlusal'], updatedAt: '2026-10-15T09:30:00Z', notes: 'Composite filling in good condition' },
      '36': { toothNumber: 36, condition: 'rct', updatedAt: '2026-08-12T14:00:00Z', notes: 'Root canal completed with zirconia crown' },
      '48': { toothNumber: 48, condition: 'impacted', updatedAt: '2026-11-10T10:15:00Z', notes: 'Horizontally impacted 3rd molar' }
    },
    totalBilled: 12500,
    totalPaid: 12500,
    balanceDue: 0,
    createdAt: '2026-07-10T10:30:00Z',
    updatedAt: '2026-11-10T10:30:00Z'
  },
  {
    id: 'pat-102',
    patientId: 'PAT-1002',
    name: 'Senthil Kumar',
    phone: '+91 97890 55412',
    email: 'senthil.k@autotech.in',
    age: 46,
    gender: 'Male',
    bloodGroup: 'A+',
    address: '18/4, Alapakkam Main Road, Maduravoyal, Chennai',
    chiefComplaint: 'Routine checkup for dental implant placed last year',
    medicalAlerts: ['Hypertension (Controlled)'],
    dentalChart: {
      '46': { toothNumber: 46, condition: 'implant', updatedAt: '2026-09-01T11:00:00Z', notes: 'Straumann SLA Bone Level Implant' },
      '18': { toothNumber: 18, condition: 'missing', updatedAt: '2026-05-18T16:00:00Z', notes: 'Extracted 2 years ago' },
      '28': { toothNumber: 28, condition: 'missing', updatedAt: '2026-05-18T16:00:00Z', notes: 'Extracted' }
    },
    totalBilled: 32000,
    totalPaid: 22000,
    balanceDue: 10000,
    createdAt: '2026-07-18T11:00:00Z',
    updatedAt: '2026-11-01T11:45:00Z'
  },
  {
    id: 'pat-103',
    patientId: 'PAT-1003',
    name: 'Ananya Sundaram',
    phone: '+91 94441 87654',
    email: 'ananya.sundaram@tcs.com',
    age: 26,
    gender: 'Female',
    bloodGroup: 'B+',
    address: 'Flat 3B, Sunshine Apartments, Mount Poonamallee Road, Porur, Chennai',
    chiefComplaint: 'Routine scaling & cleaning',
    medicalAlerts: [],
    dentalChart: {
      '55': { toothNumber: 55, condition: 'caries', surfaces: ['occlusal'], updatedAt: '2026-11-12T14:30:00Z', notes: 'Incipient pit decay on primary 2nd molar' }
    },
    totalBilled: 5350,
    totalPaid: 5350,
    balanceDue: 0,
    createdAt: '2026-08-01T09:15:00Z',
    updatedAt: '2026-11-12T15:00:00Z'
  },
  {
    id: 'pat-104',
    patientId: 'PAT-1004',
    name: 'Rajesh Varadarajan',
    phone: '+91 98840 33219',
    email: 'rajesh.v@chennaifinance.co.in',
    age: 54,
    gender: 'Male',
    bloodGroup: 'AB+',
    address: '67, 2nd Avenue, Anna Nagar West, Chennai',
    chiefComplaint: 'Bleeding gums when brushing',
    medicalAlerts: ['Type 2 Diabetes (HbA1c 6.8)'],
    dentalChart: {},
    totalBilled: 4200,
    totalPaid: 0,
    balanceDue: 4200,
    createdAt: '2026-08-15T15:00:00Z',
    updatedAt: '2026-08-15T15:00:00Z'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'pat-101',
    patientName: 'Kavitha Ramesh',
    patientPhone: '+91 98401 23891',
    date: '2026-11-15',
    startTime: '10:00',
    durationMin: 45,
    chair: 'Dental Chair',
    doctor: 'Dr. P. Manickapriya',
    procedure: 'Composite Laser Restoration Tooth #16',
    status: 'In-Chair',
    notes: 'Check occlusion carefully after curing'
  },
  {
    id: 'apt-2',
    patientId: 'pat-102',
    patientName: 'Senthil Kumar',
    patientPhone: '+91 97890 55412',
    date: '2026-11-15',
    startTime: '11:30',
    durationMin: 30,
    chair: 'Dental Chair',
    doctor: 'Dr. P. Manickapriya',
    procedure: 'Periodic Implant Maintenance & Hygiene',
    status: 'Confirmed',
    notes: 'Blood pressure check on arrival'
  },
  {
    id: 'apt-3',
    patientId: 'pat-103',
    patientName: 'Ananya Sundaram',
    patientPhone: '+91 94441 87654',
    date: '2026-11-15',
    startTime: '14:00',
    durationMin: 30,
    chair: 'Dental Chair',
    doctor: 'Dr. P. Manickapriya',
    procedure: 'Ultrasonic Plaque Scaling & Micro-Polishing',
    status: 'Scheduled',
    notes: 'Routine 6-month cleaning'
  }
];

export const INITIAL_CLINICAL_NOTES: ClinicalNote[] = [
  {
    id: 'note-1',
    patientId: 'pat-101',
    date: '2026-11-10',
    doctor: 'Dr. P. Manickapriya',
    toothNumbers: ['16', '48'],
    subjective: 'Patient reports mild sensitivity to cold sweets in upper right back tooth region. No spontaneous nocturnal pain.',
    objective: 'Clinical exam shows disto-occlusal dark cavitation on tooth 16 (FDI). Cold test positive, non-lingering. RVG digital radiograph shows decay confined to dentin, pulpal boundary intact. Tooth 48 horizontally impacted.',
    assessment: '1. Class II Dentine Caries tooth #16. 2. Asymptomatic Impacted Mandibular 3rd Molar #48.',
    plan: 'Scheduled composite restoration for tooth 16 under local anesthesia. Advised extraction of 48 in subsequent phase.'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    prescriptionNumber: 'RX-2026-0045',
    patientId: 'pat-101',
    patientName: 'Kavitha Ramesh',
    patientAge: 32,
    patientGender: 'Female',
    date: '2026-11-10',
    doctor: 'Dr. P. Manickapriya',
    diagnosis: 'Class II Dentine Caries & Post-Restoration Sensitivity Tooth 16 (FDI)',
    medications: [
      {
        name: 'Tab. Combiflam (Ibuprofen 400mg + Paracetamol 325mg)',
        dosage: '1 Tablet',
        frequency: '1 - 0 - 1 (Twice daily, after food)',
        duration: '3 Days',
        instructions: 'Take strictly after food with water. For dental pain and inflammation.'
      },
      {
        name: 'Tab. Pan-40 (Pantoprazole 40mg)',
        dosage: '1 Tablet',
        frequency: '1 - 0 - 0 (Morning, 30 min before food)',
        duration: '3 Days',
        instructions: 'Take on empty stomach before breakfast to prevent gastric acidity.'
      },
      {
        name: 'Hexidine 0.2% Mouthwash (Chlorhexidine Gluconate)',
        dosage: '10 ml',
        frequency: '1 - 0 - 1 (Twice daily)',
        duration: '7 Days',
        instructions: 'Rinse undiluted for 60 seconds after brushing. Do not eat or drink for 30 minutes.'
      }
    ],
    specialAdvice: 'Avoid biting hard foodstuffs on the right side for 24 hours. Maintain oral hygiene.',
    createdAt: '2026-11-10T10:45:00Z'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'S7D-2026-0001',
    patientId: 'pat-101',
    patientName: 'Kavitha Ramesh',
    patientPhone: '+91 98401 23891',
    date: '2026-11-10',
    doctor: 'Dr. P. Manickapriya',
    items: [
      { id: 'item-1', procedureId: 'proc-1', procedureName: 'Consultation & Oral Examination', procedureCode: 'CONS-01', teeth: ['Full Mouth'], cost: 300 },
      { id: 'item-2', procedureId: 'proc-2', procedureName: 'Digital Intraoral RVG X-Ray', procedureCode: 'RVG-01', teeth: ['16 (FDI)'], cost: 200 },
      { id: 'item-3', procedureId: 'proc-10', procedureName: 'Tooth-Colored Composite Laser Restoration', procedureCode: 'COMP-02', teeth: ['16 (FDI)'], surfaces: 'MOD', cost: 2000 }
    ],
    subtotal: 2500,
    discount: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 2500,
    paidAmount: 2500,
    balance: 0,
    paymentMethod: 'UPI / QR',
    status: 'Paid',
    notes: 'Paid via GPay UPI. First visit exam & composite restoration.',
    createdAt: '2026-11-10T11:00:00Z'
  }
];

export const INITIAL_CONSULTANT_PAYOUTS: ConsultantPayout[] = [
  {
    id: 'con-1',
    consultantName: 'Dr. S. Anand (MDS)',
    consultantPhone: '+91 98410 88231',
    specialty: 'Oral & Maxillofacial Surgeon',
    patientName: 'Kavitha Ramesh',
    procedure: 'Surgical Disimpaction Mandibular 3rd Molar #48',
    date: '2026-11-11',
    caseFee: 2500,
    amountPaid: 2500,
    balanceDue: 0,
    paymentMethod: 'UPI / GPay',
    status: 'Paid',
    notes: 'Transferred via GPay immediately after procedure. Patient healed uneventfully.',
    createdAt: '2026-11-11T12:30:00Z'
  },
  {
    id: 'con-2',
    consultantName: 'Dr. R. Vignesh (MDS)',
    consultantPhone: '+91 97911 44520',
    specialty: 'Orthodontist',
    patientName: 'Ananya Sundaram',
    procedure: 'Monthly Orthodontic Wire Tightening & Archwire Change',
    date: '2026-11-12',
    caseFee: 1500,
    amountPaid: 1500,
    balanceDue: 0,
    paymentMethod: 'Cash',
    status: 'Paid',
    notes: '0.016 NiTi upper and lower wires placed.',
    createdAt: '2026-11-12T17:00:00Z'
  },
  {
    id: 'con-3',
    consultantName: 'Dr. M. Deepa (MDS)',
    consultantPhone: '+91 94440 22391',
    specialty: 'Endodontist',
    patientName: 'Senthil Kumar',
    procedure: 'Microscopic Re-RCT for Missed MB2 Canal Tooth #26',
    date: '2026-11-14',
    caseFee: 2200,
    amountPaid: 0,
    balanceDue: 2200,
    paymentMethod: 'UPI / GPay',
    status: 'Pending',
    notes: 'Obturation scheduled next sitting. Case fee payable on completion.',
    createdAt: '2026-11-14T15:00:00Z'
  }
];

export const INITIAL_LAB_ORDERS: LabWorkOrder[] = [
  {
    id: 'lab-1',
    labName: 'DentCare Dental Lab',
    labPhone: '+91 98841 55660',
    workType: 'CAD/CAM Monolithic High-Translucent Zirconia Crown',
    patientName: 'Kavitha Ramesh',
    teeth: 'Tooth 16 (FDI)',
    shade: 'A2 Vita Classical',
    sentDate: '2026-11-10',
    expectedDeliveryDate: '2026-11-14',
    deliveredDate: '2026-11-13',
    workStatus: 'Delivered',
    labCharge: 1800,
    amountPaid: 1800,
    balanceDue: 0,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    notes: 'Fit and occlusion excellent. Cemented with RelyX luting cement.',
    createdAt: '2026-11-10T12:00:00Z'
  },
  {
    id: 'lab-2',
    labName: 'Vasantha Dental Ceramic Lab',
    labPhone: '+91 97890 11223',
    workType: 'Porcelain Fused to Metal (PFM) Ceramic Crown',
    patientName: 'Senthil Kumar',
    teeth: 'Tooth 46 (FDI)',
    shade: 'A3 Vita Classical',
    sentDate: '2026-11-12',
    expectedDeliveryDate: '2026-11-16',
    workStatus: 'In-Lab',
    labCharge: 950,
    amountPaid: 0,
    balanceDue: 950,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Pending',
    notes: 'Metal coping trial successful. Awaiting final ceramic glazing.',
    createdAt: '2026-11-12T14:30:00Z'
  },
  {
    id: 'lab-3',
    labName: 'Illusion Dental Craft',
    labPhone: '+91 94442 33441',
    workType: 'Upper Hawley Orthodontic Retainer with Labial Bow',
    patientName: 'Ananya Sundaram',
    teeth: 'Maxillary Arch',
    shade: 'Clear Pink Acrylic',
    sentDate: '2026-11-08',
    expectedDeliveryDate: '2026-11-12',
    deliveredDate: '2026-11-11',
    workStatus: 'Fitted in Patient',
    labCharge: 1200,
    amountPaid: 1200,
    balanceDue: 0,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    notes: 'Delivered and patient instructed on wearing schedule.',
    createdAt: '2026-11-08T16:00:00Z'
  }
];

export const INITIAL_EXPENSES: GeneralExpense[] = [
  {
    id: 'exp-1',
    category: 'Dental Materials & Consumables',
    title: '3M Filtek Composite Syringes (A2, A3), Bonding Agent & Etchant Gel',
    date: '2026-11-05',
    amount: 5400,
    paidTo: 'Prime Dental Products Chennai',
    paymentMethod: 'UPI / GPay',
    invoiceNumber: 'INV-PDP-8821',
    notes: 'Restocked for November restorative procedures.',
    createdAt: '2026-11-05T11:00:00Z'
  },
  {
    id: 'exp-2',
    category: 'Electricity & TNEB',
    title: 'TNEB Electricity Bill - Maduravoyal Operatory & Compressor',
    date: '2026-11-06',
    amount: 2350,
    paidTo: 'TNEB (TANGEDCO Online)',
    paymentMethod: 'UPI / GPay',
    invoiceNumber: 'TNEB-098231',
    notes: 'Commercial consumer number 04-123-456-789.',
    createdAt: '2026-11-06T15:30:00Z'
  },
  {
    id: 'exp-3',
    category: 'Bio-Medical Waste Disposal',
    title: 'Monthly Bio-Medical Waste Bag Collection & Sharps Disposal (TNPCB Authorized)',
    date: '2026-11-07',
    amount: 850,
    paidTo: 'Tamil Nadu Waste Management Ltd',
    paymentMethod: 'Cash',
    invoiceNumber: 'BMW-2026-110',
    notes: 'Yellow and red bags collected with barcoded manifests.',
    createdAt: '2026-11-07T10:00:00Z'
  },
  {
    id: 'exp-4',
    category: 'Dental Materials & Consumables',
    title: 'Lignocaine 2% with Adrenaline Cartridges (Box of 50) & Dispo Needles',
    date: '2026-11-08',
    amount: 1450,
    paidTo: 'Apollo Dental Supplies Koyambedu',
    paymentMethod: 'UPI / GPay',
    invoiceNumber: 'ADS-4421',
    notes: 'Local anesthetic stock.',
    createdAt: '2026-11-08T16:00:00Z'
  }
];

export const INITIAL_VISITS: PatientVisit[] = [
  {
    id: 'vis-101-1',
    patientId: 'pat-101',
    patientName: 'Kavitha Ramesh',
    patientPhone: '+91 98401 23891',
    date: '2026-11-10',
    time: '10:00',
    visitNumber: 1,
    visitType: 'Routine Consultation',
    chiefComplaint: 'Sensitivity to cold water on upper right back tooth',
    doctor: 'Dr. P. Manickapriya',
    chair: 'Dental Chair (Operatory 1)',
    proceduresDone: [
      'Consultation & Clinical Oral Examination',
      'Digital Intraoral Radiograph (RVG / IOPA)',
      'Tooth-Colored Light-Cure Composite Laser Restoration (1 Surface)'
    ],
    teethTreated: ['16 (FDI)'],
    clinicalDiagnosis: 'Class II Dentine Caries tooth #16. Asymptomatic horizontally impacted #48.',
    treatmentSummary: 'Decay excavated from tooth #16 under rubber dam isolation. 37% phosphoric acid etching + 5th gen bonding agent applied. Packable light-cured composite placed in increments and cured. Occlusion verified with articulating paper.',
    prescriptionsIssued: [
      'Tab. Combiflam (400mg/325mg) - 1-0-1 x 3 Days',
      'Tab. Pan-40 (40mg) - 1-0-0 x 3 Days',
      'Hexidine 0.2% Mouthwash - Twice daily'
    ],
    feeCharged: 2500,
    amountPaid: 2500,
    paymentMode: 'UPI / QR',
    nextVisitDate: '2026-11-11',
    nextVisitPlan: 'Surgical disimpaction of tooth #48 by visiting Oral Surgeon Dr. S. Anand.',
    status: 'Completed',
    createdAt: '2026-11-10T11:00:00Z'
  },
  {
    id: 'vis-101-2',
    patientId: 'pat-101',
    patientName: 'Kavitha Ramesh',
    patientPhone: '+91 98401 23891',
    date: '2026-11-11',
    time: '11:30',
    visitNumber: 2,
    visitType: 'Treatment Sitting',
    chiefComplaint: 'Surgical removal of wisdom tooth #48',
    doctor: 'Dr. S. Anand (Oral & Maxillofacial Surgeon)',
    chair: 'Dental Chair (Operatory 1)',
    proceduresDone: [
      'Surgical Impaction Third Molar Removal (Wisdom Tooth Surgery)'
    ],
    teethTreated: ['48 (FDI)'],
    clinicalDiagnosis: 'Horizontally impacted mandibular 3rd molar #48 with recurrent pericoronitis history.',
    treatmentSummary: 'Inferior alveolar nerve block administered with 2% Lignocaine + 1:80,000 Adrenaline. Ward incision made, mucoperiosteal flap reflected. Bone guttering done with straight handpiece under chilled saline irrigation. Tooth sectioned, delivered cleanly. Socket debrided, 3-0 silk sutures placed (3 interrupted). Hemostasis achieved.',
    prescriptionsIssued: [
      'Cap. Ammox 500mg - 1-1-1 x 5 Days',
      'Tab. Zerodol-SP - 1-0-1 x 3 Days',
      'Tab. Pan-D - 1-0-0 x 3 Days',
      'Betadine Gargle'
    ],
    feeCharged: 3500,
    amountPaid: 3500,
    paymentMode: 'UPI / QR',
    nextVisitDate: '2026-11-18',
    nextVisitPlan: 'Suture removal & post-extraction socket healing assessment.',
    status: 'Completed',
    createdAt: '2026-11-11T12:30:00Z'
  },
  {
    id: 'vis-102-1',
    patientId: 'pat-102',
    patientName: 'Senthil Kumar',
    patientPhone: '+91 97890 55412',
    date: '2026-05-18',
    time: '16:00',
    visitNumber: 1,
    visitType: 'Treatment Sitting',
    chiefComplaint: 'Broken tooth root lower right first molar region (#46), difficulty chewing',
    doctor: 'Dr. P. Manickapriya',
    chair: 'Dental Chair (Operatory 1)',
    proceduresDone: [
      'Routine Tooth Extraction under Local Anaesthesia',
      'Digital Intraoral Radiograph (RVG / IOPA)'
    ],
    teethTreated: ['46 (FDI)'],
    clinicalDiagnosis: 'Grossly decayed non-restorable tooth #46 root tips',
    treatmentSummary: 'Residual root tips elevated and extracted under 2% Lignocaine. Socket curettage done, pressure pack placed. Advised delayed implant placement after 3 months bone consolidation.',
    prescriptionsIssued: ['Tab. Combiflam - 1-0-1 x 3 Days', 'Warm saline rinses'],
    feeCharged: 1500,
    amountPaid: 1500,
    paymentMode: 'Cash',
    nextVisitDate: '2026-09-01',
    nextVisitPlan: 'Implant placement stage 1 surgery consultation.',
    status: 'Completed',
    createdAt: '2026-05-18T17:00:00Z'
  },
  {
    id: 'vis-102-2',
    patientId: 'pat-102',
    patientName: 'Senthil Kumar',
    patientPhone: '+91 97890 55412',
    date: '2026-09-01',
    time: '11:00',
    visitNumber: 2,
    visitType: 'Treatment Sitting',
    chiefComplaint: 'Implant placement stage 1 surgery for missing #46',
    doctor: 'Dr. P. Manickapriya',
    chair: 'Dental Chair (Operatory 1)',
    proceduresDone: [
      'Titanium Dental Implant (Fixture Placement)'
    ],
    teethTreated: ['46 (FDI)'],
    clinicalDiagnosis: 'Partially edentulous Kennedy Class III space #46',
    treatmentSummary: 'Mid-crestal incision, sequential osteotomy drills with chilled saline irrigation. Straumann bone-level 4.1 x 10mm fixture placed with 35 Ncm torque. Cover screw placed, primary closure with 4-0 vicryl sutures. Post-op IOPA confirmed optimal 3D positioning.',
    prescriptionsIssued: ['Cap. Augmentin 625mg x 5 Days', 'Tab. Zerodol-P x 3 Days', 'Hexidine rinse'],
    feeCharged: 25000,
    amountPaid: 15000,
    paymentMode: 'UPI / QR',
    nextVisitDate: '2026-11-01',
    nextVisitPlan: 'Stage 2 uncovery and impression for crown.',
    status: 'Completed',
    createdAt: '2026-09-01T12:30:00Z'
  },
  {
    id: 'vis-102-3',
    patientId: 'pat-102',
    patientName: 'Senthil Kumar',
    patientPhone: '+91 97890 55412',
    date: '2026-11-01',
    time: '11:45',
    visitNumber: 3,
    visitType: 'Post-Op Review',
    chiefComplaint: 'Implant stage 2 review & impression for crown #46',
    doctor: 'Dr. P. Manickapriya',
    chair: 'Dental Chair (Operatory 1)',
    proceduresDone: [
      'Custom Implant Abutment & Screw-Retained Crown',
      'Digital Intraoral Radiograph (RVG / IOPA)'
    ],
    teethTreated: ['46 (FDI)'],
    clinicalDiagnosis: 'Osseointegrated implant #46 ready for prosthetic restoration',
    treatmentSummary: 'Zero mobility, zero pain on percussion. Open-tray impression coping seated, polyvinyl siloxane elastomeric impression made. Sent to Vasantha Dental Ceramic Lab for PFM screw-retained crown fabrication.',
    prescriptionsIssued: ['None required'],
    feeCharged: 5500,
    amountPaid: 5500,
    paymentMode: 'UPI / QR',
    nextVisitDate: '2026-11-15',
    nextVisitPlan: 'Final crown trial, torque tightening to 30 Ncm and composite access closure.',
    status: 'Completed',
    createdAt: '2026-11-01T12:30:00Z'
  },
  {
    id: 'vis-103-1',
    patientId: 'pat-103',
    patientName: 'Ananya Sundaram',
    patientPhone: '+91 94441 87654',
    date: '2026-08-01',
    time: '09:15',
    visitNumber: 1,
    visitType: 'Routine Consultation',
    chiefComplaint: 'Routine teeth scaling and staining removal',
    doctor: 'Dr. P. Manickapriya',
    chair: 'Dental Chair (Operatory 1)',
    proceduresDone: [
      'Full Mouth Ultrasonic Scaling & Teeth Polishing'
    ],
    teethTreated: ['Full Mouth'],
    clinicalDiagnosis: 'Mild marginal gingivitis with supragingival calculus',
    treatmentSummary: 'Full mouth supragingival and subgingival ultrasonic scaling completed with Woodpecker scaler. Prophylaxis paste micro-polishing done. Demonstrated modified Bass brushing technique and flossing.',
    prescriptionsIssued: ['Hexidine 0.2% mouthwash twice daily for 7 days'],
    feeCharged: 1200,
    amountPaid: 1200,
    paymentMode: 'UPI / QR',
    nextVisitDate: '2026-11-15',
    nextVisitPlan: 'Periodic 6-month checkup and cleaning review.',
    status: 'Completed',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'vis-104-1',
    patientId: 'pat-104',
    patientName: 'Rajesh Varadarajan',
    patientPhone: '+91 98840 33219',
    date: '2026-08-15',
    time: '15:00',
    visitNumber: 1,
    visitType: 'Routine Consultation',
    chiefComplaint: 'Bleeding gums when brushing & halitosis',
    doctor: 'Dr. P. Manickapriya',
    chair: 'Dental Chair (Operatory 1)',
    proceduresDone: [
      'Consultation & Clinical Oral Examination',
      'Deep Subgingival Curettage & Root Planing (Per Quadrant)'
    ],
    teethTreated: ['UR', 'LR'],
    clinicalDiagnosis: 'Generalized Chronic Periodontitis with subgingival calculus and bleeding on probing',
    treatmentSummary: 'Periodontal probing depth measured (4-5mm pockets in molars). Ultrasonic scaling and Gracey curettes used for root planing in Right quadrants. Subgingival irrigation with povidone-iodine. Advised oral hygiene regimen and diabetes glycemic control.',
    prescriptionsIssued: ['Metrogyl DG gel application', 'Thermoseal-RA toothpaste'],
    feeCharged: 4200,
    amountPaid: 0,
    paymentMode: 'None',
    nextVisitDate: '2026-11-20',
    nextVisitPlan: 'Left quadrants curettage and periodontal re-evaluation.',
    status: 'Follow-up Due',
    createdAt: '2026-08-15T16:00:00Z'
  }
];


