import React, { useEffect } from 'react';
import type { Invoice, ClinicProfile } from '../../types';
import { InvoiceA4Print } from '../invoices/InvoiceA4Print';
import { downloadInvoicePdf } from '../../utils/pdfGenerator';
import { Download } from 'lucide-react';

interface InstantInvoiceDownloaderProps {
  invoice: Invoice;
  clinic: ClinicProfile;
}

export const InstantInvoiceDownloader: React.FC<InstantInvoiceDownloaderProps> = ({
  invoice,
  clinic
}) => {
  // Automatically and directly trigger the PDF file download as soon as the patient clicks the WhatsApp link!
  useEffect(() => {
    // 350ms delay gives the browser time to finish initial paint and render before triggering file download
    const timer = setTimeout(() => {
      downloadInvoicePdf(invoice, clinic);
    }, 350);

    return () => clearTimeout(timer);
  }, [invoice, clinic]);

  const handleDownloadPdf = () => {
    downloadInvoicePdf(invoice, clinic);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-16">
      {/* Clean Single Header - ONLY Download PDF File Button */}
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-end">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            title="Download PDF File"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF File</span>
          </button>
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
            Your official PDF invoice has been downloaded. You can view or save it directly on your device.
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            {clinic.name} • {clinic.addressLine1}, {clinic.city} • Ph: {clinic.phone}
          </p>
        </div>
      </main>
    </div>
  );
};
