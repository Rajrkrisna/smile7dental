import React from 'react';
import { Droplets, Sparkles, Feather, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const EcosystemSection: React.FC = () => {
  const experiences = [
    {
      icon: <Droplets className="w-6 h-6 text-teal-300" />,
      title: "Micro-Hydration Cleansing",
      description:
        "Replacing high-pressure scraping with gentle ultrasonic misting and mineralized water droplets that soothe gum tissue while lifting surface impurities.",
      tag: "Pure Hygiene",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-teal-300" />,
      title: "Biomimetic Enamel Glow",
      description:
        "Natural hydroxyapatite remineralization treatments that rebuild protective crystalline layers and restore your smile’s organic translucency.",
      tag: "Bio-Restoration",
    },
    {
      icon: <Feather className="w-6 h-6 text-coral" />,
      title: "Feather-Touch Laser Aesthetics",
      description:
        "Silent laser precision for painless gum contouring and tissue renewal without stitches or sound triggers.",
      tag: "Zero Sound",
    },
    {
      icon: <Shield className="w-6 h-6 text-teal-300" />,
      title: "Sterile Sanctuary Protocol",
      description:
        "Medical-grade air purification recycling air every 90 seconds with soothing essential oil aromatics to eliminate all clinical scents.",
      tag: "Pure Air",
    },
  ];

  return (
    <section id="ecosystem" className="relative min-h-screen flex items-center justify-center px-6 py-28 z-10">
      <div className="max-w-6xl w-full mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-3 inline-block"
          >
            The Ecosystem of Wellness
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl sm:text-6xl text-white font-bold tracking-tight mb-6"
          >
            A Sanctuary of <span className="italic text-teal-300">Cleanliness & Light</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-300 text-lg max-w-2xl mx-auto font-light"
          >
            We dissolved clinical anxiety into an organic ecosystem where every touch, sound, and scent is crafted for deep peace.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative p-8 rounded-3xl bg-navy-900/40 backdrop-blur-xl border border-slate-800/80 hover:border-teal-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(91,188,214,0.15)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-navy-800/80 border border-slate-700/60 group-hover:scale-110 transition-transform">
                  {exp.icon}
                </div>
                <span className="text-[10px] tracking-widest uppercase font-medium px-3 py-1 rounded-full bg-teal-400/10 text-teal-300 border border-teal-400/20">
                  {exp.tag}
                </span>
              </div>
              <h3 className="font-serif text-2xl text-white font-semibold mb-3 group-hover:text-teal-300 transition-colors">
                {exp.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-light">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
