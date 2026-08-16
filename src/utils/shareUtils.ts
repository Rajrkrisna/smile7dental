import type { Invoice, ClinicProfile, InvoiceItem } from '../types';

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
 * Creates a compact, URL-safe base64 token containing the invoice snapshot
 * so patients can download their official invoice instantly on any smartphone or browser.
 */
export const encodeInvoicePayload = (invoice: Invoice, _clinic: ClinicProfile): string => {
  try {
    const compactArr = [
      invoice.id,                             // 0: id
      invoice.invoiceNumber,                  // 1: num
      invoice.date,                           // 2: dt
      invoice.patientName,                    // 3: pnm
      invoice.patientPhone || '',             // 4: pph
      invoice.patientAge || 0,                // 5: pag
      invoice.patientGender || '',            // 6: pgn
      invoice.patientAddress || '',           // 7: padr
      invoice.doctorName || '',               // 8: doc
      invoice.subtotal,                       // 9: sub
      invoice.totalItemDiscount + (invoice.additionalDiscountValue || 0), // 10: disc
      invoice.totalTax,                       // 11: tax
      invoice.grandTotal,                     // 12: tot
      invoice.amountPaid,                     // 13: pd
      invoice.balanceDue,                     // 14: due
      invoice.status,                         // 15: st
      invoice.clinicalNotes || '',            // 16: note
      invoice.prescriptions || '',            // 17: rx
      invoice.nextAppointmentDate || '',      // 18: nxt
      invoice.items.map(it => [               // 19: items
        it.procedureName,
        it.procedureCode || 'S7D',
        it.quantity,
        it.unitPrice,
        it.lineTotal,
        it.toothNumbers || [],
        it.surface || ''
      ])
    ];

    const jsonStr = JSON.stringify(compactArr);
    return btoa(encodeURIComponent(jsonStr));
  } catch (err) {
    console.error('Failed to encode compact invoice token:', err);
    return '';
  }
};

/**
 * Decodes the portable invoice token from the URL (supports both compact array and legacy object schemas)
 */
export const decodeInvoicePayload = (token: string): { invoice: Invoice; clinic: ClinicProfile } | null => {
  try {
    const jsonStr = decodeURIComponent(atob(token));
    const data = JSON.parse(jsonStr);
    if (!data) return null;

    const defaultClinic: ClinicProfile = {
      name: 'Smile7 Dental Clinic',
      tagline: 'Precision Dental Care Redefined for Comfort',
      dentistInCharge: 'Dr. P. Manickapriya',
      registrationNumber: '',
      dentalCouncilNumber: 'Tamil Nadu Dental Council Reg. #24892',
      taxId: '',
      phone: '+91 97908 62510',
      email: 'care@smile7dental.com',
      website: 'https://smile7dental.com/',
      addressLine1: 'No. 1/2, Alapakkam Main Road, Janaki Nagar, Maduravoyal',
      addressLine2: '',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600095',
      currencySymbol: '₹',
      currencyCode: 'INR',
      defaultTaxRate: 0,
      defaultToothNotation: 'fdi',
      invoicePrefix: 'S7D',
      invoiceFooterNote: 'Thank you for choosing Smile7 Dental Clinic. Please keep this invoice for warranty and clinical insurance records.',
      bankDetails: {
        accountName: 'Smile7 Dental Clinic',
        accountNumber: '',
        ifscOrRouting: '',
        bankName: '',
        upiId: '9790862510@okaxis'
      }
    };

    // Compact Array format (v2)
    if (Array.isArray(data)) {
      const items: InvoiceItem[] = (data[19] || []).map((it: any, index: number) => ({
        id: `item_${index}`,
        procedureId: it[1] || `proc_${index}`,
        procedureCode: it[1] || 'S7D',
        procedureName: it[0] || 'Dental Procedure',
        category: 'general',
        quantity: it[2] || 1,
        unitPrice: it[3] || 0,
        lineTotal: it[4] || 0,
        toothNumbers: it[5] || [],
        surface: it[6] || undefined,
        discountType: 'fixed',
        discountValue: 0,
        taxPercent: 0
      }));

      const invoice: Invoice = {
        id: data[0] || 'INV-TEMP',
        invoiceNumber: data[1] || 'S7D-0000',
        date: data[2] || new Date().toISOString(),
        dueDate: data[2] || new Date().toISOString(),
        patientId: 'PAT-PORTAL',
        patientName: data[3] || 'Patient',
        patientPhone: data[4] || '',
        patientAge: data[5] || 30,
        patientGender: data[6] || 'other',
        patientAddress: data[7] || undefined,
        doctorName: data[8] || 'Dr. P. Manickapriya',
        subtotal: data[9] || 0,
        totalItemDiscount: data[10] || 0,
        additionalDiscountType: 'fixed',
        additionalDiscountValue: 0,
        totalTax: data[11] || 0,
        grandTotal: data[12] || 0,
        amountPaid: data[13] || 0,
        balanceDue: data[14] || 0,
        status: data[15] || 'paid',
        clinicalNotes: data[16] || undefined,
        prescriptions: data[17] || undefined,
        nextAppointmentDate: data[18] || undefined,
        items: items,
        payments: [],
        createdAt: data[2] || new Date().toISOString(),
        updatedAt: data[2] || new Date().toISOString()
      };

      return { invoice, clinic: defaultClinic };
    }

    // Legacy Object format (v1)
    if (data.i) {
      const i = data.i;
      const c = data.c || {};

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
        ...defaultClinic,
        name: c.nm || defaultClinic.name,
        tagline: c.tag || defaultClinic.tagline,
        dentistInCharge: c.doc || defaultClinic.dentistInCharge,
        dentalCouncilNumber: c.dcn || defaultClinic.dentalCouncilNumber,
        phone: c.ph || defaultClinic.phone,
        email: c.em || defaultClinic.email,
        website: c.wb || defaultClinic.website,
        addressLine1: c.adr || defaultClinic.addressLine1,
        city: c.ct || defaultClinic.city,
        state: c.st || defaultClinic.state,
        zipCode: c.zip || defaultClinic.zipCode
      };

      return { invoice, clinic };
    }

    return null;
  } catch (err) {
    console.error('Failed to decode invoice token:', err);
    return null;
  }
};

