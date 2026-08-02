import React from 'react';
import { Award, CheckCircle2, HeartHandshake, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const DoctorSection: React.FC = () => {
  return (
    <section id="doctor" className="py-28 px-6 md:px-12 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Doctor Avatar Badge Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative"
          >
            <div className="rounded-3xl bg-white border border-slate-200 shadow-apple p-8 text-center relative overflow-hidden">
              <div className="w-36 h-36 mx-auto mb-6 rounded-full bg-gradient-to-br from-navy-700 via-sky-500 to-teal-500 p-1 shadow-md">
                <div className="w-full h-full rounded-full bg-white grid place-items-center">
                  <span className="font-serif text-4xl font-bold text-navy-700">PM</span>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-slate-900 mb-1">
                Dr. P. Manickapriya
              </h3>
              
              {/* Multi-line Title Layout */}
              <div className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">
                B.D.S., FCD.
              </div>
              <ul className="text-xs font-semibold text-slate-700 space-y-1 inline-block text-left mb-3">
                <li className="flex items-center gap-1.5">
                  <span className="text-sky-500 font-bold">&bull;</span>
                  <span>General Dental Surgeon</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-sky-500 font-bold">&bull;</span>
                  <span>Aesthetic & Restorative Dentist</span>
                </li>
              </ul>

              <div className="block">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 mb-6">
                  <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>DCI Reg No: 26448</span>
                </div>
              </div>

              <div className="space-y-3 text-left text-xs text-slate-600 border-t border-slate-100 pt-6 font-medium">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>9+ Years Specialized Dental Clinical Practice</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Fellow in Cosmetic Dentistry (FCD)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>5,000+ Successful Precision Patient Treatments</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Doctor Bio & Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-navy-700 px-3.5 py-1 rounded-full bg-sky-50">
              Lead Doctor & Founder
            </span>

            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              "We Believe Dental Care Should Be{' '}
              <span className="font-serif italic text-navy-700">Gentle, Precise & Transparent</span>"
            </h2>

            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
              Dr. P. Manickapriya established Smile7 Dental Clinic with a singular vision: to combine hospital-grade clinical precision with a gentle, patient-centered approach that removes all fear from visiting the dentist.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2 text-navy-700 font-bold mb-1 text-sm">
                  <HeartHandshake className="w-4 h-4 text-sky-500" />
                  <span>Patient-Centered Empathy</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Every treatment plan is thoroughly explained in plain language before we begin. Your comfort guides our pace.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2 text-navy-700 font-bold mb-1 text-sm">
                  <Award className="w-4 h-4 text-sky-500" />
                  <span>Biomimetic Precision</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Utilizing only top-tier certified biomimetic dental materials to ensure natural aesthetics and long-term durability.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
