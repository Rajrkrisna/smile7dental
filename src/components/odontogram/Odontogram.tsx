import React, { useState } from 'react';
import type { 
  ToothInfo, 
  ToothFinding, 
  ToothConditionType, 
  ToothSurface, 
  ToothNotation 
} from '../../types';
import { ADULT_TEETH_MAP, PEDIATRIC_TEETH_MAP } from '../../data/initialData';
import { ToothVisual } from './ToothVisual';
import { getToothLabel } from '../../utils/notation';
import { 
  RotateCcw, 
  CheckCircle, 
  ShieldAlert, 
  Check, 
  Sparkles, 
  Layers, 
  Tag
} from 'lucide-react';

interface OdontogramProps {
  chartFindings: Record<string, ToothFinding>;
  onUpdateFinding: (finding: ToothFinding) => void;
  onClearFinding: (toothNumber: number) => void;
  activeNotation: ToothNotation;
  onChangeNotation: (notation: ToothNotation) => void;
}

const CONDITIONS: { id: ToothConditionType; label: string; color: string; badge: string }[] = [
  { id: 'sound', label: 'Sound / Healthy', color: '#ffffff', badge: 'bg-slate-100 text-slate-700 border-slate-300' },
  { id: 'caries', label: 'Caries / Cavity', color: '#ef4444', badge: 'bg-red-500 text-white border-red-600' },
  { id: 'restored', label: 'Restored / Filling', color: '#3b82f6', badge: 'bg-blue-500 text-white border-blue-600' },
  { id: 'crown', label: 'Crown / Cap', color: '#f59e0b', badge: 'bg-amber-500 text-white border-amber-600' },
  { id: 'rct', label: 'Root Canal (RCT)', color: '#8b5cf6', badge: 'bg-purple-600 text-white border-purple-700' },
  { id: 'implant', label: 'Dental Implant', color: '#06b6d4', badge: 'bg-cyan-600 text-white border-cyan-700' },
  { id: 'missing', label: 'Missing / Extracted', color: '#64748b', badge: 'bg-slate-600 text-white border-slate-700' },
  { id: 'impacted', label: 'Impacted', color: '#f97316', badge: 'bg-orange-500 text-white border-orange-600' },
];

