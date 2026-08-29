import React from 'react';
import { useDental } from '../../context/DentalContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Users, 
  Plus, 
  ArrowUpRight, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ClinicDashboardProps {
  onOpenCreateInvoice: () => void;
  onOpenAddPatient: () => void;
  onViewInvoice: (invoiceId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const ClinicDashboard: React.FC<ClinicDashboardProps> = ({
  onOpenCreateInvoice,
  onOpenAddPatient,
  onViewInvoice,
  onNavigateTab
}) => {
  const { stats, invoices, clinicProfile } = useDental();

  // Calculate top procedures by count
  const procedureStats: { [procName: string]: { count: number; revenue: number; category: string } } = {};
  invoices.forEach(inv => {
    inv.items.forEach(item => {
      if (!procedureStats[item.procedureName]) {
        procedureStats[item.procedureName] = { count: 0, revenue: 0, category: item.category };
      }
      procedureStats[item.procedureName].count += item.quantity;
      procedureStats[item.procedureName].revenue += item.lineTotal;
    });
  });

  const topProcedures = Object.entries(procedureStats)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const recentInvoices = [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-teal-700/50">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-200 border border-teal-400/30 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Smile7dental Practice Management v2.4</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Welcome back, {clinicProfile.dentistInCharge.split(',')[0]}
            </h1>
            <p className="text-sm text-teal-100/80 leading-relaxed">
              Dental billing system active. All patient treatment logs, tooth maps, and payment collections are up to date.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenAddPatient}
              className="px-4 py-2.5 text-xs font-bold text-teal-950 bg-teal-100 hover:bg-white rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-teal-800" />
              + Add Patient
            </button>

            <button
              type="button"
              onClick={onOpenCreateInvoice}
              className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 active:bg-teal-700 rounded-xl shadow-md shadow-teal-950/40 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              + Create Dental Invoice
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Month Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Month Collections</span>
            <span className="p-2 bg-teal-50 text-teal-700 rounded-xl border border-teal-100">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(stats.monthRevenue || stats.totalRevenue, clinicProfile.currencySymbol)}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Active Financial Cycle</span>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Receipts</span>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(stats.todayRevenue, clinicProfile.currencySymbol)}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Counter settlements</p>
        </div>

        {/* Pending Receivables */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-300 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Receivables</span>
            <span className="p-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-rose-600 tracking-tight">
            {formatCurrency(stats.totalPendingDues, clinicProfile.currencySymbol)}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Across {stats.totalPartialInvoices + stats.totalUnpaidInvoices} open balances
          </p>
        </div>

        {/* Active Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Patients</span>
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {stats.totalPatientsCount}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {stats.totalInvoicesCount} clinical invoices
          </p>
        </div>
      </div>

      {/* Main Grid: Recent Invoices & Top Dental Procedures */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Recent Invoices */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Recent Invoices & Settlements
              </h2>
              <p className="text-xs text-slate-500">Latest treatment billing records</p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('invoices')}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              View Full Ledger <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[10px] uppercase">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Treatments</th>
                  <th className="py-3 px-4 text-right">Grand Total</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-teal-800 whitespace-nowrap">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{inv.patientName}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(inv.date)}</p>
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-slate-700 font-medium">
                      {inv.items.map(i => i.procedureName).join(', ')}
                    </td>

                    <td className="py-3 px-4 text-right font-black text-slate-900 whitespace-nowrap">
                      {formatCurrency(inv.grandTotal, clinicProfile.currencySymbol)}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        inv.status === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onViewInvoice(inv.id)}
                        className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Column: Top Treatments by Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Top Treatments
              </h2>
              <p className="text-xs text-slate-500">By total billed revenue</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('treatments')}
              className="text-xs font-bold text-teal-700 hover:text-teal-900"
            >
              Fee Catalog
            </button>
          </div>

          <div className="space-y-3">
            {topProcedures.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">No treatment data yet.</p>
            ) : (
              topProcedures.map((proc, index) => (
                <div key={index} className="space-y-1.5 pb-2 border-b border-slate-50 last:border-0">
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <p className="font-bold text-slate-800 leading-tight">{proc.name}</p>
                      <span className="text-[10px] text-slate-400">{proc.category} • {proc.count} units</span>
                    </div>
                    <span className="font-black text-slate-900 whitespace-nowrap ml-2">
                      {formatCurrency(proc.revenue, clinicProfile.currencySymbol)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-teal-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, (proc.revenue / (topProcedures[0].revenue || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Practice Info Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Practice Details</span>
            </div>
            <p className="text-slate-600"><span className="font-medium">Reg:</span> {clinicProfile.registrationNumber}</p>
            <p className="text-slate-600"><span className="font-medium">Council:</span> {clinicProfile.dentalCouncilNumber}</p>
            <p className="text-slate-600"><span className="font-medium">Location:</span> Maduravoyal, Chennai</p>
          </div>
        </div>
      </div>
    </div>
  );
};
