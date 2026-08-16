import React from 'react';
import { BorderBeamPanel } from '../ui/border-beam-panel';
import { Sparkles, HeartHandshake, ShieldCheck, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

export const ClinicTechSection: React.FC = () => {
  return (
    <section id="technology" className="py-28 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-navy-700 px-3.5 py-1 rounded-full bg-sky-50">
            Clinical Excellence & Specializations
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Aesthetic & Restorative Clinical Care
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
            Led by Dr. P. Manickapriya (General Dental Surgeon | Aesthetic & Restorative Dentist), Smile7 focuses on tooth-preserving restorations and gentle family care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Aesthetic & Cosmetic Restorations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <BorderBeamPanel
              beams={2}
              thickness={2}
              radius={24}
              glow
              colors={["#004884", "#1e88e5"]}
              className="h-full bg-white border-slate-200 shadow-apple hover:shadow-apple-hover"
            >
              <div className="flex flex-col h-full justify-between gap-6 p-2 text-left">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-navy-700 border border-sky-100 grid place-items-center mb-6">
                    <Smile className="w-6 h-6 text-[#004884]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Aesthetic Smile Restorations
                  </h3>
                  <p className="text-slate-600 text-sm font-normal leading-relaxed">
                    Custom shade-matched ceramic and composite restorations to correct chipped, worn, gaps, or discolored teeth for a natural smile aesthetic.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-navy-700 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  <span>Natural Smile Aesthetics</span>
                </div>
              </div>
            </BorderBeamPanel>
          </motion.div>

          {/* Card 2: Restorative Tooth Preservation & Digital RVG */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <BorderBeamPanel
              beams={2}
              thickness={2}
              radius={24}
              glow
              colors={["#1e88e5", "#268199"]}
              className="h-full bg-white border-slate-200 shadow-apple hover:shadow-apple-hover"
            >
              <div className="flex flex-col h-full justify-between gap-6 p-2 text-left">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 grid place-items-center mb-6">
                    <HeartHandshake className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Restorative & Painless Therapy
                  </h3>
                  <p className="text-slate-600 text-sm font-normal leading-relaxed">
                    Tooth-saving rotary endodontic treatments, durable dental crown placements, and instant low-radiation digital RVG radiography for accurate diagnosis.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  <span>Preserves Natural Teeth</span>
                </div>
              </div>
            </BorderBeamPanel>
          </motion.div>

          {/* Card 3: General Dental Surgery & Safety */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <BorderBeamPanel
              beams={2}
              thickness={2}
              radius={24}
              glow
              colors={["#004884", "#268199"]}
              className="h-full bg-white border-slate-200 shadow-apple hover:shadow-apple-hover"
            >
              <div className="flex flex-col h-full justify-between gap-6 p-2 text-left">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-navy-700 border border-sky-100 grid place-items-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-[#004884]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    General Surgery & Preventative Care
                  </h3>
                  <p className="text-slate-600 text-sm font-normal leading-relaxed">
                    Gentle surgical tooth extractions, ultrasonic plaque scaling, and strict multi-stage instrument sterilization protocols for family health.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-navy-700 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  <span>Strict Sterilization & Hygiene</span>
                </div>
              </div>
            </BorderBeamPanel>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
