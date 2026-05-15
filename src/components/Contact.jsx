import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({ name: '', phone: '', program: 'MMA' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hi! I'm ${form.name}. I want to join Antigravity Fight Club for ${form.program}. My number is ${form.phone}.`
    );
    window.open(`https://wa.me/919999999999?text=${msg}`, '_blank');
    setSubmitted(true);
  };

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
              Ready to Start
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-[#ff1a1a]/40 to-transparent" />
          </div>
          <h2 className="font-bebas text-[clamp(3rem,12vw,6rem)] tracking-wide text-white leading-none">
            READY TO <span className="text-[#ff1a1a]">FIGHT?</span>
          </h2>
          <p className="text-gray-400 text-sm font-inter mt-3">
            Your first session is on us. No experience needed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-10 border border-[#ff1a1a]/30 bg-[#0d0d0d]">
                <div className="text-5xl mb-4">🥊</div>
                <h3 className="font-bebas text-3xl text-white tracking-wider mb-2">
                  YOU'RE IN THE GAME
                </h3>
                <p className="text-gray-400 text-sm font-inter">
                  We've opened WhatsApp for you. See you on the mat!
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 bg-[#0d0d0d] border border-white/5 p-7"
              >
                <h3 className="font-bebas text-2xl tracking-wider text-white mb-2">
                  CLAIM YOUR FREE TRIAL
                </h3>

                <div>
                  <label className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase block mb-2">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 text-white font-inter text-sm px-4 py-3.5
                               placeholder:text-gray-600 focus:outline-none focus:border-[#ff1a1a]/60
                               transition-colors min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase block mb-2">
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 text-white font-inter text-sm px-4 py-3.5
                               placeholder:text-gray-600 focus:outline-none focus:border-[#ff1a1a]/60
                               transition-colors min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase block mb-2">
                    Program Interest
                  </label>
                  <select
                    id="contact-program"
                    value={form.program}
                    onChange={(e) => setForm({ ...form, program: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 text-white font-inter text-sm px-4 py-3.5
                               focus:outline-none focus:border-[#ff1a1a]/60 transition-colors min-h-[48px] cursor-pointer"
                  >
                    <option>MMA</option>
                    <option>Boxing</option>
                    <option>Kickboxing</option>
                    <option>Street Combat</option>
                  </select>
                </div>

                <motion.button
                  id="contact-submit-btn"
                  type="submit"
                  whileTap={{ scale: 0.96 }}
                  className="btn-red-glow bg-[#ff1a1a] text-white font-bebas tracking-[0.3em] text-xl py-4 mt-2
                             min-h-[52px] w-full cursor-pointer hover:bg-[#cc0000] transition-colors"
                >
                  JOIN NOW — FREE TRIAL
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            {[
              {
                icon: <MapPin size={20} className="text-[#ff1a1a]" />,
                label: 'Location',
                val: 'Andheri West, Mumbai — Near D-Mart',
              },
              {
                icon: <Clock size={20} className="text-[#ff1a1a]" />,
                label: 'Hours',
                val: 'Mon–Sat: 5AM–10PM  |  Sunday: 6AM–2PM',
              },
              {
                icon: <Phone size={20} className="text-[#ff1a1a]" />,
                label: 'Call Us',
                val: '+91 99999 99999',
                href: 'tel:+919999999999',
              },
              {
                icon: <MessageCircle size={20} className="text-[#ff1a1a]" />,
                label: 'WhatsApp',
                val: 'Message us instantly',
                href: 'https://wa.me/919999999999',
              },
            ].map((info, i) => (
              <motion.a
                key={info.label}
                href={info.href || undefined}
                target={info.href?.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-4 p-5 bg-[#0d0d0d] border border-white/5
                            hover:border-[#ff1a1a]/30 transition-all duration-300
                            ${info.href ? 'cursor-pointer group' : ''}`}
              >
                <div className="mt-0.5 flex-shrink-0">{info.icon}</div>
                <div>
                  <div className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase mb-0.5">
                    {info.label}
                  </div>
                  <div className={`font-inter text-sm text-gray-200 ${info.href ? 'group-hover:text-[#ff1a1a] transition-colors' : ''}`}>
                    {info.val}
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
