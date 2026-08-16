import type { Invoice, ClinicProfile } from '../types';
import { formatCurrency, formatDate } from './formatters';

export const sanitizeIndianPhoneNumber = (phoneStr: string): string => {
  // Remove all non-digit characters
  const digits = phoneStr.replace(/\D/g, '');
  
  if (digits.startsWith('91') && digits.length === 12) {
    return digits;
  }
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return `91${digits.slice(1)}`;
  }
  return digits;
};

export const generateWhatsAppInvoiceText = (invoice: Invoice, clinic: ClinicProfile): string => {
  const itemsText = invoice.items
    .map((item, idx) => {
      const teeth = item.toothNumbers && item.toothNumbers.length > 0 
        ? ` [Teeth: ${item.toothNumbers.join(', ')}]` 
        : '';
      const surface = item.surface ? ` (Surface: ${item.surface})` : '';
      return `${idx + 1}. *${item.procedureName}*${teeth}${surface}\n   Qty: ${item.quantity} × ${formatCurrency(item.unitPrice, clinic.currencySymbol)} = *${formatCurrency(item.lineTotal, clinic.currencySymbol)}*`;
    })
    .join('\n\n');

  const discountLine = invoice.totalItemDiscount > 0 || invoice.additionalDiscountValue > 0
    ? `\n• *Discount Applied:* -${formatCurrency(invoice.totalItemDiscount + (invoice.additionalDiscountValue || 0), clinic.currencySymbol)}`
    : '';

  const taxLine = invoice.totalTax > 0
    ? `\n• *Tax / GST:* +${formatCurrency(invoice.totalTax, clinic.currencySymbol)}`
    : '';

  const paymentStatus = invoice.balanceDue === 0
    ? '✅ *PAID IN FULL*'
    : invoice.amountPaid > 0
    ? `⚠️ *PARTIALLY PAID* (Balance: ${formatCurrency(invoice.balanceDue, clinic.currencySymbol)})`
    : `🔴 *PAYMENT DUE* (${formatCurrency(invoice.balanceDue, clinic.currencySymbol)})`;

  const nextAppt = invoice.nextAppointmentDate
    ? `\n\n📅 *Scheduled Next Visit:* ${formatDate(invoice.nextAppointmentDate)}`
    : '';

  const rx = invoice.prescriptions
    ? `\n\n💊 *Prescription (Rx):*\n${invoice.prescriptions}`
    : '';

  const upiInfo = clinic.bankDetails?.upiId
    ? `\n\n📲 *Instant UPI Payment Handle:* ${clinic.bankDetails.upiId}`
    : '';

  return `🦷 *SMILE7 DENTAL CLINIC*
*${clinic.tagline}*
📍 ${clinic.addressLine1}, ${clinic.city} - ${clinic.zipCode}
📞 ${clinic.phone} | 🌐 ${clinic.website}

━━━━━━━━━━━━━━━━━━━━
📄 *DENTAL INVOICE: ${invoice.invoiceNumber}*
📅 *Date:* ${formatDate(invoice.date)}
👤 *Patient Name:* ${invoice.patientName} (${invoice.patientPhone})
🩺 *Attending Doctor:* ${invoice.doctorName || clinic.dentistInCharge}

━━━━━━━━━━━━━━━━━━━━
*TREATMENTS & PROCEDURES:*

${itemsText}

━━━━━━━━━━━━━━━━━━━━
💰 *FINANCIAL SUMMARY:*
• *Subtotal:* ${formatCurrency(invoice.subtotal, clinic.currencySymbol)}${discountLine}${taxLine}
• *Grand Total:* *${formatCurrency(invoice.grandTotal, clinic.currencySymbol)}*
• *Amount Received:* ${formatCurrency(invoice.amountPaid, clinic.currencySymbol)}
• *Balance Due:* *${formatCurrency(invoice.balanceDue, clinic.currencySymbol)}*
• *Status:* ${paymentStatus}${upiInfo}${rx}${nextAppt}

━━━━━━━━━━━━━━━━━━━━
_Thank you for choosing Smile7 Dental Clinic! Please keep this message for your medical & warranty records._`;
};

export const generateEmailInvoiceContent = (invoice: Invoice, clinic: ClinicProfile): { subject: string; body: string } => {
  const subject = `Dental Invoice #${invoice.invoiceNumber} - Smile7 Dental Clinic (${invoice.patientName})`;

  const itemsList = invoice.items
    .map((item, idx) => {
      const teeth = item.toothNumbers && item.toothNumbers.length > 0 ? ` [Teeth: ${item.toothNumbers.join(', ')}]` : '';
      return `${idx + 1}. ${item.procedureName}${teeth} - Qty: ${item.quantity} - Total: ${formatCurrency(item.lineTotal, clinic.currencySymbol)}`;
    })
    .join('\n');

  const body = `Dear ${invoice.patientName},

Thank you for visiting Smile7 Dental Clinic. Please find below the summary of your dental invoice:

========================================
SMILE7 DENTAL CLINIC
Dr. P. Manickapriya (BDS)
No. 1/2, Alapakkam Main Road, Janaki Nagar, Maduravoyal, Chennai - 600095
Phone: +91 97908 62510 | Email: care@smile7dental.com
========================================

INVOICE DETAILS:
Invoice Number: ${invoice.invoiceNumber}
Date: ${formatDate(invoice.date)}
Patient Name: ${invoice.patientName}
Attending Clinician: ${invoice.doctorName || clinic.dentistInCharge}

ITEMIZED PROCEDURES:
${itemsList}

BILL SUMMARY:
----------------------------------------
Subtotal: ${formatCurrency(invoice.subtotal, clinic.currencySymbol)}
Grand Total: ${formatCurrency(invoice.grandTotal, clinic.currencySymbol)}
Amount Paid: ${formatCurrency(invoice.amountPaid, clinic.currencySymbol)}
Balance Due: ${formatCurrency(invoice.balanceDue, clinic.currencySymbol)}
Payment Status: ${invoice.status.toUpperCase()}

${invoice.prescriptions ? `PRESCRIPTIONS (Rx):\n${invoice.prescriptions}\n\n` : ''}${invoice.clinicalNotes ? `CLINICAL NOTES:\n${invoice.clinicalNotes}\n\n` : ''}${invoice.nextAppointmentDate ? `NEXT APPOINTMENT: ${formatDate(invoice.nextAppointmentDate)}\n\n` : ''}For any queries or assistance, please contact us at +91 97908 62510 or care@smile7dental.com.

Warm regards,
Smile7 Dental Clinic Team
Maduravoyal, Chennai`;

  return { subject, body };
};

export const sendWhatsAppInvoice = (invoice: Invoice, clinic: ClinicProfile, targetPhone?: string) => {
  const phoneToUse = targetPhone || invoice.patientPhone;
  const cleanPhone = sanitizeIndianPhoneNumber(phoneToUse);
  const message = generateWhatsAppInvoiceText(invoice, clinic);
  const encodedText = encodeURIComponent(message);
  
  const whatsappUrl = cleanPhone 
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

export const sendEmailInvoice = (invoice: Invoice, clinic: ClinicProfile, targetEmail?: string) => {
  const emailToUse = targetEmail || '';
  const { subject, body } = generateEmailInvoiceContent(invoice, clinic);
  
  const mailtoUrl = `mailto:${encodeURIComponent(emailToUse)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
};
