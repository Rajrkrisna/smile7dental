import React, { useState } from 'react';
import type { Invoice, ClinicProfile } from '../../types';
import { InvoiceA4Print } from '../invoices/InvoiceA4Print';
import { 
  Download, 
  Printer, 
  Phone, 
  ShieldCheck 
} from 'lucide-react';

interface InstantInvoiceDownloaderProps {
  invoice: Invoice;
  clinic: ClinicProfile;
}

export const InstantInvoiceDownloader: React.FC<InstantInvoiceDownloaderProps> = ({
  invoice,
  clinic
}) => {
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  const handleDownloadPdf = () => {
    const prevTitle = document.title;
    document.title = `Smile7Dental_Invoice_${invoice.invoiceNumber}_${invoice.patientName.replace(/\s+/g, '_')}`;
    setDownloadTriggered(true);
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-16">
      {/* Top Patient Floating Action Bar (Hidden when printing) */}
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-slate-900 block leading-tight">
                {clinic.name} • Official Invoice #{invoice.invoiceNumber}
              </span>
              <span className="text-[11px] font-bold text-teal-700">
                {clinic.tagline || 'Prevent Now! Smile Forever!'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={`tel:${clinic.phone.replace(/\s+/g, '')}`}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Call Clinic"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Call Clinic</span>
            </a>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              title="Download or save official PDF invoice in 1 click"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span>{downloadTriggered ? 'Saved! Download PDF Again' : 'Download PDF (1-Click)'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer hidden md:flex"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Document Viewport */}
      <main className="max-w-4xl mx-auto p-2 sm:p-6 mt-2">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
          <InvoiceA4Print 
            invoice={invoice} 
            clinic={clinic} 
          />
        </div>

        {/* Bottom Helper Bar on Mobile */}
        <div className="no-print mt-4 text-center space-y-2">
          <p className="text-xs text-slate-500">
            Tap <strong>Download PDF (1-Click)</strong> above to save this dental receipt directly to your smartphone or computer.
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            {clinic.name} • {clinic.addressLine1}, {clinic.city} • Ph: {clinic.phone}
          </p>
        </div>
      </main>
    </div>
  );
};
