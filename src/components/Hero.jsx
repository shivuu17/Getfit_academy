import { motion } from 'framer-motion';
import heroImg from '../assets/hero_fighter.png';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.18, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function Hero() {
  const scrollTo = (id) =>
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImg})` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/95" />
      {/* Red vignette */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-transparent to-black/80" />
      {/* Red bottom line accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff1a1a] to-transparent opacity-60" />

      {/* Content */}
      <div className="relative z-10 text-center px-5 max-w-lg mx-auto pt-24 pb-32">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 border border-[#ff1a1a]/60 px-4 py-1.5 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1a1a] animate-pulse" />
          <span className="font-barlow font-semibold tracking-[0.25em] text-[11px] text-[#ff1a1a] uppercase">
            Est. 2019 • Mumbai, India
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-bebas text-[clamp(3.5rem,14vw,7rem)] leading-none tracking-wide text-white mb-4"
        >
          UNLEASH<br />
          <span className="text-[#ff1a1a]">YOUR</span><br />
          INNER<br />FIGHTER
        </motion.h1>

        {/* Sub text */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-barlow font-semibold tracking-[0.3em] text-gray-300 text-sm mb-10 uppercase"
        >
          MMA &nbsp;•&nbsp; BOXING &nbsp;•&nbsp; STREET COMBAT
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            id="hero-join-btn"
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo('#contact')}
            className="btn-red-glow bg-[#ff1a1a] text-white font-bebas tracking-[0.25em] text-xl px-10 py-4 min-h-[52px] cursor-pointer"
          >
            JOIN NOW
          </motion.button>
          <motion.button
            id="hero-trial-btn"
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo('#pricing')}
            className="border border-white/60 text-white font-bebas tracking-[0.25em] text-xl px-10 py-4 min-h-[52px] hover:border-white hover:bg-white/5 transition-all cursor-pointer"
          >
            FREE TRIAL
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex justify-center gap-10 mt-14 pt-8 border-t border-white/10"
        >
          {[
            { value: '500+', label: 'Members' },
            { value: '12+', label: 'Pro Trainers' },
            { value: '6', label: 'Years' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-bebas text-3xl text-[#ff1a1a] leading-none">{s.value}</div>
              <div className="font-barlow text-[11px] tracking-widest text-gray-400 uppercase mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
      >
        <div className="w-px h-10 bg-gradient-to-b from-[#ff1a1a] to-transparent" />
      </motion.div>
    </section>
  );
}
