/**
 * Smile7 Dental Clinic - Automated Phone Reminder & 2-Day Advance Notification System
 * Supports Capacitor Local Notifications, Google Calendar deep links, and .ics alarms.
 */

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import type { Appointment, ClinicProfile } from '../types';
import { formatIndianDate } from './currency';

/**
 * Deterministic integer hash for notification IDs (Android/Capacitor requires 32-bit int)
 */
function hashToId(str: string, offset: number = 0): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 10000000) + offset;
}

/**
 * Parses appointment date and start time into a Date object
 */
export function getAppointmentDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

/**
 * Calculates 2-day advance reminder date (at 9:00 AM, 2 days before appointment)
 */
export function getTwoDaysBeforeReminder(apptDateTime: Date): Date {
  const reminder = new Date(apptDateTime.getTime());
  reminder.setDate(reminder.getDate() - 2);
  reminder.setHours(9, 0, 0, 0); // 9:00 AM on reminder morning
  return reminder;
}

/**
 * Schedule phone notifications for an appointment (2 days before + morning of)
 */
export async function scheduleAppointmentPhoneReminder(
  appt: Appointment,
  clinicProfile: ClinicProfile
): Promise<{ scheduled: boolean; message: string; remindersCount: number }> {
  const apptDateTime = getAppointmentDateTime(appt.date, appt.startTime);
  const twoDaysBefore = getTwoDaysBeforeReminder(apptDateTime);
  const morningOf = new Date(apptDateTime.getTime());
  morningOf.setHours(8, 30, 0, 0); // 8:30 AM on appointment day

  const now = new Date();
  const notificationsToSchedule: any[] = [];

  const formattedDate = formatIndianDate(appt.date);
  const notifId2Days = hashToId(appt.id, 1000);
  const notifIdDayOf = hashToId(appt.id, 2000);

  // 1. Check if 2-day reminder is in the future
  if (twoDaysBefore.getTime() > now.getTime()) {
    notificationsToSchedule.push({
      id: notifId2Days,
      title: `🗓️ Appointment in 2 Days: ${appt.patientName}`,
      body: `Dr. Manickapriya, upcoming procedure: ${appt.procedure} on ${formattedDate} at ${appt.startTime}. Phone: ${appt.patientPhone}`,
      schedule: { at: twoDaysBefore, allowWhileIdle: true },
      sound: 'default',
      smallIcon: 'ic_launcher',
      actionTypeId: 'OPEN_APPT',
      extra: {
        appointmentId: appt.id,
        patientId: appt.patientId
      }
    });
  }

  // 2. Day-of reminder (if appointment is in future)
  if (morningOf.getTime() > now.getTime() && apptDateTime.getTime() > now.getTime()) {
    notificationsToSchedule.push({
      id: notifIdDayOf,
      title: `🦷 Today's Appointment: ${appt.patientName} (${appt.startTime})`,
      body: `Procedure: ${appt.procedure} • Chair: ${appt.chair || 'Dental Chair'}. Phone: ${appt.patientPhone}`,
      schedule: { at: morningOf, allowWhileIdle: true },
      sound: 'default',
      smallIcon: 'ic_launcher',
      extra: {
        appointmentId: appt.id
      }
    });
  }

  // 3. Native Capacitor Platform Execution (Android & iOS Phone)
  if (Capacitor.isNativePlatform()) {
    try {
      let permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display !== 'granted') {
        permStatus = await LocalNotifications.requestPermissions();
      }

      if (permStatus.display === 'granted' && notificationsToSchedule.length > 0) {
        // Cancel any existing reminder for this appointment first
        try {
          await LocalNotifications.cancel({
            notifications: [{ id: notifId2Days }, { id: notifIdDayOf }]
          });
        } catch {}

        await LocalNotifications.schedule({
          notifications: notificationsToSchedule
        });

        return {
          scheduled: true,
          message: `Phone reminder scheduled for 2 days before (${twoDaysBefore.toLocaleDateString()}) and morning of!`,
          remindersCount: notificationsToSchedule.length
        };
      }
    } catch (err: any) {
      console.warn('Native notification schedule error:', err);
    }
  }

  // 4. Web Browser / Laptop Notification Support
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch {}
    }
  }

  return {
    scheduled: notificationsToSchedule.length > 0,
    message: notificationsToSchedule.length > 0
      ? `Reminder set for 2 days before (${twoDaysBefore.toLocaleDateString()})`
      : 'Appointment is already past or today.',
    remindersCount: notificationsToSchedule.length
  };
}

