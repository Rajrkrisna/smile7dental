import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { X, Calendar, Clock, Armchair, MessageSquare, Bell, Smartphone, ExternalLink } from 'lucide-react';
import { getWhatsAppUrl, getAppointmentWhatsAppText } from '../../utils/whatsapp';
import { formatIndianDate, formatTimeAMPM } from '../../utils/currency';
import type { Appointment } from '../../types';
import { 
  scheduleAppointmentPhoneReminder, 
  createGoogleCalendarUrl, 
  getAppointmentDateTime, 
  getTwoDaysBeforeReminder 
} from '../../utils/appointmentReminders';

interface NewAppointmentModalProps {
  onClose: () => void;
  preselectedPatientId?: string;
  onAppointmentAdded?: (appt: Appointment) => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  onClose,
  preselectedPatientId,
  onAppointmentAdded
}) => {
  const { patients, procedures, clinicProfile, addAppointment } = useClinic();

  const [patientId, setPatientId] = useState(preselectedPatientId || patients[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [durationMin, setDurationMin] = useState(45);
  const [chair] = useState('Dental Chair');
  const [procedure, setProcedure] = useState(procedures[0]?.name || 'Consultation & Oral Examination');
  const [notes, setNotes] = useState('');
  const [sendWhatsAppReminder, setSendWhatsAppReminder] = useState(true);
  const [setPhoneReminder, setSetPhoneReminder] = useState(true);
  const [addToCalendar, setAddToCalendar] = useState(false);

  const selectedPatient = patients.find(p => p.id === patientId);

  // Compute 2-days before notification date preview
  const apptDateTime = getAppointmentDateTime(date, startTime);
  const twoDaysBefore = getTwoDaysBeforeReminder(apptDateTime);
  const twoDaysBeforeFormatted = twoDaysBefore.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const newAppt = addAppointment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientPhone: selectedPatient.phone,
      date,
      startTime,
      durationMin,
      chair,
      doctor: clinicProfile.doctorName,
      procedure,
      status: 'Scheduled',
      notes: notes.trim() || undefined
    });

    // 1. Schedule Native Phone Reminder 2 Days Before
    if (setPhoneReminder) {
      scheduleAppointmentPhoneReminder(newAppt, clinicProfile);
    }

    // 2. Add to Google / Phone Calendar if selected
    if (addToCalendar) {
      const gcalUrl = createGoogleCalendarUrl(newAppt, clinicProfile);
      window.open(gcalUrl, '_blank');
    }

    // 3. Auto-launch WhatsApp reminder with schedule date if checked
    if (sendWhatsAppReminder && selectedPatient.phone) {
      const fullClinicAddress = clinicProfile.city
        ? `${clinicProfile.address}, ${clinicProfile.city}`
        : clinicProfile.address;

      const msg = getAppointmentWhatsAppText(
        selectedPatient.name,
        formatIndianDate(date),
        formatTimeAMPM(startTime),
        clinicProfile.clinicName,
        clinicProfile.doctorName,
        clinicProfile.phone,
        procedure,
        fullClinicAddress
      );
      const url = getWhatsAppUrl(selectedPatient.phone, msg);
      if (url && url !== '#') {
        window.open(url, '_blank');
      }
    }

    if (onAppointmentAdded) onAppointmentAdded(newAppt);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Schedule Chair Appointment
            </h3>
            <p className="text-xs text-slate-500">
              Book operatory chair and procedure slot for a patient.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg leading-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Select Patient *
            </label>
            <select
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#004884]/20 focus:border-[#004884]"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.patientId} - {p.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Date, Time, Duration */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004884]/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Start Time *
                </label>
                {startTime && (
                  <span className="text-[10px] font-extrabold text-[#004884] bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                    {formatTimeAMPM(startTime)}
                  </span>
                )}
              </div>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004884]/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Duration (Min)
              </label>
              <select
                value={durationMin}
                onChange={e => setDurationMin(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value={15}>15 mins</option>
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins (1h)</option>
                <option value={90}>90 mins (1.5h)</option>
                <option value={120}>120 mins (2h)</option>
              </select>
            </div>
          </div>

          {/* Operatory Chair - Single Chair Setup */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800 block">Dental Operatory</span>
              <span className="text-slate-500 text-[11px]">Smile7 Dental Clinic (Single Chair Setup)</span>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-sky-50 text-[#004884] border border-sky-200">
              Dental Chair
            </span>
          </div>

          {/* Procedure */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Planned Procedure
            </label>
            <select
              value={procedure}
              onChange={e => setProcedure(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#004884]/20"
            >
              {procedures.map(proc => (
                <option key={proc.id} value={proc.name}>
                  [{proc.category}] {proc.code} — {proc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clinical Notes / Prep info */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Visit Instructions / Pre-op Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Ensure medical allergy check, prep rubber dam"
              className="w-full text-xs p-2 rounded-xl border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-[#004884]/20"
            />
          </div>

          {/* Automated Phone Reminder (2 Days Before) */}
          <div className="p-3 bg-sky-50/80 border border-sky-200 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={setPhoneReminder}
                  onChange={e => setSetPhoneReminder(e.target.checked)}
                  className="w-4 h-4 text-[#004884] rounded border-sky-300 focus:ring-[#004884] cursor-pointer"
                />
                <span className="flex items-center gap-1.5 text-[#004884]">
                  <Bell className="w-3.5 h-3.5 text-[#004884] shrink-0" />
                  Add reminder to phone & notify me 2 days before
                </span>
              </label>
              <span className="text-[10px] font-black text-[#004884] bg-white px-2 py-0.5 rounded border border-sky-200">
                🔔 2 Days Prior
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pl-6 leading-tight">
              Phone notification rings on <strong>{twoDaysBeforeFormatted}</strong> (at 9:00 AM) and morning of the appointment.
            </p>
          </div>

          {/* Optional: Add to Google Calendar */}
          <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={addToCalendar}
                onChange={e => setAddToCalendar(e.target.checked)}
                className="w-4 h-4 text-[#004884] rounded border-slate-300 focus:ring-[#004884] cursor-pointer"
              />
              <span className="flex items-center gap-1.5 text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                Also open Google / Apple Calendar with 2-day alert
              </span>
            </label>
            <span className="text-[10px] text-slate-400 font-medium">
              Google Cal
            </span>
          </div>

          {/* Schedule Reminder WhatsApp Option */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={sendWhatsAppReminder}
                onChange={e => setSendWhatsAppReminder(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="flex items-center gap-1.5 text-emerald-950">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Send WhatsApp reminder with schedule date now
              </span>
            </label>
            <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-600" />
              <span>{formatIndianDate(date)}</span>
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold bg-[#004884] hover:bg-sky-700 text-white rounded-xl shadow-xs shadow-[#004884]/20 cursor-pointer"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

