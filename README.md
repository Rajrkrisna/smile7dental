# Smile7 Dental Clinic — Desktop Practice Management Software (PMS)

A high-precision, offline-first, standalone dental practice management software custom-built for **Smile7 Dental Clinic**, running locally on Windows.

- **Clinic**: Smile7 Dental Clinic (smile7dental.com)
- **Chief Dental Surgeon**: Dr. P. Manickapriya (B.D.S., FCD.)
- **Registration**: Tamil Nadu Dental Council Reg #24892 (DCI: 26448)
- **Clinic Address**: No. 1/2, Alapakkam Main Road, Janaki Nagar, Maduravoyal, Chennai, Tamil Nadu - 600095
- **Contact**: +91 97908 62510 | care@smile7dental.com
- **Currency**: Indian Rupees (`₹` / `Rs.`) formatted with `en-IN` standards
- **Pricing Model**: Flexible Manual Fee Entry — every procedure amount is entered/edited manually per patient

> **100% Offline & Private**: Runs completely on your laptop without requiring internet access. All patient medical histories, charted teeth, appointments, and bills are stored locally on your hard drive with 1-click JSON backup/restore.

---

## 🚀 How to Run on Your Laptop

### 🌟 1-Click Windows Executable (.exe)
Double-click:
```
C:\Users\rajrk\.gemini\antigravity\scratch\dental-clinic-desktop\Smile7Dental.exe
```
- **Native Windows Executable**: Starts with zero command prompt window.
- **Embedded Offline Server**: Runs completely offline with built-in instant static server on port 4500.
- **Dedicated Desktop Window**: Opens in a borderless, focused desktop application window with the Smile7 Dental icon.
- **System Tray Icon**: Keeps running in the Windows System Tray with 1-click reopen or exit.

### Install Windows Desktop Shortcut
- Double-click **`Install-Desktop-Shortcut.bat`**.
- It places a shortcut named **`Smile7 Dental Clinic.lnk`** directly on your Windows desktop with the official Smile7 tooth logo icon!

### Quick Batch Launcher
- Double-click **`Launch-Smile7Dental.bat`**.

---

## 🎨 Theme & Visual Identity (Matched to smile7dental.com)

- **Signature Smile7 Blue Gradient**: `bg-gradient-to-r from-[#002244] via-[#004884] to-[#0284c7]`
- **Primary Brand Blue**: `#004884` (Deep Royal Medical Blue)
- **Dark Navy Blue**: `#002244` / `#00264d`
- **Sky Accent**: `#0284c7` / `#0ea5e9` / `sky-50`
- **Typography**: Plus Jakarta Sans (Headings & UI) + JetBrains Mono (Numbers & Codes)
- **Official Brand Assets**: Embedded `smile7-logo-icon.png` and `favicon.png`

---

## 🦷 Comprehensive Features

### 1. Interactive Odontogram (Teeth Chart)
- **Adult (32 Teeth)** & **Pediatric (20 Deciduous Teeth)** full arch charts.
- **Instant 3-Way Notation Switcher**:
  - **FDI Two-Digit Notation (ISO 3950)**: `11–48` adult / `51–85` child.
  - **Universal Numbering System**: `1–32` adult / `A–T` child.
  - **Palmer Notation**: Quadrant brackets (`8┘..1┘`, `└1..└8`, `┌1..┌8`, `1┐..8┐`).
- **5-Surface Anatomy**: Occlusal (O), Mesial (M), Distal (D), Buccal/Labial (B), Lingual/Palatal (L).
- **Condition Marking & Quick Stamp Tool**: Caries, Restored, Crown, RCT, Implant, Missing, Impacted.

### 2. Manual Pricing & INR Billing Engine
- **No Fixed Procedure Prices**: Doctor enters whatever fee is agreed upon for that specific patient/treatment.
- **Custom Procedure Descriptions**: Type any custom treatment (e.g., *Zirconia Bridge 3 units*, *Night Guard*, *Bleaching*).
- **Inline Amount Editing & Clear All**: Change prices directly in the bill table before finalizing.
- **Dual Print Receipts**:
  - **A4 Letterhead Tax Invoice**: Featuring Smile7 logo, Dr. P. Manickapriya credentials, itemized teeth breakdown, payment mode, and authorized seal.
  - **80mm Thermal Slip**: For POS thermal printers.

### 3. Patient Electronic Records (EDR)
- Patient Directory with search by Name, Phone, or Patient ID.
- **Critical Medical Caution Alerts**: Penicillin allergy, Hypertension, Diabetes, Anticoagulant use, Bleeding disorders, Cardiac conditions, Pregnancy.

### 4. Operatory Chair Scheduling
- 4 operatory chair allocations: `Chair 1`, `Chair 2`, `Chair 3`, and `Surgical Suite`.
- Live queue workflow: `Scheduled` ➔ `Checked-In` ➔ `In-Chair` ➔ `Completed`.

### 5. Clinical SOAP Notes & Digital Rx
- Four-section clinical visit documentation: Subjective, Objective, Assessment, Plan.
- Dental Prescription Studio with quick drug templates (Amoxicillin, Ibuprofen, Paracetamol, Mouthwash) and printable prescription slips.

### 6. Local Disaster Recovery
- 1-click **Export Database Backup (.JSON)** to laptop or USB drive.
- Instant **Restore Database** to recover clinic state at any time.

---

## 🎨 Stitch.google.com Design Integration

When you finish your designs on **stitch.google.com**:
1. Share the exported CSS tokens or JSX layout structures.
2. The UI components are modularly organized in `src/components/`:
   - `src/components/layout/Navbar.tsx` & `Sidebar.tsx`
   - `src/components/dashboard/Dashboard.tsx`
   - `src/components/odontogram/`
   - `src/components/patients/`
   - `src/components/appointments/`
   - `src/components/billing/`
   - `src/components/prescriptions/`
3. We can seamlessly update the styling without disturbing the offline `ClinicContext` data model!

---

## 🔒 Project Isolation
The pre-existing website folder at `C:\Users\rajrk\.gemini\antigravity\scratch\Smile7dental` was left **100% untouched**. This software is completely independent in `dental-clinic-desktop`.
