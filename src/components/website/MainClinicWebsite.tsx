import React, { useState, useEffect } from 'react';
import { Navbar } from '../ui/Navbar';
import { HeroSection } from '../sections/HeroSection';
import { ClinicalServicesSection } from '../sections/ClinicalServicesSection';
import { ClinicTechSection } from '../sections/ClinicTechSection';
import { DoctorSection } from '../sections/DoctorSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { FooterSection } from '../sections/FooterSection';
import { BookingModal } from '../sections/BookingModal';
import { ServiceDetailModal } from '../sections/ServiceDetailModal';
import type { ServiceData } from '../sections/ServiceDetailModal';
interface MainClinicWebsiteProps {
  onOpenBillingPortal: () => void;
}

export const MainClinicWebsite: React.FC<MainClinicWebsiteProps> = ({ onOpenBillingPortal }) => {
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingTreatment, setBookingTreatment] = useState<string | undefined>(undefined);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);

  // Discreet keyboard shortcut for Dr. Manickapriya & clinic staff (Ctrl + Shift + B or Cmd + Shift + B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'B' || e.key === 'b')) {
        e.preventDefault();
        onOpenBillingPortal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenBillingPortal]);

  const handleOpenGeneralBooking = () => {
    setBookingTreatment(undefined);
    setIsBookingOpen(true);
  };

  const handleOpenServiceDetail = (service: ServiceData) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleBookFromServiceDetail = (treatmentTitle: string) => {
    setIsServiceModalOpen(false);
    setBookingTreatment(treatmentTitle);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#bae6fd] selection:text-[#00264d]">
      {/* Apple-style Glass Navigation Bar */}
      <Navbar 
        onOpenBooking={handleOpenGeneralBooking} 
      />

      {/* Main Page Content */}
      <main>
        <HeroSection onOpenBooking={handleOpenGeneralBooking} />
        <ClinicalServicesSection onSelectService={handleOpenServiceDetail} />
        <ClinicTechSection />
        <DoctorSection />
        <TestimonialsSection />
      </main>

      {/* Footer with Google Maps Location & Staff Portal Trigger */}
      <FooterSection onOpenBillingPortal={onOpenBillingPortal} />

      {/* Interactive Treatment Explanatory Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onBookTreatment={handleBookFromServiceDetail}
      />

      {/* Appointment Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialTreatment={bookingTreatment}
      />
    </div>
  );
};
