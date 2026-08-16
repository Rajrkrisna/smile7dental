import type { Invoice, ClinicProfile, InvoiceItem } from '../types';
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

/**
 * Creates a portable, URL-safe base64 token containing the invoice snapshot
 * so patients can view and download their official invoice on any smartphone or browser.
 */
export const encodeInvoicePayload = (invoice: Invoice, clinic: ClinicProfile): string => {
  try {
    const compactData = {
      i: {
        id: invoice.id,
        num: invoice.invoiceNumber,
        dt: invoice.date,
        due: invoice.dueDate,
        pid: invoice.patientId,
        pnm: invoice.patientName,
        pph: invoice.patientPhone,
        pag: invoice.patientAge,
        pgn: invoice.patientGender,
        padr: invoice.patientAddress,
        doc: invoice.doctorName,
        items: invoice.items.map(it => ({
          n: it.procedureName,
          c: it.procedureCode,
          cat: it.category,
          q: it.quantity,
          p: it.unitPrice,
          t: it.toothNumbers,
          s: it.surface,
          d: it.discountValue,
          dt: it.discountType,
          tx: it.taxPercent,
          lt: it.lineTotal
        })),
        sub: invoice.subtotal,
        tdisc: invoice.totalItemDiscount,
        atyp: invoice.additionalDiscountType,
        aval: invoice.additionalDiscountValue,
        tax: invoice.totalTax,
        tot: invoice.grandTotal,
        pd: invoice.amountPaid,
        dueAmt: invoice.balanceDue,
        st: invoice.status,
        note: invoice.clinicalNotes,
        rx: invoice.prescriptions,
        nxt: invoice.nextAppointmentDate
      },
      c: {
        nm: clinic.name,
        tag: clinic.tagline,
        doc: clinic.dentistInCharge,
        ph: clinic.phone,
        em: clinic.email,
        wb: clinic.website,
        adr: clinic.addressLine1,
        ct: clinic.city,
        st: clinic.state,
        zip: clinic.zipCode,
        tx: clinic.taxId,
        dcn: clinic.dentalCouncilNumber,
        cur: clinic.currencySymbol,
        ccode: clinic.currencyCode,
        upi: clinic.bankDetails?.upiId
      }
    };

    const jsonStr = JSON.stringify(compactData);
    const base64 = btoa(encodeURIComponent(jsonStr));
    return base64;
  } catch (err) {
    console.error('Failed to encode invoice payload token:', err);
    return '';
  }
};

/**
 * Decodes the portable invoice token from the URL
 */
export const decodeInvoicePayload = (token: string): { invoice: Invoice; clinic: ClinicProfile } | null => {
  try {
    const jsonStr = decodeURIComponent(atob(token));
    const data = JSON.parse(jsonStr);
    if (!data || !data.i || !data.c) return null;

    const i = data.i;
    const c = data.c;

    const items: InvoiceItem[] = (i.items || []).map((it: any, index: number) => ({
      id: `item_${index}`,
      procedureId: it.c || `proc_${index}`,
      procedureCode: it.c || '',
      procedureName: it.n || 'Dental Procedure',
      category: it.cat || 'general',
      quantity: it.q || 1,
      unitPrice: it.p || 0,
      toothNumbers: it.t || [],
      surface: it.s,
      discountType: it.dt || 'fixed',
      discountValue: it.d || 0,
      taxPercent: it.tx || 0,
      lineTotal: it.lt || 0
    }));

    const invoice: Invoice = {
      id: i.id,
      invoiceNumber: i.num,
      patientId: i.pid || 'PAT-TEMP',
      patientName: i.pnm || 'Patient',
      patientPhone: i.pph || '',
      patientAge: i.pag || 30,
      patientGender: i.pgn || 'other',
      patientAddress: i.padr,
      doctorName: i.doc || 'Dr. P. Manickapriya',
      date: i.dt || new Date().toISOString(),
      dueDate: i.due || i.dt || new Date().toISOString(),
      items: items,
      subtotal: i.sub || 0,
      totalItemDiscount: i.tdisc || 0,
      additionalDiscountType: i.atyp || 'fixed',
      additionalDiscountValue: i.aval || 0,
      totalTax: i.tax || 0,
      grandTotal: i.tot || 0,
      amountPaid: i.pd || 0,
      balanceDue: i.dueAmt || 0,
      status: i.st || 'paid',
      payments: [],
      clinicalNotes: i.note,
      prescriptions: i.rx,
      nextAppointmentDate: i.nxt,
      createdAt: i.dt || new Date().toISOString(),
      updatedAt: i.dt || new Date().toISOString()
    };

    const clinic: ClinicProfile = {
      name: c.nm || 'Smile7 Dental Clinic',
      tagline: c.tag || 'Precision Dental Care Redefined for Comfort',
      dentistInCharge: c.doc || 'Dr. P. Manickapriya',
      registrationNumber: '',
      dentalCouncilNumber: c.dcn || 'Tamil Nadu Dental Council Reg. #24892',
      taxId: c.tx || '',
      phone: c.ph || '+91 97908 62510',
      email: c.em || 'care@smile7dental.com',
      website: c.wb || 'https://smile7dental.com/',
      addressLine1: c.adr || 'No. 1/2, Alapakkam Main Road, Janaki Nagar, Maduravoyal',
      addressLine2: '',
      city: c.ct || 'Chennai',
      state: c.st || 'Tamil Nadu',
      zipCode: c.zip || '600095',
      currencySymbol: c.cur || '₹',
      currencyCode: c.ccode || 'INR',
      defaultTaxRate: 0,
      defaultToothNotation: 'fdi',
      invoicePrefix: 'S7D',
      invoiceFooterNote: 'Thank you for choosing Smile7 Dental Clinic. Please keep this invoice for warranty and clinical insurance records.',
      bankDetails: {
        accountName: c.nm || 'Smile7 Dental Clinic',
        accountNumber: '',
        ifscOrRouting: '',
        bankName: '',
        upiId: c.upi || '9790862510@okaxis'
      }
    };

    return { invoice, clinic };
  } catch (err) {
    console.error('Failed to decode invoice token:', err);
    return null;
  }
};

