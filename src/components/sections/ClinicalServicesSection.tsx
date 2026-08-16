import React from 'react';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ServiceData } from './ServiceDetailModal';

interface ClinicalServicesSectionProps {
  onSelectService: (service: ServiceData) => void;
}

export const ClinicalServicesSection: React.FC<ClinicalServicesSectionProps> = ({ onSelectService }) => {
  const services: ServiceData[] = [
    {
      id: 'implants',
      title: 'Dental Implants & Restorations',
      category: 'Permanent Tooth Replacement',
      duration: 'Single Visit Setup',
      description:
        'Biocompatible titanium implants topped with custom porcelain crowns. Feels and functions exactly like a natural tooth.',
      detailedOverview:
        'Dental implants are the gold standard for replacing missing teeth. A titanium post is precisely integrated into your jawbone, acting as a natural root. We then attach a custom-crafted porcelain crown matched perfectly to your surrounding teeth.',
      highlights: ['99.2% Long-Term Success Rate', 'Computer-Guided Placement', 'Natural Bone Integration'],
      procedureSteps: [
        'Digital X-Ray & Bone Density Assessment',
        'Keyhole Titanium Implant Placement under Local Anaesthetic',
        'Osseointegration Phase with Temporary Protective Cap',
        'Final Custom Ceramic Crown Attachment & Bite Calibration',
      ],
      badgeColor: 'bg-sky-50 text-[#004884] border border-sky-100',
    },
    {
      id: 'aligners',
      title: 'Invisalign & Clear Aligners',
      category: 'Orthodontics',
      duration: '6 – 12 Months',
      description:
        'Virtually invisible, removable aligner trays that straighten teeth comfortably without metal brackets or wires.',
      detailedOverview:
        'Straighten your teeth discreetly using custom-molded medical-grade clear aligners. Using digital diagnostics, we map your entire teeth movement step-by-step before your first set of trays is printed.',
      highlights: ['Digital Treatment Mapping', 'Zero Food Restrictions', 'Discreet & Removable'],
      procedureSteps: [
        'Digital Exam & Smile Outcome Preview',
        'Custom Aligner Set Manufacturing',
        'Bi-Weekly Tray Switches at Home',
        'Periodic Check-ins & Retainer Delivery',
      ],
      badgeColor: 'bg-teal-50 text-teal-700 border border-teal-100',
    },
    {
      id: 'root-canal',
      title: 'Painless Root Canal Therapy',
      category: 'Endodontics',
      duration: '45 – 60 Mins',
      description:
        'Advanced rotary endodontic treatment that eliminates tooth ache instantly while saving your natural tooth root.',
      detailedOverview:
        'Save your natural tooth with painless rotary endodontics. We remove infected pulp tissue, disinfect the inner root canals with micro-lasers, and seal them with biocompatible gutta-percha to prevent future infection.',
      highlights: ['Single-Seating Comfort', 'Micro-Rotary Precision', 'Zero-Pain Local Anaesthesia'],
      procedureSteps: [
        'Digital X-Ray & Pain Isolation Diagnosis',
        'Micro-Pulp Cleaning & Laser Disinfection',
        'Thermal Gutta-Percha Root Canal Sealing',
        'Protective Crown Reinforcement Placement',
      ],
      badgeColor: 'bg-sky-50 text-[#004884] border border-sky-100',
    },
    {
      id: 'veneers',
      title: 'Cosmetic Veneers & Smile Design',
      category: 'Esthetic Dentistry',
      duration: '2 Consultations',
      description:
        'Ultra-thin ultra-durable porcelain ceramic veneers to correct discoloration, gaps, chipped teeth, and misalignment.',
      detailedOverview:
        'Transform your smile aesthetics with custom porcelain veneers. Micro-thin ceramic shells are bonded directly to the front surface of your teeth, correcting gaps, chips, uneven lengths, or deep stains.',
      highlights: ['Preserves 98% Natural Enamel', 'Custom Shade Matching', 'Stain-Resistant Glass Ceramic'],
      procedureSteps: [
        'Digital Smile Design & Facial Aesthetics Analysis',
        'Minimal Enamel Preparation & Temporary Mockup',
        'Master Ceramist Glass Porcelain Hand-Crafting',
        'Adhesive Resin Bonding & Final Aesthetic Polish',
      ],
      badgeColor: 'bg-teal-50 text-teal-700 border border-teal-100',
    },
    {
      id: 'pediatric',
      title: 'Pediatric & Family Dentistry',
      category: 'Preventative Care',
      duration: '30 Mins',
      description:
        'Gentle, friendly dental care for children and teens. Fluoride treatments, cavity-preventing sealants, and positive habits.',
      detailedOverview:
        'We create fun, fear-free dental visits for children and teens. From cavity-preventing pit and fissure sealants to protective fluoride varnishes, our team fosters lifelong positive oral health habits.',
      highlights: ['Child-Friendly Atmosphere', 'Pain-Free Fluoride Varnish', 'Habit Counseling & Sealants'],
      procedureSteps: [
        'Gentle Oral Hygiene Exam & Fun Demonstration',
        'Ultrasonic Plaque Cleaning & Polish',
        'Painless Fluoride Varnish Application',
        'Preventative Pit & Fissure Sealants (if required)',
      ],
      badgeColor: 'bg-sky-50 text-[#004884] border border-sky-100',
    },
    {
      id: 'whitening',
      title: 'Laser Teeth Whitening & Cleaning',
      category: 'Hygiene & Brightening',
      duration: '45 Mins',
      description:
        'Ultrasonic micro-polishing paired with cold-light laser activation to lift stubborn stains safely up to 8 shades lighter.',
      detailedOverview:
        'Brighten your smile up to 8 shades in less than an hour. Ultrasonic scaling removes calculus and stains, followed by gentle gel application activated by cold-light laser technology to protect enamel.',
      highlights: ['Zero Sensitivity Formula', 'Removes Tobacco & Coffee Stains', 'Instant Sparkling Results'],
      procedureSteps: [
        'Gentle Ultrasonic Scaling & Micro-Polishing',
        'Protective Gum Barrier Gel Application',
        'Hydrogen Peroxide Whitening Gel & Laser Activation',
        'Sensitivity-Shield Desensitizing Finish',
      ],
      badgeColor: 'bg-teal-50 text-teal-700 border border-teal-100',
    },
  ];

  return (
    <section id="services" className="py-28 px-6 md:px-12 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-navy-700 px-3.5 py-1 rounded-full bg-slate-200/80">
            Comprehensive Dental Care
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Specialized Clinical Services
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
            Every procedure at Smile7 is tailored to your unique anatomical needs using evidence-based dentistry and state-of-the-art equipment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative flex flex-col justify-between p-7 rounded-3xl bg-white border border-slate-200/80 shadow-apple hover:shadow-apple-hover transition-all duration-300 text-left"
            >
              <div>
                {/* Perfectly Aligned Card Header */}
                <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-slate-100">
                  <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${service.badgeColor}`}>
                    {service.category}
                  </span>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100/90 px-2.5 py-1 rounded-full border border-slate-200/60 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>{service.duration}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-navy-700 transition-colors leading-snug">
                  {service.title}
                </h3>

                <p className="text-slate-600 text-sm font-normal leading-relaxed mb-6">
                  {service.description}
                </p>

                <ul className="space-y-2 border-t border-slate-100 pt-5 mb-6">
                  {service.highlights.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* High-Contrast Action Button */}
              <button
                onClick={() => onSelectService(service)}
                className="w-full py-3.5 rounded-full bg-[#004884] hover:bg-sky-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2"
              >
                <span>Learn More & Consult</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
