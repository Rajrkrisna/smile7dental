import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { formatCurrency } from '../../utils/formatters';
import { exportToCSV } from '../../utils/printUtils';
import { 
  Users, 
  Search, 
  UserPlus, 
  Download, 
  Eye, 
  FileText, 
  AlertTriangle, 
  Trash2 
} from 'lucide-react';

interface PatientListProps {
  onOpenAddPatient: () => void;
  onSelectPatient: (patientId: string) => void;
  onCreateInvoiceForPatient: (patientId: string) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  onOpenAddPatient,
  onSelectPatient,
  onCreateInvoiceForPatient
}) => {
  const { patients, deletePatient, clinicProfile } = useDental();
  const [searchTerm, setSearchTerm] = useState('');
  const [balanceFilter, setBalanceFilter] = useState<'all' | 'due' | 'clear'>('all');

  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.patientNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBalance = 
      balanceFilter === 'all' ? true :
      balanceFilter === 'due' ? p.outstandingBalance > 0 :
      p.outstandingBalance === 0;

    return matchesSearch && matchesBalance;
  });

  const handleExportCSV = () => {
    const data = filteredPatients.map(p => ({
      PatientID: p.patientNumber,
      FullName: p.fullName,
      Phone: p.phone,
      Email: p.email || '',
      Age: p.age,
      Gender: p.gender,
      TotalBilled: p.totalBilled,
      TotalPaid: p.totalPaid,
      OutstandingBalance: p.outstandingBalance,
      MedicalAlerts: p.medicalAlerts?.join('; ') || '',
      RegisteredDate: p.createdAt
    }));
    exportToCSV(data, `Smile7dental_Patients_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl flex items-center justify-center shadow-inner">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Patient Directory</h1>
            <p className="text-xs text-slate-500">
              Manage clinical patient records, treatment balances, and medical history
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            type="button"
            onClick={onOpenAddPatient}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-sm shadow-teal-600/20 transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            + Add New Patient
          </button>
        </div>
      </div>

      {/* Search & Balance Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search patient by name, phone (+1...), or ID (PAT-1001)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold">Account Status:</span>
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setBalanceFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                balanceFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              All ({patients.length})
            </button>
            <button
              type="button"
              onClick={() => setBalanceFilter('due')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                balanceFilter === 'due' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500'
              }`}
            >
              With Due ({patients.filter(p => p.outstandingBalance > 0).length})
            </button>
            <button
              type="button"
              onClick={() => setBalanceFilter('clear')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                balanceFilter === 'clear' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
              }`}
            >
              Settled / Nil Due
            </button>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Patients Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No patient records match "{searchTerm}". You can register a new patient now.
            </p>
            <button
              type="button"
              onClick={onOpenAddPatient}
              className="mt-2 px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 inline-flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" /> + Add Patient
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Patient ID</th>
                  <th className="py-3.5 px-4">Full Name & Demographics</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Medical Alerts</th>
                  <th className="py-3.5 px-4 text-right">Lifetime Billed</th>
                  <th className="py-3.5 px-4 text-right">Outstanding Due</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                    onClick={() => onSelectPatient(patient.id)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-800 whitespace-nowrap">
                      {patient.patientNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 text-sm">{patient.fullName}</p>
                      <p className="text-[11px] text-slate-400">
                        {patient.age} Yrs • {patient.gender.toUpperCase()} 
                        {patient.bloodGroup ? ` • Blood: ${patient.bloodGroup}` : ''}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {patient.phone}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      {patient.medicalAlerts && patient.medicalAlerts.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {patient.medicalAlerts.map((alert, idx) => (
                            <span
                              key={idx}
                              className="bg-rose-50 border border-rose-200 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1"
                            >
                              <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                              {alert}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None recorded</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-semibold text-slate-800 whitespace-nowrap">
                      {formatCurrency(patient.totalBilled, clinicProfile.currencySymbol)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black whitespace-nowrap">
                      {patient.outstandingBalance > 0 ? (
                        <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 font-bold text-xs">
                          {formatCurrency(patient.outstandingBalance, clinicProfile.currencySymbol)}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold">Clear</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onCreateInvoiceForPatient(patient.id)}
                          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-lg border border-teal-200 text-[11px] flex items-center gap-1"
                          title="Generate Invoice"
                        >
                          <FileText className="w-3 h-3" />
                          Bill
                        </button>

                        <button
                          type="button"
                          onClick={() => onSelectPatient(patient.id)}
                          className="p-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete record for ${patient.fullName}?`)) {
                              deletePatient(patient.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete Patient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
