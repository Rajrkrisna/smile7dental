import type { Invoice, ClinicProfile } from '../types';

/**
 * Creates a portable, URL-safe base64 token containing the invoice snapshot
 * and clinic branding directly from Settings (name, tagline, address, registration).
 * Compatible with Smile7dental's decodeInvoicePayload.
 */
export function createOnlineInvoicePayload(invoice: Invoice, clinic: ClinicProfile): string {
  try {
    const payloadObj = {
      i: {
        id: invoice.id,
        num: invoice.invoiceNumber,
        dt: invoice.date,
        pnm: invoice.patientName,
        pph: invoice.patientPhone || '',
        pag: 30,
        pgn: 'other',
        doc: invoice.doctor || clinic.doctorName || 'Dr. P. Manickapriya',
        sub: invoice.subtotal,
        tdisc: invoice.discount || 0,
        tax: invoice.taxAmount || 0,
        tot: invoice.total,
        pd: invoice.paidAmount,
        dueAmt: invoice.balance,
        st: (invoice.status || 'paid').toLowerCase(),
        note: invoice.notes || '',
        items: invoice.items.map((it, idx) => ({
          id: it.id || `item_${idx}`,
          n: it.procedureName,
          c: it.procedureCode || 'S7D',
          q: 1,
          p: it.cost,
          t: it.teeth || [],
          s: it.surfaces || ''
        }))
      },
      c: {
        nm: clinic.clinicName || 'Smile7 Dental Clinic',
        tag: clinic.tagline || 'Prevent Now! Smile Forever!',
        doc: clinic.doctorName || 'Dr. P. Manickapriya',
        dcn: clinic.dentalCouncil || clinic.registrationNumber || 'Tamil Nadu Dental Council Reg. #24892',
        ph: clinic.phone || '+91 97908 62510',
        em: clinic.email || 'care@smile7dental.com',
        adr: clinic.address || 'No. 1/2, Alapakkam Main Road, Janaki Nagar, Maduravoyal',
        ct: clinic.city || 'Chennai, Tamil Nadu - 600095'
      }
    };

    const jsonStr = JSON.stringify(payloadObj);
    return btoa(encodeURIComponent(jsonStr));
  } catch (err) {
    console.error('Failed to create online invoice token:', err);
    return '';
  }
}

/**
 * Generates an ultra-short, single-line online invoice link on smile7dental.com.
 * Stays on ONE clean line in WhatsApp without wrapping (e.g. https://smile7dental.com/?inv=S7D-1005&p=rk&t=2465&th=16).
 * Opening this link immediately and directly triggers the official PDF download.
 */
export function getOnlineInvoiceUrl(invoice: Invoice, clinic?: ClinicProfile): string {
  const params = new URLSearchParams();
  params.set('inv', invoice.invoiceNumber);
  params.set('p', invoice.patientName);
  params.set('t', String(invoice.total));
  
  if (invoice.balance > 0) {
    params.set('b', String(invoice.balance));
  }

  if (invoice.items && invoice.items.length > 0) {
    const firstItem = invoice.items[0];
    const teeth = firstItem.teeth || [];
    if (teeth.length > 0) {
      params.set('th', teeth.join(','));
    }
  }

  return `https://smile7dental.com/?${params.toString()}`;
}
