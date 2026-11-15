import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Odontogram } from './Odontogram';
import { User, Activity, AlertTriangle, FileText, ChevronRight } from 'lucide-react';

interface OdontogramStudioProps {
  onOpenPatientDossier: (patientId: string) => void;
  onOpenNewInvoice: (patientId: string) => void;
}

export const OdontogramStudio: React.FC<OdontogramStudioProps> = ({
  onOpenPatientDossier,
  onOpenNewInvoice
}) => {
  const { 
    patients, 
    updateToothFinding, 
    clearToothFinding, 
    notation, 
    setNotation,
    clinicProfile 
  } = useClinic();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const activePatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="space-y-6">
      {/* Top Patient Selector Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-black text-lg text-slate-900 tracking-tight">
            Clinical Odontogram & Teeth Studio
          </h2>
          <p className="text-xs text-slate-500">
            Interactive anatomical tooth chart with live notation switcher (FDI, Universal, Palmer) and condition stamping.
          </p>
        </div>

        {/* Patient Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-600 whitespace-nowrap">
            Active Patient:
          </label>
          <select
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
            className="text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#004884]/20 w-full sm:w-64"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.patientId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activePatient ? (
        <div className="space-y-4">
          {/* Active Patient Details Banner - Smile7 Blue Gradient */}
          <div className="bg-gradient-to-r from-[#002244] via-[#004884] to-[#0284c7] text-white p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-white">
                {activePatient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm">{activePatient.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-sky-200 border border-white/20">
                    {activePatient.patientId}
                  </span>
                </div>
                <p className="text-sky-100/80 text-[11px]">
                  {activePatient.age} Yrs • {activePatient.gender} • Ph: {activePatient.phone}
                </p>
              </div>
            </div>

            {/* Medical Alerts pill if any */}
            {activePatient.medicalAlerts.length > 0 && (
              <div className="flex items-center gap-1.5 bg-rose-500/30 border border-rose-400/40 px-3 py-1.5 rounded-xl text-rose-100 font-bold text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                <span>Alerts: {activePatient.medicalAlerts.join(', ')}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenPatientDossier(activePatient.id)}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold transition-colors cursor-pointer border border-white/20"
              >
                Full Dossier
              </button>
              <button
                type="button"
                onClick={() => onOpenNewInvoice(activePatient.id)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-[#004884] font-bold transition-colors cursor-pointer shadow-xs"
              >
                + Bill Mapped Teeth (Rs.)
              </button>
            </div>
          </div>

          {/* Interactive Odontogram Component */}
          <Odontogram
            chartFindings={activePatient.dentalChart || {}}
            onUpdateFinding={f => updateToothFinding(activePatient.id, f)}
            onClearFinding={t => clearToothFinding(activePatient.id, t)}
            activeNotation={notation}
            onChangeNotation={setNotation}
          />
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
          <Activity className="w-12 h-12 mx-auto text-slate-300" />
          <h4 className="font-extrabold text-sm text-slate-700">No Patient Selected</h4>
          <p className="text-xs">Register or select a patient above to load their dental chart.</p>
        </div>
      )}
    </div>
  );
};

