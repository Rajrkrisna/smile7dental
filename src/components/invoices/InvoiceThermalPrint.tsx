import React from 'react';
import type { Invoice, ClinicProfile } from '../../types';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

import logoIcon from '../../assets/smile7-logo-icon.png';

interface InvoiceThermalPrintProps {
  invoice: Invoice;
  clinic: ClinicProfile;
}

export const InvoiceThermalPrint: React.FC<InvoiceThermalPrintProps> = ({ invoice, clinic }) => {
  return (
    <div id="invoice-thermal-printable" className="thermal-print-container bg-white text-black font-mono text-[11px] leading-tight p-4 max-w-[80mm] mx-auto border border-dashed border-slate-300">
      {/* Clinic Header */}
      <div className="text-center pb-2 border-b border-black">
        <img 
          src={logoIcon} 
          alt="Smile7 Logo" 
          className="w-8 h-8 object-contain mx-auto mb-1 grayscale contrast-200" 
        />
        <p className="text-base font-bold uppercase tracking-tight">{clinic.name}</p>
        <p className="text-[10px]">{clinic.addressLine1}</p>
        <p className="text-[10px]">{clinic.city}, {clinic.state} {clinic.zipCode}</p>
        <p className="text-[10px]">Tel: {clinic.phone}</p>
        {clinic.taxId && <p className="text-[10px]">Tax ID: {clinic.taxId}</p>}
      </div>

      {/* Invoice & Patient Meta */}
      <div className="py-2 border-b border-dashed border-black space-y-0.5">
        <div className="flex justify-between">
          <span>INV: {invoice.invoiceNumber}</span>
          <span>{formatDate(invoice.date)}</span>
        </div>
        <div>
          <span>Patient: {invoice.patientName}</span>
        </div>
        <div>
          <span>Doctor: {invoice.doctorName || clinic.dentistInCharge}</span>
        </div>
      </div>

      {/* Items list */}
      <div className="py-2 border-b border-black space-y-1.5">
        <div className="flex justify-between font-bold border-b border-dashed border-black pb-1">
          <span>TREATMENT</span>
          <span>AMOUNT</span>
        </div>
        {invoice.items.map((item, idx) => (
          <div key={item.id || idx} className="space-y-0.5">
            <div className="flex justify-between font-medium">
              <span className="truncate max-w-[180px]">{item.procedureName}</span>
              <span>{formatCurrency(item.lineTotal, clinic.currencySymbol)}</span>
            </div>
            <div className="text-[9px] text-slate-600 flex justify-between">
              <span>
                {item.quantity}x @ {formatCurrency(item.unitPrice, clinic.currencySymbol)}
                {item.toothNumbers?.length ? ` [Teeth: ${item.toothNumbers.join(', ')}]` : ''}
              </span>
              {item.discountValue > 0 && <span>(Disc)</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Financial Summary */}
      <div className="py-2 border-b border-dashed border-black space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(invoice.subtotal, clinic.currencySymbol)}</span>
        </div>
        {invoice.totalItemDiscount > 0 && (
          <div className="flex justify-between">
            <span>Item Disc:</span>
            <span>-{formatCurrency(invoice.totalItemDiscount, clinic.currencySymbol)}</span>
          </div>
        )}
        {invoice.additionalDiscountValue > 0 && (
          <div className="flex justify-between">
            <span>Spl. Disc:</span>
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
        {invoice.totalTax > 0 && (
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>{formatCurrency(invoice.totalTax, clinic.currencySymbol)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs font-bold pt-1 border-t border-black">
          <span>TOTAL:</span>
          <span>{formatCurrency(invoice.grandTotal, clinic.currencySymbol)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>PAID:</span>
          <span>{formatCurrency(invoice.amountPaid, clinic.currencySymbol)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>BALANCE DUE:</span>
          <span>{formatCurrency(invoice.balanceDue, clinic.currencySymbol)}</span>
        </div>
      </div>

      {/* Payment details */}
      {invoice.payments && invoice.payments.length > 0 && (
        <div className="py-2 border-b border-dashed border-black text-[9px] space-y-0.5">
          <p className="font-bold">PAYMENTS RECEIVED:</p>
          {invoice.payments.map((p, i) => (
            <div key={i} className="flex justify-between">
              <span>{formatDateTime(p.date)} ({p.method.toUpperCase()})</span>
              <span>{formatCurrency(p.amount, clinic.currencySymbol)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-3 space-y-1 text-[10px]">
        <p className="font-bold">*** SMILE WITH CONFIDENCE ***</p>
        <p>Thank you for visiting Smile7dental!</p>
        {invoice.nextAppointmentDate && (
          <p className="font-bold border border-black p-1 my-1">
            Next Visit: {formatDate(invoice.nextAppointmentDate)}
          </p>
        )}
      </div>
    </div>
  );
};
