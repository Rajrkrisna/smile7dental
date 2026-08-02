import React from 'react';
import { X, Calendar, Clock, CheckCircle2, ArrowRight, Sparkles, Stethoscope, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ServiceData {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  highlights: string[];
  badgeColor: string;
  detailedOverview?: string;
  procedureSteps?: string[];
  suitability?: string;
  longevity?: string;
}

interface ServiceDetailModalProps {
  service: ServiceData | null;
  isOpen: boolean;
  onClose: () => void;
  onBookTreatment: (treatmentTitle: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onBookTreatment,
}) => {
  if (!service) return null;

  const defaultSteps = [
    'Digital RVG Radiography & Comprehensive Clinical Exam',
    'Personalized Treatment Planning with Dr. P. Manickapriya',
    'Painless Procedure Execution under Local Anesthesia or Sedation',
    'Post-Treatment Polish, Care Instructions & Warranty Follow-up',
  ];

  const steps = service.procedureSteps || defaultSteps;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Content with sleek rounded custom inner scrollbar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl z-10 text-left"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors z-20"
              aria-label="Close Treatment Dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category Badge & Duration */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full ${service.badgeColor}`}>
                {service.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{service.duration}</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
              {service.title}
            </h2>

            {/* Description */}
            <p className="text-slate-600 text-base font-normal leading-relaxed mb-6">
              {service.detailedOverview || service.description}
            </p>

            {/* Highlights Grid */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 mb-6 space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-navy-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>Key Procedure Highlights</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Procedure Workflow */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-800 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-sky-500" />
                <span>Clinical Treatment Workflow</span>
              </h4>
              <div className="space-y-2.5">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-xs">
                    <div className="w-6 h-6 rounded-full bg-navy-700 text-white font-bold text-xs grid place-items-center shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="text-xs text-slate-700 font-medium leading-relaxed">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Disclaimer Notice Box */}
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-left text-xs text-amber-950 space-y-1 mb-8">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 uppercase tracking-wider text-[10px]">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Medical & Treatment Disclaimer</span>
              </div>
              <p className="text-amber-900/90 text-[11px] leading-relaxed">
                Treatment procedures, timelines, and clinical outcomes presented on this website are for general educational awareness. Specific treatment plans may vary from person to person depending on individual oral health conditions, which will be evaluated during your initial clinical consultation with Dr. P. Manickapriya.
              </p>
            </div>

            {/* Action Bar: Book Appointment Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-200">
              <button
                onClick={() => onBookTreatment(service.title)}
                className="w-full sm:flex-1 py-4 rounded-full bg-[#004884] hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-4 rounded-full border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Close Summary
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
