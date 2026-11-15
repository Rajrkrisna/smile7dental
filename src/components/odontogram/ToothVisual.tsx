import React from 'react';
import type { ToothInfo, ToothFinding, ToothNotation, ToothConditionType } from '../../types';
import { getToothLabel } from '../../utils/notation';

interface ToothVisualProps {
  tooth: ToothInfo;
  finding?: ToothFinding;
  notation: ToothNotation;
  isPediatric?: boolean;
  isSelected?: boolean;
  onClick: (tooth: ToothInfo) => void;
  onSurfaceClick?: (tooth: ToothInfo, surface: 'occlusal' | 'mesial' | 'distal' | 'buccal' | 'lingual') => void;
}

export const ToothVisual: React.FC<ToothVisualProps> = ({
  tooth,
  finding,
  notation,
  isPediatric = false,
  isSelected = false,
  onClick
}) => {
  const toothLabel = getToothLabel(tooth, notation, isPediatric);
  const condition = finding?.condition || 'sound';

  // Condition color themes
  const getConditionStyle = (cond: ToothConditionType) => {
    switch (cond) {
      case 'caries':
        return {
          fill: '#ef4444', // Red
          border: '#b91c1c',
          badge: 'bg-red-500 text-white',
          label: 'Caries'
        };
      case 'restored':
        return {
          fill: '#3b82f6', // Blue
          border: '#1d4ed8',
          badge: 'bg-blue-500 text-white',
          label: 'Filling'
        };
      case 'crown':
        return {
          fill: '#f59e0b', // Gold / Amber
          border: '#d97706',
          badge: 'bg-amber-500 text-white',
          label: 'Crown'
        };
      case 'rct':
        return {
          fill: '#8b5cf6', // Purple
          border: '#6d28d9',
          badge: 'bg-purple-600 text-white',
          label: 'RCT'
        };
      case 'implant':
        return {
          fill: '#06b6d4', // Cyan
          border: '#0891b2',
          badge: 'bg-cyan-600 text-white',
          label: 'Implant'
        };
      case 'missing':
        return {
          fill: '#94a3b8', // Gray
          border: '#64748b',
          badge: 'bg-slate-500 text-white',
          label: 'Missing'
        };
      case 'impacted':
        return {
          fill: '#f97316', // Orange
          border: '#c2410c',
          badge: 'bg-orange-500 text-white',
          label: 'Impacted'
        };
      case 'fractured':
        return {
          fill: '#ec4899', // Pink
          border: '#be185d',
          badge: 'bg-pink-500 text-white',
          label: 'Fractured'
        };
      default:
        return {
          fill: '#ffffff',
          border: '#cbd5e1',
          badge: 'bg-slate-100 text-slate-600',
          label: 'Sound'
        };
    }
  };

  const currentTheme = getConditionStyle(condition);
  const isMissing = condition === 'missing';

  return (
    <div
      onClick={() => onClick(tooth)}
      className={`relative group flex flex-col items-center justify-between p-1.5 rounded-xl transition-all cursor-pointer select-none ${
        isSelected
          ? 'ring-2 ring-[#004884] bg-sky-50/80 shadow-md scale-105 z-10'
          : 'bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-2xs'
      } ${isMissing ? 'opacity-50' : 'opacity-100'}`}
      style={{ width: '48px', height: '78px' }}
      title={`${tooth.name} (${toothLabel}) - ${currentTheme.label}`}
    >
      {/* Upper arch tooth number is on top */}
      {tooth.arch === 'maxillary' && (
        <span className="text-[10px] font-black tracking-tight text-slate-700 leading-none">
          {toothLabel}
        </span>
      )}

      {/* Anatomical 5-Surface Tooth SVG representation */}
      <div className="relative w-8 h-8 my-auto flex items-center justify-center">
        {isMissing ? (
          // Missing Tooth X Indicator
          <svg viewBox="0 0 40 40" className="w-8 h-8 text-slate-400">
            <line x1="6" y1="6" x2="34" y2="34" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="34" y1="6" x2="6" y2="34" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 40 40" className="w-8 h-8 drop-shadow-2xs">
            {/* Top Surface (Buccal/Labial or Lingual) */}
            <polygon
              points="4,4 36,4 28,12 12,12"
              fill={finding?.surfaces?.includes('buccal') ? currentTheme.fill : '#ffffff'}
              stroke="#64748b"
              strokeWidth="1.2"
              className="hover:fill-slate-100 transition-colors"
            />
            {/* Bottom Surface */}
            <polygon
              points="4,36 36,36 28,28 12,28"
              fill={finding?.surfaces?.includes('lingual') ? currentTheme.fill : '#ffffff'}
              stroke="#64748b"
              strokeWidth="1.2"
              className="hover:fill-slate-100 transition-colors"
            />
            {/* Left Surface (Mesial / Distal) */}
            <polygon
              points="4,4 12,12 12,28 4,36"
              fill={finding?.surfaces?.includes('mesial') ? currentTheme.fill : '#ffffff'}
              stroke="#64748b"
              strokeWidth="1.2"
              className="hover:fill-slate-100 transition-colors"
            />
            {/* Right Surface (Distal / Mesial) */}
            <polygon
              points="36,4 28,12 28,28 36,36"
              fill={finding?.surfaces?.includes('distal') ? currentTheme.fill : '#ffffff'}
              stroke="#64748b"
              strokeWidth="1.2"
              className="hover:fill-slate-100 transition-colors"
            />
            {/* Center Surface (Occlusal / Incisal) */}
            <rect
              x="12"
              y="12"
              width="16"
              height="16"
              fill={
                condition === 'sound'
                  ? '#ffffff'
                  : finding?.surfaces?.includes('occlusal') || !finding?.surfaces?.length
                  ? currentTheme.fill
                  : '#ffffff'
              }
              stroke="#64748b"
              strokeWidth="1.2"
              className="hover:fill-slate-100 transition-colors"
            />

            {/* Condition Icon Overlay */}
            {condition === 'crown' && (
              <circle cx="20" cy="20" r="5" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
            )}
            {condition === 'rct' && (
              <line x1="20" y1="10" x2="20" y2="30" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
            )}
            {condition === 'implant' && (
              <path d="M16 16 h8 v8 h-8 z" fill="#0891b2" />
            )}
          </svg>
        )}
      </div>

      {/* Lower arch tooth number is on bottom */}
      {tooth.arch === 'mandibular' && (
        <span className="text-[10px] font-black tracking-tight text-slate-700 leading-none">
          {toothLabel}
        </span>
      )}

      {/* Micro Status Indicator Badge */}
      {condition !== 'sound' && (
        <span
          className={`absolute -top-1 -right-1 text-[8px] font-bold px-1 rounded-full shadow-xs ${currentTheme.badge}`}
        >
          {currentTheme.label.charAt(0)}
        </span>
      )}
    </div>
  );
};

