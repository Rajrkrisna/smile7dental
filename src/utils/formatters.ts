import type { ToothNotation } from '../types';
import { DENTAL_TEETH_MAP, PRIMARY_TEETH_MAP } from '../data/initialData';

export const formatCurrency = (amount: number, currencySymbol: string = '$'): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${currencySymbol}0.00`;
  }
  return `${currencySymbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

export const getToothLabel = (toothId: number | string, notation: ToothNotation = 'fdi'): string => {
  const num = typeof toothId === 'string' ? parseInt(toothId, 10) : toothId;
  
  if (isNaN(num)) {
    return String(toothId);
  }

  // Check adult teeth
  const adult = DENTAL_TEETH_MAP.find(t => t.universal === num || t.fdi === num);
  if (adult) {
    if (notation === 'fdi') {
      return `Tooth #${adult.fdi} (FDI: ${adult.fdi} / Univ: #${adult.universal})`;
    }
    return `Tooth #${adult.universal} (Univ: #${adult.universal} / FDI: ${adult.fdi})`;
  }

  // Check primary teeth
  const primary = PRIMARY_TEETH_MAP.find(t => t.universal === num || t.fdi === num || t.primaryFdi === num);
  if (primary) {
    if (notation === 'fdi') {
      return `Pri. Tooth #${primary.primaryFdi} (Letter ${primary.primaryUniversal})`;
    }
    return `Pri. Tooth ${primary.primaryUniversal} (FDI ${primary.primaryFdi})`;
  }

  return `Tooth #${toothId}`;
};

export const generateInvoiceNumber = (prefix: string, count: number): string => {
  const currentYear = new Date().getFullYear();
  const seq = String(count + 1).padStart(4, '0');
  return `${prefix}-${currentYear}-${seq}`;
};

export const generatePatientId = (count: number): string => {
  const seq = String(1001 + count);
  return `PAT-${seq}`;
};
