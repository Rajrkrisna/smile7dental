import React from 'react';
import { Eye, Layers, Compass, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export const RestorationSection: React.FC = () => {
  return (
    <section id="restoration" className="relative min-h-screen flex items-center justify-center px-6 py-28 z-10">
      <div className="max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <span className="text-coral text-xs font-semibold tracking-widest uppercase mb-3">
              Organic Artistry & Precision
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl text-white font-bold tracking-tight mb-6 leading-tight">
              Sculpting <span className="italic text-coral">Confidence</span> In 3D Geometry
            </h2>
            <p className="text-slate-300 text-lg font-light leading-relaxed mb-8">
              In our digital studio, every restoration is custom-crafted to mirror the natural translucency, light reflection, and mathematical symmetry of your individual facial features.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-2xl bg-navy-900/50 backdrop-blur-md border border-slate-800/80">
                <div className="p-3 rounded-xl bg-coral/10 text-coral border border-coral/20 shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-base mb-1">Custom Digital Smile Previews</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Visualize your new smile in 3D realistic rendering before any treatment begins.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-navy-900/50 backdrop-blur-md border border-slate-800/80">
                <div className="p-3 rounded-xl bg-teal-400/10 text-teal-300 border border-teal-400/20 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-base mb-1">Ultra-Thin Porcelain Veneers</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Micro-thin ceramic layers that preserve 98% of your natural enamel structure.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-navy-900/50 backdrop-blur-md border border-slate-800/80">
                <div className="p-3 rounded-xl bg-teal-400/10 text-teal-300 border border-teal-400/20 shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-base mb-1">Deep Light Laser Whitening</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Zero-sensitivity cold laser activation brightening up to 8 shades in 45 relaxing minutes.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-6 relative flex justify-center items-center"
          >
            <div className="w-full max-w-md p-8 rounded-3xl bg-navy-900/60 backdrop-blur-xl border border-teal-400/20 text-center shadow-[0_0_50px_rgba(91,188,214,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="inline-flex p-4 rounded-2xl bg-teal-400/10 text-teal-300 mb-6 border border-teal-400/20">
                <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '20s' }} />
              </div>
              <span className="block text-xs uppercase tracking-widest text-teal-300 font-semibold mb-2">
                Digital Studio Highlight
              </span>
              <h3 className="font-serif text-3xl text-white font-bold mb-4">
                3D Crystalline Precision
              </h3>
              <p className="text-slate-300 text-sm font-light leading-relaxed mb-6">
                Interact with the central 3D prism in the background canvas as you scroll. The glowing geometric facets mirror how light reflects off healthy, pristine tooth enamel.
              </p>
              <div className="p-4 rounded-2xl bg-navy-800/80 border border-slate-700/60 text-xs text-slate-300 font-mono">
                Dr. P. Manickapriya &bull; Cosmetic Dentistry & Implantology Specialist
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