/**
 * Generates the permanent public download & viewing link for the patient
 */
export const generateInvoiceDownloadUrl = (
  invoice: Invoice, 
  clinic: ClinicProfile, 
  customSubdomain?: string
): string => {
  const token = encodeInvoicePayload(invoice, clinic);
  
  // If in browser development mode on localhost, use current origin
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const baseOrigin = isLocal 
    ? window.location.origin 
    : `https://${customSubdomain || clinic.website?.replace(/https?:\/\//, '').replace(/\/$/, '') || 'billing.smile7dental.com'}`;

  return `${baseOrigin}/?view=invoice&id=${invoice.id}&token=${token}`;
};

export const generateWhatsAppInvoiceText = (
  invoice: Invoice, 
  clinic: ClinicProfile,
  customSubdomain?: string
): string => {
  const downloadUrl = generateInvoiceDownloadUrl(invoice, clinic, customSubdomain);

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
📥 *DOWNLOAD OFFICIAL PDF INVOICE:*
👉 ${downloadUrl}

━━━━━━━━━━━━━━━━━━━━
_Thank you for choosing Smile7 Dental Clinic! Please keep this message and download link for your medical records._`;
};

export const generateEmailInvoiceContent = (
  invoice: Invoice, 
  clinic: ClinicProfile,
  customSubdomain?: string
): { subject: string; body: string } => {
  const downloadUrl = generateInvoiceDownloadUrl(invoice, clinic, customSubdomain);
  const subject = `Dental Invoice #${invoice.invoiceNumber} - Smile7 Dental Clinic (${invoice.patientName})`;

  const itemsList = invoice.items
    .map((item, idx) => {
      const teeth = item.toothNumbers && item.toothNumbers.length > 0 ? ` [Teeth: ${item.toothNumbers.join(', ')}]` : '';
      return `${idx + 1}. ${item.procedureName}${teeth} - Qty: ${item.quantity} - Total: ${formatCurrency(item.lineTotal, clinic.currencySymbol)}`;
    })
    .join('\n');

  const body = `Dear ${invoice.patientName},

Thank you for visiting Smile7 Dental Clinic. Please find below the summary and download link for your official dental tax invoice:

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

${invoice.prescriptions ? `PRESCRIPTIONS (Rx):\n${invoice.prescriptions}\n\n` : ''}${invoice.clinicalNotes ? `CLINICAL NOTES:\n${invoice.clinicalNotes}\n\n` : ''}${invoice.nextAppointmentDate ? `NEXT APPOINTMENT: ${formatDate(invoice.nextAppointmentDate)}\n\n` : ''}========================================
DOWNLOAD & PRINT OFFICIAL PDF INVOICE:
Click the link below to view or download your official digital invoice:
${downloadUrl}
========================================

For any assistance or appointments, please contact us at +91 97908 62510 or care@smile7dental.com.

Warm regards,
Dr. P. Manickapriya & Smile7 Dental Clinic Team
Maduravoyal, Chennai`;

  return { subject, body };
};

export const sendWhatsAppInvoice = (
  invoice: Invoice, 
  clinic: ClinicProfile, 
  targetPhone?: string,
  customSubdomain?: string
) => {
  const phoneToUse = targetPhone || invoice.patientPhone;
  const cleanPhone = sanitizeIndianPhoneNumber(phoneToUse);
  const message = generateWhatsAppInvoiceText(invoice, clinic, customSubdomain);
  const encodedText = encodeURIComponent(message);
  
  const whatsappUrl = cleanPhone 
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

export const sendEmailInvoice = (
  invoice: Invoice, 
  clinic: ClinicProfile, 
  targetEmail?: string,
  customSubdomain?: string
) => {
  const emailToUse = targetEmail || '';
  const { subject, body } = generateEmailInvoiceContent(invoice, clinic, customSubdomain);
  
  const mailtoUrl = `mailto:${encodeURIComponent(emailToUse)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
};
