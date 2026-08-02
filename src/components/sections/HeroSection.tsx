import React from 'react';
import { Star, ArrowRight, PhoneCall, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuroraBackground } from '../ui/aurora-background';
import logoText from '../../assets/logo-text.jpg';
import logoIcon from '../../assets/logo-icon.png';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative w-full overflow-hidden bg-slate-50">
      {/* Living Aurora Background Canvas spanning full stage with zero top/bottom gaps */}
      <AuroraBackground
        variant="ocean"
        speed={0.92}
        blobCount={5}
        className="w-full min-h-[92vh] pt-28 pb-16 flex items-center"
        childrenClassName="w-full max-w-7xl mx-auto px-6 md:px-12 py-2"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Clinical Headline & Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-950 leading-[1.12]">
              Precision Dental Care.{' '}
              <span className="font-serif italic font-normal text-[#004884] block sm:inline">
                Redefined for Comfort.
              </span>
            </h1>

            <p className="text-slate-700 text-lg sm:text-xl font-normal leading-relaxed max-w-xl">
              Led by <strong className="text-navy-700 font-semibold">Dr. P. Manickapriya</strong>, Smile7 combines advanced digital dentistry with gentle, pain-free techniques to deliver brilliant, long-lasting smiles.
            </p>

            {/* High-Visibility Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 relative z-20">
              <button
                onClick={onOpenBooking}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#004884] hover:bg-sky-600 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                <Calendar className="w-4.5 h-4.5 text-white" />
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <a
                href="tel:+919790862510"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-slate-300 hover:border-navy-700 bg-white/90 text-navy-700 font-bold text-sm uppercase tracking-wider transition-all shadow-xs hover:bg-white"
              >
                <PhoneCall className="w-4 h-4 text-sky-500" />
                <span>+91 97908 62510</span>
              </a>
            </div>

            {/* Trust Metrics Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-300/80">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-navy-700">9+ Yrs</div>
                <div className="text-xs text-slate-600 font-medium">Clinical Excellence</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-navy-700">5,000+</div>
                <div className="text-xs text-slate-600 font-medium">Happy Smiles</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-2xl sm:text-3xl font-extrabold text-navy-700">
                  4.9 <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
                </div>
                <div className="text-xs text-slate-600 font-medium">Patient Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Clean Apple-Style Clinic Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
            transition={{
              opacity: { duration: 0.9, delay: 0.2 },
              scale: { duration: 0.9, delay: 0.2 },
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="lg:col-span-6 relative flex justify-center items-center"
          >
            <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-7 space-y-4 text-left relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg">
                  <img
                    src={logoIcon}
                    alt="Smile7 Icon"
                    className="h-10 w-auto object-contain"
                  />
                  <img
                    src={logoText}
                    alt="Smile7 Logo"
                    className="h-8 w-auto object-contain mix-blend-multiply"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  Dr. P. Manickapriya
                </h3>
                
                {/* Degree & Multi-line Titles */}
                <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">
                  B.D.S., FCD.
                </div>
                <ul className="text-xs font-semibold text-slate-700 space-y-1 mb-3">
                  <li className="flex items-center gap-1.5">
                    <span className="text-sky-500 font-bold">&bull;</span>
                    <span>General Dental Surgeon</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-sky-500 font-bold">&bull;</span>
                    <span>Aesthetic & Restorative Dentist</span>
                  </li>
                </ul>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>DCI Reg No: 26448</span>
                </div>
                
                <p className="text-slate-600 text-sm font-normal leading-relaxed">
                  Advanced dentistry, delivered with precision, comfort, and uncompromising safety.
                </p>
              </div>

              <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Digital RVG Radiography & Precision Imaging</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Painless Rotary Endodontics & Laser Whitening</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Strict Multi-Stage Instrument Sterilization & Safety</span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={onOpenBooking}
                  className="w-full py-3.5 rounded-2xl bg-[#004884] hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md text-center block"
                >
                  Book Consultation With Dr. Manickapriya
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AuroraBackground>
    </section>
  );
};
