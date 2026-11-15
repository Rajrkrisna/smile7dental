import { useState } from 'react';
import { InstantInvoiceDownloader } from './components/patient-portal/InstantInvoiceDownloader';
import { MainClinicWebsite } from './components/website/MainClinicWebsite';
import { decodeInvoicePayload, parseInvoiceFromQueryParams } from './utils/shareUtils';
import type { Invoice, ClinicProfile } from './types';

export function App() {
  // Direct Download Detection: if short param ?inv= or ?d= or ?token= is present in URL
  const [directDownloadData] = useState<{
    invoice: Invoice;
    clinic: ClinicProfile;
  } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      
      // 1. Check clean single-line parameters (e.g. ?inv=S7D-1005&p=rk&t=2465)
      const fromQueryParams = parseInvoiceFromQueryParams(urlParams);
      if (fromQueryParams) return fromQueryParams;

      // 2. Check token parameters ?d=... or ?token=...
      const token = urlParams.get('d') || urlParams.get('token') || urlParams.get('payload');
      
      // Also check hash for #inv=... or #d=...
      const hash = window.location.hash;
      if (hash.includes('inv=') || hash.includes('i=')) {
        const hashParams = new URLSearchParams(hash.replace(/^#\/?/, ''));
        const fromHashParams = parseInvoiceFromQueryParams(hashParams);
        if (fromHashParams) return fromHashParams;
      }

      const hashToken = hash.includes('d=') 
        ? hash.split('d=')[1]?.split('&')[0] 
        : hash.startsWith('#/d/') 
        ? hash.replace('#/d/', '') 
        : null;

      const effectiveToken = token || hashToken;

      if (effectiveToken) {
        const decoded = decodeInvoicePayload(effectiveToken);
        if (decoded) return decoded;
      }
    } catch (e) {
      console.error('Failed to parse download payload:', e);
    }
    return null;
  });

  // If patient opened a direct invoice download link, directly render the Instant Downloader!
  if (directDownloadData) {
    return (
      <InstantInvoiceDownloader
        invoice={directDownloadData.invoice}
        clinic={directDownloadData.clinic}
      />
    );
  }

  // The public website renders exclusively the patient-facing clinic website
  return <MainClinicWebsite />;
}

export default App;
