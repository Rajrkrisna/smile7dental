import React from 'react';
import { useDental } from '../../context/DentalContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  Plus
} from 'lucide-react';

interface PatientDetailModalProps {
  patientId: string;
  onClose: () => void;
  onCreateInvoiceForPatient: (patientId: string) => void;
  onViewInvoice: (invoiceId: string) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patientId,
  onClose,
  onCreateInvoiceForPatient,
  onViewInvoice
}) => {
  const { getPatientById, invoices, clinicProfile } = useDental();
  const patient = getPatientById(patientId);

  if (!patient) return null;

  const patientInvoices = invoices.filter(inv => inv.patientId === patient.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-600 text-white rounded-2xl flex items-center justify-center font-black text-lg">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{patient.fullName}</h2>
                <span className="bg-teal-100 text-teal-800 text-xs font-mono font-bold px-2 py-0.5 rounded-md">
                  {patient.patientNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {patient.age} Yrs • {patient.gender.toUpperCase()} • Registered {formatDate(patient.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onCreateInvoiceForPatient(patient.id);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Invoice for Patient
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-100/50">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Lifetime Invoiced
              </span>
              <span className="text-xl font-black text-slate-900">
                {formatCurrency(patient.totalBilled, clinicProfile.currencySymbol)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {patientInvoices.length} invoices generated
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                Total Settled / Paid
              </span>
              <span className="text-xl font-black text-emerald-700">
                {formatCurrency(patient.totalPaid, clinicProfile.currencySymbol)}
              </span>
              <span className="text-[11px] text-emerald-600 block mt-0.5">
                Received in full
              </span>
            </div>

            <div className={`p-4 rounded-2xl border shadow-xs ${
              patient.outstandingBalance > 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                patient.outstandingBalance > 0 ? 'text-rose-700' : 'text-slate-400'
              }`}>
                Current Outstanding Dues
              </span>
              <span className={`text-xl font-black ${
                patient.outstandingBalance > 0 ? 'text-rose-700' : 'text-slate-600'
              }`}>
                {formatCurrency(patient.outstandingBalance, clinicProfile.currencySymbol)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {patient.outstandingBalance > 0 ? 'Action required' : 'Account clear'}
              </span>
            </div>
          </div>

          {/* Patient Details & Medical Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                Contact & Personal Information
              </h3>
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold">{patient.phone}</span>
                </div>
                {patient.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{patient.email}</span>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{patient.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Blood Group: <strong className="text-slate-900">{patient.bloodGroup || 'Not Specified'}</strong></span>
                </div>
              </div>

              {patient.emergencyContact && (
                <div className="pt-3 border-t border-slate-100 text-slate-600">
                  <span className="font-bold text-slate-700 block mb-1">Emergency Contact:</span>
                  <p>{patient.emergencyContact.name} ({patient.emergencyContact.relationship}) - {patient.emergencyContact.phone}</p>
                </div>
              )}
            </div>

            {/* Medical Alerts Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Medical Alerts & Contraindications
              </h3>

              {patient.medicalAlerts && patient.medicalAlerts.length > 0 ? (
                <div className="space-y-2">
                  {patient.medicalAlerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 font-bold flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      {alert}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 italic">
                  No critical medical alerts or known allergies recorded.
                </div>
              )}
            </div>
          </div>

          {/* Invoices History Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Treatment & Invoicing History ({patientInvoices.length})
              </h3>
            </div>

            {patientInvoices.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No invoices found for this patient. Click "New Invoice for Patient" to begin.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[10px] uppercase">
                      <th className="py-2.5 px-4">Invoice #</th>
                      <th className="py-2.5 px-4">Date</th>
                      <th className="py-2.5 px-4">Procedures</th>
                      <th className="py-2.5 px-4 text-right">Total</th>
                      <th className="py-2.5 px-4 text-right">Paid</th>
                      <th className="py-2.5 px-4 text-right">Due</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patientInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-teal-800">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {formatDate(inv.date)}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-slate-800">
                          {inv.items.map(i => i.procedureName).join(', ')}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          {formatCurrency(inv.grandTotal, clinicProfile.currencySymbol)}
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-700 font-semibold">
                          {formatCurrency(inv.amountPaid, clinicProfile.currencySymbol)}
                        </td>
                        <td className="py-3 px-4 text-right font-black text-rose-600">
                          {inv.balanceDue > 0 ? formatCurrency(inv.balanceDue, clinicProfile.currencySymbol) : '—'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                            inv.status === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onViewInvoice(inv.id);
                            }}
                            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
