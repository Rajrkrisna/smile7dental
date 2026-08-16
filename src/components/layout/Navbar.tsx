import React from 'react';
import { useDental } from '../../context/DentalContext';
import { Plus } from 'lucide-react';

interface NavbarProps {
  onOpenCreateInvoice: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateInvoice }) => {
  const { clinicProfile, activeToothNotation, setToothNotation } = useDental();

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Clinic Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-teal-600 to-teal-800 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md shadow-teal-700/20 tracking-wider">
            S7
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-base tracking-tight leading-tight">
                {clinicProfile.name.split('Clinic')[0] || 'Smile7dental'}
              </span>
              <span className="hidden sm:inline-block bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                Dental Billing OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs font-medium">
              {clinicProfile.dentistInCharge}
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          {/* Tooth Notation Fast Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
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
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-sm shadow-teal-600/25 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">+ New Invoice</span>
            <span className="sm:hidden">Bill</span>
          </button>
        </div>
      </div>
    </header>
  );
};
