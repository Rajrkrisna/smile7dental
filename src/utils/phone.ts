/**
 * Phone number normalization and duplicate detection utilities.
 * Handles Indian numbers with or without +91, 0 prefix, spaces, and hyphens.
 */

export function normalizePhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  
  // 12 digits starting with 91 (India country code e.g. 919840123891)
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  // 11 digits starting with 0 (e.g. 09840123891)
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

export function arePhonesEqual(phone1: string, phone2: string): boolean {
  const p1 = normalizePhone(phone1);
  const p2 = normalizePhone(phone2);
  if (!p1 || !p2) return false;
  // If at least 7 digits, compare exact match
  if (p1.length >= 7 && p2.length >= 7) {
    return p1 === p2;
  }
  return false;
}

