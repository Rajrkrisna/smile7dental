import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import type { PaymentStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV } from '../../utils/printUtils';
import { sendWhatsAppInvoice } from '../../utils/shareUtils';
import { ShareInvoiceModal } from './ShareInvoiceModal';
import { 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Plus, 
  Eye, 
  Printer, 
  Trash2, 
  Calendar,
  MessageSquare,
  Share2
} from 'lucide-react';

interface InvoiceListProps {
  onOpenCreateInvoice: () => void;
  onViewInvoice: (invoiceId: string) => void;
  onPrintInvoiceA4: (invoiceId: string) => void;
  onPrintThermal: (invoiceId: string) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  onOpenCreateInvoice,
  onViewInvoice,
  onPrintInvoiceA4,
  onPrintThermal
}) => {
  const { invoices, deleteInvoice, clinicProfile } = useDental();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all'); // all, today, thisMonth, thisYear
  const [shareInvoiceId, setShareInvoiceId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const thisMonthStr = todayStr.substring(0, 7);
  const thisYearStr = todayStr.substring(0, 4);

  const filteredInvoices = invoices.filter(inv => {
    // Text search
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patientPhone.includes(searchTerm) ||
      inv.items.some(i => i.procedureName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // Status filter
    if (statusFilter !== 'all' && inv.status !== statusFilter) {
      return false;
    }

    // Date filter
    if (dateFilter === 'today') {
      return inv.date.startsWith(todayStr);
    } else if (dateFilter === 'thisMonth') {
      return inv.date.startsWith(thisMonthStr);
    } else if (dateFilter === 'thisYear') {
      return inv.date.startsWith(thisYearStr);
    }

    return true;
  });

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
            Paid
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
            Partial
          </span>
        );
      case 'unpaid':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
            Unpaid
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const rows = filteredInvoices.map(inv => ({
      InvoiceNumber: inv.invoiceNumber,
      Date: inv.date.split('T')[0],
      PatientName: inv.patientName,
      PatientPhone: inv.patientPhone,
      GrandTotal: inv.grandTotal,
      AmountPaid: inv.amountPaid,
      BalanceDue: inv.balanceDue,
      Status: inv.status,
      Doctor: inv.doctorName || clinicProfile.dentistInCharge
    }));
    exportToCSV(rows, `Smile7dental_Invoices_${todayStr}.csv`);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Invoices & Clinical Ledgers
          </h1>
          <p className="text-xs text-slate-500">
            Manage tax bills, dispatch invoices via WhatsApp/Email, and track payments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            title="Export CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateInvoice}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-sm shadow-teal-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            + New Invoice
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by invoice # (S7D-2026-0001), patient name, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-xs"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            {['all', 'paid', 'partial', 'unpaid'].map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Period:
          </span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Invoices Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No dental invoices match your current search or filter criteria. Create a new invoice or adjust filters.
            </p>
            <button
              type="button"
              onClick={onOpenCreateInvoice}
              className="mt-2 px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Create First Invoice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Patient</th>
                  <th className="py-3.5 px-4">Treatments & Teeth</th>
                  <th className="py-3.5 px-4 text-right">Total</th>
                  <th className="py-3.5 px-4 text-right">Paid</th>
                  <th className="py-3.5 px-4 text-right">Due</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map(inv => (
                  <tr 
                    key={inv.id}
                    onClick={() => onViewInvoice(inv.id)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-900 whitespace-nowrap">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {formatDate(inv.date)}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{inv.patientName}</p>
                      <p className="text-[11px] text-slate-400">{inv.patientPhone}</p>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-medium text-slate-800 truncate">
                        {inv.items.map(i => i.procedureName).join(', ')}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {inv.items.flatMap(i => i.toothNumbers || []).slice(0, 3).map((t, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.2 rounded font-mono">
                            {t}
                          </span>
                        ))}
                        {inv.items.flatMap(i => i.toothNumbers || []).length > 3 && (
                          <span className="text-[9px] text-slate-400 font-medium">
                            +{inv.items.flatMap(i => i.toothNumbers || []).length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(inv.grandTotal, clinicProfile.currencySymbol)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-emerald-700 font-semibold whitespace-nowrap">
                      {formatCurrency(inv.amountPaid, clinicProfile.currencySymbol)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black whitespace-nowrap">
                      {inv.balanceDue > 0 ? (
                        <span className="text-rose-600">
                          {formatCurrency(inv.balanceDue, clinicProfile.currencySymbol)}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">0.00</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getStatusBadge(inv.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {/* Quick WhatsApp */}
                        <button
                          type="button"
                          onClick={() => sendWhatsAppInvoice(inv, clinicProfile, inv.patientPhone)}
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Send via WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        {/* Share Modal Trigger */}
                        <button
                          type="button"
                          onClick={() => setShareInvoiceId(inv.id)}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Share / Email Invoice"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onViewInvoice(inv.id)}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onPrintInvoiceA4(inv.id)}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Print A4 Tax Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onPrintThermal(inv.id)}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Print Thermal Slip"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete invoice ${inv.invoiceNumber}? This will revert payment records.`)) {
                              deleteInvoice(inv.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Share / Dispatch Submodal */}
      {shareInvoiceId && (
        <ShareInvoiceModal
          invoiceId={shareInvoiceId}
          onClose={() => setShareInvoiceId(null)}
        />
      )}
    </div>
  );
};
