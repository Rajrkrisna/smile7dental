import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import type { PaymentMethod } from '../../types';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import { triggerPrint } from '../../utils/printUtils';
import { InvoiceA4Print } from './InvoiceA4Print';
import { InvoiceThermalPrint } from './InvoiceThermalPrint';
import confetti from 'canvas-confetti';
import { 
  X, 
  Printer, 
  FileText, 
  User, 
  Stethoscope, 
  Plus 
} from 'lucide-react';

interface InvoiceDetailModalProps {
  invoiceId: string;
  initialPrintMode?: 'none' | 'a4' | 'thermal';
  onClose: () => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoiceId,
  initialPrintMode = 'none',
  onClose
}) => {
  const { getInvoiceById, clinicProfile, recordPayment } = useDental();
  const invoice = getInvoiceById(invoiceId);

  const [activeTab, setActiveTab] = useState<'details' | 'a4' | 'thermal'>(
    initialPrintMode === 'a4' ? 'a4' : initialPrintMode === 'thermal' ? 'thermal' : 'details'
  );

  // Payment Recording Drawer State
  const [showRecordPayment, setShowRecordPayment] = useState<boolean>(false);
  const [payAmount, setPayAmount] = useState<number>(invoice?.balanceDue || 0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('card');
  const [payRefNumber, setPayRefNumber] = useState<string>('');
  const [payNotes] = useState<string>('Follow-up treatment settlement');

  if (!invoice) return null;

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    recordPayment(invoice.id, {
      amount: payAmount,
      date: new Date().toISOString(),
      method: payMethod,
      referenceNumber: payRefNumber,
      notes: payNotes,
      receivedBy: clinicProfile.dentistInCharge
    });

    try {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setShowRecordPayment(false);
  };

  const handlePrintA4 = () => {
    triggerPrint('invoice-a4-printable');
  };

  const handlePrintThermal = () => {
    triggerPrint('invoice-thermal-printable');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Invoice {invoice.invoiceNumber}
                </h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  invoice.status === 'partial' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  'bg-rose-100 text-rose-800 border border-rose-200'
                }`}>
                  {invoice.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Patient: <span className="font-semibold text-slate-800">{invoice.patientName}</span> • Date: {formatDate(invoice.date)}
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-200/80 p-0.5 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'details' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Interactive Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('a4')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  activeTab === 'a4' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Printer className="w-3.5 h-3.5" /> A4 Invoice
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('thermal')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  activeTab === 'thermal' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Thermal Slip
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50">
          {/* TAB 1: Interactive Details */}
          {activeTab === 'details' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Top Banner with Financial Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Billed</span>
                  <span className="text-xl font-black text-slate-900">
                    {formatCurrency(invoice.grandTotal, clinicProfile.currencySymbol)}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Total Paid</span>
                  <span className="text-xl font-black text-emerald-700">
                    {formatCurrency(invoice.amountPaid, clinicProfile.currencySymbol)}
                  </span>
                </div>

                <div className={`p-4 rounded-2xl border shadow-xs ${
                  invoice.balanceDue > 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'
                }`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    invoice.balanceDue > 0 ? 'text-rose-700' : 'text-slate-400'
                  }`}>Balance Due</span>
                  <span className={`text-xl font-black ${
                    invoice.balanceDue > 0 ? 'text-rose-700' : 'text-slate-600'
                  }`}>
                    {formatCurrency(invoice.balanceDue, clinicProfile.currencySymbol)}
                  </span>
                </div>
              </div>

              {/* Patient & Doctor Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px]">
                    <User className="w-3.5 h-3.5" /> Patient Details
                  </div>
                  <p className="text-sm font-bold text-slate-900">{invoice.patientName}</p>
                  <p className="text-slate-600">Phone: {invoice.patientPhone}</p>
                  {invoice.patientAddress && <p className="text-slate-500">{invoice.patientAddress}</p>}
                </div>

                <div className="space-y-1 border-t sm:border-t-0 sm:border-l sm:pl-4 border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px]">
                    <Stethoscope className="w-3.5 h-3.5" /> Clinician in Charge
                  </div>
                  <p className="text-sm font-bold text-slate-900">{invoice.doctorName || clinicProfile.dentistInCharge}</p>
                  <p className="text-slate-600">Clinic: {clinicProfile.name}</p>
                  {invoice.dueDate && (
                    <p className="text-slate-500">Due Date: {formatDate(invoice.dueDate)}</p>
                  )}
                </div>
              </div>

              {/* Itemized Procedures Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50/80 border-b border-slate-200">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Itemized Dental Procedures & Tooth Mapping
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[10px] uppercase">
                        <th className="py-2.5 px-4">#</th>
                        <th className="py-2.5 px-4">Treatment</th>
                        <th className="py-2.5 px-4">Tooth / Arch</th>
                        <th className="py-2.5 px-4 text-center">Qty</th>
                        <th className="py-2.5 px-4 text-right">Unit Rate</th>
                        <th className="py-2.5 px-4 text-right">Discount</th>
                        <th className="py-2.5 px-4 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoice.items.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="py-3 px-4 font-semibold text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-900">{item.procedureName}</p>
                            <span className="text-[10px] text-teal-700 font-mono">
                              Code: {item.procedureCode}
                            </span>
                            {item.surface && (
                              <span className="text-[10px] text-slate-500 block">
                                Surface: {item.surface}
                              </span>
                            )}
                            {item.notes && (
                              <p className="text-[10px] text-slate-500 mt-0.5">{item.notes}</p>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {item.toothNumbers?.length ? (
                              <div className="flex flex-wrap gap-1">
                                {item.toothNumbers.map((t, i) => (
                                  <span key={i} className="bg-teal-50 text-teal-800 border border-teal-200 font-semibold text-[10px] px-1.5 py-0.5 rounded">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Full Mouth</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-slate-700">{item.quantity}</td>
                          <td className="py-3 px-4 text-right font-medium text-slate-700">
                            {formatCurrency(item.unitPrice, clinicProfile.currencySymbol)}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-500">
                            {item.discountValue > 0 ? (
                              item.discountType === 'percentage' 
                                ? `${item.discountValue}%` 
                                : formatCurrency(item.discountValue, clinicProfile.currencySymbol)
                            ) : '—'}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">
                            {formatCurrency(item.lineTotal, clinicProfile.currencySymbol)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Clinical Notes & Prescriptions */}
              {(invoice.clinicalNotes || invoice.prescriptions || invoice.nextAppointmentDate) && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Clinical Notes & Follow-up
                  </h3>
                  {invoice.clinicalNotes && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-1">Doctor's Observation:</span>
                      <p className="text-slate-600">{invoice.clinicalNotes}</p>
                    </div>
                  )}
                  {invoice.prescriptions && (
                    <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-blue-950">
                      <span className="font-bold block mb-1">Prescriptions (Rx):</span>
                      <p>{invoice.prescriptions}</p>
                    </div>
                  )}
                  {invoice.nextAppointmentDate && (
                    <p className="font-semibold text-teal-800">
                      Scheduled Next Visit: {formatDate(invoice.nextAppointmentDate)}
                    </p>
                  )}
                </div>
              )}

              {/* Payment History & Record Payment CTA */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Payment Transactions ({invoice.payments?.length || 0})
                  </h3>

                  {invoice.balanceDue > 0 && !showRecordPayment && (
                    <button
                      type="button"
                      onClick={() => {
                        setPayAmount(invoice.balanceDue);
                        setShowRecordPayment(true);
                      }}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Record Settlement / Payment
                    </button>
                  )}
                </div>

                {/* Record Payment Sub-form */}
                {showRecordPayment && (
                  <form onSubmit={handleRecordPaymentSubmit} className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl space-y-3 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-teal-200/60">
                      <span className="font-bold text-teal-900">Record Follow-up Payment</span>
                      <button
                        type="button"
                        onClick={() => setShowRecordPayment(false)}
                        className="text-slate-400 hover:text-slate-600 font-bold"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Amount ({clinicProfile.currencySymbol})
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={invoice.balanceDue}
                          step="any"
                          value={payAmount}
                          onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
                        <select
                          value={payMethod}
                          onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                        >
                          <option value="card">Credit/Debit Card</option>
                          <option value="cash">Cash</option>
                          <option value="upi">UPI / QR Code</option>
                          <option value="insurance">Insurance Direct</option>
                          <option value="bank_transfer">Bank Wire</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Ref / Auth Number</label>
                        <input
                          type="text"
                          placeholder="e.g. TXN-88492"
                          value={payRefNumber}
                          onChange={(e) => setPayRefNumber(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowRecordPayment(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
                      >
                        Confirm Receipt
                      </button>
                    </div>
                  </form>
                )}

                {/* List of Payments */}
                {invoice.payments?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No payments recorded yet for this invoice.</p>
                ) : (
                  <div className="space-y-2">
                    {invoice.payments.map((p, idx) => (
                      <div key={p.id || idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{formatCurrency(p.amount, clinicProfile.currencySymbol)}</p>
                          <p className="text-slate-500 text-[11px]">
                            {formatDateTime(p.date)} via <span className="font-semibold uppercase">{p.method}</span>
                            {p.referenceNumber ? ` (Ref: ${p.referenceNumber})` : ''}
                          </p>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Full A4 Print Layout */}
          {activeTab === 'a4' && (
            <div className="space-y-4">
              <div className="flex justify-end gap-2 max-w-[210mm] mx-auto">
                <button
                  type="button"
                  onClick={handlePrintA4}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print / Save as PDF
                </button>
              </div>
              <div className="shadow-xl rounded-2xl overflow-hidden border border-slate-300">
                <InvoiceA4Print invoice={invoice} clinic={clinicProfile} />
              </div>
            </div>
          )}

          {/* TAB 3: 80mm Thermal Receipt Layout */}
          {activeTab === 'thermal' && (
            <div className="space-y-4">
              <div className="flex justify-end gap-2 max-w-[80mm] mx-auto">
                <button
                  type="button"
                  onClick={handlePrintThermal}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print Thermal Slip
                </button>
              </div>
              <div className="shadow-xl rounded-xl overflow-hidden border border-slate-300 bg-white">
                <InvoiceThermalPrint invoice={invoice} clinic={clinicProfile} />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
          <span className="text-slate-500">
            Invoice ID: <span className="font-mono">{invoice.id}</span>
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
