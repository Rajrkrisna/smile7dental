import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Armchair, 
  CheckCircle2, 
  User, 
  Phone,
  MessageSquare,
  Send,
  Copy,
  Check,
  X,
  Bell,
  ExternalLink
} from 'lucide-react';
import { getWhatsAppUrl, getAppointmentWhatsAppText } from '../../utils/whatsapp';
import { formatIndianDate } from '../../utils/currency';
import type { Appointment, AppointmentStatus } from '../../types';
import { 
  getTwoDayAdvancePatientWhatsAppText, 
  createGoogleCalendarUrl, 
  downloadCalendarIcsFile, 
  scheduleAppointmentPhoneReminder 
} from '../../utils/appointmentReminders';

interface AppointmentCalendarProps {
  onOpenNewAppointment: () => void;
  onSelectPatient: (patientId: string) => void;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  onOpenNewAppointment,
  onSelectPatient
}) => {
  const { appointments, updateAppointmentStatus, clinicProfile } = useClinic();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Reminder message preview & dispatch modal state
  const [reminderAppt, setReminderAppt] = useState<Appointment | null>(null);
  const [reminderText, setReminderText] = useState<string>('');
  const [reminderType, setReminderType] = useState<'twoday' | 'standard'>('twoday');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [phoneAlertSet, setPhoneAlertSet] = useState<boolean>(false);

  const fullClinicAddress = clinicProfile.city
    ? `${clinicProfile.address}, ${clinicProfile.city}`
    : clinicProfile.address;

  // Change date helpers
  const handleShiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleOpenReminder = (appt: Appointment) => {
    setReminderAppt(appt);
    setReminderType('twoday');
    setReminderText(getTwoDayAdvancePatientWhatsAppText(appt, clinicProfile));
    setCopiedSuccess(false);
    setPhoneAlertSet(false);
  };

  const handleSwitchReminderType = (type: 'twoday' | 'standard') => {
    if (!reminderAppt) return;
    setReminderType(type);
    if (type === 'twoday') {
      setReminderText(getTwoDayAdvancePatientWhatsAppText(reminderAppt, clinicProfile));
    } else {
      setReminderText(
        getAppointmentWhatsAppText(
          reminderAppt.patientName,
          formatIndianDate(reminderAppt.date),
          reminderAppt.startTime,
          clinicProfile.clinicName,
          reminderAppt.doctor,
          clinicProfile.phone,
          reminderAppt.procedure,
          fullClinicAddress
        )
      );
    }
  };

  const handleCopyReminder = async () => {
    if (!reminderText) return;
    try {
      await navigator.clipboard.writeText(reminderText);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch {
      // Fallback
    }
  };

  const getStatusBtnClass = (currentStatus: AppointmentStatus, targetStatus: AppointmentStatus) => {
    if (currentStatus !== targetStatus) {
      return 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
    }
    switch (targetStatus) {
      case 'Completed':
        return 'bg-emerald-600 text-white border-emerald-600 shadow-2xs';
      case 'In-Chair':
        return 'bg-purple-600 text-white border-purple-600 shadow-2xs animate-pulse';
      case 'Checked-In':
        return 'bg-blue-600 text-white border-blue-600 shadow-2xs';
      default:
        return 'bg-slate-800 text-white border-slate-800 shadow-2xs';
    }
  };

  const filteredAppts = appointments.filter(a => {
    if (a.date !== selectedDate) return false;
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    return true;
  });

  const statuses = ['All', 'In-Chair', 'Scheduled', 'Checked-In', 'Completed'];

  return (
    <div className="space-y-5">
      {/* Top Header & Date Navigation */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-lg text-slate-900 tracking-tight">
                Dental Chair Schedule & Appointments
              </h2>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#004884] border border-sky-200">
                1 Dental Chair Operatory
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Single operatory daily chair queue, in-chair tracking, and procedure times.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenNewAppointment}
            className="px-4 py-2.5 rounded-xl bg-[#004884] hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs shadow-[#004884]/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Book Chair Slot
          </button>
        </div>

        {/* Date Selector & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleShiftDate(-1)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004884]/20"
            />
            <button
              type="button"
              onClick={() => handleShiftDate(1)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
            >
              Today
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto w-full sm:w-auto">
            {statuses.map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === st ? 'bg-white text-[#004884] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments Timeline Grid */}
      {filteredAppts.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
          <CalendarIcon className="w-12 h-12 mx-auto text-slate-300" />
          <h4 className="font-extrabold text-sm text-slate-700">No Appointments for {selectedDate}</h4>
          <p className="text-xs">Select another date or click "Book Chair Slot" above to schedule a patient.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppts.map(appt => (
            <div
              key={appt.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                {/* Time & Duration badge */}
                <div className="w-16 text-center shrink-0 bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                  <span className="block text-sm font-black text-slate-900 leading-none">
                    {appt.startTime}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">
                    {appt.durationMin} mins
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectPatient(appt.patientId)}
                      className="font-extrabold text-sm text-slate-900 hover:text-[#004884] transition-colors text-left"
                    >
                      {appt.patientName}
                    </button>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-[#004884] border border-sky-200">
                      {appt.chair}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#004884] mt-0.5">
                    {appt.procedure}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {appt.patientPhone}
                    </span>

                    {/* Schedule Date & Time Badge */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#004884] font-bold text-[10px] border border-blue-200">
                      <CalendarIcon className="w-2.5 h-2.5" />
                      {formatIndianDate(appt.date)} at {appt.startTime}
                    </span>

                    {/* Send Reminder Button - Opens Modal with Preview & Date */}
                    <button
                      type="button"
                      onClick={() => handleOpenReminder(appt)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-2xs transition-colors cursor-pointer"
                      title="Send schedule reminder to patient"
                    >
                      <Bell className="w-2.5 h-2.5" />
                      <span>Send Reminder</span>
                    </button>

                    {/* Quick 1-Click WhatsApp Link */}
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
                          fullClinicAddress
                        )
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 transition-colors"
                      title="1-click open WhatsApp reminder"
                    >
                      <MessageSquare className="w-2.5 h-2.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                    <span>â€¢ Doctor: {appt.doctor}</span>
                  </div>

                  {appt.notes && (
                    <p className="text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded-md mt-1.5 border border-slate-200/60 inline-block">
                      Note: {appt.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Switcher Action Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 self-end md:self-center">
                {(['Scheduled', 'Checked-In', 'In-Chair', 'Completed', 'Cancelled'] as AppointmentStatus[]).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => updateAppointmentStatus(appt.id, st)}
                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${getStatusBtnClass(appt.status, st)}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Reminder Preview & Dispatch Modal */}
      {reminderAppt && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Send Appointment Schedule Reminder
                  </h3>
                  <p className="text-xs text-slate-500">
                    Preview and send schedule reminder with date, time & clinic details
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReminderAppt(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Schedule Highlights Card */}
            <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Patient</span>
                <span className="font-extrabold text-slate-900">{reminderAppt.patientName}</span>
                <span className="text-slate-500 block font-mono text-[11px]">{reminderAppt.patientPhone}</span>
              </div>
              <div>
                <span className="font-black text-[#004884] block">{formatIndianDate(reminderAppt.date)}</span>
                <span className="text-slate-700 font-bold text-[11px]">{reminderAppt.startTime} ({reminderAppt.durationMin} mins)</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Planned Procedure</span>
                  <span className="font-bold text-slate-800">{reminderAppt.procedure}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-[#004884] border border-sky-200">
                  {reminderAppt.chair}
                </span>
              </div>
            </div>

            {/* Reminder Mode Selector Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => handleSwitchReminderType('twoday')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                  reminderType === 'twoday'
                    ? 'bg-white text-[#004884] shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🔔 2-Day Advance Reminder
              </button>
              <button
                type="button"
                onClick={() => handleSwitchReminderType('standard')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                  reminderType === 'standard'
                    ? 'bg-white text-[#004884] shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🗓️ Day-Of Schedule Reminder
              </button>
            </div>

            {/* Doctor's Phone Notification & Calendar Integration Bar */}
            <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#004884] flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  Doctor's Phone Alert (2 Days Before at 9:00 AM)
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    await scheduleAppointmentPhoneReminder(reminderAppt, clinicProfile);
                    setPhoneAlertSet(true);
                    setTimeout(() => setPhoneAlertSet(false), 3000);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    phoneAlertSet
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-[#004884] border-sky-300 hover:bg-sky-100'
                  }`}
                >
                  {phoneAlertSet ? '✓ Phone Alert Armed' : 'Set Phone Alert'}
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-sky-200/60">
                <a
                  href={createGoogleCalendarUrl(reminderAppt, clinicProfile)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-1.5 px-2 text-[11px] font-bold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 transition-colors"
                >
                  📅 Add to Google Calendar (2-Day Alert)
                </a>
                <button
                  type="button"
                  onClick={() => downloadCalendarIcsFile(reminderAppt, clinicProfile)}
                  className="text-center py-1.5 px-2.5 text-[11px] font-bold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  title="Download .ics file for Apple / Outlook Calendar"
                >
                  .ICS File
                </button>
              </div>
            </div>

            {/* Message Body Editor */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Reminder Message Text (Editable)
                </label>
                <span className="text-[10px] text-slate-400">
                  Professional clinic greeting
                </span>
              </div>
              <textarea
                rows={7}
                value={reminderText}
                onChange={e => setReminderText(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#004884]/20 resize-none bg-white text-slate-800 leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCopyReminder}
                className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                  copiedSuccess
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text (SMS)</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReminderAppt(null)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={getWhatsAppUrl(reminderAppt.patientPhone, reminderText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setReminderAppt(null)}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


