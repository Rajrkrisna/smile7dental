import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  Activity, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  UserPlus, 
  FilePlus, 
  Pill,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { getWhatsAppUrl, getAppointmentWhatsAppText } from '../../utils/whatsapp';
import { formatIndianDate, formatTimeAMPM } from '../../utils/currency';

interface DashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
  onOpenNewInvoice: () => void;
  onSelectPatient: (patientId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateTab,
  onOpenNewPatient,
  onOpenNewAppointment,
  onOpenNewInvoice,
  onSelectPatient
}) => {
  const { patients, appointments, invoices, clinicProfile, updateAppointmentStatus } = useClinic();

  const totalPatients = patients.length;
  const totalBilled = patients.reduce((acc, p) => acc + p.totalBilled, 0);
  const totalPaid = patients.reduce((acc, p) => acc + p.totalPaid, 0);
  const totalOutstanding = patients.reduce((acc, p) => acc + p.balanceDue, 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === todayStr);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Welcome Banner & Fast Actions with Signature Smile7 Gradient Blue */}
      <div className="bg-gradient-to-r from-[#002244] via-[#004884] to-[#0284c7] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div>
          <span className="text-sky-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider block">
            Practice Management Studio
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
            Welcome back, {clinicProfile.doctorName}
          </h2>
          <p className="text-sky-100/90 text-xs mt-1 max-w-lg">
            {clinicProfile.clinicName} • Operating locally and offline on this device.
          </p>
        </div>

        {/* Quick Start Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenNewPatient}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-[#004884] font-bold text-xs rounded-xl shadow-xs hover:bg-sky-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#004884]" />
            Add Patient
          </button>
          <button
            type="button"
            onClick={onOpenNewAppointment}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-[#00386b] hover:bg-[#002e58] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Chair
          </button>
          <button
            type="button"
            onClick={onOpenNewInvoice}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Create Bill
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Patients - Clickable redirect to Patient List */}
        <div 
          onClick={() => onNavigateTab('patients')}
          className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-[#004884] shadow-2xs hover:shadow-md transition-all space-y-1.5 sm:space-y-2 cursor-pointer group min-w-0"
          title="Click to view full Patient Directory"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] sm:text-xs font-bold group-hover:text-[#004884] transition-colors truncate">Total Patients</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-sky-50 text-[#004884] group-hover:bg-[#004884] group-hover:text-white transition-colors shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between min-w-0">
            <p className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-[#004884] transition-colors truncate">
              {totalPatients}
            </p>
            <span className="hidden xs:inline-flex text-[10px] sm:text-[11px] font-bold text-[#004884] items-center gap-0.5 opacity-90 group-hover:translate-x-0.5 transition-transform shrink-0">
              List <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
            Active clinic dossiers
          </p>
        </div>

        {/* Today's Appointments - Clickable redirect to Appointments */}
        <div 
          onClick={() => onNavigateTab('appointments')}
          className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-[#004884] shadow-2xs hover:shadow-md transition-all space-y-1.5 sm:space-y-2 cursor-pointer group min-w-0"
          title="Click to view Chair Schedule"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] sm:text-xs font-bold group-hover:text-[#004884] transition-colors truncate">Today's Chair Queue</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-sky-50 text-[#004884] group-hover:bg-[#004884] group-hover:text-white transition-colors shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between min-w-0">
            <p className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-[#004884] transition-colors truncate">
              {todayAppts.length}
            </p>
            <span className="hidden xs:inline-flex text-[10px] sm:text-[11px] font-bold text-[#004884] items-center gap-0.5 opacity-90 group-hover:translate-x-0.5 transition-transform shrink-0">
              Chairs <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-blue-600 font-medium truncate">
            {todayAppts.filter(a => a.status === 'Completed').length} completed
          </p>
        </div>

        {/* Total Settled Revenue - Clickable redirect to Billing */}
        <div 
          onClick={() => onNavigateTab('billing')}
          className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-emerald-600 shadow-2xs hover:shadow-md transition-all space-y-1.5 sm:space-y-2 cursor-pointer group min-w-0"
          title="Click to view Billing & Invoices"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] sm:text-xs font-bold group-hover:text-emerald-700 transition-colors truncate">Total Collections</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between min-w-0">
            <p className="text-base sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors truncate">
              {clinicProfile.currencySymbol || '₹'}{' '}
              {totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
            </p>
            <span className="hidden xs:inline-flex text-[10px] sm:text-[11px] font-bold text-emerald-700 items-center gap-0.5 opacity-90 group-hover:translate-x-0.5 transition-transform shrink-0">
              Ledger <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-600 font-medium truncate">
            Across {invoices.length} invoices
          </p>
        </div>

        {/* Outstanding Receivables - Clickable redirect to Billing */}
        <div 
          onClick={() => onNavigateTab('billing')}
          className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-amber-500 shadow-2xs hover:shadow-md transition-all space-y-1.5 sm:space-y-2 cursor-pointer group min-w-0"
          title="Click to view Unsettled Dues"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] sm:text-xs font-bold group-hover:text-amber-700 transition-colors truncate">Pending Dues</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between min-w-0">
            <p className="text-base sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-amber-700 transition-colors truncate">
              {clinicProfile.currencySymbol || '₹'}{' '}
              {totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
            </p>
            <span className="hidden xs:inline-flex text-[10px] sm:text-[11px] font-bold text-amber-700 items-center gap-0.5 opacity-90 group-hover:translate-x-0.5 transition-transform shrink-0">
              Dues <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-amber-600 font-medium truncate">
            Unsettled balances
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout: Today's Appointments & Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Chair Queue (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Today's Dental Operatory Schedule
              </h3>
              <p className="text-xs text-slate-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('appointments')}
              className="text-xs font-bold text-[#004884] hover:text-sky-700 flex items-center gap-1 cursor-pointer"
            >
              Full Calendar <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayAppts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Calendar className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium">No appointments scheduled for today.</p>
              <button
                type="button"
                onClick={onOpenNewAppointment}
                className="text-xs font-bold text-[#004884] hover:underline cursor-pointer"
              >
                + Book an appointment now
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayAppts.map(appt => (
                <div
                  key={appt.id}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 text-center shrink-0">
                      <span className="block text-xs font-black text-slate-900 leading-none">
                        {formatTimeAMPM(appt.startTime)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {appt.durationMin}m
                      </span>
                    </div>

                    <div className="h-8 w-px bg-slate-200"></div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900">
                          {appt.patientName}
                        </span>
                        <a
                          href={getWhatsAppUrl(
                            appt.patientPhone,
                            getAppointmentWhatsAppText(
                              appt.patientName,
                              formatIndianDate(appt.date),
                              formatTimeAMPM(appt.startTime),
                              clinicProfile.clinicName,
                              appt.doctor,
                              clinicProfile.phone,
                              appt.procedure,
                              clinicProfile.city ? `${clinicProfile.address}, ${clinicProfile.city}` : clinicProfile.address
                            )
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[9px] border border-emerald-200 transition-colors"
                          title="Send WhatsApp appointment reminder"
                        >
                          <MessageSquare className="w-2.5 h-2.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                          {appt.chair}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#004884] font-medium">
                        {appt.procedure}
                      </p>
                    </div>
                  </div>

                  {/* Status / Quick Action */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        appt.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : appt.status === 'In-Chair'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200 animate-pulse'
                          : appt.status === 'Checked-In'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {appt.status}
                    </span>

                    {appt.status !== 'Completed' && (
                      <button
                        type="button"
                        onClick={() =>
                          updateAppointmentStatus(
                            appt.id,
                            appt.status === 'Scheduled' || appt.status === 'Confirmed'
                              ? 'In-Chair'
                              : 'Completed'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer"
                      >
                        {appt.status === 'In-Chair' ? 'Finish' : 'Call to Chair'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Patient Directory Quick Panel (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">
              Recent Patients
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('patients')}
              className="text-xs font-bold text-[#004884] hover:text-sky-700 cursor-pointer"
            >
              View All ({patients.length})
            </button>
          </div>

          <div className="space-y-2">
            {patients.slice(0, 5).map(p => {
              const findingsCount = Object.keys(p.dentalChart || {}).length;
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectPatient(p.id)}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-[#004884]/40 hover:bg-sky-50/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {p.name}
                      </span>
                      {p.medicalAlerts.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" title={p.medicalAlerts.join(', ')} />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">
                      {p.patientId} • {p.age}y ({p.gender.charAt(0)}) • {findingsCount > 0 ? `${findingsCount} teeth charted` : 'Mapping pending'}
                      {p.chiefComplaint ? ` • ${p.chiefComplaint}` : ''}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