export const Odontogram: React.FC<OdontogramProps> = ({
  chartFindings,
  onUpdateFinding,
  onClearFinding,
  activeNotation,
  onChangeNotation
}) => {
  const [dentition, setDentition] = useState<'adult' | 'pediatric'>('adult');
  const [selectedTooth, setSelectedTooth] = useState<ToothInfo | null>(null);
  const [activeBrush, setActiveBrush] = useState<ToothConditionType>('caries');
  const [brushModeEnabled, setBrushModeEnabled] = useState<boolean>(false);

  // Surface modal state
  const [modalSurfaces, setModalSurfaces] = useState<ToothSurface[]>([]);
  const [modalNotes, setModalNotes] = useState<string>('');
  const [modalCondition, setModalCondition] = useState<ToothConditionType>('caries');

  const teethList = dentition === 'adult' ? ADULT_TEETH_MAP : PEDIATRIC_TEETH_MAP;

  // Split teeth by quadrant
  const upperRight = teethList.filter(t => t.quadrant === 'UR');
  const upperLeft = teethList.filter(t => t.quadrant === 'UL');
  const lowerLeft = teethList.filter(t => t.quadrant === 'LL');
  const lowerRight = teethList.filter(t => t.quadrant === 'LR');

  const handleToothClick = (tooth: ToothInfo) => {
    if (brushModeEnabled) {
      if (activeBrush === 'sound') {
        onClearFinding(tooth.fdi);
      } else {
        onUpdateFinding({
          toothNumber: tooth.fdi,
          condition: activeBrush,
          surfaces: activeBrush === 'caries' || activeBrush === 'restored' ? ['occlusal'] : undefined,
          updatedAt: new Date().toISOString()
        });
      }
      return;
    }

    // Open detailed inspector modal
    setSelectedTooth(tooth);
    const existing = chartFindings[String(tooth.fdi)];
    if (existing) {
      setModalCondition(existing.condition);
      setModalSurfaces(existing.surfaces || []);
      setModalNotes(existing.notes || '');
    } else {
      setModalCondition('caries');
      setModalSurfaces(['occlusal']);
      setModalNotes('');
    }
  };

  const handleSaveModal = () => {
    if (!selectedTooth) return;

    if (modalCondition === 'sound') {
      onClearFinding(selectedTooth.fdi);
    } else {
      onUpdateFinding({
        toothNumber: selectedTooth.fdi,
        condition: modalCondition,
        surfaces: modalSurfaces,
        notes: modalNotes,
        updatedAt: new Date().toISOString()
      });
    }
    setSelectedTooth(null);
  };

  const toggleModalSurface = (surf: ToothSurface) => {
    setModalSurfaces(prev =>
      prev.includes(surf) ? prev.filter(s => s !== surf) : [...prev, surf]
    );
  };

  // Tally chart findings
  const findingsList = Object.values(chartFindings);
  const cariesCount = findingsList.filter(f => f.condition === 'caries').length;
  const restoredCount = findingsList.filter(f => f.condition === 'restored').length;
  const rctCount = findingsList.filter(f => f.condition === 'rct').length;
  const missingCount = findingsList.filter(f => f.condition === 'missing').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-6">
      {/* Header Controls: Dentition, Notation, and Fast Brush */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-900 tracking-tight">
              Interactive Odontogram (Teeth Chart)
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-50 text-[#004884] font-bold border border-sky-200">
              {dentition === 'adult' ? 'Adult (32 Teeth)' : 'Pediatric (20 Deciduous)'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any tooth to examine surfaces or use Quick Stamp tool to record clinical findings.
          </p>
        </div>

        {/* View Switches */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Adult / Pediatric Switch */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setDentition('adult')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dentition === 'adult' ? 'bg-white text-[#004884] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Adult (32)
            </button>
            <button
              type="button"
              onClick={() => setDentition('pediatric')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dentition === 'pediatric' ? 'bg-white text-[#004884] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pediatric (20)
            </button>
          </div>

          {/* Tooth Numbering System Selector */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold items-center">
            <button
              type="button"
              onClick={() => onChangeNotation('fdi')}
              title="FDI Two-Digit Notation (ISO 3950: 11-48) - Dental Council of India (DCI) Standard"
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeNotation === 'fdi' ? 'bg-white text-[#004884] shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>FDI (India / DCI Standard)</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeNotation('palmer')}
              title="Palmer Notation (Quadrants: 8┘..1┘ | └1..└8)"
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                activeNotation === 'palmer' ? 'bg-white text-[#004884] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Palmer ┘└
            </button>
            <button
              type="button"
              onClick={() => onChangeNotation('universal')}
              title="Universal Numbering System (US: 1-32)"
              className={`px-2 py-1.5 rounded-lg transition-all ${
                activeNotation === 'universal' ? 'bg-white text-[#004884] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Univ (#)
            </button>
          </div>
        </div>
      </div>

      {/* Quick Brush / Legend Bar */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setBrushModeEnabled(!brushModeEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              brushModeEnabled
                ? 'bg-[#004884] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {brushModeEnabled ? 'Quick Stamp: ACTIVE' : 'Enable Quick Stamp'}
          </button>
          {brushModeEnabled && (
            <span className="text-[11px] text-[#004884] font-medium">
              Click any tooth to stamp {activeBrush.toUpperCase()}
            </span>
          )}
        </div>

        {/* Condition Picker Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CONDITIONS.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveBrush(c.id);
                setBrushModeEnabled(true);
              }}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                activeBrush === c.id && brushModeEnabled
                  ? `${c.badge} ring-2 ring-slate-800 ring-offset-1 shadow-xs`
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* The Graphical Mouth Grid (Maxillary & Mandibular Arches) */}
      <div className="relative overflow-x-auto py-2">
        <div className="sm:hidden text-center pb-2 text-[10px] text-slate-400 font-medium">
          ↔ Slide horizontally to inspect full dental arch
        </div>

        <div className="min-w-[760px] mx-auto space-y-3 px-2">
          {/* Upper Arch (Maxilla) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider">
              <span>Upper Right (UR / Quad 1)</span>
              <span className="bg-slate-100 px-2.5 py-0.5 rounded text-slate-600 font-extrabold text-[10px]">
                MAXILLARY ARCH
              </span>
              <span>Upper Left (UL / Quad 2)</span>
            </div>

            <div className="flex items-center justify-center gap-6">
              {/* UR Quadrant */}
              <div className="flex items-center gap-1.5 justify-end flex-1">
                {upperRight.map(tooth => (
                  <ToothVisual
                    key={tooth.fdi}
                    tooth={tooth}
                    finding={chartFindings[String(tooth.fdi)]}
                    notation={activeNotation}
                    isPediatric={dentition === 'pediatric'}
                    isSelected={selectedTooth?.fdi === tooth.fdi}
                    onClick={handleToothClick}
                  />
                ))}
              </div>

              {/* Anatomical Midline */}
              <div className="w-0.5 h-20 bg-sky-400/60 relative flex items-center justify-center">
                <span className="absolute -top-3 text-[9px] font-black text-[#004884] uppercase tracking-widest">
                  Midline
                </span>
              </div>

              {/* UL Quadrant */}
              <div className="flex items-center gap-1.5 justify-start flex-1">
                {upperLeft.map(tooth => (
                  <ToothVisual
                    key={tooth.fdi}
                    tooth={tooth}
                    finding={chartFindings[String(tooth.fdi)]}
                    notation={activeNotation}
                    isPediatric={dentition === 'pediatric'}
                    isSelected={selectedTooth?.fdi === tooth.fdi}
                    onClick={handleToothClick}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Arch Divider Gap */}
          <div className="my-5 border-b border-dashed border-slate-200 relative">
            <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-white px-3 text-[10px] font-bold text-slate-400 tracking-wider">
              OCCLUSAL PLANE
            </span>
          </div>

          {/* Lower Arch (Mandible) */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-6">
              {/* LR Quadrant */}
              <div className="flex items-center gap-1.5 justify-end flex-1">
                {lowerRight.map(tooth => (
                  <ToothVisual
                    key={tooth.fdi}
                    tooth={tooth}
                    finding={chartFindings[String(tooth.fdi)]}
                    notation={activeNotation}
                    isPediatric={dentition === 'pediatric'}
                    isSelected={selectedTooth?.fdi === tooth.fdi}
                    onClick={handleToothClick}
                  />
                ))}
              </div>

              {/* Anatomical Midline */}
              <div className="w-0.5 h-20 bg-sky-400/60 relative flex items-center justify-center">
                <span className="absolute -bottom-3 text-[9px] font-black text-[#004884] uppercase tracking-widest">
                  Midline
                </span>
              </div>

              {/* LL Quadrant */}
              <div className="flex items-center gap-1.5 justify-start flex-1">
                {lowerLeft.map(tooth => (
                  <ToothVisual
                    key={tooth.fdi}
                    tooth={tooth}
                    finding={chartFindings[String(tooth.fdi)]}
                    notation={activeNotation}
                    isPediatric={dentition === 'pediatric'}
                    isSelected={selectedTooth?.fdi === tooth.fdi}
                    onClick={handleToothClick}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider pt-2">
              <span>Lower Right (LR / Quad 4)</span>
              <span className="bg-slate-100 px-2.5 py-0.5 rounded text-slate-600 font-extrabold text-[10px]">
                MANDIBULAR ARCH
              </span>
              <span>Lower Left (LL / Quad 3)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <span className="text-slate-500 font-medium">Chart Summary:</span>
          <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
            {cariesCount} Caries
          </span>
          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            {restoredCount} Restored
          </span>
          <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
            {rctCount} RCT
          </span>
          <span className="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
            {missingCount} Missing
          </span>
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          Indian Dental Clinic Standard: {activeNotation === 'fdi' ? 'FDI Two-Digit (11-48, DCI Approved)' : activeNotation.toUpperCase()}
        </div>
      </div>

      {/* Detailed Tooth Inspector Modal */}
      {selectedTooth && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-[#004884] bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                  Tooth {getToothLabel(selectedTooth, activeNotation, dentition === 'pediatric')}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-1.5">
                  {selectedTooth.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedTooth.arch === 'maxillary' ? 'Upper Arch' : 'Lower Arch'} •{' '}
                  {selectedTooth.quadrant} Quadrant
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTooth(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Condition Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Clinical Condition / Diagnosis
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {CONDITIONS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setModalCondition(c.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between border transition-all cursor-pointer ${
                      modalCondition === c.id
                        ? 'border-[#004884] bg-sky-50 text-[#004884] shadow-2xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.label}</span>
                    {modalCondition === c.id && <Check className="w-3.5 h-3.5 text-[#004884]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Surface Selector (for Caries & Restorations) */}
            {(modalCondition === 'caries' || modalCondition === 'restored') && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">
                  Affected Surfaces (MODBL)
                </label>
                <div className="flex items-center gap-2">
                  {(
                    [
                      { id: 'occlusal', label: 'Occlusal (O)' },
                      { id: 'mesial', label: 'Mesial (M)' },
                      { id: 'distal', label: 'Distal (D)' },
                      { id: 'buccal', label: 'Buccal (B)' },
                      { id: 'lingual', label: 'Lingual (L)' }
                    ] as { id: ToothSurface; label: string }[]
                  ).map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleModalSurface(s.id)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        modalSurfaces.includes(s.id)
                          ? 'bg-[#004884] text-white border-[#004884] shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {s.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clinical Observations Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Specific Tooth Observation / Notes
              </label>
              <textarea
                value={modalNotes}
                onChange={e => setModalNotes(e.target.value)}
                placeholder="e.g. Sensitivity on cold test, class II cavity, advised composite"
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004884]/20 focus:border-[#004884] resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (selectedTooth) onClearFinding(selectedTooth.fdi);
                  setSelectedTooth(null);
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Clear Tooth Finding
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTooth(null)}
                  className="text-xs font-bold text-slate-600 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveModal}
                  className="text-xs font-bold bg-[#004884] hover:bg-sky-700 text-white px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Finding
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

