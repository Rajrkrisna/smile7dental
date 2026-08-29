import React from 'react';
import type { Invoice, ClinicProfile } from '../../types';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

import logoIcon from '../../assets/smile7-logo-icon.png';
import logoText from '../../assets/smile7-logo-text.jpg';

interface InvoiceA4PrintProps {
  invoice: Invoice;
  clinic: ClinicProfile;
}

export const InvoiceA4Print: React.FC<InvoiceA4PrintProps> = ({ invoice, clinic }) => {
  return (
    <div id="invoice-a4-printable" className="a4-print-container bg-white text-slate-900 font-sans p-8 max-w-[210mm] mx-auto">
      {/* Letterhead Header */}
      <div className="border-b-2 border-teal-700 pb-5 mb-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <img 
                src={logoIcon} 
                alt="Smile7 Logo Icon" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <img 
                  src={logoText} 
                  alt="Smile7 Dental Clinic" 
                  className="h-7 w-auto object-contain mb-0.5"
                />
                <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                  {clinic.tagline}
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-600 space-y-0.5 pt-2">
              <p>{clinic.addressLine1}, {clinic.addressLine2}</p>
              <p>{clinic.city}, {clinic.state} - {clinic.zipCode}</p>
              <p>
                <span className="font-semibold">Phone:</span> {clinic.phone} &nbsp;|&nbsp; 
                <span className="font-semibold">Email:</span> {clinic.email}
              </p>
              {clinic.website && (
                <p><span className="font-semibold">Web:</span> {clinic.website}</p>
              )}
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="inline-block bg-teal-50 border border-teal-200 px-4 py-2 rounded-lg text-right">
              <span className="text-[11px] font-bold uppercase tracking-widest text-teal-800 block">
                DENTAL INVOICE
              </span>
              <span className="text-lg font-black text-teal-950 block">
                {invoice.invoiceNumber}
              </span>
            </div>
            <div className="text-xs text-slate-600 pt-2 space-y-0.5">
              <p><span className="font-semibold text-slate-700">Date:</span> {formatDate(invoice.date)}</p>
              {invoice.dueDate && (
                <p><span className="font-semibold text-slate-700">Due Date:</span> {formatDate(invoice.dueDate)}</p>
              )}
              {clinic.dentalCouncilNumber && (
                <p><span className="font-semibold text-slate-700">Council Reg:</span> {clinic.dentalCouncilNumber}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Patient & Doctor Information */}
      <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            PATIENT INFORMATION
          </span>
          <p className="text-sm font-bold text-slate-900">{invoice.patientName}</p>
          <p className="text-slate-600">
            {invoice.patientAge ? `${invoice.patientAge} Yrs` : ''} 
            {invoice.patientGender ? ` / ${invoice.patientGender}` : ''}
          </p>
          <p className="text-slate-600"><span className="font-medium">Phone:</span> {invoice.patientPhone}</p>
          {invoice.patientAddress && (
            <p className="text-slate-600"><span className="font-medium">Address:</span> {invoice.patientAddress}</p>
          )}
        </div>

        <div className="border-l border-slate-200 pl-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            ATTENDING CLINICIAN & TREATMENT
          </span>
          <p className="text-sm font-bold text-slate-900">{invoice.doctorName || clinic.dentistInCharge}</p>
          <p className="text-slate-600">Department of Dental Surgery</p>
          <p className="text-slate-500">{clinic.dentalCouncilNumber}</p>
          <p className="text-slate-600 mt-1">
            <span className="font-medium">Status:</span>{' '}
            <span className={`inline-block font-bold uppercase px-2 py-0.5 rounded text-[10px] ${
              invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
              invoice.status === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {invoice.status.toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      {/* Itemized Procedures Table */}
      <div className="mb-6">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-800 text-white font-bold">
              <th className="py-2.5 px-3 rounded-l-md w-8">#</th>
              <th className="py-2.5 px-3">Procedure Description</th>
              <th className="py-2.5 px-3">Tooth / Area</th>
              <th className="py-2.5 px-3 text-center w-12">Qty</th>
              <th className="py-2.5 px-3 text-right">Unit Price</th>
              <th className="py-2.5 px-3 text-right">Disc.</th>
              <th className="py-2.5 px-3 text-right rounded-r-md">Total ({clinic.currencySymbol})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {invoice.items.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-500">{index + 1}</td>
                <td className="py-2.5 px-3">
                  <p className="font-bold text-slate-800">{item.procedureName}</p>
                  {item.procedureCode && (
                    <span className="text-[10px] text-teal-700 font-mono font-medium block">
                      Code: {item.procedureCode} ({item.category})
                    </span>
                  )}
                  {item.surface && (
                    <span className="text-[10px] text-slate-500 italic block">
                      Surface: {item.surface}
                    </span>
                  )}
                  {item.notes && (
                    <p className="text-[10px] text-slate-600 mt-0.5">{item.notes}</p>
                  )}
                </td>
                <td className="py-2.5 px-3">
                  {item.toothNumbers && item.toothNumbers.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.toothNumbers.map((t, idx) => (
                        <span key={idx} className="bg-teal-50 border border-teal-200 text-teal-900 font-semibold px-1.5 py-0.5 rounded text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">General / Full Mouth</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-center font-medium text-slate-700">{item.quantity}</td>
                <td className="py-2.5 px-3 text-right text-slate-700 font-medium">
                  {formatCurrency(item.unitPrice, clinic.currencySymbol)}
                </td>
                <td className="py-2.5 px-3 text-right text-slate-500">
                  {item.discountValue > 0 ? (
                    item.discountType === 'percentage' 
                      ? `${item.discountValue}%` 
                      : formatCurrency(item.discountValue, clinic.currencySymbol)
                  ) : '—'}
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                  {formatCurrency(item.lineTotal, clinic.currencySymbol)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summary & Clinical Notes */}
      <div className="grid grid-cols-2 gap-6 pt-2 mb-6 border-t border-slate-200">
        {/* Clinical Notes & Prescriptions */}
        <div className="text-xs space-y-2">
          {invoice.clinicalNotes && (
            <div className="text-slate-700 text-[11px] p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg">
              <span className="font-bold text-amber-900 block mb-0.5">Clinical Note / Next Visit:</span>
              <p>{invoice.clinicalNotes}</p>
              {invoice.nextAppointmentDate && (
                <p className="font-semibold text-amber-900 mt-1">
                  Scheduled Next Appointment: {formatDate(invoice.nextAppointmentDate)}
                </p>
              )}
            </div>
          )}

          {invoice.prescriptions && (
            <div className="text-slate-700 text-[11px] p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg">
              <span className="font-bold text-blue-900 block mb-0.5">Prescribed Medication (Rx):</span>
              <p>{invoice.prescriptions}</p>
            </div>
          )}
        </div>

        {/* Calculation Totals */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-semibold text-slate-800">{formatCurrency(invoice.subtotal, clinic.currencySymbol)}</span>
          </div>

          {invoice.totalItemDiscount > 0 && (
            <div className="flex justify-between py-1 text-emerald-700">
              <span>Item Discounts</span>
              <span>-{formatCurrency(invoice.totalItemDiscount, clinic.currencySymbol)}</span>
            </div>
          )}

          {invoice.additionalDiscountValue > 0 && (
            <div className="flex justify-between py-1 text-emerald-700">
              <span>Special Clinic Discount ({invoice.additionalDiscountType === 'percentage' ? `${invoice.additionalDiscountValue}%` : 'Fixed'})</span>
              <span>
                -{formatCurrency(
                  invoice.additionalDiscountType === 'percentage'
                    ? ((invoice.subtotal - invoice.totalItemDiscount) * invoice.additionalDiscountValue) / 100
                    : invoice.additionalDiscountValue,
                  clinic.currencySymbol
                )}
              </span>
            </div>
          )}

          <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black text-slate-900">
            <span>Grand Total</span>
            <span className="text-base text-teal-900">{formatCurrency(invoice.grandTotal, clinic.currencySymbol)}</span>
          </div>

          <div className="flex justify-between py-1 bg-emerald-50 px-2 rounded font-semibold text-emerald-900">
            <span>Amount Paid</span>
            <span>{formatCurrency(invoice.amountPaid, clinic.currencySymbol)}</span>
          </div>

          <div className={`flex justify-between py-1 px-2 rounded font-bold ${
            invoice.balanceDue > 0 ? 'bg-rose-50 text-rose-900' : 'bg-slate-100 text-slate-700'
          }`}>
            <span>Balance Due</span>
            <span>{formatCurrency(invoice.balanceDue, clinic.currencySymbol)}</span>
          </div>
        </div>
      </div>

      {/* Payment Transactions Record */}
      {invoice.payments && invoice.payments.length > 0 && (
        <div className="border border-slate-200 rounded-lg p-3 mb-6 bg-slate-50 text-xs">
          <p className="font-bold text-slate-800 mb-1.5 uppercase text-[10px] tracking-wider">
            Payment Receipts & Transactions
          </p>
          <div className="space-y-1">
            {invoice.payments.map((p, idx) => (
              <div key={p.id || idx} className="flex justify-between text-slate-600 py-0.5 border-b border-slate-200 last:border-0">
                <span>
                  <span className="font-medium text-slate-900">{formatDateTime(p.date)}</span> — {p.method.toUpperCase()} 
                  {p.referenceNumber ? ` (Ref: ${p.referenceNumber})` : ''}
                </span>
                <span className="font-bold text-slate-900">{formatCurrency(p.amount, clinic.currencySymbol)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Terms & Doctor Signature */}
      <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end text-xs">
        <div className="max-w-[65%] text-[10px] text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">Terms & Conditions:</p>
          <p>{clinic.invoiceFooterNote}</p>
          <p className="italic text-slate-400">
            This is an official computer-generated dental invoice issued by Smile7 Dental Clinic.
          </p>
        </div>

        <div className="text-center space-y-1">
          <div className="w-40 border-b border-slate-800 pb-8 text-center">
            {/* Signature Area */}
          </div>
          <p className="font-bold text-slate-900 text-xs">{clinic.dentistInCharge}</p>
          <p className="text-[10px] text-slate-500">Authorized Signatory / Seal</p>
        </div>
      </div>
    </div>
  );
};
