import type { Invoice, ClinicProfile } from '../types';
import { formatCurrency, formatDate } from './formatters';

export const triggerPrint = (printSectionId: string) => {
  // Add a print-active class to body with targeted mode
  document.body.classList.add('printing-active');
  const section = document.getElementById(printSectionId);
  if (section) {
    section.classList.add('active-print-target');
  }

  window.print();

  // Cleanup after print dialog
  setTimeout(() => {
    document.body.classList.remove('printing-active');
    if (section) {
      section.classList.remove('active-print-target');
    }
  }, 500);
};

export const exportToJSON = (data: unknown, filename: string) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (rows: Record<string, unknown>[], filename: string) => {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(header => {
        const val = row[header] ?? '';
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generates a self-contained, high-resolution HTML document of the official Dental Tax Invoice
 */
export const generateInvoiceHtmlDocument = (invoice: Invoice, clinic: ClinicProfile): string => {
  const itemsRows = invoice.items.map((item, idx) => {
    const teeth = item.toothNumbers && item.toothNumbers.length > 0 
      ? `<div style="font-size:11px; color:#0284c7; font-weight:600; margin-top:2px;">Teeth: ${item.toothNumbers.join(', ')}${item.surface ? ` (${item.surface})` : ''}</div>` 
      : '';
    const notes = item.notes ? `<div style="font-size:10px; color:#64748b; margin-top:2px;">${item.notes}</div>` : '';
    
    return `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 12px; text-align: center; color: #64748b; font-size: 11px;">${idx + 1}</td>
        <td style="padding: 10px 12px;">
          <div style="font-weight: 700; color: #0f172a; font-size: 12px;">${item.procedureName}</div>
          ${teeth}
          ${notes}
        </td>
        <td style="padding: 10px 12px; font-family: monospace; font-size: 11px; color: #64748b;">${item.procedureCode || 'S7D'}</td>
        <td style="padding: 10px 12px; text-align: center; font-weight: 600; font-size: 12px;">${item.quantity}</td>
        <td style="padding: 10px 12px; text-align: right; font-size: 12px;">${formatCurrency(item.unitPrice, clinic.currencySymbol)}</td>
        <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #0f172a; font-size: 12px;">${formatCurrency(item.lineTotal, clinic.currencySymbol)}</td>
      </tr>
    `;
  }).join('');

  const discountRow = (invoice.totalItemDiscount > 0 || (invoice.additionalDiscountValue || 0) > 0)
    ? `<tr>
        <td style="padding: 4px 0; color: #64748b;">Discount:</td>
        <td style="padding: 4px 0; text-align: right; color: #16a34a; font-weight: 600;">-${formatCurrency(invoice.totalItemDiscount + (invoice.additionalDiscountValue || 0), clinic.currencySymbol)}</td>
      </tr>`
    : '';

  const taxRow = (invoice.totalTax > 0)
    ? `<tr>
        <td style="padding: 4px 0; color: #64748b;">Tax / GST:</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 600;">+${formatCurrency(invoice.totalTax, clinic.currencySymbol)}</td>
      </tr>`
    : '';

  const paymentStatusBadge = invoice.balanceDue === 0
    ? `<span style="background-color: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; padding: 4px 10px; border-radius: 9999px; font-weight: 800; font-size: 11px; text-transform: uppercase;">PAID IN FULL</span>`
    : invoice.amountPaid > 0
    ? `<span style="background-color: #fef9c3; color: #854d0e; border: 1px solid #fef08a; padding: 4px 10px; border-radius: 9999px; font-weight: 800; font-size: 11px; text-transform: uppercase;">PARTIAL PAYMENT</span>`
    : `<span style="background-color: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; padding: 4px 10px; border-radius: 9999px; font-weight: 800; font-size: 11px; text-transform: uppercase;">PAYMENT DUE</span>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dental Invoice ${invoice.invoiceNumber} - ${clinic.name}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #1e293b; line-height: 1.4; padding: 20px; }
    .invoice-card { max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    @media print {
      body { background: #ffffff; padding: 0; }
      .invoice-card { border: none; box-shadow: none; padding: 0; max-width: 100%; border-radius: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 800px; margin: 0 auto 16px auto; display: flex; justify-content: space-between; align-items: center;">
    <span style="font-size: 12px; color: #64748b; font-weight: 600;">Official Patient Invoice</span>
    <button onclick="window.print()" style="background: #004884; color: #ffffff; border: none; padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer;">Print / Save as PDF</button>
  </div>

  <div class="invoice-card">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #004884; padding-bottom: 20px;">
      <div>
        <h1 style="font-size: 24px; font-weight: 900; color: #004884; letter-spacing: -0.5px;">${clinic.name}</h1>
        <p style="font-size: 12px; color: #0284c7; font-weight: 600; margin-top: 2px;">${clinic.tagline}</p>
        <div style="font-size: 11px; color: #64748b; margin-top: 6px; line-height: 1.5;">
          ${clinic.addressLine1}, ${clinic.city} - ${clinic.zipCode}<br>
          Phone: <strong>${clinic.phone}</strong> | Email: ${clinic.email}
          ${clinic.taxId ? `<br>GSTIN / Tax Reg: <strong>${clinic.taxId}</strong>` : ''}
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 20px; font-weight: 900; color: #0f172a; letter-spacing: 0.5px;">TAX INVOICE</div>
        <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: #004884; margin-top: 4px;">#${invoice.invoiceNumber}</div>
        <div style="margin-top: 8px;">${paymentStatusBadge}</div>
      </div>
    </div>

    <!-- Meta Info Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; padding: 16px; background: #f8fafc; border-radius: 12px; font-size: 12px;">
      <div>
        <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">PATIENT DETAILS</div>
        <div style="font-size: 14px; font-weight: 800; color: #0f172a;">${invoice.patientName}</div>
        <div style="color: #475569; margin-top: 2px;">Phone: ${invoice.patientPhone || 'N/A'}</div>
        <div style="color: #475569;">Age/Gender: ${invoice.patientAge || '—'} Yrs / ${invoice.patientGender || '—'}</div>
        ${invoice.patientAddress ? `<div style="color: #475569; margin-top: 2px;">Address: ${invoice.patientAddress}</div>` : ''}
      </div>

      <div style="text-align: right;">
        <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">CLINICAL RECORD</div>
        <div style="color: #475569;">Date of Treatment: <strong>${formatDate(invoice.date)}</strong></div>
        <div style="color: #475569; margin-top: 2px;">Attending Doctor: <strong>${invoice.doctorName || clinic.dentistInCharge}</strong></div>
        <div style="color: #475569; margin-top: 2px;">${clinic.dentalCouncilNumber || 'DCI Reg. Certified'}</div>
      </div>
    </div>

    <!-- Items Table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase;">
          <th style="padding: 10px 12px; width: 35px; text-align: center;">#</th>
          <th style="padding: 10px 12px; text-align: left;">Treatment / Procedure</th>
          <th style="padding: 10px 12px; text-align: left; width: 70px;">CDT</th>
          <th style="padding: 10px 12px; width: 45px; text-align: center;">Qty</th>
          <th style="padding: 10px 12px; width: 90px; text-align: right;">Rate</th>
          <th style="padding: 10px 12px; width: 100px; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <!-- Totals Section -->
    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; align-items: start; margin-bottom: 24px;">
      <div style="font-size: 11px; color: #64748b; padding: 12px; background: #f8fafc; border-radius: 8px;">
        ${invoice.prescriptions ? `<div style="margin-bottom: 8px;"><strong style="color:#0f172a;">Prescription (Rx):</strong><br>${invoice.prescriptions}</div>` : ''}
        ${invoice.clinicalNotes ? `<div style="margin-bottom: 8px;"><strong style="color:#0f172a;">Clinical Notes:</strong><br>${invoice.clinicalNotes}</div>` : ''}
        ${invoice.nextAppointmentDate ? `<div><strong style="color:#004884;">Next Appointment:</strong> ${formatDate(invoice.nextAppointmentDate)}</div>` : ''}
      </div>

      <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Subtotal:</td>
          <td style="padding: 4px 0; text-align: right; font-weight: 600;">${formatCurrency(invoice.subtotal, clinic.currencySymbol)}</td>
        </tr>
        ${discountRow}
        ${taxRow}
        <tr style="border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; font-size: 15px; font-weight: 900; color: #004884;">
          <td style="padding: 8px 0;">Grand Total:</td>
          <td style="padding: 8px 0; text-align: right;">${formatCurrency(invoice.grandTotal, clinic.currencySymbol)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #16a34a; font-weight: 700;">Amount Paid:</td>
          <td style="padding: 6px 0; text-align: right; color: #16a34a; font-weight: 700;">${formatCurrency(invoice.amountPaid, clinic.currencySymbol)}</td>
        </tr>
        <tr style="font-weight: 800; font-size: 13px; color: ${invoice.balanceDue > 0 ? '#dc2626' : '#64748b'};">
          <td style="padding: 4px 0;">Balance Due:</td>
          <td style="padding: 4px 0; text-align: right;">${formatCurrency(invoice.balanceDue, clinic.currencySymbol)}</td>
        </tr>
      </table>
    </div>

    <!-- Footer Signature -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 10px; color: #64748b;">
      <div>
        <p>${clinic.invoiceFooterNote}</p>
        <p style="margin-top: 4px; color: #94a3b8;">Computer Generated Authentic Dental Invoice • Smile7 Dental Clinic</p>
      </div>
      <div style="text-align: center; min-width: 160px;">
        <div style="font-weight: 800; font-size: 12px; color: #0f172a;">${invoice.doctorName || clinic.dentistInCharge}</div>
        <div style="color: #0284c7; font-weight: 600;">Authorized Signatory</div>
      </div>
    </div>
  </div>

  <script>
    // Automatically open print/save-as-PDF dialog upon loading
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 400);
    });
  </script>
</body>
</html>`;
};

/**
 * Triggers direct browser download of the standalone HTML/PDF invoice file
 */
export const downloadStandaloneInvoiceFile = (invoice: Invoice, clinic: ClinicProfile) => {
  const htmlContent = generateInvoiceHtmlDocument(invoice, clinic);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Smile7Dental_Invoice_${invoice.invoiceNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