/**
 * Creates Google Calendar deep link with pre-filled 2-day alert
 */
export function createGoogleCalendarUrl(appt: Appointment, clinicProfile: ClinicProfile): string {
  const apptDateTime = getAppointmentDateTime(appt.date, appt.startTime);
  const endDateTime = new Date(apptDateTime.getTime() + (appt.durationMin || 45) * 60000);

  const formatGCalDate = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d+/g, '');

  const startIso = formatGCalDate(apptDateTime);
  const endIso = formatGCalDate(endDateTime);

  const title = encodeURIComponent(`Dental: ${appt.patientName} (${appt.procedure}) - Smile7 Dental`);
  const details = encodeURIComponent(
    `Patient: ${appt.patientName}\nPhone: ${appt.patientPhone}\nProcedure: ${appt.procedure}\nChair: ${appt.chair || 'Dental Chair'}\nDoctor: ${clinicProfile.doctorName}\nNotes: ${appt.notes || 'None'}\n\nAutomated reminder: Please prepare operatory chair.`
  );
  const location = encodeURIComponent(
    `${clinicProfile.clinicName}, ${clinicProfile.address}, ${clinicProfile.city}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

/**
 * Generates an iCalendar (.ics) file with native 2-day (-P2D) and 2-hour (-PT2H) alarms
 */
export function downloadCalendarIcsFile(appt: Appointment, clinicProfile: ClinicProfile): void {
  const apptDateTime = getAppointmentDateTime(appt.date, appt.startTime);
  const endDateTime = new Date(apptDateTime.getTime() + (appt.durationMin || 45) * 60000);

  const formatIcsDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const nowIso = formatIcsDate(new Date());
  const startIso = formatIcsDate(apptDateTime);
  const endIso = formatIcsDate(endDateTime);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Smile7 Dental Clinic//Appointment Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:smile7-appt-${appt.id}@smile7dental.com`,
    `DTSTAMP:${nowIso}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:Dental Appointment: ${appt.patientName} - ${appt.procedure}`,
    `DESCRIPTION:Patient: ${appt.patientName}\\nPhone: ${appt.patientPhone}\\nProcedure: ${appt.procedure}\\nAttending Doctor: ${clinicProfile.doctorName}`,
    `LOCATION:${clinicProfile.clinicName}\\, ${clinicProfile.address}\\, ${clinicProfile.city}`,
    'STATUS:CONFIRMED',
    // 2-day advance alarm
    'BEGIN:VALARM',
    'TRIGGER:-P2D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: Appointment with ${appt.patientName} in 2 days (${formatIndianDate(appt.date)})`,
    'END:VALARM',
    // 2-hour advance alarm
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Dental Chair Alert: ${appt.patientName} in 2 hours for ${appt.procedure}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Smile7_Appointment_${appt.patientName.replace(/\s+/g, '_')}_${appt.date}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * WhatsApp message text to send to patient 2 days before appointment
 */
export function getTwoDayAdvancePatientWhatsAppText(
  appt: Appointment,
  clinicProfile: ClinicProfile
): string {
  const formattedDate = formatIndianDate(appt.date);
  return (
    `Hello ${appt.patientName},\n\n` +
    `This is a gentle reminder of your upcoming dental appointment in 2 days with ${clinicProfile.doctorName} at ${clinicProfile.clinicName}:\n\n` +
    `🗓️ *Date:* ${formattedDate}\n` +
    `⏰ *Time:* ${appt.startTime}\n` +
    `🦷 *Treatment:* ${appt.procedure}\n` +
    `📍 *Location:* ${clinicProfile.address}, ${clinicProfile.city}\n\n` +
    `If you need to reschedule or have any queries, please let us know or call ${clinicProfile.phone}.\n\n` +
    `Thank you,\n${clinicProfile.clinicName}`
  );
}

/**
 * Scans all appointments to find those scheduled in the next 48 hours (2 days)
 */
export function getUpcomingAppointmentsInNext48Hours(appointments: Appointment[]): Appointment[] {
  const now = new Date();
  const fortyEightHoursLater = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  return appointments.filter(a => {
    if (a.status === 'Cancelled' || a.status === 'Completed') return false;
    const apptDateTime = getAppointmentDateTime(a.date, a.startTime);
    return apptDateTime.getTime() >= now.getTime() && apptDateTime.getTime() <= fortyEightHoursLater.getTime();
  }).sort((a, b) => {
    const timeA = getAppointmentDateTime(a.date, a.startTime).getTime();
    const timeB = getAppointmentDateTime(b.date, b.startTime).getTime();
    return timeA - timeB;
  });
}
