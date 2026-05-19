import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="contact" className="py-20 bg-[#000]">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-[#ff1a1a]/40 to-transparent" />
            <span className="font-barlow font-semibold tracking-[0.3em] text-[#ff1a1a] text-xs uppercase">
              Get In Touch
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-[#ff1a1a]/40 to-transparent" />
          </div>
          <h2 className="font-bebas text-[clamp(3rem,12vw,6rem)] tracking-wide text-white leading-none">
            CONTACT <span className="text-[#ff1a1a]">US</span>
          </h2>
          <p className="text-gray-400 text-sm font-inter mt-3">
            Reach out to us for any inquiries or visit us at our location.
          </p>
        </motion.div>

        {/* Two-column layout: details left, map right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch mb-10">
          {/* Left: Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#0d0d0d] border border-white/5 rounded p-6 md:p-8 flex flex-col md:min-h-[420px]"
          >
            <h3 className="font-bebas text-2xl text-white mb-4">Visit Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-[#ff1a1a] mt-1" />
                <div>
                  <div className="font-barlow text-xs text-[#ff1a1a] tracking-[0.2em] uppercase mb-1">Address</div>
                  <div className="text-sm text-gray-300">H85Q+HX9 Mannat bliss pg sector 44 chalera, Gali Number 3, Chhalera Bangar, Sector 44, Noida, UP 201303</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock size={20} className="text-[#ff1a1a] mt-1" />
                <div>
                  <div className="font-barlow text-xs text-[#ff1a1a] tracking-[0.2em] uppercase mb-1">Opening Hours</div>
                  <div className="text-sm text-gray-300">7 Days Gym Open<br/>Mon - Sat: 05:30 AM - 10:30 PM<br/>Sunday: 06:00 AM - 10:30 AM</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone size={20} className="text-[#ff1a1a] mt-1" />
                <div>
                  <div className="font-barlow text-xs text-[#ff1a1a] tracking-[0.2em] uppercase mb-1">Phone</div>
                  <div className="text-sm text-gray-300">+91 85068 89718</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MessageCircle size={20} className="text-[#ff1a1a] mt-1" />
                <div>
                  <div className="font-barlow text-xs text-[#ff1a1a] tracking-[0.2em] uppercase mb-1">WhatsApp</div>
                  <div className="text-sm text-gray-300">+91 85068 89718</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Map Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#0d0d0d] border border-white/5 rounded p-0 overflow-hidden flex flex-col md:min-h-[420px]"
          >
            <div className="flex items-center justify-end p-3">
              <button className="bg-[#ff1a1a] text-white text-xs px-3 py-1 rounded">Find Us on Map</button>
            </div>
            <div className="flex-1 min-h-0">
              <iframe
                title="Getfit Academy Location"
                className="w-full h-full"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(85%)' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d438.0450490248132!2d77.33982498292858!3d28.55893878913356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce7bd1ecef689%3A0xd53d7090a2afbb94!2sGetfit%20Academy-%20Building%20a%20professional%20fighting%20crew%20with%20Boxing%20%7C%20MMA%20%7C%20Kickboxing%20%7C%20Fitness%20%7C%20Wrestling!5e0!3m2!1sen!2sin!4v1778829912998!5m2!1sen!2sin"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
