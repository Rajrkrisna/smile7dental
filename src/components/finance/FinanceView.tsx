import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FlaskConical, 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Phone, 
  Trash2, 
  Check, 
  X, 
  ExternalLink,
  MessageSquare,
  Building2,
  Stethoscope,
  Sparkles,
  PieChart,
  FileSpreadsheet,
  QrCode
} from 'lucide-react';
import { formatINR, formatIndianDate } from '../../utils/currency';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import type { 
  ConsultantPayout, 
  LabWorkOrder, 
  GeneralExpense, 
  ConsultantSpecialty, 
  LabWorkStatus,
  ExpenseCategory 
} from '../../types';

const CONSULTANT_PRESETS = [
  { name: 'Dr. S. Anand (MDS)', specialty: 'Oral & Maxillofacial Surgeon' as ConsultantSpecialty, phone: '+91 98410 88231', defaultFee: 2500, procedure: 'Surgical Impaction 3rd Molar' },
  { name: 'Dr. R. Vignesh (MDS)', specialty: 'Orthodontist' as ConsultantSpecialty, phone: '+91 97911 44520', defaultFee: 1500, procedure: 'Monthly Orthodontic Wire Change' },
  { name: 'Dr. M. Deepa (MDS)', specialty: 'Endodontist' as ConsultantSpecialty, phone: '+91 94440 22391', defaultFee: 2000, procedure: 'Microscopic Molar Root Canal' },
  { name: 'Dr. K. Praveen (MDS)', specialty: 'Pedodontist' as ConsultantSpecialty, phone: '+91 98842 11340', defaultFee: 1800, procedure: 'Pediatric Pulpectomy & Crown' },
  { name: 'Dr. J. Suresh (MDS)', specialty: 'Periodontist' as ConsultantSpecialty, phone: '+91 97891 66550', defaultFee: 2200, procedure: 'Flap Surgery & Bone Grafting' }
];

const LAB_PRESETS = [
  { name: 'DentCare Dental Lab', phone: '+91 98841 55660' },
  { name: 'Vasantha Dental Ceramic Lab', phone: '+91 97890 11223' },
  { name: 'Illusion Dental Craft', phone: '+91 94442 33441' },
  { name: 'Precision Zirconia Studio', phone: '+91 98401 99220' }
];

const COMMON_WORK_TYPES = [
  'CAD/CAM Monolithic High-Translucent Zirconia Crown',
  'Porcelain Fused to Metal (PFM) Ceramic Crown',
  'E-Max Aesthetic Lithium Disilicate Crown',
  'Full Metal Crown / Cast Cap',
  'Complete Denture (Single Arch)',
  'Complete Denture (Dual-Arch - Both Arches)',
  'Cast Partial Denture (BPS Acrylic)',
  'Flexible Valplast Partial Denture',
  'Upper Hawley Orthodontic Retainer',
  'Clear Aligners (Invisible Braces)',
  'Night Guard / Occlusal Splint'
];

const COMMON_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Dental Materials & Consumables',
  'Clinic Rent',
  'Electricity & TNEB',
  'Staff & Assistant Salary',
  'Bio-Medical Waste Disposal',
  'Equipment Servicing & Maintenance',
  'Marketing & Printing',
  'Tea, Coffee & Patient Hospitality',
  'Miscellaneous'
];

