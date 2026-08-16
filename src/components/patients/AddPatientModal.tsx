import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import type { Patient } from '../../types';
import { X, UserPlus, AlertTriangle } from 'lucide-react';

interface AddPatientModalProps {
  onClose: () => void;
  onPatientAdded?: (patient: Patient) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  onClose,
  onPatientAdded
}) => {
  const { addPatient } = useDental();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [medicalAlertInput, setMedicalAlertInput] = useState('');
  const [medicalAlerts, setMedicalAlerts] = useState<string[]>([]);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRel, setEmergencyRel] = useState('Spouse');

  const handleAddAlert = () => {
    if (medicalAlertInput.trim()) {
      setMedicalAlerts([...medicalAlerts, medicalAlertInput.trim()]);
      setMedicalAlertInput('');
    }
  };

  const handleRemoveAlert = (index: number) => {
    setMedicalAlerts(medicalAlerts.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert('Please enter at least Patient Name and Contact Phone Number.');
      return;
    }

    const created = addPatient({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      age: Number(age) || 0,
      gender,
      dateOfBirth: dateOfBirth || undefined,
      address: address.trim() || undefined,
      bloodGroup: bloodGroup || undefined,
      medicalAlerts,
      emergencyContact: emergencyName ? {
        name: emergencyName,
        relationship: emergencyRel,
        phone: emergencyPhone
      } : undefined
    });

    if (onPatientAdded) {
      onPatientAdded(created);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">New Patient Intake</h2>
              <p className="text-xs text-slate-500">Register patient record & medical history</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Johnathan Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="patient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Age (Years)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-xs text-slate-900"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-xs text-slate-900"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-xs text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Residential Address</label>
              <input
                type="text"
                placeholder="Street address, City, State, Zip"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Medical Alerts Section */}
          <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-rose-900 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Medical History & Allergies</span>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Penicillin Allergy, Diabetic, Hypertension, Bleeding Disorder..."
                value={medicalAlertInput}
                onChange={(e) => setMedicalAlertInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAlert();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                type="button"
                onClick={handleAddAlert}
                className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-xs"
              >
                + Add Alert
              </button>
            </div>

            {medicalAlerts.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {medicalAlerts.map((alert, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-white text-rose-900 border border-rose-300 font-bold px-2 py-0.5 rounded-lg text-[11px]"
                  >
                    {alert}
                    <button
                      type="button"
                      onClick={() => handleRemoveAlert(idx)}
                      className="hover:text-rose-600 ml-1 font-black"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="font-bold text-slate-700 block">Emergency Contact (Optional)</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Contact Name"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Relationship (e.g. Spouse)"
                value={emergencyRel}
                onChange={(e) => setEmergencyRel(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <input
                type="tel"
                placeholder="Emergency Phone"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl font-bold shadow-md shadow-teal-600/20"
            >
              Save Patient Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
