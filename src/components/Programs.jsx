import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const programs = [
  {
    id: 'boxing',
    icon: '🥊',
    title: 'BOXING',
    sub: 'Sweet Science',
    desc: 'Master jabs, hooks, footwork and ring IQ with championship-level coaching.',
    tag: 'BEGINNER FRIENDLY',
  },
  {
    id: 'mma',
    icon: '🏆',
    title: 'MMA',
    sub: 'Mixed Martial Arts',
    desc: 'Complete fighting system combining striking, wrestling and ground game.',
    tag: 'MOST POPULAR',
  },
  {
    id: 'kickboxing',
    icon: '🦵',
    title: 'KICKBOXING',
    sub: 'Stand-Up Striking',
    desc: 'Explosive kicks, punches and combinations that condition your entire body.',
    tag: 'HIGH INTENSITY',
  },
  {
    id: 'street',
    icon: '⚡',
    title: 'STREET COMBAT',
    sub: 'Self Defense',
    desc: 'Real-world situational fighting techniques for when it matters most.',
    tag: 'ADVANCED',
  },
];

function ProgramCard({ prog, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-[#111] border border-white/5 p-6 cursor-pointer overflow-hidden
                 hover:border-[#ff1a1a]/40 transition-all duration-300"
      style={{
        boxShadow: 'inset 0 0 0 0 rgba(255,26,26,0)',
      }}
    >
      {/* Red glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                      bg-gradient-to-br from-[#ff1a1a]/8 to-transparent pointer-events-none" />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff1a1a]/50 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Tag badge */}
      {prog.tag && (
        <span className={`inline-block font-barlow font-bold tracking-widest text-[10px] px-2.5 py-1 mb-4 uppercase
          ${prog.tag === 'MOST POPULAR'
            ? 'bg-[#ff1a1a] text-white pulse-red'
            : 'border border-white/20 text-gray-400'
          }`}
        >
          {prog.tag}
        </span>
      )}

      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0 mt-1">{prog.icon}</div>
        <div className="flex-1">
          <div className="font-barlow font-semibold text-[10px] tracking-[0.3em] text-[#ff1a1a] uppercase mb-1">
            {prog.sub}
          </div>
          <h3 className="font-bebas text-3xl tracking-wider text-white leading-none mb-2">
            {prog.title}
          </h3>
          <p className="font-inter text-sm text-gray-400 leading-relaxed">{prog.desc}</p>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-end mt-4">
        <span className="font-barlow font-semibold text-xs tracking-widest text-gray-600
                         group-hover:text-[#ff1a1a] transition-colors uppercase">
          Learn More →
        </span>
      </div>
    </motion.div>
  );
}

export default function Programs() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section id="programs" className="py-20 px-5 max-w-7xl mx-auto">
      {/* Section header */}
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 30 }}
        animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-[#ff1a1a]/40 to-transparent" />
          <span className="font-barlow font-semibold tracking-[0.3em] text-[#ff1a1a] text-xs uppercase">
            What We Offer
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-[#ff1a1a]/40 to-transparent" />
        </div>
        <h2 className="font-bebas text-[clamp(2.8rem,10vw,5rem)] tracking-wide text-white text-center leading-none">
          CHOOSE YOUR <span className="text-[#ff1a1a]">DISCIPLINE</span>
        </h2>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {programs.map((prog, i) => (
          <ProgramCard key={prog.id} prog={prog} index={i} />
        ))}
      </div>
    </section>
  );
}
