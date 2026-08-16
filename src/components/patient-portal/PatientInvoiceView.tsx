import React from 'react';
import type { Invoice, ClinicProfile } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { triggerPrint } from '../../utils/printUtils';
import { InvoiceA4Print } from '../invoices/InvoiceA4Print';
import logoIcon from '../../assets/smile7-logo-icon.png';
import logoText from '../../assets/smile7-logo-text.jpg';
import { 
  Download, 
  Printer, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  CreditCard,
  FileCheck2,
  Calendar,
  Pill,
  ExternalLink
} from 'lucide-react';

interface PatientInvoiceViewProps {
  invoice: Invoice;
  clinic: ClinicProfile;
  onAdminLoginClick?: () => void;
}

export const PatientInvoiceView: React.FC<PatientInvoiceViewProps> = ({
  invoice,
  clinic,
  onAdminLoginClick
}) => {
  const handlePrintOrDownloadPDF = () => {
    triggerPrint('invoice-a4-printable');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col justify-between">
      
      {/* Top Patient Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center gap-2">
              <img 
                src={logoIcon} 
                alt="Smile7 Logo Icon" 
                className="h-8 w-auto object-contain"
              />
              <img 
                src={logoText} 
                alt="Smile7 Dental Clinic" 
                className="h-6 w-auto object-contain hidden sm:block"
              />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm hidden sm:block leading-tight">
                Patient Invoice Portal
              </span>
              <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified Digital Receipt
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintOrDownloadPDF}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-teal-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF / Print</span>
            </button>

            {onAdminLoginClick && (
              <button
                type="button"
                onClick={onAdminLoginClick}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer hidden sm:block"
              >
                Staff Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full p-4 sm:p-6 my-4 space-y-6">
        
        {/* Patient Greeting & Status Banner */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Hello,</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {invoice.patientName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Invoice #{invoice.invoiceNumber} • Issued on {formatDate(invoice.date)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Invoice Total
              </span>
              <span className="text-2xl font-black text-slate-900">
                {formatCurrency(invoice.grandTotal, clinic.currencySymbol)}
              </span>
            </div>

            <div className="pl-3 border-l border-slate-200">
              {invoice.balanceDue === 0 ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Paid in Full
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1.5 rounded-xl font-bold text-xs">
                  <Clock className="w-4 h-4 text-rose-600" />
                  Due: {formatCurrency(invoice.balanceDue, clinic.currencySymbol)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Instant UPI Payment Box (If Balance Due) */}
        {invoice.balanceDue > 0 && clinic.bankDetails?.upiId && (
          <div className="bg-linear-to-r from-teal-700 to-emerald-800 text-white p-6 rounded-3xl shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                  <CreditCard className="w-6 h-6 text-teal-200" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Instant Online UPI Payment</h3>
                  <p className="text-xs text-teal-100">Pay remaining balance securely using any UPI App (GPay, PhonePe, Paytm)</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-teal-200">Balance Amount:</span>
                <p className="text-xl font-black">{formatCurrency(invoice.balanceDue, clinic.currencySymbol)}</p>
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl border border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span>UPI ID: <strong>{clinic.bankDetails.upiId}</strong></span>
              <a
                href={`upi://pay?pa=${clinic.bankDetails.upiId}&pn=${encodeURIComponent(clinic.name)}&am=${invoice.balanceDue}&cu=INR&tn=${encodeURIComponent('Dental Invoice ' + invoice.invoiceNumber)}`}
                className="px-4 py-2 bg-white text-teal-900 font-bold rounded-xl shadow hover:bg-teal-50 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Pay via UPI App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Prescription & Follow-up Card */}
        {(invoice.prescriptions || invoice.nextAppointmentDate) && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {invoice.prescriptions && (
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-1.5 text-blue-950">
                <span className="font-bold flex items-center gap-1.5 text-blue-900">
                  <Pill className="w-4 h-4 text-blue-600" />
                  Prescription & Medication (Rx):
                </span>
                <p className="whitespace-pre-wrap leading-relaxed">{invoice.prescriptions}</p>
              </div>
            )}

            {invoice.nextAppointmentDate && (
              <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl space-y-1.5 text-teal-950">
                <span className="font-bold flex items-center gap-1.5 text-teal-900">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Scheduled Next Appointment:
                </span>
                <p className="text-sm font-black">{formatDate(invoice.nextAppointmentDate)}</p>
                <p className="text-[11px] text-teal-700">Please arrive 5 minutes prior for registration.</p>
              </div>
            )}
          </div>
        )}

        {/* Printable Official A4 Invoice Preview Container */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
              <FileCheck2 className="w-4 h-4 text-teal-600" />
              Official Dental Tax Invoice
            </span>
            <button
              type="button"
              onClick={handlePrintOrDownloadPDF}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print or Save PDF</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            <InvoiceA4Print invoice={invoice} clinic={clinic} />
          </div>
        </div>

        {/* Clinic Info, Help, and Emergency Care */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs text-slate-600">
          <h3 className="text-sm font-bold text-slate-900">Need Help or Dental Support?</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={`tel:${clinic.phone.replace(/\s+/g, '')}`}
              className="p-3.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-2xl flex items-center gap-3 transition-colors text-slate-800"
            >
              <div className="w-10 h-10 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold block text-slate-900">Call Practice Helpline</span>
                <span className="text-slate-500 font-medium">{clinic.phone}</span>
              </div>
            </a>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(clinic.name + ' ' + clinic.addressLine1 + ' ' + clinic.city)}`}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-2xl flex items-center gap-3 transition-colors text-slate-800"
            >
              <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold block text-slate-900">Clinic Location & Directions</span>
                <span className="text-slate-500 font-medium truncate block max-w-[200px]">
                  {clinic.addressLine1}, {clinic.city}
                </span>
              </div>
            </a>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 p-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">Smile7 Dental Clinic • Precision Dental Care Redefined for Comfort</p>
        <p>{clinic.addressLine1}, Janaki Nagar, Maduravoyal, Chennai, Tamil Nadu - 600095</p>
        <p className="text-[11px] text-slate-400">© {new Date().getFullYear()} Smile7 Dental Clinic. All clinical records securely generated.</p>
      </footer>
    </div>
  );
};
