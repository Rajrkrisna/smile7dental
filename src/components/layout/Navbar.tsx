import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Plus, 
  Calendar, 
  Users, 
  ShieldCheck,
  Globe
} from 'lucide-react';
import logoIcon from '../../assets/smile7-logo-icon.png';

interface NavbarProps {
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
  onOpenNewInvoice: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewPatient,
  onOpenNewAppointment,
  onOpenNewInvoice
}) => {
  const { clinicProfile, notation, setNotation } = useClinic();

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Clinic Branding with Official Smile7 Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white border border-slate-200 rounded-xl p-1 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
            <img 
              src={logoIcon} 
              alt="Smile7 Dental Clinic Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-slate-900 text-base tracking-tight leading-none">
                {clinicProfile.clinicName}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 bg-sky-50 text-[#004884] text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-200">
                <Globe className="w-2.5 h-2.5 text-[#004884]" />
                smile7dental.com
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#004884]" />
              <span>{clinicProfile.doctorName} • {clinicProfile.registrationNumber}</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Fast Notation Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Tooth Notation Toggle Quick Access */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
            <span className="text-[10px] text-slate-400 pl-2 uppercase tracking-wider font-extrabold">Notation:</span>
            <button
              type="button"
              onClick={() => setNotation('fdi')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                notation === 'fdi' ? 'bg-white text-[#004884] shadow-xs font-black' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="FDI Two-Digit Notation (11-48) - Dental Council of India Standard"
            >
              FDI (India)
            </button>
            <button
              type="button"
              onClick={() => setNotation('universal')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                notation === 'universal' ? 'bg-white text-[#004884] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Universal Numbering System (1-32)"
            >
              Univ (#)
            </button>
            <button
              type="button"
              onClick={() => setNotation('palmer')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                notation === 'palmer' ? 'bg-white text-[#004884] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Palmer Notation (Quadrants: 8┘..1┘ | └1..└8)"
            >
              Palmer ┘└
            </button>
          </div>

          {/* Quick Register Patient */}
          <button
            type="button"
            onClick={onOpenNewPatient}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            + Patient
          </button>

          {/* Quick Book Chair */}
          <button
            type="button"
            onClick={onOpenNewAppointment}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#004884] bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#004884]" />
            Book Chair
          </button>

          {/* Create Dental Bill */}
          <button
            type="button"
            onClick={onOpenNewInvoice}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#004884] hover:bg-sky-700 shadow-xs shadow-[#004884]/25 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Bill (Rs.)
          </button>
        </div>
      </div>
    </header>
  );
};
