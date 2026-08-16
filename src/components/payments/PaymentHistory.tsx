import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { exportToCSV } from '../../utils/printUtils';
import { 
  CreditCard, 
  Search, 
  Download, 
  Eye
} from 'lucide-react';

interface PaymentHistoryProps {
  onViewInvoice: (invoiceId: string) => void;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ onViewInvoice }) => {
  const { invoices, clinicProfile } = useDental();
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  // Flatten all payment transactions across invoices
  const allPayments = invoices.flatMap(inv => 
    (inv.payments || []).map(pay => ({
      ...pay,
      invoiceNumber: inv.invoiceNumber,
      patientName: inv.patientName,
      patientPhone: inv.patientPhone,
      grandTotal: inv.grandTotal
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredPayments = allPayments.filter(p => {
    const matchesSearch = 
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.referenceNumber && p.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.notes && p.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMethod = methodFilter === 'all' || p.method === methodFilter;

    return matchesSearch && matchesMethod;
  });

  const totalCollected = allPayments.reduce((acc, p) => acc + p.amount, 0);

  // Method breakdowns
  const cardTotal = allPayments.filter(p => p.method === 'card').reduce((acc, p) => acc + p.amount, 0);
  const upiTotal = allPayments.filter(p => p.method === 'upi').reduce((acc, p) => acc + p.amount, 0);
  const cashTotal = allPayments.filter(p => p.method === 'cash').reduce((acc, p) => acc + p.amount, 0);

  const handleExportCSV = () => {
    const data = filteredPayments.map(p => ({
      PaymentID: p.id,
      InvoiceNumber: p.invoiceNumber,
      PatientName: p.patientName,
      Amount: p.amount,
      Date: p.date,
      Method: p.method,
      ReferenceNumber: p.referenceNumber || '',
      ReceivedBy: p.receivedBy || '',
      Notes: p.notes || ''
    }));
    exportToCSV(data, `Smile7dental_Payment_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl flex items-center justify-center shadow-inner">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Payments & Receipts Ledger</h1>
            <p className="text-xs text-slate-500">
              Audit trail of all patient settlements, transaction modes, and incoming receipts
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Export Payments CSV
        </button>
      </div>

      {/* Metric Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Collected</span>
          <span className="text-xl font-black text-slate-900">
            {formatCurrency(totalCollected, clinicProfile.currencySymbol)}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">{allPayments.length} transactions</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 block">Credit / Debit Card</span>
          <span className="text-xl font-black text-teal-800">
            {formatCurrency(cardTotal, clinicProfile.currencySymbol)}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">POS Swipe & Chip</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">UPI / QR Digital</span>
          <span className="text-xl font-black text-indigo-800">
            {formatCurrency(upiTotal, clinicProfile.currencySymbol)}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Instant scan payments</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Cash Counter</span>
          <span className="text-xl font-black text-emerald-800">
            {formatCurrency(cashTotal, clinicProfile.currencySymbol)}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Physical currency</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by invoice #, patient name, or transaction reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold">Payment Mode:</span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Methods</option>
            <option value="card">Card</option>
            <option value="upi">UPI / QR</option>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Wire</option>
            <option value="insurance">Insurance</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No payment transaction records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Receipt Date & Time</th>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Reference / Auth No.</th>
                  <th className="py-3.5 px-4 text-right">Amount Received</th>
                  <th className="py-3.5 px-4 text-right">Invoice Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {formatDateTime(pay.date)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-teal-800 whitespace-nowrap">
                      {pay.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {pay.patientName}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                        {pay.method}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                      {pay.referenceNumber || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-emerald-700 whitespace-nowrap text-sm">
                      +{formatCurrency(pay.amount, clinicProfile.currencySymbol)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onViewInvoice(pay.invoiceId)}
                        className="text-xs font-bold text-teal-700 hover:text-teal-900 underline inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
