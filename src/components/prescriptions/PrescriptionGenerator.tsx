import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Pill, 
  Printer, 
  Plus, 
  Search, 
  Trash2, 
  Check, 
  Sparkles,
  Stethoscope,
  MessageSquare,
  PackageCheck
} from 'lucide-react';
import logoIcon from '../../assets/smile7-logo-icon.png';
import { formatIndianDate } from '../../utils/currency';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import type { Prescription } from '../../types';

const COMMON_DENTAL_DRUGS = [
  { name: 'Tab. Augmentin 625 (Amoxyclav)', dosage: '625 mg', frequency: '1 - 0 - 1 (Twice daily, after food)', duration: '5 Days', instructions: 'Take with full glass of water after meals' },
  { name: 'Tab. Zerodol-SP (Aceclo + Para + Serratio)', dosage: '1 Tab', frequency: '1 - 0 - 1 (Twice daily, after food)', duration: '3 Days', instructions: 'For pain and swelling. Take strictly after food' },
  { name: 'Tab. Combiflam (Ibuprofen + Para)', dosage: '1 Tab', frequency: '1 - 0 - 1 (Twice daily, after food)', duration: '3 Days', instructions: 'Take strictly after meals with water' },
  { name: 'Tab. Metrogyl 400 (Metronidazole)', dosage: '400 mg', frequency: '1 - 1 - 1 (Thrice daily, after food)', duration: '5 Days', instructions: 'Do not consume alcohol during course' },
  { name: 'Tab. Pan-40 (Pantoprazole)', dosage: '40 mg', frequency: '1 - 0 - 0 (Morning only)', duration: '5 Days', instructions: 'Take 30 mins before breakfast on empty stomach' },
  { name: 'Tab. Ketorol-DT', dosage: '10 mg', frequency: 'SOS (Severe pain)', duration: '2 Days', instructions: 'Disperse tablet in half glass water; drink immediately for acute toothache' },
  { name: 'Tab. Novamox 500 (Amoxicillin)', dosage: '500 mg', frequency: '1 - 1 - 1 (Thrice daily, after food)', duration: '5 Days', instructions: 'Take after food with water' },
  { name: 'Tab. Taxim-O 200 (Cefixime)', dosage: '200 mg', frequency: '1 - 0 - 1 (Twice daily, after food)', duration: '5 Days', instructions: 'Take after meals for oral infections' },
  { name: 'Hexidine 0.2% Mouthwash', dosage: '10 ml', frequency: '1 - 0 - 1 (Twice daily)', duration: '14 Days', instructions: 'Rinse undiluted for 60 seconds after brushing; do not eat/drink for 30 mins' },
  { name: 'Mucopain Gel / Dologel CT', dosage: 'Pea size', frequency: '3 times daily', duration: '5 Days', instructions: 'Apply locally over painful ulcer or wound 10 mins before food' },
  { name: 'Tab. Dolo 650 (Paracetamol)', dosage: '650 mg', frequency: '1 - 0 - 1 (SOS)', duration: '3 Days', instructions: 'For mild dental pain or fever' },
  { name: 'Sensodent-K / Thermoseal RA Paste', dosage: 'Pea size', frequency: 'Twice daily', duration: '30 Days', instructions: 'Massage gently on sensitive teeth for 2 mins before brushing' }
];

