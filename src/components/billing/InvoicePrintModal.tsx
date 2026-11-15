import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { X, Printer, Receipt, FileText, MessageSquare, Download, Copy, Check, QrCode, Globe, ExternalLink, Link2, Sparkles, Loader2 } from 'lucide-react';
import logoIcon from '../../assets/smile7-logo-icon.png';
import { formatINR, numberToIndianWords, formatIndianDate } from '../../utils/currency';
import { getWhatsAppUrl, getInvoiceWhatsAppText } from '../../utils/whatsapp';
import { getOnlineInvoiceUrl } from '../../utils/onlineInvoice';
import { shortenUrl } from '../../utils/urlShortener';
import { downloadInvoicePdf } from '../../utils/pdfGenerator';
import type { Invoice } from '../../types';

interface InvoicePrintModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  invoice,
  onClose
}) => {
  const { clinicProfile } = useClinic();
  const [printLayout, setPrintLayout] = useState<'a4' | 'thermal'>('a4');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const directOnlineUrl = getOnlineInvoiceUrl(invoice, clinicProfile);
  const [effectiveUrl, setEffectiveUrl] = useState<string>(directOnlineUrl);
  const [isShortening, setIsShortening] = useState<boolean>(false);

  // Optional background shortening if URL is longer than 75 chars
  useEffect(() => {
    if (directOnlineUrl.length <= 75) {
      setEffectiveUrl(directOnlineUrl);
      setIsShortening(false);
      return;
    }

    let isMounted = true;
    setIsShortening(true);
    shortenUrl(directOnlineUrl)
      .then((shortLink) => {
        if (isMounted) {
          setEffectiveUrl(shortLink);
          setIsShortening(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsShortening(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [directOnlineUrl]);

  const whatsappMessage = getInvoiceWhatsAppText(
    invoice.patientName,
    invoice.invoiceNumber,
    invoice.total,
    invoice.balance,
    clinicProfile.clinicName,
    clinicProfile.phone,
    effectiveUrl
  );

  const handleCopyOnlineLink = () => {
    try {
      navigator.clipboard.writeText(effectiveUrl);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleOpenOnlineDownload = () => {
    window.open(effectiveUrl, '_blank');
  };

  const handleDownloadPdf = () => {
    downloadInvoicePdf(invoice, clinicProfile);
  };

  const isShortLink = effectiveUrl.length < 80;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4 max-h-[95vh] overflow-y-auto">
        
        {/* STANDALONE CLOSE BUTTON IN THE TOP-RIGHT CORNER */}
        <button
          type="button"
          onClick={onClose}
          className="no-print absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-2xs transition-all cursor-pointer z-30"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Controls Bar (No Print) with padding on right to leave corner clear */}
        <div className="no-print flex flex-col md:flex-row items-start md:items-center justify-between pb-3 border-b border-slate-100 gap-3 pr-12">
          {/* Layout Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Receipt Layout:</span>
            <button
              type="button"
              onClick={() => setPrintLayout('a4')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                printLayout === 'a4'
                  ? 'bg-[#004884] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              A4 Dental Invoice
            </button>
            <button
              type="button"
              onClick={() => setPrintLayout('thermal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                printLayout === 'thermal'
                  ? 'bg-[#004884] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              80mm Thermal Slip
            </button>
          </div>

          {/* Action Buttons: WhatsApp, Download PDF, Print */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={getWhatsAppUrl(invoice.patientPhone, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              title="Send invoice with short PDF download link on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              title="Download or save as PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-[#004884] hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              title="Print receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>

        {/* ONLINE PATIENT DOWNLOAD BANNER & PDF ACTIONS */}
        <div className="no-print bg-sky-50/80 border border-sky-200 rounded-2xl p-4 space-y-3 text-xs shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#004884] text-white flex items-center justify-center shrink-0 shadow-2xs">
                {isShortening ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#002244] block text-xs">
                    Patient Bill Link (1-Click PDF Download)
                  </span>
                  {isShortLink && !isShortening && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      <Sparkles className="w-2.5 h-2.5" /> Short Link
                    </span>
                  )}
                  {isShortening && (
                    <span className="text-[10px] text-sky-700 italic">Shortening...</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-700 truncate font-mono mt-0.5">
                  {effectiveUrl}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleCopyOnlineLink}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[#004884] border border-sky-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                title="Copy online invoice download link"
              >
                {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSuccess ? 'Link Copied!' : 'Copy Short Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenOnlineDownload}
                className="px-3.5 py-1.5 rounded-xl bg-[#004884] hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                title="Open and test 1-click PDF download page"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test 1-Click PDF</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-sky-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600">
            <span>
              Patients can view and download their official dental receipt PDF online in 1 click from any mobile phone or browser.
            </span>
            <span className="font-bold text-sky-900 shrink-0">
              Short link auto-included in WhatsApp message
            </span>
          </div>
        </div>

        {/* FORMAT 1: A4 DENTAL TAX INVOICE */}
        {printLayout === 'a4' && (
          <div className="print-content bg-white p-8 rounded-2xl border border-slate-200 space-y-6 text-slate-900 text-xs">
            {/* Clinic Letterhead */}
            <div className="border-b-2 border-[#004884] pb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={logoIcon} 
                  alt="Smile7 Dental Clinic Logo" 
                  className="w-14 h-14 object-contain shrink-0" 
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
                <div>
                  <h1 className="text-xl font-black text-[#002244] uppercase tracking-tight">
                    {clinicProfile.clinicName}
                  </h1>
                  <p className="text-xs text-slate-600 font-bold">{clinicProfile.tagline}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{clinicProfile.address}</p>
                  <p className="text-[11px] text-slate-500">{clinicProfile.city} • Ph: {clinicProfile.phone}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-black text-xs text-[#004884] block">{clinicProfile.doctorName}</span>
                <span className="text-[11px] text-slate-600 block">{clinicProfile.doctorQualification}</span>
                <span className="text-[10px] text-slate-500 block font-mono">{clinicProfile.registrationNumber}</span>
                <span className="text-[10px] text-slate-500 block">{clinicProfile.dentalCouncil}</span>
              </div>
            </div>

            {/* Invoice & Patient Info Bar */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Details:</span>
                <p className="font-extrabold text-sm text-slate-900 mt-0.5">{invoice.patientName}</p>
                <p className="text-[11px] text-slate-600">Mobile: {invoice.patientPhone}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Invoice Receipt:</span>
                <p className="font-extrabold text-sm text-[#004884] font-mono mt-0.5">{invoice.invoiceNumber}</p>
                <p className="text-[11px] text-slate-600">Date: {formatIndianDate(invoice.date)}</p>
                <p className="text-[11px] text-slate-600 font-bold">Payment Mode: {invoice.paymentMethod}</p>
              </div>
            </div>

            {/* Itemized Dental Treatments Table */}
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-left text-slate-600 font-bold text-[10px] uppercase">
                  <th className="py-2.5">#</th>
                  <th className="py-2.5">Treatment / Clinical Procedure</th>
                  <th className="py-2.5">Tooth # (FDI) / Surfaces</th>
                  <th className="py-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id} className="py-2">
                    <td className="py-2.5 font-bold text-slate-400">{idx + 1}.</td>
                    <td className="py-2.5">
                      <span className="font-extrabold text-slate-900 block">{item.procedureName}</span>
                      {item.procedureCode && (
                        <span className="text-[10px] text-slate-500 font-mono">Code: {item.procedureCode}</span>
                      )}
                    </td>
                    <td className="py-2.5">
                      <span className="font-bold text-[#004884]">
                        {item.teeth.length > 0 ? item.teeth.join(', ') : 'General'}
                      </span>
                      {item.surfaces && (
                        <span className="text-slate-500 ml-1">({item.surfaces})</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right font-black text-slate-900">
                      {formatINR(item.cost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations Breakdown */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between pt-2 border-t border-slate-200 gap-4">
              <div className="text-xs text-slate-600 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Amount In Words:</span>
                <p className="font-bold text-slate-800 italic bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-block">
                  {numberToIndianWords(invoice.total)}
                </p>
              </div>

              <div className="w-64 space-y-1.5 text-right text-xs shrink-0 self-end">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold">{formatINR(invoice.subtotal)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span className="font-bold">-{formatINR(invoice.discount)}</span>
                  </div>
                )}
                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Tax ({invoice.taxRate}%):</span>
                    <span className="font-bold">+{formatINR(invoice.taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span>{formatINR(invoice.total)}</span>
                </div>
                <div className="flex justify-between text-[#004884] font-bold">
                  <span>Amount Settled:</span>
                  <span>{formatINR(invoice.paidAmount)}</span>
                </div>
                {invoice.balance > 0 && (
                  <div className="flex justify-between text-rose-700 font-black text-xs pt-1 border-t border-rose-100">
                    <span>Balance Due:</span>
                    <span>{formatINR(invoice.balance)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-200">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Payment Status:</span>
                  <span className={`inline-block font-extrabold uppercase px-2 py-0.5 rounded text-[10px] ${
                    invoice.balance === 0
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {invoice.balance === 0 ? 'PAID IN FULL' : 'PARTIAL DUE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Indian UPI & Bank Details Banner */}
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#004884] shrink-0" />
                <div>
                  <span className="font-bold text-[#004884]">UPI & Digital Payments Accepted</span>
                  <p className="text-[10px] text-slate-600">GPay • PhonePe • Paytm • BHIM • UPI ID: <strong className="font-mono">9840123891@okaxis</strong></p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500">Smile7 Helpline: {clinicProfile.phone}</span>
            </div>

            {/* Footer Note & Signature */}
            <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs">
              <div className="max-w-xs space-y-1">
                <p className="text-[11px] text-slate-500">{clinicProfile.footerNote}</p>
                <p className="text-[10px] text-slate-400 font-mono">Invoice Status: {invoice.status.toUpperCase()}</p>
              </div>

              <div className="text-right space-y-1">
                <div className="w-40 border-b border-slate-400 h-8"></div>
                <span className="font-extrabold text-slate-900 block text-xs">{clinicProfile.doctorName}</span>
                <span className="text-[10px] text-slate-500 block">Authorized Signature</span>
              </div>
            </div>
          </div>
        )}

        {/* FORMAT 2: 80MM THERMAL RECEIPT */}
        {printLayout === 'thermal' && (
          <div className="print-content max-w-xs mx-auto p-4 bg-white rounded-xl border border-slate-300 font-mono text-[11px] leading-tight space-y-3 text-slate-900">
            <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
              <h3 className="font-black text-xs uppercase">{clinicProfile.clinicName}</h3>
              <p className="text-[10px]">{clinicProfile.doctorName} • {clinicProfile.dentalCouncil}</p>
              <p className="text-[10px]">{clinicProfile.address}</p>
              <p className="text-[10px]">Ph: {clinicProfile.phone}</p>
            </div>

            <div className="space-y-0.5 border-b border-dashed border-slate-300 pb-2">
              <div className="flex justify-between">
                <span>RECEIPT: {invoice.invoiceNumber}</span>
                <span>{formatIndianDate(invoice.date)}</span>
              </div>
              <div>Patient: {invoice.patientName}</div>
              <div>Doctor: {clinicProfile.doctorName}</div>
            </div>

            <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-2">
              {invoice.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="truncate pr-2">{item.procedureName}</span>
                  <span className="shrink-0">{formatINR(item.cost)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 font-bold">
              <div className="flex justify-between">
                <span>TOTAL:</span>
                <span>{formatINR(invoice.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>PAID ({invoice.paymentMethod}):</span>
                <span>{formatINR(invoice.paidAmount)}</span>
              </div>
              {invoice.balance > 0 && (
                <div className="flex justify-between text-rose-700">
                  <span>BALANCE DUE:</span>
                  <span>{formatINR(invoice.balance)}</span>
                </div>
              )}
            </div>

            <div className="text-center text-[10px] pt-2 border-t border-dashed border-slate-300 space-y-1">
              <p>UPI Accepted: GPay / PhonePe / Paytm</p>
              <p>*** Thank You For Visiting Smile7 ***</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

