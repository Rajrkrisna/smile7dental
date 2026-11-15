import React, { useState, useEffect } from 'react';
import type { Invoice, ClinicProfile } from '../../types';
import { InvoiceA4Print } from '../invoices/InvoiceA4Print';
import { downloadInvoicePdf } from '../../utils/pdfGenerator';
import { 
  Download, 
  Printer, 
  Phone, 
  ShieldCheck, 
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface InstantInvoiceDownloaderProps {
  invoice: Invoice;
  clinic: ClinicProfile;
}

export const InstantInvoiceDownloader: React.FC<InstantInvoiceDownloaderProps> = ({
  invoice,
  clinic
}) => {
  const [downloadCount, setDownloadCount] = useState(0);
  const [downloadedFileName, setDownloadedFileName] = useState('');

  // Automatically and directly trigger the PDF file download as soon as the patient clicks the WhatsApp link!
  useEffect(() => {
    // 350ms delay gives the browser time to finish initial paint and render before triggering file download
    const timer = setTimeout(() => {
      const fileName = downloadInvoicePdf(invoice, clinic);
      if (fileName) {
        setDownloadedFileName(fileName);
        setDownloadCount((c) => c + 1);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [invoice, clinic]);

  const handleDownloadPdf = () => {
    const fileName = downloadInvoicePdf(invoice, clinic);
    if (fileName) {
      setDownloadedFileName(fileName);
      setDownloadCount((c) => c + 1);
    }
  };

  const handlePrint = () => {
    const prevTitle = document.title;
    document.title = `Smile7Dental_Invoice_${invoice.invoiceNumber}_${invoice.patientName.replace(/\s+/g, '_')}`;
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-16">
      {/* Top Direct Download Success Banner */}
      <div className="no-print bg-[#004884] text-white px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs tracking-wide">
                  Official PDF Bill Downloaded
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-200 text-[10px] font-bold">
                  <Sparkles className="w-2.5 h-2.5" /> Direct Download
                </span>
              </div>
              <p className="text-[11px] text-sky-100 font-mono mt-0.5">
                {downloadedFileName || `Smile7Dental_Invoice_${invoice.invoiceNumber}.pdf`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Download another copy of your PDF invoice"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadCount > 1 ? 'Downloaded Again!' : 'Download PDF Again'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Header */}
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-slate-900 block leading-tight">
                {clinic.name} • Invoice #{invoice.invoiceNumber}
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
              <span>Call Clinic</span>
            </a>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              title="Download PDF Bill"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF File</span>
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