const INDIAN_DENTAL_KITS = [
  {
    name: 'Extraction / Impaction Kit',
    diagnosis: 'Post-Extraction / Wisdom Tooth Surgery Management',
    advice: 'Bite gauze for 45 mins. No spitting, hot drinks, or straw for 24 hours. Cold ice packs outside cheek.',
    drugs: [
      { name: 'Tab. Augmentin 625 (Amoxyclav)', dosage: '625 mg', frequency: '1 - 0 - 1 (Twice daily, after food)', duration: '5 Days', instructions: 'Take after meals' },
      { name: 'Tab. Zerodol-SP (Aceclo + Para + Serratio)', dosage: '1 Tab', frequency: '1 - 0 - 1 (Twice daily, after food)', duration: '3 Days', instructions: 'For pain & swelling relief' },
      { name: 'Tab. Pan-40 (Pantoprazole)', dosage: '40 mg', frequency: '1 - 0 - 0 (Morning only)', duration: '5 Days', instructions: 'Take on empty stomach before breakfast' },
      { name: 'Hexidine 0.2% Mouthwash', dosage: '10 ml', frequency: '1 - 0 - 1 (Twice daily)', duration: '7 Days', instructions: 'Start from Day 2: gentle rinse after meals' }
    ]
  },
  {
    name: 'Acute Pulpitis / RCT Kit',
    diagnosis: 'Acute Irreversible Pulpitis / Endodontic Therapy',
    advice: 'Avoid chewing hard food on treated tooth until permanent crown/restoration is placed.',
    drugs: [
      { name: 'Tab. Combiflam (Ibuprofen + Para)', dosage: '1 Tab', frequency: '1 - 0 - 1 (Twice daily, after food)', duration: '3 Days', instructions: 'Take strictly after meals' },
      { name: 'Tab. Metrogyl 400 (Metronidazole)', dosage: '400 mg', frequency: '1 - 1 - 1 (Thrice daily, after food)', duration: '5 Days', instructions: 'Strictly avoid alcohol' },
      { name: 'Tab. Pan-40 (Pantoprazole)', dosage: '40 mg', frequency: '1 - 0 - 0 (Morning only)', duration: '3 Days', instructions: 'Take before breakfast' }
    ]
  },
  {
    name: 'Post-Scaling / Gums Kit',
    diagnosis: 'Chronic Generalized Marginal Gingivitis / Post Ultrasonic Scaling',
    advice: 'Use soft bristle brush with gentle circular motion. Warm saline gargles twice daily.',
    drugs: [
      { name: 'Hexidine 0.2% Mouthwash', dosage: '10 ml', frequency: '1 - 0 - 1 (Twice daily)', duration: '14 Days', instructions: 'Rinse for 60 seconds after meals' },
      { name: 'Mucopain Gel / Dologel CT', dosage: 'Pea size', frequency: 'Twice daily', duration: '5 Days', instructions: 'Apply locally over bleeding margins before meals' }
    ]
  },
  {
    name: 'Severe Toothache SOS Kit',
    diagnosis: 'Severe Acute Odontalgia (Emergency Dental Pain)',
    advice: 'Visit clinic for definitive dental chair evaluation and treatment.',
    drugs: [
      { name: 'Tab. Ketorol-DT', dosage: '10 mg', frequency: 'SOS (Max 2 tabs/day)', duration: '2 Days', instructions: 'Disperse in half glass water; drink immediately for acute toothache' },
      { name: 'Tab. Pan-40 (Pantoprazole)', dosage: '40 mg', frequency: '1 - 0 - 0 (Morning only)', duration: '2 Days', instructions: 'Take before meals' }
    ]
  }
];

