import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const pillars = [
  {
    id: 'training',
    icon: '🥊',
    title: 'Real Fight Training',
    desc: 'Sparring, live drilling, and cage-tested techniques used by actual pro fighters.',
  },
  {
    id: 'coaches',
    icon: '🧑‍🏫',
    title: 'Pro Coaches',
    desc: 'Our trainers have competed at national and international level. Real fighters teach here.',
  },
  {
    id: 'conditioning',
    icon: '💪',
    title: 'Strength & Endurance',
    desc: 'Fight-specific conditioning — power, explosiveness, and an iron-clad cardio engine.',
  },
  {
    id: 'discipline',
    icon: '🧠',
    title: 'Discipline & Focus',
    desc: 'Mental fortitude built through adversity. You leave tougher than you arrived.',
  },
];

function Pillar({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className="group flex gap-5 p-5 border border-white/5 bg-[#0d0d0d]
                 hover:border-[#ff1a1a]/30 hover:bg-[#111] transition-all duration-300"
    >
      <div className="text-4xl flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
        {item.icon}
      </div>
      <div>
        <h3 className="font-barlow font-bold tracking-wider text-lg text-white mb-1.5 uppercase">
          {item.title}
        </h3>
        <p className="font-inter text-sm text-gray-400 leading-relaxed">{item.desc}</p>
      </div>
    </motion.div>
  );
}

export default function WhyUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="why" className="py-20 bg-[#060606]">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-[#ff1a1a]/40 to-transparent" />
            <span className="font-barlow font-semibold tracking-[0.3em] text-[#ff1a1a] text-xs uppercase">
              The Antigravity Edge
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-[#ff1a1a]/40 to-transparent" />
          </div>
          <h2 className="font-bebas text-[clamp(2.8rem,10vw,5rem)] tracking-wide text-white text-center leading-none">
            WHY <span className="text-[#ff1a1a]">ANTIGRAVITY</span>
          </h2>
          <p className="text-center text-gray-400 text-sm font-inter mt-3 max-w-md mx-auto">
            We don't run a fitness class. We build fighters.
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((item, i) => (
            <Pillar key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* Bottom bar stat */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 h-px bg-gradient-to-r from-transparent via-[#ff1a1a] to-transparent"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="font-bebas text-2xl md:text-4xl tracking-widest text-gray-500 uppercase">
            Where <span className="text-white">Warriors</span> Are Made
          </p>
        </motion.div>
      </div>
    </section>
  );
}