export const FinanceView: React.FC = () => {
  const { 
    clinicProfile,
    patients,
    invoices,
    consultantPayouts,
    addConsultantPayout,
    updateConsultantPayout,
    deleteConsultantPayout,
    labWorkOrders,
    addLabWorkOrder,
    updateLabWorkOrder,
    deleteLabWorkOrder,
    generalExpenses,
    addGeneralExpense,
    updateGeneralExpense,
    deleteGeneralExpense
  } = useClinic();

  const [activeFinanceTab, setActiveFinanceTab] = useState<'consultants' | 'labs' | 'expenses' | 'summary'>('consultants');

  // Modal States
  const [isAddConsultantOpen, setIsAddConsultantOpen] = useState(false);
  const [isAddLabOpen, setIsAddLabOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPendingOnly, setFilterPendingOnly] = useState(false);

  // Calculations
  const totalCollections = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalConsultantPaid = consultantPayouts.reduce((acc, c) => acc + c.amountPaid, 0);
  const totalConsultantPending = consultantPayouts.reduce((acc, c) => acc + c.balanceDue, 0);

  const totalLabPaid = labWorkOrders.reduce((acc, l) => acc + l.amountPaid, 0);
  const totalLabPending = labWorkOrders.reduce((acc, l) => acc + l.balanceDue, 0);

  const totalGeneralExpenses = generalExpenses.reduce((acc, e) => acc + e.amount, 0);

  const totalExpenses = totalConsultantPaid + totalLabPaid + totalGeneralExpenses;
  const netProfit = totalCollections - totalExpenses;
  const totalPendingPayables = totalConsultantPending + totalLabPending;
  const profitMargin = totalCollections > 0 ? Math.round((netProfit / totalCollections) * 100) : 0;

  // Form states: Consultant Payout
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cSpecialty, setCSpecialty] = useState<ConsultantSpecialty>('Oral & Maxillofacial Surgeon');
  const [cPatient, setCPatient] = useState(patients[0]?.name || '');
  const [cProcedure, setCProcedure] = useState('');
  const [cDate, setCDate] = useState(new Date().toISOString().split('T')[0]);
  const [cFee, setCFee] = useState<number | ''>('');
  const [cPaid, setCPaid] = useState<number | ''>('');
  const [cMethod, setCMethod] = useState<'UPI / GPay' | 'Cash' | 'Bank Transfer / IMPS' | 'Cheque'>('UPI / GPay');
  const [cNotes, setCNotes] = useState('');

  // Form states: Lab Work Order
  const [labName, setLabName] = useState(LAB_PRESETS[0].name);
  const [labPhone, setLabPhone] = useState(LAB_PRESETS[0].phone);
  const [labWorkType, setLabWorkType] = useState(COMMON_WORK_TYPES[0]);
  const [labPatient, setLabPatient] = useState(patients[0]?.name || '');
  const [labTeeth, setLabTeeth] = useState('Tooth 16 (FDI)');
  const [labShade, setLabShade] = useState('A2');
  const [labSentDate, setLabSentDate] = useState(new Date().toISOString().split('T')[0]);
  const [labExpDate, setLabExpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [labFee, setLabFee] = useState<number | ''>('');
  const [labPaidAmt, setLabPaidAmt] = useState<number | ''>('');
  const [labMethod, setLabMethod] = useState<'UPI / GPay' | 'Cash' | 'Bank Transfer / IMPS' | 'Cheque'>('UPI / GPay');
  const [labNotes, setLabNotes] = useState('');

  // Form states: General Expense
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Dental Materials & Consumables');
  const [expTitle, setExpTitle] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expAmount, setExpAmount] = useState<number | ''>('');
  const [expPaidTo, setExpPaidTo] = useState('');
  const [expMethod, setExpMethod] = useState<'UPI / GPay' | 'Cash' | 'Bank Transfer / IMPS' | 'Card'>('UPI / GPay');
  const [expInvoiceNum, setExpInvoiceNum] = useState('');
  const [expNotes, setExpNotes] = useState('');

  // Handlers: Consultant Payout Submit
  const handleConsultantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim()) return;

    const fee = typeof cFee === 'number' ? cFee : 0;
    const paid = typeof cPaid === 'number' ? cPaid : 0;
    const balance = Math.max(0, fee - paid);
    const status = balance === 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending';

    addConsultantPayout({
      consultantName: cName.trim(),
      consultantPhone: cPhone.trim() || undefined,
      specialty: cSpecialty,
      patientName: cPatient.trim() || undefined,
      procedure: cProcedure.trim() || 'Specialist Consultation',
      date: cDate,
      caseFee: fee,
      amountPaid: paid,
      balanceDue: balance,
      paymentMethod: cMethod,
      status,
      notes: cNotes.trim() || undefined
    });

    setIsAddConsultantOpen(false);
    setCName('');
    setCPhone('');
    setCProcedure('');
    setCFee('');
    setCPaid('');
    setCNotes('');
  };

  // Handlers: Lab Order Submit
  const handleLabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labName.trim() || !labPatient.trim()) return;

    const charge = typeof labFee === 'number' ? labFee : 0;
    const paid = typeof labPaidAmt === 'number' ? labPaidAmt : 0;
    const balance = Math.max(0, charge - paid);
    const paymentStatus = balance === 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending';

    addLabWorkOrder({
      labName: labName.trim(),
      labPhone: labPhone.trim() || undefined,
      workType: labWorkType,
      patientName: labPatient.trim(),
      teeth: labTeeth.trim() || undefined,
      shade: labShade.trim() || undefined,
      sentDate: labSentDate,
      expectedDeliveryDate: labExpDate,
      workStatus: 'In-Lab',
      labCharge: charge,
      amountPaid: paid,
      balanceDue: balance,
      paymentMethod: labMethod,
      paymentStatus,
      notes: labNotes.trim() || undefined
    });

    setIsAddLabOpen(false);
    setLabFee('');
    setLabPaidAmt('');
    setLabNotes('');
  };

  // Handlers: Expense Submit
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || expAmount === '') return;

    addGeneralExpense({
      category: expCategory,
      title: expTitle.trim(),
      date: expDate,
      amount: Number(expAmount),
      paidTo: expPaidTo.trim() || 'Vendor',
      paymentMethod: expMethod,
      invoiceNumber: expInvoiceNum.trim() || undefined,
      notes: expNotes.trim() || undefined
    });

    setIsAddExpenseOpen(false);
    setExpTitle('');
    setExpAmount('');
    setExpPaidTo('');
    setExpInvoiceNum('');
    setExpNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-50 text-[#004884]">
              <Wallet className="w-5 h-5" />
            </span>
            <h2 className="font-black text-lg text-slate-900 tracking-tight">
              Clinic Finance & Accounts Management
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain visiting consultant doctor payouts, dental lab charges, clinic expenses, and practice profit & loss.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddConsultantOpen(true)}
            className="px-3.5 py-2 bg-[#004884] hover:bg-sky-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>+ Pay Consultant</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddLabOpen(true)}
            className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>+ New Lab Order</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddExpenseOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Log Expense</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Collections */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Total Patient Income</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {formatINR(totalCollections)}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">
            From {invoices.length} patient bills
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Total Practice Expenses</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {formatINR(totalExpenses)}
          </p>
          <p className="text-[11px] text-rose-600 font-medium">
            Consultants, Labs & OPEX
          </p>
        </div>

        {/* Net Profit */}
        <div className="bg-gradient-to-br from-[#002244] to-[#004884] text-white p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-sky-200">
            <span className="text-xs font-bold">Net Practice Cashflow</span>
            <div className="p-1.5 rounded-lg bg-white/10 text-sky-200">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black tracking-tight text-white">
            {formatINR(netProfit)}
          </p>
          <p className="text-[11px] text-sky-200 font-medium">
            {profitMargin}% Operational Margin
          </p>
        </div>

        {/* Pending Payables */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Pending Payables</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-900 tracking-tight">
            {formatINR(totalPendingPayables)}
          </p>
          <p className="text-[11px] text-amber-700 font-medium">
            Consultant: {formatINR(totalConsultantPending)} • Lab: {formatINR(totalLabPending)}
          </p>
        </div>
      </div>

      {/* Finance Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'consultants', label: `Visiting Consultants (${consultantPayouts.length})`, icon: Stethoscope },
          { id: 'labs', label: `Dental Lab Charges (${labWorkOrders.length})`, icon: FlaskConical },
          { id: 'expenses', label: `Clinic Expenses & Overheads (${generalExpenses.length})`, icon: Receipt },
          { id: 'summary', label: 'Practice P&L Statement', icon: PieChart }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeFinanceTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFinanceTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#004884] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CONSULTANT DOCTOR PAYOUTS */}
      {/* ========================================================================= */}
      {activeFinanceTab === 'consultants' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Visiting Specialist Doctors Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Pay orthodontic, oral surgery, and endodontic consultants per case or sitting.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddConsultantOpen(true)}
              className="px-3 py-1.5 bg-[#004884] hover:bg-sky-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Consultant Payout</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consultantPayouts.map(c => (
              <div 
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-50 text-[#004884] border border-sky-200">
                        {c.specialty}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-1.5">
                        {c.consultantName}
                      </h4>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="font-bold text-slate-800">
                      Procedure: <span className="text-[#004884]">{c.procedure}</span>
                    </p>
                    {c.patientName && (
                      <p className="text-slate-600">
                        Patient: <strong>{c.patientName}</strong>
                      </p>
                    )}
                    <p className="text-slate-400 text-[11px]">
                      Visit Date: {formatIndianDate(c.date)}
                    </p>
                  </div>

                  {c.notes && (
                    <p className="text-[11px] text-slate-500 italic mt-2">
                      "{c.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Case Fee:</span>
                    <span className="font-bold text-slate-900">{formatINR(c.caseFee)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Settled Amount:</span>
                    <span className="font-extrabold text-emerald-700">{formatINR(c.amountPaid)}</span>
                  </div>
                  {c.balanceDue > 0 && (
                    <div className="flex items-center justify-between text-xs text-rose-700 font-bold">
                      <span>Balance Payable:</span>
                      <span>{formatINR(c.balanceDue)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      {c.consultantPhone && (
                        <a
                          href={getWhatsAppUrl(
                            c.consultantPhone,
                            `Hello ${c.consultantName},

Payment update from Smile7 Dental Clinic (Dr. P. Manickapriya):
Case: ${c.procedure} (${c.patientName || 'Patient'})
Case Fee: ${formatINR(c.caseFee)}
Settled: ${formatINR(c.amountPaid)} via ${c.paymentMethod}
Status: ${c.status}

Thank you!`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                          title="Share payment update on WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      {c.status !== 'Paid' && (
                        <button
                          type="button"
                          onClick={() => updateConsultantPayout({
                            ...c,
                            amountPaid: c.caseFee,
                            balanceDue: 0,
                            status: 'Paid'
                          })}
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteConsultantPayout(c.id)}
                      className="p-1 text-slate-300 hover:text-rose-600 cursor-pointer transition-colors"
                      title="Delete payout entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {consultantPayouts.length === 0 && (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
              <Stethoscope className="w-10 h-10 mx-auto text-slate-300" />
              <h4 className="font-extrabold text-sm text-slate-700">No Consultant Payouts Recorded</h4>
              <p className="text-xs">Click "+ Pay Consultant" to log payments to visiting orthodontists, surgeons, or endodontists.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DENTAL LAB CHARGES & ORDERS */}
      {/* ========================================================================= */}
      {activeFinanceTab === 'labs' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Dental Commercial Laboratory Work & Bills
              </h3>
              <p className="text-xs text-slate-500">
                Track crown, bridge, denture, and aligner lab jobs, shade matching, delivery dates, and bills.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddLabOpen(true)}
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Lab Order & Charge</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {labWorkOrders.map(lab => (
              <div 
                key={lab.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                        {lab.labName}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-1.5">
                        {lab.workType}
                      </h4>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      lab.workStatus === 'Delivered' || lab.workStatus === 'Fitted in Patient'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                    }`}>
                      {lab.workStatus}
                    </span>
                  </div>

                  <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="font-bold text-slate-800">
                      Patient: <span className="text-[#004884]">{lab.patientName}</span>
                    </p>
                    <div className="flex items-center gap-3 text-slate-600 text-[11px]">
                      {lab.teeth && <span>Tooth: <strong>{lab.teeth}</strong></span>}
                      {lab.shade && <span>Shade: <strong>{lab.shade}</strong></span>}
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[10px] pt-1 border-t border-slate-200/50">
                      <span>Sent: {formatIndianDate(lab.sentDate)}</span>
                      <span>Expected: {formatIndianDate(lab.expectedDeliveryDate)}</span>
                    </div>
                  </div>

                  {lab.notes && (
                    <p className="text-[11px] text-slate-500 italic mt-2">
                      "{lab.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Lab Charge:</span>
                    <span className="font-bold text-slate-900">{formatINR(lab.labCharge)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Paid ({lab.paymentMethod}):</span>
                    <span className="font-extrabold text-emerald-700">{formatINR(lab.amountPaid)}</span>
                  </div>
                  {lab.balanceDue > 0 && (
                    <div className="flex items-center justify-between text-xs text-rose-700 font-bold">
                      <span>Lab Bill Due:</span>
                      <span>{formatINR(lab.balanceDue)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      {lab.labPhone && (
                        <a
                          href={getWhatsAppUrl(
                            lab.labPhone,
                            `Hello ${lab.labName},

Order update from Smile7 Dental Clinic (Dr. P. Manickapriya):
Job: ${lab.workType}
Patient: ${lab.patientName} (${lab.teeth || ''})
Expected Delivery: ${formatIndianDate(lab.expectedDeliveryDate)}
Bill Amount: ${formatINR(lab.labCharge)} (${lab.paymentStatus})

Kindly confirm status. Thank you!`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                          title="Message Dental Lab on WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      {lab.workStatus === 'In-Lab' && (
                        <button
                          type="button"
                          onClick={() => updateLabWorkOrder({
                            ...lab,
                            workStatus: 'Delivered',
                            deliveredDate: new Date().toISOString().split('T')[0]
                          })}
                          className="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Mark Delivered
                        </button>
                      )}

                      {lab.paymentStatus !== 'Paid' && (
                        <button
                          type="button"
                          onClick={() => updateLabWorkOrder({
                            ...lab,
                            amountPaid: lab.labCharge,
                            balanceDue: 0,
                            paymentStatus: 'Paid'
                          })}
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Clear Bill
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteLabWorkOrder(lab.id)}
                      className="p-1 text-slate-300 hover:text-rose-600 cursor-pointer transition-colors"
                      title="Delete lab order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {labWorkOrders.length === 0 && (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
              <FlaskConical className="w-10 h-10 mx-auto text-slate-300" />
              <h4 className="font-extrabold text-sm text-slate-700">No Dental Lab Orders</h4>
              <p className="text-xs">Click "+ New Lab Order" to log work sent for crowns, dentures, or aligners.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CLINIC EXPENSES & MATERIALS */}
      {/* ========================================================================= */}
      {activeFinanceTab === 'expenses' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Clinic Operational Overheads & Dental Consumables
              </h3>
              <p className="text-xs text-slate-500">
                Track composites, gloves, rent, TNEB electricity, bio-medical waste, and assistant salary.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddExpenseOpen(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Clinic Expense</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Description / Item</th>
                    <th className="py-3 px-4">Paid To (Vendor)</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4 text-right">Amount (Rs.)</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {generalExpenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-500">
                        {formatIndianDate(exp.date)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">
                        <div>{exp.title}</div>
                        {exp.invoiceNumber && (
                          <span className="text-[10px] text-slate-400 font-mono">Bill #: {exp.invoiceNumber}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {exp.paidTo}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                          {exp.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-slate-950">
                        {formatINR(exp.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => deleteGeneralExpense(exp.id)}
                          className="p-1 text-slate-300 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {generalExpenses.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No clinic expenses recorded yet. Click "+ Log Expense" above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PRACTICE P&L STATEMENT */}
      {/* ========================================================================= */}
      {activeFinanceTab === 'summary' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-slate-900">
                Clinic Profit & Loss (P&L) Statement
              </h3>
              <p className="text-xs text-slate-500">
                Operating cashflow summary for {clinicProfile.clinicName} (Dr. P. Manickapriya).
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Print Financial Statement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income Side */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <span className="font-black text-sm text-emerald-950 uppercase tracking-wide">
                  1. Clinical Revenue (Collections)
                </span>
                <span className="font-black text-emerald-900 text-base">
                  {formatINR(totalCollections)}
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-emerald-800">
                  <span>Patient Treatment Payments Collected</span>
                  <span className="font-bold">{formatINR(totalCollections)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px] pt-1">
                  <span>Total Patient Invoices Generated</span>
                  <span>{invoices.length} invoices</span>
                </div>
              </div>
            </div>

            {/* Expenses Side */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
              <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                <span className="font-black text-sm text-rose-950 uppercase tracking-wide">
                  2. Operating Outflows (Expenses)
                </span>
                <span className="font-black text-rose-900 text-base">
                  {formatINR(totalExpenses)}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-rose-900">
                  <span>Visiting Consultant Doctor Payouts</span>
                  <span className="font-bold">{formatINR(totalConsultantPaid)}</span>
                </div>
                <div className="flex justify-between text-rose-900">
                  <span>Dental Commercial Lab Bills</span>
                  <span className="font-bold">{formatINR(totalLabPaid)}</span>
                </div>
                <div className="flex justify-between text-rose-900">
                  <span>Clinic Materials, Rent & Overheads</span>
                  <span className="font-bold">{formatINR(totalGeneralExpenses)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Margin Highlight Banner */}
          <div className="bg-gradient-to-r from-[#002244] via-[#004884] to-[#0284c7] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-sky-300 font-bold text-xs uppercase tracking-wider block">
                Net Practice Profit / Cashflow
              </span>
              <p className="text-2xl font-black mt-0.5">
                {formatINR(netProfit)}
              </p>
              <p className="text-sky-100 text-xs mt-1">
                Net operational surplus after all consultant payouts, lab fees, and material expenses.
              </p>
            </div>

            <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-center shrink-0">
              <span className="text-[10px] text-sky-200 block uppercase font-bold">Profit Margin</span>
              <span className="text-2xl font-black text-white">{profitMargin}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD CONSULTANT DOCTOR PAYOUT */}
      {/* ========================================================================= */}
      {isAddConsultantOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-sky-50 text-[#004884]">
                  <Stethoscope className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Record Consultant Doctor Payout
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pay visiting orthodontists, oral surgeons, or endodontists per case.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddConsultantOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick 1-Click Presets */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Quick Preset Consultants (Click to Autofill):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CONSULTANT_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setCName(p.name);
                      setCSpecialty(p.specialty);
                      setCPhone(p.phone);
                      setCFee(p.defaultFee);
                      setCPaid(p.defaultFee);
                      setCProcedure(p.procedure);
                    }}
                    className="text-[10px] font-bold px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#004884] border border-sky-200 transition-colors cursor-pointer"
                  >
                    + {p.name.split(' (')[0]} ({p.specialty.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleConsultantSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={cName}
                    onChange={e => setCName(e.target.value)}
                    placeholder="e.g. Dr. S. Anand (MDS)"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Specialty *
                  </label>
                  <select
                    value={cSpecialty}
                    onChange={e => setCSpecialty(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Oral & Maxillofacial Surgeon">Oral & Maxillofacial Surgeon</option>
                    <option value="Orthodontist">Orthodontist</option>
                    <option value="Endodontist">Endodontist</option>
                    <option value="Periodontist">Periodontist</option>
                    <option value="Prosthodontist / Implantologist">Prosthodontist / Implantologist</option>
                    <option value="Pedodontist">Pedodontist</option>
                    <option value="Aesthetic Dentist">Aesthetic Dentist</option>
                    <option value="General Dental Surgeon">General Dental Surgeon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Doctor Mobile (+91)
                  </label>
                  <input
                    type="text"
                    value={cPhone}
                    onChange={e => setCPhone(e.target.value)}
                    placeholder="e.g. 98410 88231"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Visit Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={cDate}
                    onChange={e => setCDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Procedure Performed *
                  </label>
                  <input
                    type="text"
                    required
                    value={cProcedure}
                    onChange={e => setCProcedure(e.target.value)}
                    placeholder="e.g. Surgical Impaction #48"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Associated Patient
                  </label>
                  <input
                    type="text"
                    value={cPatient}
                    onChange={e => setCPatient(e.target.value)}
                    placeholder="e.g. Kavitha Ramesh"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Financials: Case fee, Amount paid, Mode */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Case Fee (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={cFee}
                    onChange={e => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setCFee(val);
                      setCPaid(val); // default auto-fill paid
                    }}
                    placeholder="2500"
                    className="w-full p-2 rounded-lg border border-slate-300 font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Amount Paid (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={cPaid}
                    onChange={e => setCPaid(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="2500"
                    className="w-full p-2 rounded-lg border border-slate-300 font-bold bg-white text-emerald-700"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Payment Mode</label>
                  <select
                    value={cMethod}
                    onChange={e => setCMethod(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-bold bg-white"
                  >
                    <option value="UPI / GPay">UPI / GPay</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer / IMPS">Bank Transfer / IMPS</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Clinical Notes / Remarks (Optional)
                </label>
                <input
                  type="text"
                  value={cNotes}
                  onChange={e => setCNotes(e.target.value)}
                  placeholder="e.g. Suture removal scheduled after 7 days"
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddConsultantOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-[#004884] hover:bg-sky-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Consultant Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD DENTAL LAB WORK ORDER */}
      {/* ========================================================================= */}
      {isAddLabOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
                  <FlaskConical className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Record Dental Lab Order & Charge
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track crown, bridge, denture, and aligner lab bills and delivery dates.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddLabOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLabSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Dental Lab Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={labName}
                    onChange={e => setLabName(e.target.value)}
                    placeholder="e.g. DentCare Dental Lab"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Lab Contact Phone (+91)
                  </label>
                  <input
                    type="text"
                    value={labPhone}
                    onChange={e => setLabPhone(e.target.value)}
                    placeholder="e.g. 98841 55660"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Type of Lab Work *
                </label>
                <select
                  value={labWorkType}
                  onChange={e => setLabWorkType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {COMMON_WORK_TYPES.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={labPatient}
                    onChange={e => setLabPatient(e.target.value)}
                    placeholder="Patient full name"
                    className="w-full text-xs p-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tooth # (FDI)
                  </label>
                  <input
                    type="text"
                    value={labTeeth}
                    onChange={e => setLabTeeth(e.target.value)}
                    placeholder="e.g. Tooth 16"
                    className="w-full text-xs p-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Shade
                  </label>
                  <input
                    type="text"
                    value={labShade}
                    onChange={e => setLabShade(e.target.value)}
                    placeholder="e.g. A2 Vita"
                    className="w-full text-xs p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Date Sent to Lab *
                  </label>
                  <input
                    type="date"
                    required
                    value={labSentDate}
                    onChange={e => setLabSentDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Expected Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={labExpDate}
                    onChange={e => setLabExpDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Lab Billing */}
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 grid grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-purple-950 block mb-1">Lab Bill (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={labFee}
                    onChange={e => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setLabFee(val);
                      setLabPaidAmt(val);
                    }}
                    placeholder="1800"
                    className="w-full p-2 rounded-lg border border-purple-200 font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-purple-950 block mb-1">Amount Paid (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={labPaidAmt}
                    onChange={e => setLabPaidAmt(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="1800"
                    className="w-full p-2 rounded-lg border border-purple-200 font-bold bg-white text-emerald-700"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-purple-950 block mb-1">Payment Mode</label>
                  <select
                    value={labMethod}
                    onChange={e => setLabMethod(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-purple-200 font-bold bg-white"
                  >
                    <option value="UPI / GPay">UPI / GPay</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer / IMPS">Bank Transfer / IMPS</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Lab Instructions / Notes
                </label>
                <input
                  type="text"
                  value={labNotes}
                  onChange={e => setLabNotes(e.target.value)}
                  placeholder="e.g. Please ensure tight proximal contacts and natural translucency"
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddLabOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Lab Work & Charge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: LOG CLINIC EXPENSE */}
      {/* ========================================================================= */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-slate-100 text-slate-800">
                  <Receipt className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Log Clinic Expense / Material Bill
                  </h3>
                  <p className="text-xs text-slate-500">
                    Record consumables, rent, TNEB power, or assistant salary.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Expense Category *
                  </label>
                  <select
                    value={expCategory}
                    onChange={e => setExpCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {COMMON_EXPENSE_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expDate}
                    onChange={e => setExpDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Item Description / Title *
                </label>
                <input
                  type="text"
                  required
                  value={expTitle}
                  onChange={e => setExpTitle(e.target.value)}
                  placeholder="e.g. 3M Composite Syringes + Bonding Agent"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={expAmount}
                    onChange={e => setExpAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 5400"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Paid To (Vendor / Staff / Utility)
                  </label>
                  <input
                    type="text"
                    value={expPaidTo}
                    onChange={e => setExpPaidTo(e.target.value)}
                    placeholder="e.g. Prime Dental Supplies"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={expMethod}
                    onChange={e => setExpMethod(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="UPI / GPay">UPI / GPay</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer / IMPS">Bank Transfer / IMPS</option>
                    <option value="Card">Card</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Vendor Invoice / Receipt Number
                  </label>
                  <input
                    type="text"
                    value={expInvoiceNum}
                    onChange={e => setExpInvoiceNum(e.target.value)}
                    placeholder="e.g. INV-9921"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Record Clinic Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

