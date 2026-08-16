import React from 'react';
import { useDental } from '../../context/DentalContext';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Stethoscope, 
  CreditCard, 
  Settings,
  Plus
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenCreateInvoice: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenCreateInvoice
}) => {
  const { invoices, patients, stats } = useDental();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices & Billing', icon: FileText, badge: invoices.length },
    { id: 'patients', label: 'Patient Directory', icon: Users, badge: patients.length },
    { id: 'treatments', label: 'Fee Schedule', icon: Stethoscope },
    { id: 'payments', label: 'Payments Ledger', icon: CreditCard },
    { id: 'settings', label: 'Clinic Settings', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-4">
      {/* Quick Action Button for Desktop */}
      <div className="hidden md:block">
        <button
          type="button"
          onClick={onOpenCreateInvoice}
          className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-2xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Dental Bill
        </button>
      </div>

      {/* Navigation List */}
      <nav className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex md:flex-col gap-1 overflow-x-auto scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap md:w-full ${
                isActive
                  ? 'bg-teal-50 text-teal-800 border border-teal-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`hidden md:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Pending Due Alert Widget */}
      {stats.totalPendingDues > 0 && (
        <div className="hidden md:block bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs space-y-1">
          <span className="font-bold text-rose-800 block text-[11px] uppercase tracking-wide">
            Receivables Pending
          </span>
          <p className="text-rose-900 font-black text-base">
            ${stats.totalPendingDues.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-rose-700/80 text-[10px]">
            {stats.totalPartialInvoices + stats.totalUnpaidInvoices} unsettled invoices
          </p>
        </div>
      )}
    </aside>
  );
};
