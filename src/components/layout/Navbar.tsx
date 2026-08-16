import React from 'react';
import { useDental } from '../../context/DentalContext';
import { Plus, Lock, Globe, ShieldCheck, ArrowLeft } from 'lucide-react';
import logoIcon from '../../assets/smile7-logo-icon.png';

interface NavbarProps {
  onOpenCreateInvoice: () => void;
  activeTab: string;
  onBackToWebsite?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateInvoice, onBackToWebsite }) => {
  const { 
    clinicProfile, 
    activeToothNotation, 
    setToothNotation,
    adminAuth,
    adminUser,
    logout
  } = useDental();

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Clinic Branding with Official Logo */}
        <div className="flex items-center gap-3">
          {onBackToWebsite && (
            <button
              type="button"
              onClick={onBackToWebsite}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 shrink-0 cursor-pointer"
              title="Return to Main Smile7 Dental Clinic Website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Main Website</span>
            </button>
          )}

          <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl p-1 flex items-center justify-center shadow-xs overflow-hidden">
            <img 
              src={logoIcon} 
              alt="Smile7 Dental Clinic Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to text initials if image load fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-base tracking-tight leading-tight">
                {clinicProfile.name}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                <Globe className="w-2.5 h-2.5 text-teal-600" />
                {adminAuth.subdomainUrl || 'billing.smile7dental.com'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-600" />
              <span>{clinicProfile.dentistInCharge}</span>
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Tooth Notation Fast Switcher */}
          <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-400 font-semibold px-2 text-[10px] uppercase">Notation:</span>
            <button
              type="button"
              onClick={() => setToothNotation('fdi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeToothNotation === 'fdi'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="FDI Two-Digit Notation (11-48)"
            >
              FDI
            </button>
            <button
              type="button"
              onClick={() => setToothNotation('universal')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeToothNotation === 'universal'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Universal Numbering (1-32)"
            >
              Universal (#)
            </button>
          </div>

          {/* Quick Invoice Trigger */}
          <button
            type="button"
            onClick={onOpenCreateInvoice}
            className="px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-sm shadow-teal-600/25 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">+ New Invoice</span>
            <span className="sm:hidden">Bill</span>
          </button>

          {/* Doctor / Admin User Pill & Fast Lock Terminal Button */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <div className="hidden lg:flex flex-col text-right pr-1">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {adminUser?.name || 'Dr. P. Manickapriya'}
              </span>
              <span className="text-[10px] text-teal-700 font-semibold">
                Admin Active
              </span>
            </div>

            <button
              type="button"
              onClick={logout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all flex items-center gap-1 text-xs font-bold"
              title="Lock Admin Terminal / Log Out"
            >
              <Lock className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline text-[11px] text-slate-700">Lock</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
