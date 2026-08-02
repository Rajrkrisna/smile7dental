import React from 'react';
import { BorderBeamPanel } from '../ui/border-beam-panel';
import { Smile, Heart, Shield, Music, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComfortSectionProps {
  onOpenBooking: () => void;
}

export const ComfortSection: React.FC<ComfortSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="comfort" className="relative min-h-screen flex items-center justify-center px-6 py-28 z-10">
      <div className="max-w-6xl w-full mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-3 inline-block"
          >
            Emotion & Comfort First
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl sm:text-6xl text-white font-bold tracking-tight mb-6"
          >
            The <span className="italic text-teal-300">Anxiety-Free</span> Comfort Sanctuary
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-300 text-lg max-w-2xl mx-auto font-light"
          >
            We designed every detail to eradicate medical tension and create an atmosphere of serene relaxation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <BorderBeamPanel beams={2} thickness={2} radius={24} glow className="h-full bg-navy-900/60 backdrop-blur-xl">
              <div className="flex flex-col h-full justify-between gap-6 p-2">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-400/10 border border-teal-400/20 text-teal-300 grid place-items-center mb-6">
                    <Music className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl text-white font-semibold mb-3">
                    Acoustic & VR Immersion
                  </h3>
                  <p className="text-slate-300 text-sm font-light leading-relaxed">
                    Noise-canceling headphones paired with calming visual VR streams or binaural audio harmonic soundscapes during your procedure.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sensory Relief</span>
                </div>
              </div>
            </BorderBeamPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <BorderBeamPanel beams={2} thickness={2} radius={24} glow colors={["#ff6b5e", "#5bbcd6"]} className="h-full bg-navy-900/60 backdrop-blur-xl">
              <div className="flex flex-col h-full justify-between gap-6 p-2">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-coral/10 border border-coral/20 text-coral grid place-items-center mb-6">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl text-white font-semibold mb-3">
                    Gentle Conscious Sedation
                  </h3>
                  <p className="text-slate-300 text-sm font-light leading-relaxed">
                    Mild, soothing nitrous oxide mist or oral conscious sedation allows you to rest peacefully without discomfort or stress.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-coral">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Painless Guarantee</span>
                </div>
              </div>
            </BorderBeamPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <BorderBeamPanel beams={2} thickness={2} radius={24} glow className="h-full bg-navy-900/60 backdrop-blur-xl">
              <div className="flex flex-col h-full justify-between gap-6 p-2">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-400/10 border border-teal-400/20 text-teal-300 grid place-items-center mb-6">
                    <Smile className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl text-white font-semibold mb-3">
                    Personalized Spa Amenities
                  </h3>
                  <p className="text-slate-300 text-sm font-light leading-relaxed">
                    Warmed lavender-infused towels, ergonomic memory foam suites, and post-treatment soothing herbal teas.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pure Comfort</span>
                </div>
              </div>
            </BorderBeamPanel>
          </motion.div>
        </div>

        <div className="text-center">
          <button
            onClick={onOpenBooking}
            className="px-10 py-5 rounded-full bg-gradient-to-r from-teal-400 via-teal-500 to-coral text-navy-900 font-semibold text-sm tracking-widest uppercase shadow-[0_0_40px_rgba(91,188,214,0.4)] hover:scale-105 transition-all duration-300"
          >
            Experience Gentle Care &mdash; Book Consultation
          </button>
        </div>
      </div>
    </section>
  );
};