export const PrescriptionGenerator: React.FC = () => {
  const { patients, prescriptions, clinicProfile, addPrescription } = useClinic();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState(COMMON_DENTAL_DRUGS.slice(0, 2));
  const [specialAdvice, setSpecialAdvice] = useState('Maintain gentle oral hygiene. Avoid hot/spicy foods for 48 hours. Follow up if swelling persists.');
  const [viewingRx, setViewingRx] = useState<Prescription | null>(null);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handleAddDrugFromTemplate = (drug: typeof COMMON_DENTAL_DRUGS[0]) => {
    setMedications(prev => [...prev, { ...drug }]);
  };

  const handleRemoveDrug = (index: number) => {
    setMedications(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || medications.length === 0) return;

    const newRx = addPrescription({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientAge: selectedPatient.age,
      patientGender: selectedPatient.gender,
      date: new Date().toISOString().split('T')[0],
      doctor: clinicProfile.doctorName,
      diagnosis: diagnosis || 'Dental Treatment / Post-Operative Management',
      medications,
      specialAdvice
    });

    setViewingRx(newRx);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-black text-lg text-slate-900 tracking-tight">
            Digital Prescriptions (Rx) Studio
          </h2>
          <p className="text-xs text-slate-500">
            Generate printable dental prescriptions with dosage instructions and medication templates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescription Builder Form (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
          <form onSubmit={handleCreateRx} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Select Patient *
                </label>
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patientId} - {p.age}y {p.gender})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Clinical Diagnosis *
                </label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Irreversible Pulpitis, Post Extraction"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            {/* 1-Click Indian Clinical Dental Kits */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                1-Click Indian Clinical Prescription Kits:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {INDIAN_DENTAL_KITS.map((kit, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setMedications([...kit.drugs]);
                      setDiagnosis(kit.diagnosis);
                      setSpecialAdvice(kit.advice);
                    }}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>⚡ {kit.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Templates Bar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#004884]" />
                Indian Dental Drug Templates (Click to add):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_DENTAL_DRUGS.map((drug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddDrugFromTemplate(drug)}
                    className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-50 hover:bg-sky-50 hover:text-[#004884] text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                  >
                    + {drug.name} ({drug.dosage})
                  </button>
                ))}
              </div>
            </div>

            {/* Medication List Table */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block">
                Prescribed Medications ({medications.length})
              </span>
              <div className="space-y-2">
                {medications.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={m.name}
                        onChange={e => {
                          const updated = [...medications];
                          updated[idx].name = e.target.value;
                          setMedications(updated);
                        }}
                        placeholder="Drug name"
                        className="font-bold text-slate-900 bg-white p-1.5 rounded-lg border border-slate-200 flex-1"
                      />
                      <input
                        type="text"
                        value={m.dosage}
                        onChange={e => {
                          const updated = [...medications];
                          updated[idx].dosage = e.target.value;
                          setMedications(updated);
                        }}
                        placeholder="Strength"
                        className="w-24 bg-white p-1.5 rounded-lg border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDrug(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={m.frequency}
                        onChange={e => {
                          const updated = [...medications];
                          updated[idx].frequency = e.target.value;
                          setMedications(updated);
                        }}
                        placeholder="Frequency (e.g. 1-0-1)"
                        className="bg-white p-1.5 rounded-lg border border-slate-200"
                      />
                      <input
                        type="text"
                        value={m.duration}
                        onChange={e => {
                          const updated = [...medications];
                          updated[idx].duration = e.target.value;
                          setMedications(updated);
                        }}
                        placeholder="Duration (e.g. 5 Days)"
                        className="bg-white p-1.5 rounded-lg border border-slate-200"
                      />
                    </div>

                    <input
                      type="text"
                      value={m.instructions}
                      onChange={e => {
                        const updated = [...medications];
                        updated[idx].instructions = e.target.value;
                        setMedications(updated);
                      }}
                      placeholder="Special instructions (e.g. After food with water)"
                      className="w-full bg-white p-1.5 rounded-lg border border-slate-200 text-[11px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Post-Operative Advice / Dietary Caution
              </label>
              <textarea
                rows={2}
                value={specialAdvice}
                onChange={e => setSpecialAdvice(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold bg-[#004884] hover:bg-sky-700 text-white rounded-xl shadow-xs shadow-[#004884]/20 cursor-pointer"
              >
                Generate & Preview Prescription
              </button>
            </div>
          </form>
        </div>

        {/* Prescription History Panel (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Recent Prescriptions
          </h3>

          <div className="space-y-2.5">
            {prescriptions.map(rx => (
              <div
                key={rx.id}
                onClick={() => setViewingRx(rx)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-[#004884]/40 bg-slate-50/50 hover:bg-sky-50/20 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-sky-100 text-[#004884]">
                      {rx.prescriptionNumber}
                    </span>
                    <span className="font-bold text-xs text-slate-900">{rx.patientName}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                    {rx.diagnosis}
                  </p>
                  <span className="text-[10px] text-slate-400">{rx.date} • {rx.medications.length} drug(s)</span>
                </div>

                <Printer className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Printable Prescription Modal */}
      {viewingRx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 space-y-6 max-h-[95vh] overflow-y-auto">
            {/* Modal Controls (No Print) */}
            <div className="no-print flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <span className="text-xs font-bold text-slate-500">
                Smile7 Dental Prescription Pad
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppUrl(
                    patients.find(p => p.id === viewingRx.patientId)?.phone || selectedPatient?.phone || '',
                    `Hello ${viewingRx.patientName},

Prescription from ${clinicProfile.doctorName} (${clinicProfile.clinicName}):
Rx No: ${viewingRx.prescriptionNumber} • Date: ${formatIndianDate(viewingRx.date)}
Diagnosis: ${viewingRx.diagnosis}

Prescribed Medications:
${viewingRx.medications.map((m, idx) => `${idx + 1}. ${m.name} (${m.dosage})\n   Dosage: ${m.frequency} for ${m.duration}\n   Instruction: ${m.instructions}`).join('\n\n')}

Special Advice: ${viewingRx.specialAdvice || 'Maintain gentle oral hygiene.'}

Clinic: Maduravoyal, Chennai. Ph: ${clinicProfile.phone}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#004884] hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Prescription
                </button>
                <button
                  type="button"
                  onClick={() => setViewingRx(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Prescription Paper Sheet */}
            <div className="print-content space-y-6 border border-slate-200 p-6 rounded-2xl bg-white text-slate-900">
              {/* Clinic Header */}
              <div className="border-b-2 border-[#004884] pb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={logoIcon} 
                    alt="Smile7 Dental Clinic Logo" 
                    className="w-14 h-14 object-contain shrink-0" 
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div>
                    <h2 className="text-xl font-black text-[#002244] uppercase tracking-tight">
                      {clinicProfile.clinicName}
                    </h2>
                    <p className="text-xs text-slate-600 font-bold">{clinicProfile.tagline}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{clinicProfile.address}</p>
                    <p className="text-[11px] text-slate-500">{clinicProfile.city} • Ph: {clinicProfile.phone}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-xs text-[#004884] block">{clinicProfile.doctorName}</span>
                  <span className="text-[11px] text-slate-600 block">{clinicProfile.doctorQualification}</span>
                  <span className="text-[10px] text-slate-500 block font-mono">{clinicProfile.registrationNumber}</span>
                  <span className="text-[10px] text-slate-500 block">{clinicProfile.dentalCouncil}</span>
                </div>
              </div>

              {/* Patient Bar */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Patient: </span>
                  <span className="font-black text-slate-900">{viewingRx.patientName}</span>
                  <span className="text-slate-500 ml-2">({viewingRx.patientAge} Yrs / {viewingRx.patientGender})</span>
                </div>
                <div>
                  <span className="text-slate-400">Rx No: </span>
                  <span className="font-bold text-slate-900">{viewingRx.prescriptionNumber}</span>
                  <span className="text-slate-400 ml-3">Date: </span>
                  <span className="font-bold text-slate-900">{formatIndianDate(viewingRx.date)}</span>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Diagnosis:</span>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{viewingRx.diagnosis}</p>
              </div>

              {/* Rx Symbol & Medication List */}
              <div className="space-y-4 pt-2">
                <span className="font-black text-2xl text-[#004884] font-serif italic block">
                  ℞
                </span>

                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500 text-[10px] uppercase font-bold">
                      <th className="py-2">#</th>
                      <th className="py-2">Medication & Dosage</th>
                      <th className="py-2">Frequency / Timing</th>
                      <th className="py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingRx.medications.map((m, idx) => (
                      <tr key={idx} className="py-2">
                        <td className="py-2.5 font-bold text-slate-400">{idx + 1}.</td>
                        <td className="py-2.5">
                          <span className="font-extrabold text-slate-900 block">{m.name} ({m.dosage})</span>
                          <span className="text-[11px] text-[#004884] italic">{m.instructions}</span>
                        </td>
                        <td className="py-2.5 font-bold text-slate-800">{m.frequency}</td>
                        <td className="py-2.5 font-bold text-slate-600">{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Special Advice */}
              {viewingRx.specialAdvice && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Post-Treatment Advice:</span>
                  <p className="text-slate-600 text-[11px]">{viewingRx.specialAdvice}</p>
                </div>
              )}

              {/* Doctor Signature Line */}
              <div className="pt-10 flex items-end justify-between text-xs">
                <div className="text-[10px] text-slate-400">
                  Electronic clinic prescription • Valid with doctor registration
                </div>
                <div className="text-right space-y-1">
                  <div className="w-48 border-b border-slate-400 h-8"></div>
                  <span className="font-extrabold text-slate-900 block text-xs">{clinicProfile.doctorName}</span>
                  <span className="text-[10px] text-slate-500 block">Dentist Signature & Seal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

