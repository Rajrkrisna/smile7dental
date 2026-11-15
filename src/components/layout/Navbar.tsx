import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Plus, 
  Calendar, 
  Users, 
  ShieldCheck,
  Globe,
  Cloud,
  RefreshCw,
  Bell,
  MessageSquare,
  ExternalLink,
  X,
  Phone
} from 'lucide-react';
import logoIcon from '../../assets/smile7-logo-icon.png';
import { 
  getUpcomingAppointmentsInNext48Hours,
  getTwoDayAdvancePatientWhatsAppText,
  createGoogleCalendarUrl,
  scheduleAppointmentPhoneReminder
} from '../../utils/appointmentReminders';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { formatIndianDate } from '../../utils/currency';

interface NavbarProps {
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
  onOpenNewInvoice: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewPatient,
  onOpenNewAppointment,
  onOpenNewInvoice,
  onNavigateTab
}) => {
  const { 
    clinicProfile, 
    notation, 
    setNotation,
    syncConfig,
    syncStatus,
    lastSyncTime,
    triggerSync,
    appointments
  } = useClinic();

  const [showReminders, setShowReminders] = useState(false);
  const upcomingReminders = getUpcomingAppointmentsInNext48Hours(appointments);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Clinic Branding with Official Smile7 Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white border border-slate-200 rounded-xl p-1 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
            <img 
              src={logoIcon} 
              alt="Smile7 Dental Clinic Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-slate-900 text-base tracking-tight leading-none">
                {clinicProfile.clinicName}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 bg-sky-50 text-[#004884] text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-200">
                <Globe className="w-2.5 h-2.5 text-[#004884]" />
                smile7dental.com
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#004884]" />
              <span>{clinicProfile.doctorName} • {clinicProfile.registrationNumber}</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Fast Notation Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Tooth Notation Toggle Quick Access */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
            <span className="text-[10px] text-slate-400 pl-2 uppercase tracking-wider font-extrabold">Notation:</span>
            <button
              type="button"
              onClick={() => setNotation('fdi')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                notation === 'fdi' ? 'bg-white text-[#004884] shadow-xs font-black' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="FDI Two-Digit Notation (11-48) - Dental Council of India Standard"
            >
              FDI (India)
            </button>
            <button
              type="button"
              onClick={() => setNotation('universal')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                notation === 'universal' ? 'bg-white text-[#004884] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Universal Numbering System (1-32)"
            >
              Univ (#)
            </button>
            <button
              type="button"
              onClick={() => setNotation('palmer')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                notation === 'palmer' ? 'bg-white text-[#004884] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Palmer Notation (Quadrants: 8┘..1┘ | └1..└8)"
            >
              Palmer ┘└
            </button>
          </div>

          {/* GitHub Cloud Database Sync Status */}
          <button
            type="button"
            onClick={() => {
              if (!syncConfig.token) {
                onNavigateTab('settings');
              } else {
                triggerSync('bidirectional');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              syncStatus === 'syncing'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : syncStatus === 'success'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : syncStatus === 'error'
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : syncConfig.token
                ? 'bg-sky-50 text-[#004884] border-sky-200 hover:bg-sky-100'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            title={
              !syncConfig.token
                ? 'Click to connect GitHub Cloud Database in Settings'
                : syncStatus === 'syncing'
                ? 'Syncing with GitHub database...'
                : syncStatus === 'error'
                ? 'Sync error. Click to retry sync'
                : `Synced with GitHub at ${lastSyncTime || 'recently'}. Click to sync now.`
            }
          >
            {syncStatus === 'syncing' ? (
              <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            ) : (
              <Cloud className={`w-3.5 h-3.5 ${syncStatus === 'success' ? 'text-emerald-600' : syncStatus === 'error' ? 'text-rose-600' : 'text-[#004884]'}`} />
            )}
            <span className="hidden sm:inline">
              {!syncConfig.token 
                ? 'Connect Cloud' 
                : syncStatus === 'syncing' 
                ? 'Syncing...' 
                : syncStatus === 'error'
                ? 'Sync Error'
                : lastSyncTime
                ? `Synced ${lastSyncTime}`
                : 'Synced'}
            </span>
          </button>

          {/* 2-Day Phone Reminders & Upcoming Appointments Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowReminders(prev => !prev)}
              className={`relative flex items-center justify-center p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                upcomingReminders.length > 0
                  ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title={
                upcomingReminders.length > 0
                  ? `${upcomingReminders.length} appointments in next 48 hours (2-day alerts active)`
                  : 'No upcoming appointments in next 48h'
              }
            >
              <Bell className="w-4 h-4 text-amber-600" />
              {upcomingReminders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {upcomingReminders.length}
                </span>
              )}
            </button>

            {/* Upcoming 48-Hour Reminders Dropdown Popover */}
            {showReminders && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">
                        Upcoming 48-Hour Reminders
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium">
                        2-day prior phone alerts & patient follow-ups
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowReminders(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2.5 divide-y divide-slate-100">
                  {upcomingReminders.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-xs text-slate-500 font-medium">
                        No appointments in the next 48 hours.
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        When you book appointments, 2-day phone alerts will appear here!
                      </p>
                    </div>
                  ) : (
                    upcomingReminders.map(appt => (
                      <div key={appt.id} className="pt-2.5 first:pt-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">
                                {appt.patientName}
                              </span>
                              <span className="text-[10px] bg-sky-50 text-[#004884] font-bold px-1.5 py-0.5 rounded border border-sky-200">
                                {appt.startTime}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                              {appt.procedure} • {formatIndianDate(appt.date)}
                            </p>
                            {appt.patientPhone && (
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                                <Phone className="w-2.5 h-2.5" />
                                {appt.patientPhone}
                              </p>
                            )}
                          </div>
                          <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                            2-Day Alert
                          </span>
                        </div>

                        {/* Quick 1-Tap Actions */}
                        <div className="flex items-center gap-1.5 mt-2">
                          {appt.patientPhone && (
                            <a
                              href={getWhatsAppUrl(
                                appt.patientPhone,
                                getTwoDayAdvancePatientWhatsAppText(appt, clinicProfile)
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3 text-emerald-600" />
                              <span>WhatsApp 2-Day</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          )}

                          <a
                            href={createGoogleCalendarUrl(appt, clinicProfile)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                            title="Add to Google Calendar with 2-day reminder alarm"
                          >
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>Google Cal</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>

                          <button
                            type="button"
                            onClick={async () => {
                              await scheduleAppointmentPhoneReminder(appt, clinicProfile);
                              alert(`Phone reminder re-armed for 2 days before ${formatIndianDate(appt.date)} (9:00 AM)`);
                            }}
                            className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            title="Re-schedule native phone notification"
                          >
                            <span>Arm Alert</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Register Patient */}
          <button
            type="button"
            onClick={onOpenNewPatient}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            + Patient
          </button>

          {/* Quick Book Chair */}
          <button
            type="button"
            onClick={onOpenNewAppointment}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#004884] bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#004884]" />
            Book Chair
          </button>

          {/* Create Dental Bill */}
          <button
            type="button"
            onClick={onOpenNewInvoice}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#004884] hover:bg-sky-700 shadow-xs shadow-[#004884]/25 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Bill (Rs.)
          </button>
        </div>
      </div>
    </header>
  );
};
