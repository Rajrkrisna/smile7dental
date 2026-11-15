import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  History, 
  Calendar, 
  Users, 
  Stethoscope, 
  Activity, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  Printer, 
  Trash2, 
  ChevronRight, 
  CheckCircle2, 
  Clock,
  AlertTriangle, 
  FileText, 
  Pill, 
  DollarSign, 
  X, 
  Check,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { formatINR, formatIndianDate, formatTimeAMPM } from '../../utils/currency';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import type { PatientVisit, VisitType } from '../../types';
import logoIcon from '../../assets/smile7-logo-icon.png';

interface VisitHistoryViewProps {
  onSelectPatient?: (patientId: string) => void;
  onOpenNewInvoice?: (patientId: string) => void;
}

export const VisitHistoryView: React.FC<VisitHistoryViewProps> = ({
  onSelectPatient,
  onOpenNewInvoice
}) => {
  const { 
    clinicProfile, 
    patients, 
    patientVisits, 
    addPatientVisit, 
    updatePatientVisit, 
    deletePatientVisit,
    procedures
  } = useClinic();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDoctor, setFilterDoctor] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modal States
  const [isLogVisitOpen, setIsLogVisitOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<PatientVisit | null>(null);
  const [printVisit, setPrintVisit] = useState<PatientVisit | null>(null);
  const [printAllVisitsPatientId, setPrintAllVisitsPatientId] = useState<string | null>(null);
  const [visitToDelete, setVisitToDelete] = useState<PatientVisit | null>(null);

  // New/Edit Visit Form State
  const [vPatientId, setVPatientId] = useState(patients[0]?.id || '');
  const [vDate, setVDate] = useState(new Date().toISOString().split('T')[0]);
  const [vTime, setVTime] = useState('10:00');
  const [vType, setVType] = useState<VisitType>('Treatment Sitting');
  const [vComplaint, setVComplaint] = useState('');
  const [vDoctor, setVDoctor] = useState(clinicProfile.doctorName);
  const [vChair, setVChair] = useState('Dental Chair (Operatory 1)');
  const [vSelectedProcs, setVSelectedProcs] = useState<string[]>([]);
  const [vTeeth, setVTeeth] = useState('');
  const [vDiagnosis, setVDiagnosis] = useState('');
  const [vSummary, setVSummary] = useState('');
  const [vRx, setVRx] = useState('');
  const [vFee, setVFee] = useState<number | ''>('');
  const [vPaid, setVPaid] = useState<number | ''>('');
  const [vPaymentMode, setVPaymentMode] = useState<'UPI / QR' | 'Cash' | 'Card' | 'Bank Transfer' | 'None'>('UPI / QR');
  const [vNextDate, setVNextDate] = useState('');
  const [vNextPlan, setVNextPlan] = useState('');
  const [vStatus, setVStatus] = useState<'Completed' | 'In-Progress' | 'Follow-up Due'>('Completed');

  // Quick chips for chief complaints
  const COMMON_COMPLAINTS = [
    'Toothache / Pulpitis Pain',
    'Sensitivity to Hot/Cold',
    'Cavity / Broken Filling',
    'Root Canal Treatment Sitting',
    'Crown Trial & Cementation',
    'Routine Teeth Scaling & Polishing',
    'Bleeding Gums & Flap Review',
    'Wisdom Tooth Impaction Pain',
    'Orthodontic Wire Adjustment',
    'Implant Review / Healing Stage'
  ];

  // Doctors list
  const DOCTORS_LIST = [
    clinicProfile.doctorName,
    'Dr. S. Anand (Oral & Maxillofacial Surgeon)',
    'Dr. R. Vignesh (Orthodontist)',
    'Dr. M. Deepa (Endodontist)',
    'Dr. K. Praveen (Pedodontist)',
    'Dr. J. Suresh (Periodontist)'
  ];

  const openLogVisitModal = (preselectedPatientId?: string) => {
    const targetPatient = preselectedPatientId 
      ? patients.find(p => p.id === preselectedPatientId) 
      : patients[0];

    setEditingVisit(null);
    setVPatientId(targetPatient?.id || '');
    setVDate(new Date().toISOString().split('T')[0]);
    setVTime(new Date().toTimeString().slice(0, 5));
    setVType('Treatment Sitting');
    setVComplaint(targetPatient?.chiefComplaint || '');
    setVDoctor(clinicProfile.doctorName);
    setVChair('Dental Chair (Operatory 1)');
    setVSelectedProcs([]);
    setVTeeth('');
    setVDiagnosis('');
    setVSummary('');
    setVRx('');
    setVFee('');
    setVPaid('');
    setVPaymentMode('UPI / QR');
    setVNextDate('');
    setVNextPlan('');
    setVStatus('Completed');
    setIsLogVisitOpen(true);
  };

  const openEditVisitModal = (visit: PatientVisit) => {
    setEditingVisit(visit);
    setVPatientId(visit.patientId);
    setVDate(visit.date);
    setVTime(visit.time || '10:00');
    setVType(visit.visitType);
    setVComplaint(visit.chiefComplaint);
    setVDoctor(visit.doctor);
    setVChair(visit.chair);
    setVSelectedProcs(visit.proceduresDone);
    setVTeeth(visit.teethTreated.join(', '));
    setVDiagnosis(visit.clinicalDiagnosis || '');
    setVSummary(visit.treatmentSummary || '');
    setVRx((visit.prescriptionsIssued || []).join('\n'));
    setVFee(visit.feeCharged);
    setVPaid(visit.amountPaid);
    setVPaymentMode(visit.paymentMode);
    setVNextDate(visit.nextVisitDate || '');
    setVNextPlan(visit.nextVisitPlan || '');
    setVStatus(visit.status);
    setIsLogVisitOpen(true);
  };

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === vPatientId);
    if (!patient) {
      alert('Please select a patient.');
      return;
    }

    if (!vComplaint.trim()) {
      alert('Please enter reason for visit / chief complaint.');
      return;
    }

    const teethArray = vTeeth
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const rxArray = vRx
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean);

    const fee = typeof vFee === 'number' ? vFee : 0;
    const paid = typeof vPaid === 'number' ? vPaid : fee;

    if (editingVisit) {
      updatePatientVisit({
        ...editingVisit,
        patientId: patient.id,
        patientName: patient.name,
        patientPhone: patient.phone,
        date: vDate,
        time: vTime,
        visitType: vType,
        chiefComplaint: vComplaint.trim(),
        doctor: vDoctor,
        chair: vChair,
        proceduresDone: vSelectedProcs.length > 0 ? vSelectedProcs : ['Clinical Examination & Dental Consultation'],
        teethTreated: teethArray,
        clinicalDiagnosis: vDiagnosis.trim() || undefined,
        treatmentSummary: vSummary.trim() || undefined,
        prescriptionsIssued: rxArray.length > 0 ? rxArray : undefined,
        feeCharged: fee,
        amountPaid: paid,
        paymentMode: vPaymentMode,
        nextVisitDate: vNextDate || undefined,
        nextVisitPlan: vNextPlan.trim() || undefined,
        status: vStatus
      });
    } else {
      addPatientVisit({
        patientId: patient.id,
        patientName: patient.name,
        patientPhone: patient.phone,
        date: vDate,
        time: vTime,
        visitType: vType,
        chiefComplaint: vComplaint.trim(),
        doctor: vDoctor,
        chair: vChair,
        proceduresDone: vSelectedProcs.length > 0 ? vSelectedProcs : ['Clinical Examination & Dental Consultation'],
        teethTreated: teethArray,
        clinicalDiagnosis: vDiagnosis.trim() || undefined,
        treatmentSummary: vSummary.trim() || undefined,
        prescriptionsIssued: rxArray.length > 0 ? rxArray : undefined,
        feeCharged: fee,
        amountPaid: paid,
        paymentMode: vPaymentMode,
        nextVisitDate: vNextDate || undefined,
        nextVisitPlan: vNextPlan.trim() || undefined,
        status: vStatus
      });
    }

    setIsLogVisitOpen(false);
  };

  // Filtered & Sorted Visits
  const filteredVisits = patientVisits.filter(v => {
    const matchesSearch = 
      v.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.patientPhone.includes(searchQuery) ||
      v.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.proceduresDone.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      v.teethTreated.some(t => t.includes(searchQuery));

    if (!matchesSearch) return false;
    if (filterType !== 'all' && v.visitType !== filterType) return false;
    if (filterDoctor !== 'all' && v.doctor !== filterDoctor) return false;

    return true;
  }).sort((a, b) => {
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return sortOrder === 'desc' ? diff : -diff;
  });

  // KPI Calculations
  const totalVisitsCount = patientVisits.length;
  const uniquePatientsVisited = new Set(patientVisits.map(v => v.patientId)).size;
  const totalBilled = patientVisits.reduce((acc, v) => acc + v.feeCharged, 0);
  const totalCollected = patientVisits.reduce((acc, v) => acc + v.amountPaid, 0);

  // Group visits for "Print All Case History for Patient"
  const printPatientData = printAllVisitsPatientId ? patients.find(p => p.id === printAllVisitsPatientId) : null;
  const patientVisitsForPrint = printAllVisitsPatientId 
    ? patientVisits.filter(v => v.patientId === printAllVisitsPatientId).sort((a, b) => a.visitNumber - b.visitNumber)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner with Signature Smile7 Gradient Blue */}
      <div className="bg-gradient-to-r from-[#002244] via-[#004884] to-[#0284c7] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-sky-300 font-bold text-xs uppercase tracking-wider block">
            Clinical Practice Ledgers
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-1 flex items-center gap-2.5">
            <History className="w-6 h-6 text-sky-200" />
            <span>Patient Visit History & Sittings</span>
          </h2>
          <p className="text-sky-100/90 text-xs mt-1.5 max-w-xl">
            Complete chronological treatment records of every patient sitting, procedures performed, teeth treated, medicines given, and fees settled at Smile7 Dental Clinic.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => openLogVisitModal()}
            className="px-4 py-2.5 bg-white text-[#004884] font-bold text-xs rounded-xl shadow-xs hover:bg-sky-50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#004884]" />
            Log Visit Sitting
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sittings Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Total Sittings Done</span>
            <div className="p-2 rounded-xl bg-sky-50 text-[#004884]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {totalVisitsCount}
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Clinical chair appointments
          </p>
        </div>

        {/* Unique Patients Treated */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Patients Treated</span>
            <div className="p-2 rounded-xl bg-sky-50 text-[#004884]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {uniquePatientsVisited}
          </p>
          <p className="text-[11px] text-blue-600 font-medium">
            Across active dossiers
          </p>
        </div>

        {/* Total Sitting Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Sitting Collections</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {formatINR(totalCollected)}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">
            Total fees settled
          </p>
        </div>

        {/* Operating Operatory */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Operatory Unit</span>
            <div className="p-2 rounded-xl bg-sky-50 text-[#004884]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base font-black text-slate-900 tracking-tight truncate">
            Dental Chair 1
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Maduravoyal Clinic
          </p>
        </div>
      </div>

      {/* Search, Filter & Sorter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Patient Name, Phone, Procedure, Tooth (#16), or Diagnosis..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004884]/20 focus:border-[#004884]"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Visit Type Filter */}
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="all">All Visit Types</option>
              <option value="Routine Consultation">Routine Consultation</option>
              <option value="Treatment Sitting">Treatment Sitting</option>
              <option value="Emergency / Pain">Emergency / Pain</option>
              <option value="Post-Op Review">Post-Op Review</option>
              <option value="Recall / Maintenance">Recall / Maintenance</option>
            </select>

            {/* Doctor Filter */}
            <select
              value={filterDoctor}
              onChange={e => setFilterDoctor(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 bg-white font-medium max-w-[180px] truncate"
            >
              <option value="all">All Attending Doctors</option>
              {DOCTORS_LIST.map((doc, i) => (
                <option key={i} value={doc}>{doc}</option>
              ))}
            </select>

            {/* Sort Order Toggle */}
            <button
              type="button"
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle date order"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Showing <strong>{filteredVisits.length}</strong> patient sitting records</span>
          {(searchQuery || filterType !== 'all' || filterDoctor !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterDoctor('all');
              }}
              className="text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Visits List / Cards */}
      <div className="space-y-4">
        {filteredVisits.map(visit => {
          return (
            <div
              key={visit.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all space-y-4"
            >
              {/* Header: Sitting #, Patient Info, Visit Type, Date */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#004884] to-[#0284c7] text-white flex flex-col items-center justify-center shrink-0 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider leading-none">Visit</span>
                    <span className="text-base font-black leading-none mt-0.5">#{visit.visitNumber}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => onSelectPatient && onSelectPatient(visit.patientId)}
                        className="font-extrabold text-base text-slate-900 hover:text-[#004884] transition-colors cursor-pointer text-left"
                      >
                        {visit.patientName}
                      </button>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {visit.patientPhone}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#004884] border border-sky-200">
                        {visit.visitType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#004884]" />
                        {formatIndianDate(visit.date)} {visit.time ? `• ${formatTimeAMPM(visit.time)}` : ''}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                        {visit.doctor}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Right Actions: Print Case Sheet, WhatsApp, Edit, Delete */}
                <div className="flex items-center gap-2 self-end sm:self-start">
                  <button
                    type="button"
                    onClick={() => setPrintVisit(visit)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Print single visit sitting slip"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrintAllVisitsPatientId(visit.patientId)}
                    className="px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#004884] font-bold text-xs border border-sky-200 transition-colors cursor-pointer flex items-center gap-1"
                    title="Print complete patient case history"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Case Sheet</span>
                  </button>

                  <a
                    href={getWhatsAppUrl(
                      visit.patientPhone,
                      `Hello ${visit.patientName},

This is Smile7 Dental Clinic (Dr. P. Manickapriya).
Summary of your dental sitting on ${formatIndianDate(visit.date)}:
- Sitting: #${visit.visitNumber} (${visit.visitType})
- Procedures Done: ${visit.proceduresDone.join(', ')}
${visit.teethTreated.length > 0 ? `- Teeth: ${visit.teethTreated.join(', ')}` : ''}
${visit.nextVisitDate ? `- Next Recall Sitting: ${formatIndianDate(visit.nextVisitDate)}` : ''}
- Fee Settled: ${formatINR(visit.amountPaid)}

Thank you for your visit! Call +91 97908 62510 for any questions.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                    title="Send visit update on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => openEditVisitModal(visit)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Edit visit record"
                  >
                    <Activity className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisitToDelete(visit)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Delete visit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body: Chief Complaint & Diagnosis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Chief Complaint / Symptoms
                  </span>
                  <p className="font-bold text-slate-800">
                    {visit.chiefComplaint}
                  </p>
                </div>

                {visit.clinicalDiagnosis ? (
                  <div className="p-3 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#004884] tracking-wider block">
                      Clinical Diagnosis & Teeth Treated
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900">{visit.clinicalDiagnosis}</span>
                      {visit.teethTreated.map((tooth, idx) => (
                        <span key={idx} className="bg-[#004884] text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                          Tooth #{tooth}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Teeth Treated
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {visit.teethTreated.length > 0 ? (
                        visit.teethTreated.map((tooth, idx) => (
                          <span key={idx} className="bg-sky-100 text-[#004884] px-2 py-0.5 rounded-md text-[10px] font-bold">
                            Tooth #{tooth}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-xs">Full Mouth / General</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Procedures Performed List */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  Procedures Performed in Chair
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {visit.proceduresDone.map((proc, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{proc}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Treatment Summary / Clinical Observations */}
              {visit.treatmentSummary && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                    Clinical Treatment Summary & Observations
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {visit.treatmentSummary}
                  </p>
                </div>
              )}

              {/* Prescriptions Given */}
              {visit.prescriptionsIssued && visit.prescriptionsIssued.length > 0 && (
                <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 text-xs space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                    <Pill className="w-3 h-3 text-emerald-600" />
                    <span>Prescriptions (Rx) Issued on this Visit</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {visit.prescriptionsIssued.map((med, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-bold text-[11px]">
                        {med}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer: Financials & Next Sitting */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                {/* Financial status */}
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Sitting Fee</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {formatINR(visit.feeCharged)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Settled</span>
                    <span className="font-black text-emerald-700 text-sm">
                      {formatINR(visit.amountPaid)}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Mode: {visit.paymentMode}
                  </span>
                </div>

                {/* Next Sitting Plan */}
                {visit.nextVisitDate && (
                  <div className="p-2 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <div>
                      <span className="font-bold text-[11px] block">
                        Next Sitting: {formatIndianDate(visit.nextVisitDate)}
                      </span>
                      {visit.nextVisitPlan && (
                        <span className="text-[10px] text-amber-800 block">
                          Plan: {visit.nextVisitPlan}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredVisits.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 space-y-3">
            <History className="w-12 h-12 mx-auto text-slate-300" />
            <h4 className="font-extrabold text-sm text-slate-700">No Patient Visits Found</h4>
            <p className="text-xs max-w-sm mx-auto">
              No clinical visit records match your filters. Click "Log Visit Sitting" to record a new patient sitting.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: LOG OR EDIT VISIT SITTING */}
      {/* ========================================================================= */}
      {isLogVisitOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-50 text-[#004884]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {editingVisit ? `Edit Patient Sitting #${editingVisit.visitNumber}` : 'Log Patient Visit Sitting'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Record clinical treatment, teeth worked on, doctor notes, and fee collected.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLogVisitOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVisit} className="space-y-4">
              {/* Patient Selection & Visit Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Select Patient *
                  </label>
                  <select
                    value={vPatientId}
                    onChange={e => {
                      setVPatientId(e.target.value);
                      const pat = patients.find(p => p.id === e.target.value);
                      if (pat?.chiefComplaint && !vComplaint) {
                        setVComplaint(pat.chiefComplaint);
                      }
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-bold"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.patientId} - {p.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Visit Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={vDate}
                    onChange={e => setVDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              {/* Attending Doctor, Visit Type & Chair */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Attending Doctor *
                  </label>
                  <select
                    value={vDoctor}
                    onChange={e => setVDoctor(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    {DOCTORS_LIST.map((doc, i) => (
                      <option key={i} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Visit Type *
                  </label>
                  <select
                    value={vType}
                    onChange={e => setVType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-bold"
                  >
                    <option value="Routine Consultation">Routine Consultation</option>
                    <option value="Treatment Sitting">Treatment Sitting</option>
                    <option value="Emergency / Pain">Emergency / Pain</option>
                    <option value="Post-Op Review">Post-Op Review</option>
                    <option value="Recall / Maintenance">Recall / Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Operatory Chair
                  </label>
                  <input
                    type="text"
                    value={vChair}
                    onChange={e => setVChair(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Chief Complaint & Quick Chips */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Chief Complaint / Reason for Visit *
                </label>
                <input
                  type="text"
                  required
                  value={vComplaint}
                  onChange={e => setVComplaint(e.target.value)}
                  placeholder="e.g. Sensitivity in upper right back tooth, pain when chewing"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {COMMON_COMPLAINTS.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setVComplaint(chip)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#004884] border border-sky-200 cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teeth Worked On & Clinical Diagnosis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tooth Number(s) Treated (FDI notation)
                  </label>
                  <input
                    type="text"
                    value={vTeeth}
                    onChange={e => setVTeeth(e.target.value)}
                    placeholder="e.g. 16, 26, 48 or Full Mouth"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Separate multiple teeth with comma</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Clinical Diagnosis
                  </label>
                  <input
                    type="text"
                    value={vDiagnosis}
                    onChange={e => setVDiagnosis(e.target.value)}
                    placeholder="e.g. Class II Dentine Caries #16"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Procedures Done (Quick selection) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Procedures Performed in this Sitting
                </label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-36 overflow-y-auto space-y-1">
                  {procedures.map(p => {
                    const isChecked = vSelectedProcs.includes(p.name);
                    return (
                      <label key={p.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-white p-1 rounded-lg">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setVSelectedProcs(prev => [...prev, p.name]);
                            } else {
                              setVSelectedProcs(prev => prev.filter(name => name !== p.name));
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

              {/* Treatment Summary & Clinical Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Treatment Summary & Clinical Notes
                </label>
                <textarea
                  rows={2}
                  value={vSummary}
                  onChange={e => setVSummary(e.target.value)}
                  placeholder="e.g. Decay excavated under rubber dam isolation. Light cure composite placed in increments, occlusion adjusted."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              {/* Prescriptions Issued */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Prescriptions Issued (One line per medicine)
                </label>
                <textarea
                  rows={2}
                  value={vRx}
                  onChange={e => setVRx(e.target.value)}
                  placeholder="e.g. Tab. Combiflam (400mg) - 1-0-1 x 3 Days&#10;Hexidine Mouthwash - Twice daily"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono text-[11px]"
                />
              </div>

              {/* Financials & Payment */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Sitting Fee (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={vFee}
                    onChange={e => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setVFee(val);
                      if (vPaid === '') setVPaid(val);
                    }}
                    placeholder="e.g. 1500"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Amount Collected (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={vPaid}
                    onChange={e => setVPaid(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 1500"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold bg-white text-emerald-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={vPaymentMode}
                    onChange={e => setVPaymentMode(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="UPI / QR">UPI / QR (GPay / PhonePe)</option>
                    <option value="Cash">Cash Counter</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Bank Transfer">Bank Wire / IMPS</option>
                    <option value="None">None / Due Later</option>
                  </select>
                </div>
              </div>

              {/* Next Sitting Plan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Next Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={vNextDate}
                    onChange={e => setVNextDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Next Sitting Treatment Plan
                  </label>
                  <input
                    type="text"
                    value={vNextPlan}
                    onChange={e => setVNextPlan(e.target.value)}
                    placeholder="e.g. Suture removal, crown preparation"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogVisitOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-[#004884] hover:bg-sky-700 text-white rounded-xl shadow-xs shadow-[#004884]/20 cursor-pointer"
                >
                  {editingVisit ? 'Update Sitting Record' : 'Save Visit Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRINT OFFICIAL PATIENT CASE HISTORY SHEET */}
      {/* ========================================================================= */}
      {(printVisit || (printAllVisitsPatientId && printPatientData)) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <h3 className="font-extrabold text-sm text-slate-800">
                Patient Case History Sheet Preview
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
                  onClick={() => {
                    setPrintVisit(null);
                    setPrintAllVisitsPatientId(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Area */}
            <div className="space-y-6 print:p-0">
              {/* Header */}
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
                    Patient Case History
                  </span>
                  <span className="text-xs text-slate-400 block mt-1 font-mono">
                    Printed: {formatIndianDate(new Date().toISOString().split('T')[0])}
                  </span>
                </div>
              </div>

              {/* Patient Demographics Box */}
              {(() => {
                const pat = printPatientData || patients.find(p => p.id === printVisit?.patientId);
                if (!pat) return null;
                return (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient Name</span>
                      <strong className="text-slate-900 font-black text-sm">{pat.name}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient ID / Age</span>
                      <span className="text-slate-800 font-bold">{pat.patientId} • {pat.age} Yrs ({pat.gender})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Mobile Phone</span>
                      <span className="text-slate-800 font-mono font-bold">{pat.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Blood Group</span>
                      <span className="text-slate-800 font-bold">{pat.bloodGroup || 'N/A'}</span>
                    </div>
                    {pat.medicalAlerts.length > 0 && (
                      <div className="col-span-2 sm:col-span-4 pt-2 border-t border-slate-200 text-rose-700 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Medical Caution: {pat.medicalAlerts.join(', ')}</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Sittings Table */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1">
                  Chronological Sittings & Treatment Log
                </h4>

                <div className="space-y-4">
                  {(printVisit ? [printVisit] : patientVisitsForPrint).map((v) => (
                    <div key={v.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#004884] text-white font-black text-[11px]">
                            Sitting #{v.visitNumber}
                          </span>
                          <span className="font-bold text-slate-800">{formatIndianDate(v.date)} {v.time ? `(${formatTimeAMPM(v.time)})` : ''}</span>
                          <span className="text-slate-500 font-medium">• {v.visitType}</span>
                        </div>
                        <span className="font-bold text-slate-700">Dr. {v.doctor.replace('Dr. ', '')}</span>
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
                        <strong className="text-slate-600 block text-[11px]">Procedures Performed:</strong>
                        <span className="text-slate-900 font-medium">{v.proceduresDone.join(' • ')}</span>
                      </div>

                      {v.treatmentSummary && (
                        <div>
                          <strong className="text-slate-600 block text-[11px]">Clinical Notes:</strong>
                          <span className="text-slate-700 italic">{v.treatmentSummary}</span>
                        </div>
                      )}

                      {v.prescriptionsIssued && v.prescriptionsIssued.length > 0 && (
                        <div>
                          <strong className="text-emerald-700 block text-[11px]">Prescription (Rx):</strong>
                          <span className="text-emerald-900">{v.prescriptionsIssued.join(', ')}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                        <span>Fee Charged: <strong>{formatINR(v.feeCharged)}</strong> • Settled: <strong>{formatINR(v.amountPaid)}</strong> ({v.paymentMode})</span>
                        {v.nextVisitDate && (
                          <span className="text-amber-800 font-bold">
                            Next Recall: {formatIndianDate(v.nextVisitDate)} {v.nextVisitPlan ? `(${v.nextVisitPlan})` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor Signature */}
              <div className="pt-8 flex items-end justify-between border-t border-slate-200">
                <div className="text-[11px] text-slate-400">
                  <p>Certified clinical dental case record • Smile7 Dental Clinic</p>
                  <p>For emergencies or appointment rescheduling, contact: {clinicProfile.phone}</p>
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

      {/* Delete Confirmation Modal */}
      {visitToDelete && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-base text-slate-900">
                  Delete Sitting Record?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to delete <strong>Sitting #{visitToDelete.visitNumber}</strong> for {visitToDelete.patientName} on {formatIndianDate(visitToDelete.date)}? This action is irreversible.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setVisitToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePatientVisit(visitToDelete.id);
                  setVisitToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs shadow-rose-600/20 cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

