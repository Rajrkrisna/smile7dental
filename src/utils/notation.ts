import type { ToothInfo, ToothNotation, ToothQuadrant } from '../types';

/**
 * Returns standard Palmer bracket symbol for given quadrant and tooth item
 * Quadrant brackets:
 * UR (Upper Right): ┘ (bottom-left corner of quadrant border)
 * UL (Upper Left):  └ (bottom-right corner of quadrant border)
 * LL (Lower Left):  ┌ (top-right corner of quadrant border)
 * LR (Lower Right): ┐ (top-left corner of quadrant border)
 */
export function getPalmerSymbol(quadrant: ToothQuadrant, identifier: string | number): string {
  switch (quadrant) {
    case 'UR':
      return `${identifier}┘`;
    case 'UL':
      return `└${identifier}`;
    case 'LL':
      return `┌${identifier}`;
    case 'LR':
      return `${identifier}┐`;
  }
}

/**
 * Formats a tooth label according to the chosen numbering notation
 */
export function getToothLabel(
  tooth: ToothInfo,
  notation: ToothNotation,
  isPediatric: boolean = false
): string {
  if (isPediatric) {
    switch (notation) {
      case 'fdi':
        return String(tooth.primaryFdi || tooth.fdi);
      case 'universal':
        return tooth.primaryUniversal || String(tooth.universal);
      case 'palmer':
        return getPalmerSymbol(tooth.quadrant, tooth.primaryPalmerLetter || 'A');
    }
  }

  switch (notation) {
    case 'fdi':
      return String(tooth.fdi);
    case 'universal':
      return `#${tooth.universal}`;
    case 'palmer':
      return getPalmerSymbol(tooth.quadrant, tooth.palmerNumber);
  }
}

/**
 * Returns a human-friendly name with quadrant description
 */
export function getToothDescriptor(
  tooth: ToothInfo,
  notation: ToothNotation,
  isPediatric: boolean = false
): string {
  const label = getToothLabel(tooth, notation, isPediatric);
  return `${label} — ${tooth.name}`;
}

