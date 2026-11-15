import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Odontogram } from '../odontogram/Odontogram';
import { getWhatsAppUrl, getAppointmentWhatsAppText } from '../../utils/whatsapp';
import { formatINR, formatIndianDate } from '../../utils/currency';
import logoIcon from '../../assets/smile7-logo-icon.png';
import type { PatientVisit, VisitType } from '../../types';
import { 
  X, 
  AlertTriangle, 
  Phone, 
  Mail, 
  MapPin, 
  Activity, 
  FileText, 
  Pill, 
  CreditCard, 
  Calendar,
  Plus,
  Printer,
  MessageSquare,
  Trash2,
  Clock,
  Check,
  Stethoscope
} from 'lucide-react';

interface PatientProfileModalProps {
  patientId: string;
  onClose: () => void;
  onOpenNewInvoiceForPatient: (patientId: string) => void;
  onOpenNewAppointmentForPatient: (patientId: string) => void;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  patientId,
  onClose,
  onOpenNewInvoiceForPatient,
  onOpenNewAppointmentForPatient
}) => {
  const { 
    getPatientById, 
    deletePatient,
    updatePatient,
    updateToothFinding, 
    clearToothFinding, 
    notation, 
    setNotation, 
    clinicProfile,
    getNotesByPatient,
    addClinicalNote,
    getPrescriptionsByPatient,
    addPrescription,
    invoices,
    appointments,
    getVisitsByPatient,
    addPatientVisit,
    deletePatientVisit,
    procedures
  } = useClinic();

  const patient = getPatientById(patientId);
  const [activeTab, setActiveTab] = useState<'chart' | 'visits' | 'notes' | 'rx' | 'billing' | 'appointments'>('chart');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Visit states
  const [isAddVisitOpen, setIsAddVisitOpen] = useState(false);
  const [isPrintCaseSheetOpen, setIsPrintCaseSheetOpen] = useState(false);
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [visitTime, setVisitTime] = useState('10:00');
  const [visitType, setVisitType] = useState<VisitType>('Treatment Sitting');
  const [visitComplaint, setVisitComplaint] = useState(patient?.chiefComplaint || '');
  const [visitDoctor, setVisitDoctor] = useState(clinicProfile.doctorName);
  const [visitChair, setVisitChair] = useState('Dental Chair (Operatory 1)');
  const [visitProcs, setVisitProcs] = useState<string[]>([]);
  const [visitTeeth, setVisitTeeth] = useState('');
  const [visitDiagnosis, setVisitDiagnosis] = useState('');
  const [visitSummary, setVisitSummary] = useState('');
  const [visitRx, setVisitRx] = useState('');
  const [visitFee, setVisitFee] = useState<number | ''>('');
  const [visitPaid, setVisitPaid] = useState<number | ''>('');
  const [visitPaymentMode, setVisitPaymentMode] = useState<'UPI / QR' | 'Cash' | 'Card' | 'Bank Transfer' | 'None'>('UPI / QR');
  const [visitNextDate, setVisitNextDate] = useState('');
  const [visitNextPlan, setVisitNextPlan] = useState('');

  // New Note Modal
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [noteSubjective, setNoteSubjective] = useState('');
  const [noteObjective, setNoteObjective] = useState('');
  const [noteAssessment, setNoteAssessment] = useState('');
  const [notePlan, setNotePlan] = useState('');

  // New Rx Modal
  const [isAddRxOpen, setIsAddRxOpen] = useState(false);
  const [rxDiagnosis, setRxDiagnosis] = useState('');
  const [rxMeds, setRxMeds] = useState<{ name: string; dosage: string; frequency: string; duration: string; instructions: string }[]>([
    { name: 'Amoxicillin', dosage: '500 mg', frequency: '1 - 1 - 1 (Thrice daily)', duration: '5 Days', instructions: 'After food with water' },
    { name: 'Ibuprofen', dosage: '400 mg', frequency: '1 - 0 - 1 (Twice daily)', duration: '3 Days', instructions: 'Take only after meals if pain persists' }
  ]);
  const [rxAdvice, setRxAdvice] = useState('Maintain gentle brushing around treated area. Avoid extremely hard foods.');

  if (!patient) return null;

  const patientVisits = getVisitsByPatient(patientId);
  const patientNotes = getNotesByPatient(patientId);
  const patientRx = getPrescriptionsByPatient(patientId);
  const patientInvoices = invoices.filter(i => i.patientId === patientId);
  const patientAppointments = appointments.filter(a => a.patientId === patientId);

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    const teethArr = visitTeeth.split(',').map(t => t.trim()).filter(Boolean);
    const rxArr = visitRx.split('\n').map(r => r.trim()).filter(Boolean);
    const fee = typeof visitFee === 'number' ? visitFee : 0;
    const paid = typeof visitPaid === 'number' ? visitPaid : fee;

    addPatientVisit({
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      date: visitDate,
      time: visitTime,
      visitType,
      chiefComplaint: visitComplaint || patient.chiefComplaint || 'Dental Sitting',
      doctor: visitDoctor,
      chair: visitChair,
      proceduresDone: visitProcs.length > 0 ? visitProcs : ['Clinical Treatment Sitting'],
      teethTreated: teethArr,
      clinicalDiagnosis: visitDiagnosis || undefined,
      treatmentSummary: visitSummary || undefined,
      prescriptionsIssued: rxArr.length > 0 ? rxArr : undefined,
      feeCharged: fee,
      amountPaid: paid,
      paymentMode: visitPaymentMode,
      nextVisitDate: visitNextDate || undefined,
      nextVisitPlan: visitNextPlan || undefined,
      status: 'Completed'
    });

    setIsAddVisitOpen(false);
    setVisitProcs([]);
    setVisitTeeth('');
    setVisitDiagnosis('');
    setVisitSummary('');
    setVisitRx('');
    setVisitFee('');
    setVisitPaid('');
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    addClinicalNote({
      patientId: patient.id,
      date: new Date().toISOString().split('T')[0],
      doctor: clinicProfile.doctorName,
      subjective: noteSubjective,
      objective: noteObjective,
      assessment: noteAssessment,
      plan: notePlan
    });
    setNoteSubjective('');
    setNoteObjective('');
    setNoteAssessment('');
    setNotePlan('');
    setIsAddNoteOpen(false);
  };

  const handleSaveRx = (e: React.FormEvent) => {
    e.preventDefault();
    addPrescription({
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      date: new Date().toISOString().split('T')[0],
      doctor: clinicProfile.doctorName,
      diagnosis: rxDiagnosis || 'Dental Treatment / Post-operative care',
      medications: rxMeds,
      specialAdvice: rxAdvice
    });
    setIsAddRxOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-5">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[96vh] sm:max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Patient Summary - Signature Smile7 Blue Gradient */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#002244] via-[#004884] to-[#0284c7] text-white shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h2 className="text-lg sm:text-xl font-black tracking-tight break-words">{patient.name}</h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/15 text-sky-200 border border-white/20 shrink-0">
                  {patient.patientId}
                </span>
                <span className="text-xs text-sky-100/80 shrink-0">
                  {patient.age} Yrs • {patient.gender} • Blood Group {patient.bloodGroup || 'N/A'}
                </span>
              </div>

              {/* Patient Contacts */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-sky-100/90 mt-2">
                <span className="flex items-center gap-1.5 font-mono shrink-0">
                  <Phone className="w-3.5 h-3.5 text-sky-300" />
                  {patient.phone}
                </span>
                <a
                  href={getWhatsAppUrl(
                    patient.phone,
                    `Hello ${patient.name}, greetings from Smile7 Dental Clinic (Dr. P. Manickapriya). We are here to assist you with your dental care and appointments.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] transition-colors border border-emerald-400/30 shrink-0"
                  title="Open WhatsApp chat with patient"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
                {patient.email && (
                  <span className="flex items-center gap-1.5 truncate max-w-xs">
                    <Mail className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                    <span className="truncate">{patient.email}</span>
                  </span>
                )}
                {patient.address ? (
                  <span className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-lg border border-white/20 max-w-full">
                    <MapPin className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                    <span className="truncate max-w-xs sm:max-w-md">{patient.address}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newLoc = prompt('Update patient location / area:', patient.address);
                        if (newLoc !== null) {
                          updatePatient({ ...patient, address: newLoc.trim() || undefined });
                        }
                      }}
                      className="ml-1 text-[10px] text-sky-200 underline hover:text-white cursor-pointer shrink-0"
                      title="Edit location"
                    >
                      Edit
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const newLoc = prompt('Enter patient location / residential area (e.g. Maduravoyal, Chennai):');
                      if (newLoc && newLoc.trim()) {
                        updatePatient({ ...patient, address: newLoc.trim() });
                      }
                    }}
                    className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded-lg text-sky-200 hover:text-white text-[11px] font-bold border border-white/20 cursor-pointer shrink-0"
                    title="Add location for patient"
                  >
                    <MapPin className="w-3 h-3 text-sky-300" />
                    <span>+ Add Location</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions & Close */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => onOpenNewInvoiceForPatient(patient.id)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-[#004884] text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                + Bill (Rs.)
              </button>
              <button
                type="button"
                onClick={() => onOpenNewAppointmentForPatient(patient.id)}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors cursor-pointer border border-white/20"
              >
                + Book Chair
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-white text-xs font-bold transition-colors cursor-pointer border border-rose-400/30 flex items-center gap-1"
                title="Delete Patient Record"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                <span className="hidden sm:inline">Delete</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-sky-200 hover:text-white rounded-lg cursor-pointer hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Reason for Visit / Chief Complaint */}
          {patient.chiefComplaint && (
            <div className="mt-3 p-2.5 bg-white/10 rounded-xl border border-white/15 text-xs text-sky-100 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-sky-200 uppercase text-[10px] tracking-wider shrink-0">Reason for Visit:</span>
              <span className="font-medium break-words">{patient.chiefComplaint}</span>
            </div>
          )}

          {/* Critical Medical Alerts Banner */}
          {patient.medicalAlerts.length > 0 && (
            <div className="mt-3 p-2.5 bg-rose-500/20 border border-rose-400/40 rounded-xl flex items-start gap-2 text-rose-100 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="block sm:inline sm:mr-2">Medical Caution:</span>
                <div className="inline-flex flex-wrap gap-1.5 mt-1 sm:mt-0">
                  {patient.medicalAlerts.map(alert => (
                    <span key={alert} className="bg-rose-500/30 px-2 py-0.5 rounded text-white text-[11px] font-bold">
                      {alert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-4 sm:mt-5 border-t border-white/15 pt-3 overflow-x-auto pb-1.5 scrollbar-none">
            {[
              { id: 'chart', label: 'Dental Chart (Odontogram)', icon: Activity },
              { id: 'visits', label: `Visit History (${patientVisits.length})`, icon: Clock },
              { id: 'notes', label: `Clinical SOAP Notes (${patientNotes.length})`, icon: FileText },
              { id: 'rx', label: `Prescriptions (${patientRx.length})`, icon: Pill },
              { id: 'billing', label: `Billing & Dues (${patientInvoices.length})`, icon: CreditCard },
              { id: 'appointments', label: `Appointments (${patientAppointments.length})`, icon: Calendar }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-white text-[#004884] shadow-xs'
                      : 'text-sky-100/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
          {/* TAB 1: DENTAL CHART ODONTOGRAM */}
          {activeTab === 'chart' && (
            <div className="space-y-4">
              <Odontogram
                chartFindings={patient.dentalChart || {}}
                onUpdateFinding={f => updateToothFinding(patient.id, f)}
                onClearFinding={t => clearToothFinding(patient.id, t)}
                activeNotation={notation}
                onChangeNotation={setNotation}
              />
            </div>
          )}

          {/* TAB 2: PATIENT VISIT HISTORY & SITTINGS */}
          {activeTab === 'visits' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#004884]" />
                    <span>Patient Sittings & Visit History ({patientVisits.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chronological case records of every visit, procedure done, tooth treated, and payment settled.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPrintCaseSheetOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Case Sheet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVisitDate(new Date().toISOString().split('T')[0]);
                      setVisitComplaint(patient.chiefComplaint || '');
                      setIsAddVisitOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#004884] hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Log Sitting</span>
                  </button>
                </div>
              </div>

              {patientVisits.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
                  <Clock className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">No visits or clinical sittings logged yet for this patient.</p>
                  <button
                    type="button"
                    onClick={() => setIsAddVisitOpen(true)}
                    className="px-3 py-1.5 bg-[#004884] hover:bg-sky-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Log First Sitting
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {patientVisits.map((v) => (
                    <div
                      key={v.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3"
                    >
                      {/* Sitting header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-8 h-8 rounded-xl bg-[#004884] text-white flex items-center justify-center font-black text-xs shrink-0">
                            #{v.visitNumber}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-xs text-slate-900">
                                {formatIndianDate(v.date)} {v.time ? `• ${v.time}` : ''}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#004884] border border-sky-200 shrink-0">
                                {v.visitType}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium truncate">
                              Attending Doctor: <strong>{v.doctor}</strong> • {v.chair}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                          <a
                            href={getWhatsAppUrl(
                              patient.phone,
                              `Hello ${patient.name},
Smile7 Dental Clinic sitting summary on ${formatIndianDate(v.date)}:
- Sitting #${v.visitNumber} (${v.visitType})
- Procedures Done: ${v.proceduresDone.join(', ')}
${v.teethTreated.length > 0 ? `- Teeth: ${v.teethTreated.join(', ')}` : ''}
${v.nextVisitDate ? `- Next Sitting: ${formatIndianDate(v.nextVisitDate)}` : ''}
- Fee: ${formatINR(v.amountPaid)} Settled.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title="Share on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => deletePatientVisit(v.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete sitting"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Complaint & Diagnosis */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Chief Complaint:</span>
                          <span className="text-slate-800 font-medium">{v.chiefComplaint}</span>
                        </div>
                        {v.clinicalDiagnosis && (
                          <div className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100">
                            <span className="text-[10px] font-bold text-[#004884] uppercase block">Diagnosis & Teeth:</span>
                            <span className="text-[#004884] font-bold">
                              {v.clinicalDiagnosis} {v.teethTreated.length > 0 ? `(${v.teethTreated.join(', ')})` : ''}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Procedures */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Procedures Performed:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {v.proceduresDone.map((p, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-bold flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>{p}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Notes & Summary */}
                      {v.treatmentSummary && (
                        <p className="text-xs text-slate-600 italic bg-slate-50/70 p-2 rounded-xl">
                          "{v.treatmentSummary}"
                        </p>
                      )}

                      {/* Prescriptions */}
                      {v.prescriptionsIssued && v.prescriptionsIssued.length > 0 && (
                        <div className="p-2 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Prescription (Rx):</span>
                          <div className="flex flex-wrap gap-1">
                            {v.prescriptionsIssued.map((med, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-white text-emerald-900 border border-emerald-300 text-[10px] font-bold">
                                {med}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Financials & Recall */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span>Fee: <strong className="text-slate-900">{formatINR(v.feeCharged)}</strong></span>
                          <span>Settled: <strong className="text-emerald-700">{formatINR(v.amountPaid)}</strong> ({v.paymentMode})</span>
                        </div>
                        {v.nextVisitDate && (
                          <span className="text-amber-800 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Next Sitting: {formatIndianDate(v.nextVisitDate)} {v.nextVisitPlan ? `• ${v.nextVisitPlan}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CLINICAL SOAP NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Clinical Progress & SOAP Notes
                  </h3>
                  <p className="text-xs text-slate-500">
                    Subjective, Objective, Assessment, and Plan notes per clinical visit.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddNoteOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#004884] hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Write SOAP Note
                </button>
              </div>

              {patientNotes.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-1">
                  <FileText className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">No clinical notes recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patientNotes.map(n => (
                    <div key={n.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <span className="text-xs font-black text-slate-900">
                          Visit Date: {n.date}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Clinician: {n.doctor}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          <span className="font-bold text-[#004884] block mb-1">Subjective (Chief Complaint):</span>
                          <p className="text-slate-700">{n.subjective || 'None stated'}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          <span className="font-bold text-blue-800 block mb-1">Objective (Findings & Exam):</span>
                          <p className="text-slate-700">{n.objective || 'Normal findings'}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          <span className="font-bold text-purple-800 block mb-1">Assessment (Diagnosis):</span>
                          <p className="text-slate-700">{n.assessment || 'Under observation'}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          <span className="font-bold text-emerald-800 block mb-1">Plan (Treatment & Next Steps):</span>
                          <p className="text-slate-700">{n.plan || 'Recall in 6 months'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRESCRIPTIONS (RX) */}
          {activeTab === 'rx' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Patient Dental Prescriptions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Antibiotics, analgesics, antiseptic rinses with dosage instructions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddRxOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#004884] hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Prescribe Rx
                </button>
              </div>

              {patientRx.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-1">
                  <Pill className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">No prescriptions recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patientRx.map(rx => (
                    <div key={rx.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-50 text-[#004884] shrink-0">
                            {rx.prescriptionNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {rx.diagnosis}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">Date: {rx.date}</span>
                      </div>

                      <div className="space-y-2">
                        {rx.medications.map((m, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                            <div>
                              <span className="font-extrabold text-slate-900">{m.name}</span>
                              <span className="text-slate-500 ml-2">({m.dosage})</span>
                              <p className="text-[11px] text-[#004884] font-medium">{m.instructions}</p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              <span className="font-bold text-slate-800">{m.frequency}</span>
                              <span className="block text-[11px] text-slate-400">{m.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {rx.specialAdvice && (
                        <p className="text-xs text-slate-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                          <span className="font-bold text-amber-800">Special Advice:</span> {rx.specialAdvice}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BILLING & INVOICES */}
          {activeTab === 'billing' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Billing Ledger & Invoices
                  </h3>
                  <p className="text-xs text-slate-500">
                    Total Invoiced: {clinicProfile.currencySymbol}{patient.totalBilled} • Settled: {clinicProfile.currencySymbol}{patient.totalPaid} • Balance Due: {clinicProfile.currencySymbol}{patient.balanceDue}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenNewInvoiceForPatient(patient.id)}
                  className="px-3.5 py-2 rounded-xl bg-[#004884] hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Dental Bill
                </button>
              </div>

              {patientInvoices.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-1">
                  <CreditCard className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">No invoices generated yet for this patient.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {patientInvoices.map(inv => (
                    <div key={inv.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-xs text-slate-900">{inv.invoiceNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Date: {inv.date} • {inv.items.length} procedure item(s)
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-sm font-black text-slate-900 block">
                          {clinicProfile.currencySymbol}{inv.total.toFixed(2)}
                        </span>
                        {inv.balance > 0 && (
                          <span className="text-[11px] font-bold text-rose-600">
                            Due: {clinicProfile.currencySymbol}{inv.balance.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Visit & Appointment History
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chair allocation and procedure tracking.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenNewAppointmentForPatient(patient.id)}
                  className="px-3.5 py-2 rounded-xl bg-[#004884] hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Book Appointment
                </button>
              </div>

              {patientAppointments.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-1">
                  <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">No appointments on record.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {patientAppointments.map(appt => (
                    <div key={appt.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-xs text-slate-900">{appt.procedure}</span>
                        <p className="text-[11px] text-slate-500">
                          {formatIndianDate(appt.date)} at {appt.startTime} ({appt.durationMin} mins) • {appt.chair}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap shrink-0">
                        <a
                          href={getWhatsAppUrl(
                            appt.patientPhone,
                            getAppointmentWhatsAppText(
                              appt.patientName,
                              formatIndianDate(appt.date),
                              appt.startTime,
                              clinicProfile.clinicName,
                              appt.doctor,
                              clinicProfile.phone,
                              appt.procedure,
                              clinicProfile.city ? `${clinicProfile.address}, ${clinicProfile.city}` : clinicProfile.address
                            )
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 transition-colors"
                          title="Send WhatsApp appointment schedule reminder"
                        >
                          <MessageSquare className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Send Reminder</span>
                        </a>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal New SOAP Note Sub-Modal */}
        {isAddNoteOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-60 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900">Add Clinical SOAP Note</h3>
                <button type="button" onClick={() => setIsAddNoteOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onSubmit={handleSaveNote} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subjective (Symptoms, Pain level, Complaint):</label>
                  <textarea required rows={2} value={noteSubjective} onChange={e => setNoteSubjective(e.target.value)} placeholder="e.g. Sensitivity to sweet foods" className="w-full text-xs p-2 rounded-xl border border-slate-200" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Objective (Clinical exam, Cold test, Percussion, X-ray):</label>
                  <textarea required rows={2} value={noteObjective} onChange={e => setNoteObjective(e.target.value)} placeholder="e.g. Cavitation observed on tooth 16 disto-occlusal" className="w-full text-xs p-2 rounded-xl border border-slate-200" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assessment (Diagnosis):</label>
                  <input required type="text" value={noteAssessment} onChange={e => setNoteAssessment(e.target.value)} placeholder="e.g. Class II Dentine Caries" className="w-full text-xs p-2 rounded-xl border border-slate-200" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Plan (Treatment performed / Next visits):</label>
                  <textarea required rows={2} value={notePlan} onChange={e => setNotePlan(e.target.value)} placeholder="e.g. Composite restoration done under rubber dam" className="w-full text-xs p-2 rounded-xl border border-slate-200" />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => setIsAddNoteOpen(false)} className="px-3 py-1.5 text-xs text-slate-600 cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-[#004884] hover:bg-sky-700 text-white rounded-xl cursor-pointer">Save Note</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal New Rx Sub-Modal */}
        {isAddRxOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-60 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900">Write Dental Prescription (Rx)</h3>
                <button type="button" onClick={() => setIsAddRxOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onSubmit={handleSaveRx} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Diagnosis / Indication:</label>
                  <input required type="text" value={rxDiagnosis} onChange={e => setRxDiagnosis(e.target.value)} placeholder="e.g. Acute Periapical Abscess / Post Extraction" className="w-full text-xs p-2 rounded-xl border border-slate-200" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Prescribed Medications:</span>
                  {rxMeds.map((m, i) => (
                    <div key={i} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
                      <div className="flex gap-2">
                        <input type="text" value={m.name} onChange={e => { const updated = [...rxMeds]; updated[i].name = e.target.value; setRxMeds(updated); }} placeholder="Medication name" className="flex-1 p-1.5 rounded-lg border border-slate-200 bg-white" />
                        <input type="text" value={m.dosage} onChange={e => { const updated = [...rxMeds]; updated[i].dosage = e.target.value; setRxMeds(updated); }} placeholder="Dosage" className="w-24 p-1.5 rounded-lg border border-slate-200 bg-white" />
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={m.frequency} onChange={e => { const updated = [...rxMeds]; updated[i].frequency = e.target.value; setRxMeds(updated); }} placeholder="Frequency" className="flex-1 p-1.5 rounded-lg border border-slate-200 bg-white" />
                        <input type="text" value={m.duration} onChange={e => { const updated = [...rxMeds]; updated[i].duration = e.target.value; setRxMeds(updated); }} placeholder="Duration" className="w-24 p-1.5 rounded-lg border border-slate-200 bg-white" />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Special Advice / Instructions:</label>
                  <textarea rows={2} value={rxAdvice} onChange={e => setRxAdvice(e.target.value)} className="w-full text-xs p-2 rounded-xl border border-slate-200" />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => setIsAddRxOpen(false)} className="px-3 py-1.5 text-xs text-slate-600 cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-[#004884] hover:bg-sky-700 text-white rounded-xl cursor-pointer">Generate Rx</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Log New Clinical Sitting for This Patient */}
        {isAddVisitOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-60 flex items-center justify-center p-3 sm:p-5">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-sky-50 text-[#004884]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Log Clinical Sitting for {patient.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Record procedures done in chair, teeth treated, and payments collected.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddVisitOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVisit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Sitting Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={visitDate}
                      onChange={e => setVisitDate(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Sitting Time
                    </label>
                    <input
                      type="time"
                      value={visitTime}
                      onChange={e => setVisitTime(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Sitting Type *
                    </label>
                    <select
                      value={visitType}
                      onChange={e => setVisitType(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-bold"
                    >
                      <option value="Treatment Sitting">Treatment Sitting</option>
                      <option value="Routine Consultation">Routine Consultation</option>
                      <option value="Emergency / Pain">Emergency / Pain</option>
                      <option value="Post-Op Review">Post-Op Review</option>
                      <option value="Recall / Maintenance">Recall / Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Attending Clinician *
                    </label>
                    <select
                      value={visitDoctor}
                      onChange={e => setVisitDoctor(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                    >
                      <option value={clinicProfile.doctorName}>{clinicProfile.doctorName}</option>
                      <option value="Dr. S. Anand (Oral & Maxillofacial Surgeon)">Dr. S. Anand (Oral Surgeon)</option>
                      <option value="Dr. R. Vignesh (Orthodontist)">Dr. R. Vignesh (Orthodontist)</option>
                      <option value="Dr. M. Deepa (Endodontist)">Dr. M. Deepa (Endodontist)</option>
                      <option value="Dr. K. Praveen (Pedodontist)">Dr. K. Praveen (Pedodontist)</option>
                      <option value="Dr. J. Suresh (Periodontist)">Dr. J. Suresh (Periodontist)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Dental Operatory
                    </label>
                    <input
                      type="text"
                      value={visitChair}
                      onChange={e => setVisitChair(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                {/* Complaint */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Chief Complaint / Reason for Sitting *
                  </label>
                  <input
                    type="text"
                    required
                    value={visitComplaint}
                    onChange={e => setVisitComplaint(e.target.value)}
                    placeholder="e.g. Sensitivity in tooth 16, Pain when chewing"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                {/* Teeth Treated & Diagnosis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Teeth Treated (FDI e.g. 16, 26, 48)
                    </label>
                    <input
                      type="text"
                      value={visitTeeth}
                      onChange={e => setVisitTeeth(e.target.value)}
                      placeholder="e.g. 16, 48 or Full Mouth"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Clinical Diagnosis
                    </label>
                    <input
                      type="text"
                      value={visitDiagnosis}
                      onChange={e => setVisitDiagnosis(e.target.value)}
                      placeholder="e.g. Class II Dentine Caries #16"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                {/* Procedures Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Procedures Performed in Chair
                  </label>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-32 overflow-y-auto space-y-1">
                    {procedures.map(p => {
                      const isChecked = visitProcs.includes(p.name);
                      return (
                        <label key={p.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-white p-1 rounded-lg">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => {
                              if (e.target.checked) {
                                setVisitProcs(prev => [...prev, p.name]);
                              } else {
                                setVisitProcs(prev => prev.filter(name => name !== p.name));
                              }
                            }}
                            className="rounded text-[#004884]"
                          />
                          <span className="font-medium">[{p.code}] {p.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Treatment Notes */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Clinical Treatment Summary & Observations
                  </label>
                  <textarea
                    rows={2}
                    value={visitSummary}
                    onChange={e => setVisitSummary(e.target.value)}
                    placeholder="e.g. Decay excavated, etching & bonding done, packable composite placed in increments."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                {/* Financials */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Fee (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={visitFee}
                      onChange={e => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setVisitFee(val);
                        if (visitPaid === '') setVisitPaid(val);
                      }}
                      placeholder="e.g. 1500"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Paid (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={visitPaid}
                      onChange={e => setVisitPaid(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 1500"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-bold bg-white text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mode</label>
                    <select
                      value={visitPaymentMode}
                      onChange={e => setVisitPaymentMode(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-bold"
                    >
                      <option value="UPI / QR">UPI / QR (GPay)</option>
                      <option value="Cash">Cash Counter</option>
                      <option value="Card">Card</option>
                      <option value="Bank Transfer">Bank Wire</option>
                      <option value="None">None / Due</option>
                    </select>
                  </div>
                </div>

                {/* Next Sitting Plan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Next Sitting Date
                    </label>
                    <input
                      type="date"
                      value={visitNextDate}
                      onChange={e => setVisitNextDate(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Next Sitting Plan
                    </label>
                    <input
                      type="text"
                      value={visitNextPlan}
                      onChange={e => setVisitNextPlan(e.target.value)}
                      placeholder="e.g. Suture removal, crown trial"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddVisitOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-[#004884] hover:bg-sky-700 text-white rounded-xl shadow-xs cursor-pointer"
                  >
                    Save Sitting Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Official Printable Patient Case History Sheet */}
        {isPrintCaseSheetOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-60 flex items-center justify-center p-3 sm:p-5">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
                <h3 className="font-extrabold text-sm text-slate-800">
                  Official Patient Case History Sheet Preview
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#004884] hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Print Case Sheet
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPrintCaseSheetOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Content */}
              <div className="space-y-6 print:p-0">
                {/* Clinic Header */}
                <div className="flex items-start justify-between border-b-2 border-[#004884] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white border border-slate-200 rounded-xl p-1 flex items-center justify-center shrink-0">
                      <img src={logoIcon} alt="Smile7 Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h1 className="text-xl font-black text-slate-900 leading-tight">
                        {clinicProfile.clinicName}
                      </h1>
                      <p className="text-xs text-[#004884] font-bold">
                        {clinicProfile.doctorName} • {clinicProfile.doctorQualification}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {clinicProfile.dentalCouncil} • {clinicProfile.address}, {clinicProfile.city}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Phone: {clinicProfile.phone} • Email: {clinicProfile.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-sky-50 text-[#004884] font-black text-xs border border-sky-200 uppercase tracking-wider block">
                      Case History Sheet
                    </span>
                    <span className="text-xs text-slate-400 block mt-1 font-mono">
                      Date: {formatIndianDate(new Date().toISOString().split('T')[0])}
                    </span>
                  </div>
                </div>

                {/* Patient Information Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient Name</span>
                    <strong className="text-slate-900 font-black text-sm">{patient.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient ID / Age</span>
                    <span className="text-slate-800 font-bold">{patient.patientId} • {patient.age} Yrs ({patient.gender})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Mobile Phone</span>
                    <span className="text-slate-800 font-mono font-bold">{patient.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Blood Group</span>
                    <span className="text-slate-800 font-bold">{patient.bloodGroup || 'N/A'}</span>
                  </div>
                  {patient.medicalAlerts.length > 0 && (
                    <div className="col-span-2 sm:col-span-4 pt-2 border-t border-slate-200 text-rose-700 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Medical Caution: {patient.medicalAlerts.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Sittings Table */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1">
                    Clinical Sittings & Treatment Log ({patientVisits.length} Visits)
                  </h4>

                  <div className="space-y-3">
                    {patientVisits.map((v) => (
                      <div key={v.id} className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5 text-xs">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-[#004884] text-white font-black text-[10px]">
                              Sitting #{v.visitNumber}
                            </span>
                            <span className="font-bold text-slate-800">{formatIndianDate(v.date)}</span>
                            <span className="text-slate-500">• {v.visitType}</span>
                          </div>
                          <span className="font-bold text-slate-700">{v.doctor}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <strong className="text-slate-600 block text-[11px]">Chief Complaint:</strong>
                            <span className="text-slate-900">{v.chiefComplaint}</span>
                          </div>
                          {v.clinicalDiagnosis && (
                            <div>
                              <strong className="text-slate-600 block text-[11px]">Diagnosis & Teeth:</strong>
                              <span className="text-[#004884] font-bold">
                                {v.clinicalDiagnosis} {v.teethTreated.length > 0 ? `(${v.teethTreated.join(', ')})` : ''}
                              </span>
                            </div>
                          )}
                        </div>

                        <div>
                          <strong className="text-slate-600 block text-[11px]">Procedures Done:</strong>
                          <span className="text-slate-900">{v.proceduresDone.join(' • ')}</span>
                        </div>

                        {v.treatmentSummary && (
                          <div>
                            <strong className="text-slate-600 block text-[11px]">Clinical Notes:</strong>
                            <span className="text-slate-700 italic">{v.treatmentSummary}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[11px]">
                          <span>Fee: <strong>{formatINR(v.feeCharged)}</strong> • Settled: <strong>{formatINR(v.amountPaid)}</strong></span>
                          {v.nextVisitDate && (
                            <span className="text-amber-800 font-bold">Next Recall: {formatIndianDate(v.nextVisitDate)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Doctor Signature */}
                <div className="pt-8 flex items-end justify-between border-t border-slate-200">
                  <div className="text-[11px] text-slate-400">
                    <p>Certified clinical dental record • Smile7 Dental Clinic</p>
                    <p>Appointment helpline: {clinicProfile.phone}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="w-40 border-b border-slate-400 pb-8"></div>
                    <p className="font-bold text-xs text-slate-800">{clinicProfile.doctorName}</p>
                    <p className="text-[10px] text-slate-500">{clinicProfile.dentalCouncil}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Delete Patient Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-base text-slate-900">
                    Delete Patient Record?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Are you sure you want to permanently delete <strong className="text-slate-800">{patient.name}</strong> ({patient.patientId})?
                  </p>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900">
                <p className="font-bold">⚠️ Irreversible Clinical Action:</p>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  This will permanently delete this patient's full dossier, odontogram tooth charting, SOAP clinical notes, prescriptions, and billing receipts.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deletePatient(patient.id);
                    setShowDeleteConfirm(false);
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Record</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

