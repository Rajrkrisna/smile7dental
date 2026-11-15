import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle, 
  Phone, 
  Activity, 
  ChevronRight, 
  DollarSign,
  MessageSquare,
  Trash2,
  Clock,
  MapPin
} from 'lucide-react';
import { getWhatsAppUrl } from '../../utils/whatsapp';

interface PatientDirectoryProps {
  onOpenNewPatient: () => void;
  onSelectPatient: (patientId: string) => void;
  onOpenNewInvoiceForPatient: (patientId: string) => void;
}

export const PatientDirectory: React.FC<PatientDirectoryProps> = ({
  onOpenNewPatient,
  onSelectPatient,
  onOpenNewInvoiceForPatient
}) => {
  const { patients, clinicProfile, deletePatient, getVisitsByPatient } = useClinic();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAlertOnly, setFilterAlertOnly] = useState(false);
  const [filterBalanceOnly, setFilterBalanceOnly] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<typeof patients[0] | null>(null);

  const filteredPatients = patients.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.patientId.toLowerCase().includes(q) ||
      (p.address && p.address.toLowerCase().includes(q)) ||
      p.phone.includes(searchQuery);

    if (!matchesSearch) return false;
    if (filterAlertOnly && p.medicalAlerts.length === 0) return false;
    if (filterBalanceOnly && p.balanceDue <= 0) return false;

    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Header & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-black text-lg text-slate-900 tracking-tight">
              Patient Dossiers & Records
            </h2>
            <p className="text-xs text-slate-500">
              Manage clinical charts, medical histories, and treatment ledgers.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenNewPatient}
            className="px-4 py-2.5 rounded-xl bg-[#004884] hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs shadow-[#004884]/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Patient
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Patient Name, ID, Phone, or Location (e.g. Maduravoyal)..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004884]/20 focus:border-[#004884]"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilterAlertOnly(!filterAlertOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                filterAlertOnly
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              With Alerts
            </button>

            <button
              type="button"
              onClick={() => setFilterBalanceOnly(!filterBalanceOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                filterBalanceOnly
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-500" />
              Pending Balance
            </button>
          </div>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(patient => {
          const findingsCount = Object.keys(patient.dentalChart || {}).length;
          const patientVisits = getVisitsByPatient(patient.id);
          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient.id)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#004884] shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4 cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                        {patient.patientId}
                      </span>
                      {patientVisits.length > 0 && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-sky-50 text-[#004884] border border-sky-200 flex items-center gap-1 shrink-0">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{patientVisits.length} {patientVisits.length === 1 ? 'Sitting' : 'Sittings'}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1 group-hover:text-[#004884] transition-colors break-words">
                      {patient.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {patient.age} Yrs • {patient.gender} • Blood Group {patient.bloodGroup || 'N/A'}
                    </p>
                    {patient.address && (
                      <p className="text-[11px] font-bold text-sky-800 flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-[#004884] shrink-0" />
                        <span className="truncate">{patient.address}</span>
                      </p>
                    )}
                  </div>

                  {patient.balanceDue > 0 && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                      Due: {clinicProfile.currencySymbol}{patient.balanceDue}
                    </span>
                  )}
                </div>

                {/* Phone Contact & WhatsApp */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-600 mt-2.5">
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{patient.phone}</span>
                  </div>
                  <a
                    href={getWhatsAppUrl(
                      patient.phone,
                      `Hello ${patient.name}, this is Smile7 Dental Clinic (Dr. P. Manickapriya). How can we assist you with your dental care?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 transition-colors"
                    title="Send WhatsApp message"
                  >
                    <MessageSquare className="w-2.5 h-2.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Chief Complaint / Intake Reason if registered */}
                {patient.chiefComplaint && (
                  <p className="text-[11px] text-[#004884] bg-sky-50/80 border border-sky-100 rounded-lg p-2 mt-2 font-medium">
                    <span className="font-bold text-[#004884] block text-[10px] uppercase">Reason for Visit:</span>
                    {patient.chiefComplaint}
                  </p>
                )}

                {/* Medical Alerts Chips */}
                {patient.medicalAlerts.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {patient.medicalAlerts.map(a => (
                      <span
                        key={a}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Charted teeth count, delete button & quick button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {findingsCount > 0 ? (
                  <span className="text-slate-600 flex items-center gap-1 font-bold">
                    <Activity className="w-3.5 h-3.5 text-[#004884]" />
                    {findingsCount} charted teeth
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Activity className="w-3.5 h-3.5 text-slate-300" />
                    Pending treatment mapping
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPatientToDelete(patient);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title={`Delete ${patient.name}'s record`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[#004884] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    {findingsCount > 0 ? 'Open Dossier' : 'Map Treatment'} <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
          <Users className="w-12 h-12 mx-auto text-slate-300" />
          <h4 className="font-extrabold text-sm text-slate-700">No Patients Found</h4>
          <p className="text-xs">Try adjusting your search criteria or register a new patient.</p>
        </div>
      )}

      {/* Delete Patient Confirmation Modal */}
      {patientToDelete && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
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
                  Are you sure you want to permanently delete <strong className="text-slate-800">{patientToDelete.name}</strong> ({patientToDelete.patientId})?
                </p>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900">
              <p className="font-bold">⚠️ Warning:</p>
              <p className="text-[11px] text-rose-700 mt-0.5">
                This will delete their registered mobile number, odontogram tooth chart, clinical SOAP notes, prescriptions, and billing receipts. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPatientToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePatient(patientToDelete.id);
                  setPatientToDelete(null);
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
  );
};

