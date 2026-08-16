import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { 
  sendWhatsAppInvoice, 
  sendEmailInvoice, 
  generateWhatsAppInvoiceText, 
  generateEmailInvoiceContent,
  generateInvoiceDownloadUrl,
  sanitizeIndianPhoneNumber 
} from '../../utils/shareUtils';
import { 
  X, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Link
} from 'lucide-react';

interface ShareInvoiceModalProps {
  invoiceId: string;
  onClose: () => void;
}

export const ShareInvoiceModal: React.FC<ShareInvoiceModalProps> = ({
  invoiceId,
  onClose
}) => {
  const { getInvoiceById, clinicProfile, getPatientById, adminAuth } = useDental();
  const invoice = getInvoiceById(invoiceId);
  const patient = invoice ? getPatientById(invoice.patientId) : undefined;

  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email'>('whatsapp');
  
  // WhatsApp Form State
  const [whatsappPhone, setWhatsappPhone] = useState<string>(
    invoice?.patientPhone || patient?.phone || ''
  );
  
  // Email Form State
  const [recipientEmail, setRecipientEmail] = useState<string>(
    patient?.email || ''
  );

  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  if (!invoice) return null;

  const downloadUrl = generateInvoiceDownloadUrl(invoice, clinicProfile, adminAuth.subdomainUrl);
  const whatsAppText = generateWhatsAppInvoiceText(invoice, clinicProfile, adminAuth.subdomainUrl);
  const emailContent = generateEmailInvoiceContent(invoice, clinicProfile, adminAuth.subdomainUrl);

  const handleSendWhatsApp = () => {
    sendWhatsAppInvoice(invoice, clinicProfile, whatsappPhone, adminAuth.subdomainUrl);
  };

  const handleSendEmail = () => {
    sendEmailInvoice(invoice, clinicProfile, recipientEmail, adminAuth.subdomainUrl);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Dispatch Invoice to Patient
                </h2>
                <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {invoice.invoiceNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Patient: <span className="font-semibold text-slate-800">{invoice.patientName}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Public Download Link Banner */}
        <div className="p-4 bg-teal-50/80 border-b border-teal-200/80 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-teal-950 flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-teal-700" />
              Patient Direct Download Link (Short URL):
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-[11px] font-bold text-teal-800 hover:text-teal-950 bg-white px-2.5 py-1 rounded-lg border border-teal-200 shadow-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-teal-800 hover:text-teal-950 bg-white px-2.5 py-1 rounded-lg border border-teal-200 shadow-xs flex items-center gap-1"
              >
                <span>Preview</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="p-2 bg-white rounded-xl border border-teal-200 font-mono text-[10px] text-teal-900 truncate">
            {downloadUrl}
          </div>
        </div>

        {/* Tab Selector: WhatsApp vs Email */}
        <div className="p-4 border-b border-slate-100 flex gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm shadow-emerald-600/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
            <span>Send via WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
              activeTab === 'email'
                ? 'bg-teal-700 text-white border-teal-800 shadow-sm shadow-teal-700/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-4 h-4 text-teal-300" />
            <span>Send via Email</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* TAB 1: WhatsApp Dispatch */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Patient WhatsApp Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="tel"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      placeholder="+91 98401 XXXXX"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 self-center font-mono">
                    Formatted: +{sanitizeIndianPhoneNumber(whatsappPhone)}
                  </span>
                </div>
              </div>

              {/* Message Live Preview */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Message Preview (With Download Link):</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleCopyClipboard(whatsAppText)}
                    className="text-[11px] font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl max-h-56 overflow-y-auto whitespace-pre-wrap font-sans text-slate-800 text-[11px] leading-relaxed shadow-inner">
                  {whatsAppText}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
              >
                <span>Launch WhatsApp & Send with Download Link</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 2: Email Dispatch */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Recipient Patient Email Address
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  readOnly
                  value={emailContent.subject}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700"
                />
              </div>

              {/* Email Body Preview */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <span>Email Message Body (Includes Download Link):</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleCopyClipboard(emailContent.body)}
                    className="text-[11px] font-bold text-slate-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Email Body</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl max-h-52 overflow-y-auto whitespace-pre-wrap font-mono text-slate-800 text-[10px] leading-relaxed">
                  {emailContent.body}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleSendEmail}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-xl shadow-md shadow-teal-700/25 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Open in Mail App & Send</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
          <span className="text-slate-500">
            Smile7 Dental Clinic • Maduravoyal
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
