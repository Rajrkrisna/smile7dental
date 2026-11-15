import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { FileEdit, Plus, Search, Calendar, User } from 'lucide-react';
import type { ClinicalNote } from '../../types';

interface ClinicalNotesViewProps {
  onSelectPatient: (patientId: string) => void;
}

export const ClinicalNotesView: React.FC<ClinicalNotesViewProps> = ({
  onSelectPatient
}) => {
  const { clinicalNotes, patients, clinicProfile, addClinicalNote } = useClinic();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

  // New Note Form State
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');

  const filteredNotes = clinicalNotes.filter(n => {
    const pat = patients.find(p => p.id === n.patientId);
    const patName = pat ? pat.name.toLowerCase() : '';
    const q = searchQuery.toLowerCase();
    return (
      patName.includes(q) ||
      n.assessment.toLowerCase().includes(q) ||
      n.subjective.toLowerCase().includes(q) ||
      n.objective.toLowerCase().includes(q) ||
      n.plan.toLowerCase().includes(q)
    );
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    addClinicalNote({
      patientId: selectedPatientId,
      date: new Date().toISOString().split('T')[0],
      doctor: clinicProfile.doctorName,
      subjective,
      objective,
      assessment,
      plan
    });

    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
    setIsAddNoteOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-black text-lg text-slate-900 tracking-tight">
              Clinical Progress & SOAP Notes
            </h2>
            <p className="text-xs text-slate-500">
              Electronic dental records (EDR): Subjective symptoms, clinical observations, diagnoses, and treatment interventions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddNoteOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#004884] hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs shadow-[#004884]/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Write SOAP Note
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-md pt-2 border-t border-slate-100">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search notes by patient, symptoms, or diagnosis..."
            className="w-full text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004884]/20"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.map(n => {
          const pat = patients.find(p => p.id === n.patientId);
          return (
            <div
              key={n.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectPatient(n.patientId)}
                    className="font-black text-sm text-slate-900 hover:text-[#004884] transition-colors"
                  >
                    {pat?.name || 'Unknown Patient'}
                  </button>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                    {pat?.patientId}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Visit: {n.date}
                  </span>
                  <span>• Clinician: {n.doctor}</span>
                </div>
              </div>

              {/* SOAP 4-Quadrant Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <span className="font-extrabold text-[#004884] uppercase tracking-wider text-[10px] block mb-1">
                    Subjective (Patient Complaint & History):
                  </span>
                  <p className="text-slate-800 leading-relaxed">{n.subjective}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <span className="font-extrabold text-blue-800 uppercase tracking-wider text-[10px] block mb-1">
                    Objective (Clinical Findings & X-rays):
                  </span>
                  <p className="text-slate-800 leading-relaxed">{n.objective}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <span className="font-extrabold text-purple-800 uppercase tracking-wider text-[10px] block mb-1">
                    Assessment (Clinical Diagnosis):
                  </span>
                  <p className="text-slate-800 leading-relaxed font-semibold">{n.assessment}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <span className="font-extrabold text-emerald-800 uppercase tracking-wider text-[10px] block mb-1">
                    Plan (Treatment Undertaken & Recall):
                  </span>
                  <p className="text-slate-800 leading-relaxed">{n.plan}</p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredNotes.length === 0 && (
          <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
            <FileEdit className="w-12 h-12 mx-auto text-slate-300" />
            <h4 className="font-extrabold text-sm text-slate-700">No Clinical Notes Found</h4>
            <p className="text-xs">Click "Write SOAP Note" to add a new clinical examination entry.</p>
          </div>
        )}
      </div>

      {/* New SOAP Note Modal */}
      {isAddNoteOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">
                Write Clinical SOAP Note
              </h3>
              <button
                type="button"
                onClick={() => setIsAddNoteOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Patient *</label>
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patientId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Subjective (Chief Complaint & Symptoms) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={subjective}
                  onChange={e => setSubjective(e.target.value)}
                  placeholder="e.g. Sensitivity to hot/cold, dull throbbing pain"
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Objective (Clinical Exam, Tests, Radiographs) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={objective}
                  onChange={e => setObjective(e.target.value)}
                  placeholder="e.g. Deep cavity on 16 MO, tenderness on vertical percussion negative"
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Assessment (Working / Final Diagnosis) *
                </label>
                <input
                  required
                  type="text"
                  value={assessment}
                  onChange={e => setAssessment(e.target.value)}
                  placeholder="e.g. Irreversible Pulpitis, Class II Dentine Caries"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Plan (Procedures Executed & Recall) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={plan}
                  onChange={e => setPlan(e.target.value)}
                  placeholder="e.g. Access cavity prepared, biomechanical prep under rubber dam, Ca(OH)2 dressing"
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddNoteOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#004884] hover:bg-sky-700 text-white rounded-xl shadow-xs shadow-[#004884]/20 cursor-pointer"
                >
                  Save SOAP Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

