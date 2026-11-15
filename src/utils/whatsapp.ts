/**
 * WhatsApp integration helpers tailored for Indian Dental Clinics
 * Handles 10-digit Indian mobile numbers (+91) and formats professional clinic messages
 */

import { formatTimeAMPM } from './currency';

export function cleanIndianPhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  return digits;
}

export function getWhatsAppUrl(phone: string, text?: string): string {
  const cleanPhone = cleanIndianPhoneForWhatsApp(phone);
  if (!cleanPhone) return '#';
  const encoded = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${cleanPhone}${encoded}`;
}

export function getAppointmentWhatsAppText(
  patientName: string,
  date: string,
  time: string,
  clinicName: string = 'Smile7 Dental Clinic',
  doctorName: string = 'Dr. P. Manickapriya',
  clinicPhone: string = '+91 97908 62510',
  procedure?: string,
  clinicAddress?: string
): string {
  const address = clinicAddress && clinicAddress.trim()
    ? clinicAddress.trim()
    : 'No. 1/2, Alapakkam Main Road, Janaki Nagar, Maduravoyal, Chennai - 600095';

  const procedureLine = procedure && procedure.trim()
    ? `Procedure: ${procedure.trim()}\n`
    : '';

  const formattedTime = formatTimeAMPM(time);

  return `Hello ${patientName},

This is an appointment reminder from ${clinicName} (${doctorName}) for your scheduled dental visit:

Date: ${date}
Time: ${formattedTime}
${procedureLine}Clinic: ${address}

For directions, assistance, or rescheduling, please call or WhatsApp ${clinicPhone}.`;
}

export function getInvoiceWhatsAppText(
  patientName: string,
  invoiceNumber: string,
  totalAmount: number,
  balance: number,
  clinicName: string = 'Smile7 Dental Clinic',
  clinicPhone: string = '+91 97908 62510',
  downloadUrl?: string
): string {
  const formattedTotal = 'Rs. ' + totalAmount.toLocaleString('en-IN');
  const formattedBalance = 'Rs. ' + balance.toLocaleString('en-IN');
  const cleanUpiPhone = clinicPhone.replace(/\D/g, '').slice(-10) || '9790862510';

  const balanceLine = balance > 0
    ? `Pending Balance: ${formattedBalance}\n(Pay via UPI / GPay / PhonePe to ${cleanUpiPhone})`
    : 'Status: Fully Settled. Thank you!';

  const pdfLine = downloadUrl && downloadUrl.trim()
    ? `Download PDF Bill (1-Click):\n${downloadUrl.trim()}`
    : 'Your official PDF dental invoice receipt is attached below.';

  return `Hello ${patientName},

Your dental treatment invoice (${invoiceNumber}) from ${clinicName} is ready:

Total Amount: ${formattedTotal}
${balanceLine}

${pdfLine}

For assistance or queries, please call or WhatsApp ${clinicPhone}.
Thank you for choosing ${clinicName}!`;
}

