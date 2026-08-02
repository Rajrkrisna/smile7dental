import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Menu, X } from 'lucide-react';
import logoText from '../../assets/logo-text.jpg';
import logoIcon from '../../assets/logo-icon.png';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-md py-3' : 'bg-white py-4 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between gap-3">
        {/* Logo Container (Tooth Icon PNG + Smile7 Dental Clinic Text) */}
        <a href="#" className="flex items-center gap-2 shrink-0 group min-w-0 bg-white px-1.5 py-1 rounded-lg">
          <img
            src={logoIcon}
            alt="Smile7 Dental Icon"
            className="h-8 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform shrink-0"
          />
          <img
            src={logoText}
            alt="Smile7 Dental Clinic"
            className="h-6 sm:h-8 w-auto max-w-[125px] sm:max-w-[200px] object-contain shrink-0 mix-blend-multiply"
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-slate-700 shrink-0">
          <a href="#services" className="hover:text-navy-700 transition-colors whitespace-nowrap">
            Dental Treatments
          </a>
          <a href="#technology" className="hover:text-navy-700 transition-colors whitespace-nowrap">
            Clinical Tech & Safety
          </a>
          <a href="#doctor" className="hover:text-navy-700 transition-colors whitespace-nowrap">
            Dr. P. Manickapriya
          </a>
          <a href="#reviews" className="hover:text-navy-700 transition-colors whitespace-nowrap">
            Patient Stories
          </a>
          <a href="#contact" className="hover:text-navy-700 transition-colors whitespace-nowrap">
            Clinic Location
          </a>
        </nav>

        {/* Contact & Visible High-Contrast CTA Button */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <a
            href="tel:+919790862510"
            className="hidden lg:flex items-center gap-2 text-xs font-bold text-navy-700 hover:text-sky-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 grid place-items-center text-navy-700">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <span className="whitespace-nowrap">+91 97908 62510</span>
          </a>

          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#004884] hover:bg-sky-600 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Mobile / Tablet Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 shrink-0 ml-auto md:ml-0"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 text-left">
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-navy-700"
          >
            Dental Treatments
          </a>
          <a
            href="#technology"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-navy-700"
          >
            Clinical Tech & Safety
          </a>
          <a
            href="#doctor"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-navy-700"
          >
            Dr. P. Manickapriya
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-navy-700"
          >
            Patient Stories
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-navy-700"
          >
            Clinic Location
          </a>
          <a
            href="tel:+919790862510"
            className="flex items-center gap-2 text-xs font-bold text-navy-700 py-2 border-t border-slate-200"
          >
            <Phone className="w-4 h-4 text-sky-500" />
            <span>+91 97908 62510</span>
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="w-full py-3.5 rounded-full bg-[#004884] text-white text-xs font-bold uppercase tracking-wider shadow-md"
          >
            Book Appointment
          </button>
        </div>
      )}
    </header>
  );
};
