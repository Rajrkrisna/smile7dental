import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink, Navigation } from 'lucide-react';
import logoText from '../../assets/logo-text.jpg';
import logoIcon from '../../assets/logo-icon.png';

interface FooterSectionProps {
  onOpenBillingPortal?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onOpenBillingPortal }) => {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-400 text-sm py-20 px-6 md:px-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        {/* Left Column: Brand & Info */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl inline-flex shadow-sm">
            <img src={logoIcon} alt="Smile7 Icon" className="h-8 w-auto object-contain" />
            <img src={logoText} alt="Smile7 Text Logo" className="h-7 w-auto object-contain mix-blend-multiply" />
          </div>
          <p className="text-xs text-slate-400 font-normal leading-relaxed max-w-sm">
            Smile7 Dental Clinic offers comprehensive, evidence-based dental care led by Dr. P. Manickapriya in Maduravoyal, Chennai.
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Strict Instrument Sterilization &bull; 100% Safe</span>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Mon &ndash; Sat: 9:30 AM &ndash; 8:00 PM</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Sun: Prior Appointment Only</span>
            </div>
          </div>
        </div>

        {/* Middle Column: Contact Details */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="font-bold text-white text-sm tracking-wider uppercase">
            Contact & Location
          </h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>No. 1/2, Alapakkam Main Road, Janaki Nagar, Maduravoyal, Chennai, Tamil Nadu - 600095</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <a href="tel:+919790862510" className="hover:text-white font-semibold text-slate-200 transition-colors">
                +91 97908 62510
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <a href="mailto:care@smile7dental.com" className="hover:text-white transition-colors">
                care@smile7dental.com
              </a>
            </li>
          </ul>

          <div className="pt-4">
            <a
              href="https://maps.google.com/?q=Smile+7+Dental+Clinic+Maduravoyal+Chennai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors border border-slate-700"
            >
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
              <span>Get Directions on Google Maps</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Right Column: Exact Smile7 Dental Clinic Embedded Google Map */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase">
              Smile7 Clinic Location Map
            </h4>
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
              Google Maps Verified
            </span>
          </div>

          <div className="w-full h-56 rounded-2xl overflow-hidden border border-slate-800 shadow-lg relative bg-slate-800">
            <iframe
              title="Smile 7 Dental Clinic Exact Google Maps Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.6483551336505!2d80.16391097507793!3d13.058040887265234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52616106af993f%3A0x9da2ac9abdb25cb7!2sSmile%207%20Dental%20Clinic!5e0!3m2!1sen!2sin!4v1785666610017!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <div 
          onClick={onOpenBillingPortal}
          className="select-none"
          title=""
        >
          &copy; {new Date().getFullYear()} Smile7 Dental Clinic. Dr. P. Manickapriya (BDS, FCD &bull; DCI Reg No: 26448). All Rights Reserved.
        </div>
        <div className="text-slate-500">
          Precision Clinical Excellence &bull; Patient Care Sanctuary
        </div>
      </div>
    </footer>
  );
};
