import React, { useEffect, useState } from 'react';
import type { Invoice, ClinicProfile } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { downloadStandaloneInvoiceFile } from '../../utils/printUtils';
import logoIcon from '../../assets/smile7-logo-icon.png';
import logoText from '../../assets/smile7-logo-text.jpg';
import { 
  Download, 
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
  const [downloadCount, setDownloadCount] = useState(0);

  const performDirectDownload = () => {
    downloadStandaloneInvoiceFile(invoice, clinic);
    setDownloadTriggered(true);
    setDownloadCount(prev => prev + 1);
  };

  // Automatically trigger the file download on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      performDirectDownload();
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100 font-sans select-none">
      {/* Background glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Download Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        
        {/* Clinic Logo */}
        <div className="bg-white p-3 rounded-2xl inline-flex items-center justify-center gap-2 shadow-lg mx-auto">
          <img 
            src={logoIcon} 
            alt="Smile7 Icon" 
            className="h-9 w-auto object-contain"
          />
          <img 
            src={logoText} 
            alt="Smile7 Dental Clinic" 
            className="h-7 w-auto object-contain"
          />
        </div>

        {/* Status Indicator */}
        <div className="space-y-2">
          <div className="w-14 h-14 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center mx-auto animate-bounce">
            <Download className="w-7 h-7" />
          </div>
          
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {downloadTriggered ? 'Invoice Downloaded' : 'Downloading Invoice...'}
          </h1>
          
          <p className="text-xs text-slate-400">
            Official dental receipt generated for <strong className="text-white">{invoice.patientName}</strong>
          </p>
        </div>

        {/* Invoice Summary Pill */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Invoice Number:</span>
            <span className="font-mono font-bold text-teal-400">#{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Treatment Date:</span>
            <span className="font-medium text-slate-200">{formatDate(invoice.date)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Total Bill:</span>
            <span className="font-bold text-white text-sm">{formatCurrency(invoice.grandTotal, clinic.currencySymbol)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
            <span>Payment Status:</span>
            <span className={`font-black uppercase text-[11px] px-2 py-0.5 rounded-full ${
              invoice.balanceDue === 0 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {invoice.balanceDue === 0 ? 'Paid in Full' : `Due: ${formatCurrency(invoice.balanceDue, clinic.currencySymbol)}`}
            </span>
          </div>
        </div>

        {/* Download Actions */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={performDirectDownload}
            className="w-full py-3.5 bg-linear-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 active:scale-98 text-white font-bold rounded-xl shadow-lg shadow-teal-900/40 flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloadCount > 1 ? 'Download Again' : 'Click to Download Invoice'}</span>
          </button>

          <p className="text-[11px] text-slate-500">
            The file has been saved to your device's <strong>Downloads</strong> folder. Open it anytime to print or save as PDF.
          </p>
        </div>

        {/* Clinic Verification Footer */}
        <div className="pt-4 border-t border-slate-800/60 text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
          <span>Verified Healthcare Record • Smile7 Dental Clinic, Chennai</span>
        </div>
      </div>
    </div>
  );
};
