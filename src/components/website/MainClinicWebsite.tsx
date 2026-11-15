import React, { useState } from 'react';
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
export const MainClinicWebsite: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingTreatment, setBookingTreatment] = useState<string | undefined>(undefined);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);

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

      {/* Footer with Google Maps Location */}
      <FooterSection />

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