/**
 * Generates the clean, short download link for the patient
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
    : (customSubdomain ? `https://${customSubdomain.replace(/https?:\/\//, '').replace(/\/$/, '')}` : 'https://smile7dental.com');

  return `${baseOrigin}/?d=${token}`;
};

/**
 * Confidential, clean WhatsApp notification without exposing itemized procedure and pricing details
 */
export const generateWhatsAppInvoiceText = (
  invoice: Invoice, 
  clinic: ClinicProfile,
  customSubdomain?: string
): string => {
  const downloadUrl = generateInvoiceDownloadUrl(invoice, clinic, customSubdomain);

  return `🦷 *SMILE7 DENTAL CLINIC*
Dr. P. Manickapriya (BDS) • Chennai

Dear *${invoice.patientName}*,

Thank you for your visit today. Your official dental invoice (*#${invoice.invoiceNumber}*) is ready.

📥 *Click to Download Invoice (PDF):*
👉 ${downloadUrl}

📍 No. 1/2, Alapakkam Main Road, Maduravoyal
📞 +91 97908 62510 | 🌐 smile7dental.com`;
};

/**
 * Confidential, clean Email notification without exposing itemized procedure details
 */
export const generateEmailInvoiceContent = (
  invoice: Invoice, 
  clinic: ClinicProfile,
  customSubdomain?: string
): { subject: string; body: string } => {
  const downloadUrl = generateInvoiceDownloadUrl(invoice, clinic, customSubdomain);
  const subject = `Invoice #${invoice.invoiceNumber} - Smile7 Dental Clinic (${invoice.patientName})`;

  const body = `Dear ${invoice.patientName},

Thank you for visiting Smile7 Dental Clinic.

Your official dental invoice #${invoice.invoiceNumber} has been generated and is ready for download.

Download Your Official Invoice:
${downloadUrl}

If you have any questions or require clinical follow-up, please reach out to us at +91 97908 62510 or care@smile7dental.com.

Warm regards,
Dr. P. Manickapriya
Smile7 Dental Clinic
Maduravoyal, Chennai - 600095
https://smile7dental.com`;

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

