import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  LayoutDashboard, 
  Activity, 
  Users, 
  Calendar, 
  FileEdit, 
  Pill, 
  CreditCard, 
  Settings,
  AlertCircle,
  Wallet,
  History
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange
}) => {
  const { patients, appointments, invoices, clinicProfile, patientVisits } = useClinic();

  const totalOutstanding = patients.reduce((acc, p) => acc + p.balanceDue, 0);
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === todayDateStr);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'odontogram', label: 'Dental Chart (Odontogram)', icon: Activity },
    { id: 'patients', label: 'Patients Directory', icon: Users, badge: patients.length },
    { id: 'appointments', label: 'Appointments & Chair', icon: Calendar, badge: todayAppts.length },
    { id: 'visits', label: 'Patient Visit History', icon: History, badge: patientVisits.length },
    { id: 'clinical-notes', label: 'Clinical SOAP Notes', icon: FileEdit },
    { id: 'prescriptions', label: 'Prescriptions (Rx)', icon: Pill },
    { id: 'billing', label: 'Invoices & Billing', icon: CreditCard, badge: invoices.length },
    { id: 'finance', label: 'Finance & Expenses', icon: Wallet },
    { id: 'settings', label: 'Clinic Settings & Backup', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-4">
      {/* Navigation List */}
      <nav className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex md:flex-col gap-1 overflow-x-auto scrollbar-none">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap md:w-full cursor-pointer ${
                isActive
                  ? 'bg-sky-50 text-[#004884] border border-sky-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#004884]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`hidden md:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#004884] text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Receivables Pending Alert Widget */}
      {totalOutstanding > 0 && (
        <div className="hidden md:block bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-800 font-extrabold uppercase tracking-wide text-[10px]">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Receivables Pending</span>
          </div>
          <p className="text-amber-950 font-black text-lg">
            {clinicProfile.currencySymbol || '₹'}{' '}
            {totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-amber-700">
            Across {patients.filter(p => p.balanceDue > 0).length} patient dossiers
          </p>
        </div>
      )}

      {/* Offline Status Badge */}
      <div className="hidden md:flex items-center justify-between p-3 bg-slate-100/80 rounded-xl text-[11px] text-slate-500">
        <span className="font-medium">Data Storage</span>
        <span className="font-bold text-slate-700 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Local Offline
        </span>
      </div>
    </aside>
  );
};

