import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  CreditCard, 
  Search, 
  Plus, 
  Printer, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Receipt
} from 'lucide-react';
import type { Invoice } from '../../types';

interface BillingViewProps {
  onOpenNewInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  onOpenNewInvoice,
  onViewInvoice
}) => {
  const { invoices, clinicProfile, recordPayment } = useClinic();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Partial' | 'Unpaid'>('All');
  const [settleInvoiceId, setSettleInvoiceId] = useState<string | null>(null);
  const [settleAmount, setSettleAmount] = useState<number>(0);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patientPhone.includes(searchQuery);

    if (!matchesSearch) return false;
    if (statusFilter !== 'All' && inv.status !== statusFilter) return false;
    return true;
  });

  const totalBilled = invoices.reduce((acc, i) => acc + i.total, 0);
  const totalPaid = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalBalance = invoices.reduce((acc, i) => acc + i.balance, 0);

  const handleSettlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settleInvoiceId || settleAmount <= 0) return;
    recordPayment(settleInvoiceId, settleAmount);
    setSettleInvoiceId(null);
    setSettleAmount(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Stats */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-black text-lg text-slate-900 tracking-tight">
              Invoices & Practice Billing
            </h2>
            <p className="text-xs text-slate-500">
              Tax invoice generation, dental tooth-level fee mapping, and payments collection ledger.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenNewInvoice}
            className="px-4 py-2.5 rounded-xl bg-[#004884] hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs shadow-[#004884]/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Dental Bill (Rs.)
          </button>
        </div>

        {/* 3 Metric Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Invoiced
            </span>
            <span className="text-lg font-black text-slate-900">
              {clinicProfile.currencySymbol || '₹'}{' '}
              {totalBilled.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              Settled Collections
            </span>
            <span className="text-lg font-black text-emerald-900">
              {clinicProfile.currencySymbol || '₹'}{' '}
              {totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
              Pending Dues
            </span>
            <span className="text-lg font-black text-amber-900">
              {clinicProfile.currencySymbol || '₹'}{' '}
              {totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by invoice # or patient name..."
              className="w-full text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004884]/20"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['All', 'Paid', 'Partial', 'Unpaid'] as const).map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === st ? 'bg-white text-[#004884] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Treatments</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Balance</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#004884]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{inv.date}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {inv.patientName}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      {inv.patientPhone}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="font-semibold text-slate-800 block truncate max-w-[200px]">
                      {inv.items.map(i => i.procedureName).join(', ')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {inv.items.length} item(s) • {inv.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900">
                    {clinicProfile.currencySymbol}{inv.total.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                    {clinicProfile.currencySymbol}{inv.paidAmount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black">
                    {inv.balance > 0 ? (
                      <span className="text-rose-600">
                        {clinicProfile.currencySymbol}{inv.balance.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inv.status === 'Partial'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {inv.balance > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSettleInvoiceId(inv.id);
                            setSettleAmount(inv.balance);
                          }}
                          className="px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#004884] font-bold text-[10px] transition-colors cursor-pointer"
                        >
                          Settle
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onViewInvoice(inv)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                        title="Print A4 / Thermal Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="p-12 text-center text-slate-400 space-y-1">
            <CreditCard className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-700">No invoices found</p>
          </div>
        )}
      </div>

      {/* Settle Payment Modal */}
      {settleInvoiceId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">
              Record Balance Payment
            </h3>
            <form onSubmit={handleSettlePayment} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Payment Amount ({clinicProfile.currencySymbol})
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={settleAmount}
                  onChange={e => setSettleAmount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSettleInvoiceId(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-[#004884] hover:bg-sky-700 text-white rounded-xl cursor-pointer"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

