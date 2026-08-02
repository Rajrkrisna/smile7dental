import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, User, ShieldCheck, PhoneCall, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTreatment?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, initialTreatment }) => {
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    treatment: 'General Dental Checkup & Cleaning',
    date: '',
    time: '10:00 AM - 11:30 AM',
  });

  useEffect(() => {
    if (initialTreatment) {
      setFormData((prev) => ({ ...prev, treatment: initialTreatment }));
    }
  }, [initialTreatment]);

  // Helper to build smart mobile app vs desktop web.whatsapp.com deep links
  const getWhatsAppTargetUrl = (messageText: string) => {
    const clinicWhatsAppNumber = '919790862510';
    const encodedMessage = encodeURIComponent(messageText);

    // Detect mobile browser (iOS / Android)
    const isMobile =
      typeof navigator !== 'undefined' &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      // Mobile Deep Link: Directly launches the native iOS or Android WhatsApp App
      return `https://api.whatsapp.com/send?phone=${clinicWhatsAppNumber}&text=${encodedMessage}`;
    } else {
      // Desktop Deep Link: Opens web.whatsapp.com directly in browser tab
      return `https://web.whatsapp.com/send?phone=${clinicWhatsAppNumber}&text=${encodedMessage}`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Formatted message string containing patient entries
    const message = `Hello Dr. P. Manickapriya & Smile 7 Dental Clinic Team! 👋\n\nI would like to book a dental appointment. Here are my details:\n\n👤 Patient Name: ${formData.name}\n🦷 Required Treatment: ${formData.treatment}\n📅 Preferred Date: ${formData.date || 'As soon as available'}\n⏰ Preferred Time Window: ${formData.time}\n\nPlease let me know your available slots. Thank you!`;

    const generatedUrl = getWhatsAppTargetUrl(message);

    setWhatsappUrl(generatedUrl);
    setSubmitted(true);

    // Automatically dispatch to WhatsApp Mobile App or web.whatsapp.com
    window.open(generatedUrl, '_blank', 'noopener,noreferrer');
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

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

          {/* Modal Card with custom rounded inner scrollbar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto custom-scrollbar p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl z-10 text-left"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 grid place-items-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">
                  Appointment Request Sent!
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you, <strong className="text-navy-700">{formData.name}</strong>! Your appointment request for <strong className="text-navy-700">{formData.treatment}</strong> has been formatted into a WhatsApp message and dispatched to the clinic.
                </p>

                {/* Direct WhatsApp Action Button */}
                <div className="space-y-3 max-w-md mx-auto mb-8">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4.5 h-4.5 fill-white text-white" />
                    <span>Re-open WhatsApp Message</span>
                  </a>

                  <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 text-left text-xs text-slate-700 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#004884]">
                      <PhoneCall className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>Confirmation Call Notice</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Dr. P. Manickapriya or the clinic manager will call you back on your WhatsApp phone number prior to your visit to finalize your exact appointment slot.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="px-8 py-3.5 rounded-full bg-[#004884] hover:bg-sky-600 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  Return to Home
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-sky-600 text-xs uppercase tracking-widest font-bold mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Smile7 Dental Clinic Booking</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  Schedule Your Dental Consultation
                </h3>

                {/* WhatsApp & Call Notice Banner */}
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-slate-800 mb-6">
                  <MessageCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Instant WhatsApp Booking:</strong> Submitting this form will automatically open <strong>Smile 7 Dental Clinic's WhatsApp (+91 97908 62510)</strong> with your appointment details ready to send.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 mb-1">
                      Patient Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-navy-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 mb-1">
                      Required Dental Treatment
                    </label>
                    <select
                      value={formData.treatment}
                      onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-navy-700 font-medium"
                    >
                      <option>General Dental Checkup & Cleaning</option>
                      <option>Dental Implants & Restorations</option>
                      <option>Invisalign & Clear Aligners</option>
                      <option>Painless Root Canal Therapy</option>
                      <option>Cosmetic Veneers & Smile Design</option>
                      <option>Laser Teeth Whitening & Cleaning</option>
                      <option>Pediatric & Family Dentistry</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 mb-1">
                        Preferred Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-navy-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 mb-1">
                        Preferred Time Window
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <select
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-navy-700"
                        >
                          <option>09:30 AM - 11:30 AM</option>
                          <option>11:30 AM - 01:30 PM</option>
                          <option>03:30 PM - 05:30 PM</option>
                          <option>05:30 PM - 07:30 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4.5 h-4.5 fill-white text-white" />
                    <span>Send Appointment Request via WhatsApp</span>
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
