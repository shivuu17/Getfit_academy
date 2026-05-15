import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import impactBg from '../assets/impact_bg.png';

export default function Impact() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section id="impact" ref={ref} className="relative py-32 overflow-hidden">
      {/* Parallax background */}
      <motion.div
        style={{ y }}
        className="absolute inset-[-10%] bg-cover bg-center bg-no-repeat"
        aria-hidden="true"
      >
        <div
          className="w-full h-full"
          style={{ backgroundImage: `url(${impactBg})` }}
        />
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80" />
      {/* Red tint gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#ff1a1a]/5 to-black/70" />

      {/* Content */}
      <div className="relative z-10 px-5 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="h-px w-24 bg-[#ff1a1a] mx-auto mb-8"
        />

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-bebas text-[clamp(2.5rem,10vw,6rem)] leading-tight tracking-wide text-white"
        >
          THIS IS NOT A GYM.
        </motion.h2>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-bebas text-[clamp(2.5rem,10vw,6rem)] leading-tight tracking-wide text-[#ff1a1a]"
        >
          THIS IS A BATTLEFIELD.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="h-px w-24 bg-[#ff1a1a] mx-auto mt-8 mb-10"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="font-inter text-gray-400 text-base max-w-lg mx-auto leading-relaxed mb-10"
        >
          Every rep. Every round. Every drop of sweat is forging the version of you
          that doesn't quit.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-12"
        >
          {[
            { num: '500+', label: 'Fighters Trained' },
            { num: '23', label: 'Championships Won' },
            { num: '100%', label: 'Commitment Required' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-bebas text-5xl text-white leading-none">{stat.num}</div>
              <div className="font-barlow text-[11px] tracking-[0.25em] text-gray-500 uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
