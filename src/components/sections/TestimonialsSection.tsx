import React from 'react';
import { Star, ExternalLink, CheckCircle2, MapPin, MessageSquarePlus } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TestimonialData {
  id: string;
  name: string;
  badge: string;
  rating: number;
  date: string;
  comment: string;
  avatarLetter: string;
  avatarBg: string;
}

export const TestimonialsSection: React.FC = () => {
  // Exact Authentic Google Maps Reviews for Smile 7 Dental Clinic
  const realGoogleReviews: TestimonialData[] = [
    {
      id: 'rev-1',
      name: 'Shangeeth Sivan Adiyapatham',
      badge: 'Local Guide · 56 reviews · 172 photos',
      rating: 5,
      date: 'a month ago',
      comment:
        'Had a great experience at the clinic for scaling. Dr. Maanikapriya explained the procedure clearly and performed the scaling gently and professionally—very satisfied with the treatment.',
      avatarLetter: 'S',
      avatarBg: 'bg-[#004884] text-white',
    },
    {
      id: 'rev-2',
      name: 'Sushmitha Sakkarapani',
      badge: '3 reviews · 4 photos',
      rating: 5,
      date: 'a month ago',
      comment:
        'Had an excellent experience at Smile 7 Dental Clinic. Excellent care, friendly staff, and a very clean clinic. The treatment was smooth and comfortable. Highly recommend Smile 7 Dental Clinic!',
      avatarLetter: 'S',
      avatarBg: 'bg-sky-600 text-white',
    },
    {
      id: 'rev-3',
      name: 'Naveen Kumar Venkat',
      badge: 'Local Guide · 105 reviews · 55 photos',
      rating: 5,
      date: 'a month ago',
      comment:
        'Highly recommended for dental treatment. An experienced professional who treats patients with great care and a gentle approach 👍',
      avatarLetter: 'N',
      avatarBg: 'bg-teal-600 text-white',
    },
    {
      id: 'rev-4',
      name: 'Rafi Mohammed',
      badge: 'Local Guide · 20 reviews · 3 photos',
      rating: 5,
      date: '4 weeks ago',
      comment:
        "Dentist akka Priya took time to explain everything properly and didn't rush the consultation. Very friendly. Highly recommend Priya akka for consultation",
      avatarLetter: 'R',
      avatarBg: 'bg-[#004884] text-white',
    },
  ];

  const googleMapsUrl =
    'https://www.google.com/maps/place/Smile+7+Dental+Clinic/@13.0580409,80.163911,17z/data=!3m1!4b1!4m6!3m5!1s0x3a52616106af993f:0x9da2ac9abdb25cb7!8m2!3d13.0580409!4d80.1664859!16s%2Fg%2F11ycfy8f2q';

  return (
    <section id="reviews" className="py-28 px-6 md:px-12 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        {/* Header with Google Maps Rating Summary Badge */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider border border-slate-200">
            {/* Official Google G Logo SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Authentic Google Maps Reviews</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Patient Stories & Google Reviews
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
            Real reviews posted by patients on the official Smile 7 Dental Clinic Google Maps listing.
          </p>

          {/* Aggregate Rating Score Box & Direct Google Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-3xl font-extrabold text-slate-900">5.0</div>
              <div>
                <div className="flex items-center text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-[11px] text-slate-500 font-semibold text-left">
                  Smile 7 Dental Clinic on Google Maps
                </div>
              </div>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#004884] hover:bg-sky-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              <MapPin className="w-4 h-4 text-white" />
              <span>View Google Maps Listing</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition-all border border-slate-300"
            >
              <MessageSquarePlus className="w-4 h-4 text-sky-600" />
              <span>Write a Google Review</span>
            </a>
          </div>
        </div>

        {/* Real Google Maps Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {realGoogleReviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col justify-between p-7 rounded-3xl bg-slate-50/90 border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-left relative overflow-hidden"
            >
              <div>
                {/* Top Row: User Avatar & Google Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full ${rev.avatarBg} font-bold text-base grid place-items-center shrink-0 shadow-xs`}
                    >
                      {rev.avatarLetter}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base leading-snug">
                        {rev.name}
                      </h4>
                      <span className="text-xs text-slate-500 font-medium block">
                        {rev.badge}
                      </span>
                    </div>
                  </div>

                  {/* Google Icon Badge */}
                  <div
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white text-sky-600 border border-slate-200 shadow-2xs"
                    title="Verified Google Maps Review"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google</span>
                  </div>
                </div>

                {/* Rating Stars & Date */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/60">
                  <div className="flex items-center text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1">5.0 / 5.0</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{rev.date}</span>
                </div>

                {/* Comment */}
                <p className="text-slate-800 text-sm sm:text-base font-normal leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Verified Patient Footer */}
              <div className="pt-4 border-t border-slate-200/60 mt-5 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5 text-sky-600 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  Verified Google Patient Review
                </span>
                <span className="text-slate-400">Smile 7 Dental Clinic</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
