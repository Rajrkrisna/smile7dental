import React, { useState, useId } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  X, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  UserPlus, 
  AlertTriangle, 
  ExternalLink,
  Phone,
  UserCheck,
  ShieldAlert,
  MapPin
} from 'lucide-react';
import type { Patient } from '../../types';

interface NewPatientModalProps {
  onClose: () => void;
  onPatientAdded?: (patient: Patient) => void;
  onOpenExistingPatient?: (patient: Patient) => void;
}

const COMMON_COMPLAINTS = [
  'Toothache / Pain',
  'Routine Checkup',
  'Teeth Cleaning / Scaling',
  'Sensitivity to Cold / Sweets',
  'Cavity / Broken Filling',
  'Bleeding Gums',
  'Chipped Tooth',
  'Wisdom Tooth Pain',
  'Missing Tooth / Replacement',
  'Braces / Alignment'
];

const COMMON_MEDICAL_ALERTS = [
  'Penicillin Allergy',
  'Latex Allergy',
  'Local Anesthesia Sensitivity',
  'Hypertension',
  'Diabetes',
  'Bleeding Disorder / On Anticoagulants',
  'Cardiac Condition / Pacemaker',
  'Asthma / Respiratory',
  'Pregnant / Nursing'
];

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  onClose,
  onPatientAdded,
  onOpenExistingPatient
}) => {
  const { addPatient, findPatientByPhone } = useClinic();

  // Primary fast intake fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Expandable secondary fields (optional for initial intake)
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [email, setEmail] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('');
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [customAlert, setCustomAlert] = useState('');

  // Duplicate Check in real-time
  const digitsOnly = phone.replace(/\D/g, '');
  const existingPatient = digitsOnly.length >= 7 ? findPatientByPhone(phone) : undefined;
  const isDuplicate = !!existingPatient;

  const toggleAlert = (alert: string) => {
    setSelectedAlerts(prev =>
      prev.includes(alert) ? prev.filter(a => a !== alert) : [...prev, alert]
    );
  };

  const addCustomAlert = () => {
    if (customAlert.trim() && !selectedAlerts.includes(customAlert.trim())) {
      setSelectedAlerts(prev => [...prev, customAlert.trim()]);
      setCustomAlert('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!name.trim() || !phone.trim() || age === '') return;

    if (isDuplicate && existingPatient) {
      setSubmitError(`Cannot register: Mobile number is already registered to ${existingPatient.name} (${existingPatient.patientId}).`);
      return;
    }

    try {
      const newPat = addPatient({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        age: Number(age),
        gender,
        bloodGroup: showOptionalDetails ? bloodGroup : undefined,
        address: address.trim() || undefined,
        chiefComplaint: chiefComplaint.trim() || undefined,
        medicalAlerts: selectedAlerts
      });

      if (onPatientAdded) onPatientAdded(newPat);
      onClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Duplicate patient entry blocked.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-50 text-[#004884]">
                <UserPlus className="w-4 h-4" />
              </span>
              <h3 className="font-extrabold text-base text-slate-900">
                Quick Patient Registration
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Fast initial intake. You can map teeth charting, treatments, medical alerts, and billing later.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg leading-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Duplicate Phone Alert Banner */}
          {isDuplicate && existingPatient && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150 shadow-xs">
              <div className="flex items-start gap-2.5 text-rose-800">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-extrabold text-xs text-rose-900 flex items-center gap-1.5 flex-wrap">
                    <span>Duplicate Mobile Number Blocked</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-200 text-rose-900 rounded-md">
                      Patient Already Registered
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-700 mt-1">
                    A patient is already registered with mobile number <strong className="font-mono">{existingPatient.phone}</strong>. Duplicate patient registrations with the same phone number are not allowed.
                  </p>
                </div>
              </div>

              {/* Existing Patient Card */}
              <div className="bg-white/95 p-3 rounded-xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 font-extrabold flex items-center justify-center text-sm shrink-0 border border-rose-200">
                    {existingPatient.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-xs truncate">
                        {existingPatient.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {existingPatient.patientId}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{existingPatient.age} yrs • {existingPatient.gender}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-600">
                        {existingPatient.chiefComplaint || 'No prior complaint'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenExistingPatient) {
                      onOpenExistingPatient(existingPatient);
                    }
                    onClose();
                  }}
                  className="px-3.5 py-2 bg-[#004884] hover:bg-sky-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open {existingPatient.name.split(' ')[0]}'s Dossier</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-rose-700 pt-0.5">
                <span>Returning patient? Click <strong>"Open Dossier"</strong> to view chart & book chair.</span>
                <button
                  type="button"
                  onClick={() => setPhone('')}
                  className="font-bold underline text-rose-800 hover:text-rose-950 cursor-pointer"
                >
                  Clear Phone
                </button>
              </div>
            </div>
          )}

          {/* Submit Error if thrown */}
          {submitError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* 1. Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Kavitha Ramesh"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004884]/20 focus:border-[#004884] font-medium"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Phone Number *
                </label>
                {isDuplicate && (
                  <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                    <ShieldAlert className="w-3 h-3" />
                    Duplicate
                  </span>
                )}
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => {
                  setPhone(e.target.value);
                  setSubmitError(null);
                }}
                placeholder="e.g. 98401 23891"
                className={`w-full text-xs p-2.5 rounded-xl border transition-colors font-medium focus:outline-none ${
                  isDuplicate
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-2 focus:ring-rose-200 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-2 focus:ring-[#004884]/20 focus:border-[#004884]'
                }`}
              />
            </div>
          </div>

          {/* 2. Age & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Age (Years) *
              </label>
              <input
                type="number"
                required
                min={1}
                max={120}
                value={age}
                onChange={e => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 32"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004884]/20 focus:border-[#004884]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Gender *
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['Male', 'Female', 'Other'] as const).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      gender === g
                        ? 'bg-sky-50 text-[#004884] border-[#004884] ring-1 ring-[#004884]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Patient Location / Area (Prominent & Fast Entry) */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#004884]" />
                <span>Patient Location / Area *</span>
              </label>
              <span className="text-[10px] text-slate-400">Click area or type address</span>
            </div>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="e.g. Maduravoyal, Alapakkam, Nolambur, Porur..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004884]/20 focus:border-[#004884] font-medium"
            />

            {/* Quick 1-Click Location Chips */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {[
                'Maduravoyal',
                'Alapakkam',
                'Nolambur',
                'Porur',
                'Mogappair',
                'Koyambedu',
                'Vanagaram',
                'Adayalampattu'
              ].map(loc => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setAddress(loc)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                    address === loc
                      ? 'bg-sky-100 text-[#004884] border-sky-300 font-extrabold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {address === loc ? '✓ ' : '+ '}{loc}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Chief Complaint / Reason for Visit */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 block">
                Chief Complaint / Reason for Visit (Optional)
              </label>
              <span className="text-[10px] text-slate-400">Tap to autofill</span>
            </div>
            <input
              type="text"
              value={chiefComplaint}
              onChange={e => setChiefComplaint(e.target.value)}
              placeholder="e.g. Toothache on upper right back tooth, or Routine Checkup"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004884]/20 focus:border-[#004884]"
            />

            {/* Quick 1-Click Complaint Pills */}
            <div className="flex flex-wrap gap-1 pt-1">
              {COMMON_COMPLAINTS.slice(0, 6).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChiefComplaint(c)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                    chiefComplaint === c
                      ? 'bg-sky-50 text-[#004884] border-[#004884]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {chiefComplaint === c && <Check className="w-2.5 h-2.5 inline mr-1" />}
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Optional Additional Details Accordion */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowOptionalDetails(!showOptionalDetails)}
              className="flex items-center justify-between w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <span>+ Add Blood Group, Email or Medical Alerts (Optional)</span>
              {showOptionalDetails ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showOptionalDetails && (
              <div className="space-y-3 pt-2 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Blood Group
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={e => setBloodGroup(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                    >
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004884]/20"
                  />
                </div>

                {/* Medical History */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    Medical Caution (If known on intake):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {COMMON_MEDICAL_ALERTS.map(alert => (
                      <button
                        key={alert}
                        type="button"
                        onClick={() => toggleAlert(alert)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                          selectedAlerts.includes(alert)
                            ? 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-400'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {selectedAlerts.includes(alert) ? '✓ ' : '+ '}
                        {alert}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={customAlert}
                      onChange={e => setCustomAlert(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomAlert(); } }}
                      placeholder="+ Other allergy or medical condition"
                      className="flex-1 text-xs p-1.5 rounded-xl border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={addCustomAlert}
                      className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Notice: Odontogram is deferred */}
          <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl text-[11px] text-[#004884] flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#004884]" />
            <span>
              <strong>Initial Registration Only:</strong> No tooth charting or odontogram details required right now. You can map findings, select treatments, and enter custom charges whenever the patient sits in the dental chair.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
            <div className="text-[11px] text-slate-500">
              {isDuplicate ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Duplicate phone: registration blocked
                </span>
              ) : (
                <span>* Required intake fields</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isDuplicate}
                title={isDuplicate ? 'Duplicate mobile number already exists in records' : 'Complete quick registration'}
                className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  isDuplicate
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 shadow-none'
                    : 'bg-[#004884] hover:bg-sky-700 text-white rounded-xl shadow-xs shadow-[#004884]/20 cursor-pointer'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                {isDuplicate ? 'Duplicate Mobile Blocked' : 'Register Patient'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
