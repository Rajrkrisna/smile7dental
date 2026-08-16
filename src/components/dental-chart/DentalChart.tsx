import React, { useState } from 'react';
import type { ToothNotation, ToothInfo } from '../../types';
import { DENTAL_TEETH_MAP, PRIMARY_TEETH_MAP } from '../../data/initialData';
import { RotateCcw, Sparkles } from 'lucide-react';

interface DentalChartProps {
  selectedTeeth: string[];
  onChange: (teeth: string[]) => void;
  notation?: ToothNotation;
  isCompact?: boolean;
}

export const DentalChart: React.FC<DentalChartProps> = ({
  selectedTeeth,
  onChange,
  notation = 'fdi',
  isCompact = false
}) => {
  const [dentitionType, setDentitionType] = useState<'adult' | 'pediatric'>('adult');
  const [activeNotation, setActiveNotation] = useState<ToothNotation>(notation);

  const teethList = dentitionType === 'adult' ? DENTAL_TEETH_MAP : PRIMARY_TEETH_MAP;

  // Split into 4 quadrants
  const upperRight = teethList.filter(t => t.quadrant === 'UR');
  const upperLeft = teethList.filter(t => t.quadrant === 'UL');
  const lowerLeft = teethList.filter(t => t.quadrant === 'LL');
  const lowerRight = teethList.filter(t => t.quadrant === 'LR');

  const getToothDisplayNumber = (tooth: ToothInfo): string => {
    if (dentitionType === 'pediatric') {
      return activeNotation === 'fdi' 
        ? String(tooth.primaryFdi || tooth.fdi)
        : (tooth.primaryUniversal || String(tooth.universal));
    }
    return activeNotation === 'fdi' ? String(tooth.fdi) : String(tooth.universal);
  };

  const getToothIdentifierString = (tooth: ToothInfo): string => {
    const num = getToothDisplayNumber(tooth);
    const notName = activeNotation === 'fdi' ? 'FDI' : 'Univ';
    return `${num} (${notName})`;
  };

  const isToothSelected = (tooth: ToothInfo): boolean => {
    const id = getToothIdentifierString(tooth);
    const disp = getToothDisplayNumber(tooth);
    return selectedTeeth.some(t => t.includes(disp) || t === id || t === 'Full Mouth');
  };

  const toggleTooth = (tooth: ToothInfo) => {
    const toothStr = getToothIdentifierString(tooth);
    if (selectedTeeth.includes('Full Mouth')) {
      // replace Full Mouth with this tooth
      onChange([toothStr]);
      return;
    }

    if (isToothSelected(tooth)) {
      onChange(selectedTeeth.filter(t => !t.includes(getToothDisplayNumber(tooth)) && t !== toothStr));
    } else {
      onChange([...selectedTeeth, toothStr]);
    }
  };

  const selectQuadrant = (quadrantTeeth: ToothInfo[]) => {
    const items = quadrantTeeth.map(t => getToothIdentifierString(t));
    // Check if all already selected
    const allSelected = quadrantTeeth.every(t => isToothSelected(t));
    if (allSelected) {
      // Deselect quadrant
      const itemsToKeep = selectedTeeth.filter(st => !quadrantTeeth.some(t => st.includes(getToothDisplayNumber(t))));
      onChange(itemsToKeep);
    } else {
      const merged = Array.from(new Set([...selectedTeeth.filter(t => t !== 'Full Mouth'), ...items]));
      onChange(merged);
    }
  };

  const selectFullArch = (arch: 'maxillary' | 'mandibular') => {
    const archTeeth = teethList.filter(t => t.arch === arch);
    const items = archTeeth.map(t => getToothIdentifierString(t));
    const allSelected = archTeeth.every(t => isToothSelected(t));
    if (allSelected) {
      onChange(selectedTeeth.filter(st => !archTeeth.some(t => st.includes(getToothDisplayNumber(t)))));
    } else {
      onChange(Array.from(new Set([...selectedTeeth.filter(t => t !== 'Full Mouth'), ...items])));
    }
  };

  const selectFullMouth = () => {
    if (selectedTeeth.includes('Full Mouth')) {
      onChange([]);
    } else {
      onChange(['Full Mouth']);
    }
  };

  const clearSelection = () => {
    onChange([]);
  };

  const renderToothButton = (tooth: ToothInfo) => {
    const selected = isToothSelected(tooth);
    const dispNum = getToothDisplayNumber(tooth);

    return (
      <button
        key={`${tooth.universal}-${tooth.fdi}`}
        type="button"
        onClick={() => toggleTooth(tooth)}
        title={`${tooth.name} (FDI: ${tooth.fdi}, Univ: #${tooth.universal})`}
        className={`relative group flex flex-col items-center justify-center transition-all duration-150 rounded-lg p-1 text-xs font-semibold select-none border ${
          selected
            ? 'bg-teal-600 text-white border-teal-700 shadow-sm shadow-teal-500/20 scale-[1.03]'
            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-300'
        } ${isCompact ? 'w-8 h-10' : 'w-10 h-12'}`}
      >
        {/* Anatomical Icon Representation */}
        <div className="w-full flex justify-center mb-0.5 opacity-90">
          {tooth.isMolar ? (
            <span className="w-3.5 h-2.5 rounded-sm border border-current opacity-70 block" />
          ) : tooth.isAnterior ? (
            <span className="w-2.5 h-3 rounded-full border border-current opacity-70 block" />
          ) : (
            <span className="w-3 h-3 rounded-md border border-current opacity-70 block" />
          )}
        </div>
        <span className="text-[11px] leading-none font-bold tracking-tight">{dispNum}</span>
        {selected && (
          <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] font-bold">
            ✓
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 sm:p-4 text-slate-800">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setDentitionType('adult')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                dentitionType === 'adult'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Adult (32)
            </button>
            <button
              type="button"
              onClick={() => setDentitionType('pediatric')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                dentitionType === 'pediatric'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pediatric (20)
            </button>
          </div>

          <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveNotation('fdi')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                activeNotation === 'fdi'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="FDI Two-Digit Dental Notation (e.g., 11-48)"
            >
              FDI
            </button>
            <button
              type="button"
              onClick={() => setActiveNotation('universal')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                activeNotation === 'universal'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Universal Numbering System (1-32)"
            >
              Universal (#)
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={selectFullMouth}
            className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors flex items-center gap-1 ${
              selectedTeeth.includes('Full Mouth')
                ? 'bg-teal-600 text-white border-teal-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Full Mouth
          </button>

          <button
            type="button"
            onClick={() => selectFullArch('maxillary')}
            className="px-2 py-1 text-xs font-medium rounded-md bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          >
            Upper Arch
          </button>

          <button
            type="button"
            onClick={() => selectFullArch('mandibular')}
            className="px-2 py-1 text-xs font-medium rounded-md bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          >
            Lower Arch
          </button>

          {selectedTeeth.length > 0 && (
            <button
              type="button"
              onClick={clearSelection}
              className="px-2 py-1 text-xs font-medium rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Clear ({selectedTeeth.length})
            </button>
          )}
        </div>
      </div>

      {/* Selected tags bar */}
      <div className="min-h-8 mb-3 flex items-center gap-1.5 flex-wrap bg-white/70 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
        <span className="text-slate-500 font-medium mr-1">Selected:</span>
        {selectedTeeth.length === 0 ? (
          <span className="text-slate-400 italic">Click teeth below or choose quick arch / full mouth</span>
        ) : (
          selectedTeeth.map((tooth, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-md border border-teal-200"
            >
              {tooth}
              <button
                type="button"
                onClick={() => onChange(selectedTeeth.filter((_, i) => i !== idx))}
                className="hover:text-teal-950 font-bold ml-0.5 text-xs"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>

      {/* Visual Chart Dental Grid */}
      <div className="space-y-3">
        {/* UPPER JAW / MAXILLA */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
            <span className="text-teal-700 flex items-center gap-1">
              <span>▲ Maxillary (Upper Jaw)</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectQuadrant(upperRight)}
                className="text-[10px] text-teal-600 hover:underline"
              >
                + UR Quadrant
              </button>
              <button
                type="button"
                onClick={() => selectQuadrant(upperLeft)}
                className="text-[10px] text-teal-600 hover:underline"
              >
                + UL Quadrant
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Upper Right Quadrant (Patient Right, Viewer Left) */}
            <div className="flex justify-end gap-1 overflow-x-auto pb-1">
              {upperRight.map(renderToothButton)}
            </div>

            {/* Upper Left Quadrant (Patient Left, Viewer Right) */}
            <div className="flex justify-start gap-1 overflow-x-auto pb-1 border-l border-slate-200 pl-3">
              {upperLeft.map(renderToothButton)}
            </div>
          </div>
        </div>

        {/* MIDLINE SEPARATOR */}
        <div className="relative flex py-1 items-center justify-center">
          <div className="grow border-t border-dashed border-slate-300"></div>
          <span className="shrink mx-3 text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-100 px-2 py-0.5 rounded">
            Occlusal Plane / Midline
          </span>
          <div className="grow border-t border-dashed border-slate-300"></div>
        </div>

        {/* LOWER JAW / MANDIBLE */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-2 gap-3">
            {/* Lower Right Quadrant (Patient Right, Viewer Left) */}
            <div className="flex justify-end gap-1 overflow-x-auto pt-1">
              {lowerRight.map(renderToothButton)}
            </div>

            {/* Lower Left Quadrant (Patient Left, Viewer Right) */}
            <div className="flex justify-start gap-1 overflow-x-auto pt-1 border-l border-slate-200 pl-3">
              {lowerLeft.map(renderToothButton)}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-2 px-1 border-t border-slate-100 pt-2">
            <span className="text-teal-700 flex items-center gap-1">
              <span>▼ Mandibular (Lower Jaw)</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectQuadrant(lowerRight)}
                className="text-[10px] text-teal-600 hover:underline"
              >
                + LR Quadrant
              </button>
              <button
                type="button"
                onClick={() => selectQuadrant(lowerLeft)}
                className="text-[10px] text-teal-600 hover:underline"
              >
                + LL Quadrant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
