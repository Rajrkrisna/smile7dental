# Smile7dental - Dental Clinic Billing & Practice Management System

An ultra-modern, high-precision, offline-first dental billing and practice management web application created for **Smile7dental**.

---

## Key Features

### 1. Interactive Visual Dental Chart & Tooth Picker
- Full anatomical adult arch (32 teeth) and pediatric arch (20 deciduous teeth).
- Seamless live toggle between **FDI Two-Digit Notation (11–48 / 51–85)** and **Universal Numbering System (1–32 / A–T)**.
- Quick selection filters: Full Mouth, Upper Arch (Maxilla), Lower Arch (Mandible), and individual quadrants (UR, UL, LL, LR).
- Direct tooth number mapping to itemized invoice line items with surface notations (MOD, Buccal, Incisal, etc.).

### 2. Comprehensive Dental Billing & Invoice Generator
- Fast patient auto-complete search (by Name, Phone, or Patient ID) or instant 1-click modal registration.
- Preloaded categorized dental procedure catalogue with CDT codes (Diagnostic, Preventive, Restorative, Endodontics, Periodontics, Prosthodontics, Oral Surgery, Orthodontics, Cosmetic).
- Real-time calculations: Item discounts, invoice-level discounts (percentage or fixed amount), taxes (GST/VAT), net totals, and balance due.
- Multiple payment modes: Credit/Debit Card, UPI / QR Scan, Cash Counter, Insurance Direct, and Bank Wire.
- Multi-visit installment tracking with payment receipt history.

### 3. Dual Print & PDF Formats
- **Standard A4 / Letter Dental Tax Invoice**: Full clinic letterhead with Smile7dental branding, clinician details, patient history, itemized tooth mapping, tax summary, bank settlement info, clinical observations, prescribed medications (Rx), and doctor's signature line.
- **80mm Thermal POS Receipt Slip**: Clean monospaced counter receipt layout for instant POS printing.

### 4. Patient Dossier & Treatment History
- Patient profiles with critical **Medical Alerts & Allergies** (e.g. Penicillin allergy, Hypertension, Diabetic, Bleeding disorder).
- Lifetime invoiced totals, total settled payments, and active outstanding balances.
- Complete invoice and treatment history per patient with one-click direct billing.

### 5. Procedure Catalog & Fee Schedule Manager
- Add, edit, or disable dental treatments.
- Configure default fees, standard procedure duration, CDT codes, and tooth-specificity rules.

### 6. Payments & Collections Ledger
- Audit trail of all received payment transactions with date, time, mode, and transaction reference numbers.
- Breakdown analytics by payment method (Card, UPI/QR, Cash, Wire).

### 7. Clinic Settings & Data Portability
- Customizable clinic profile (Doctor names, Registration numbers, Tax ID/GSTIN, Phone, Address, Bank details, UPI QR ID).
- Configurable default currency symbol (`$`, `₹`, `£`, `€`, `AED`) and tooth notation preference.
- 100% offline LocalStorage persistence with **Export Database (JSON)** and **Restore Database** capabilities.

---

## Technology Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Medical Design Tokens
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans & JetBrains Mono

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Running Locally

```bash
# Navigate to project directory
cd Smile7dental

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

---

## License

Private and confidential. Built for Smile7dental Clinic & Implant Center.
