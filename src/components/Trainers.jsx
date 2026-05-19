import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import trainer1 from '../assets/trainer_1.webp';
import trainer2 from '../assets/trainer_2.webp';
import trainer3 from '../assets/trainer_3.webp';

const trainers = [
  {
    id: 't1',
    name: 'RAJAN MEHTA',
    specialty: 'MMA / Ground & Pound',
    record: '18-3 Pro',
    img: trainer1,
    exp: '9 yrs',
  },
  {
    id: 't2',
    name: 'PRIYA SHARMA',
    specialty: 'Kickboxing / Muay Thai',
    record: 'National Champion',
    img: trainer2,
    exp: '7 yrs',
  },
  {
    id: 't3',
    name: 'KHAN SAHAB',
    specialty: 'Boxing / Fundamentals',
    record: '26-4 Pro',
    img: trainer3,
    exp: '15 yrs',
  },
];

function TrainerCard({ trainer, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="snap-x-item w-[260px] sm:w-[280px] group relative overflow-hidden bg-[#0d0d0d] border border-white/5
                 hover:border-[#ff1a1a]/40 transition-all duration-300 flex-shrink-0"
    >
      {/* Image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={trainer.img}
          alt={trainer.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        {/* Experience badge */}
        <div className="absolute top-3 right-3 bg-[#ff1a1a] px-2 py-1">
          <span className="font-barlow font-bold text-[10px] tracking-widest text-white uppercase">
            {trainer.exp} exp
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="font-barlow font-semibold text-[10px] tracking-[0.3em] text-[#ff1a1a] uppercase mb-1">
          {trainer.specialty}
        </div>
        <h3 className="font-bebas text-2xl tracking-wider text-white leading-none mb-2">
          {trainer.name}
        </h3>
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-white/10" />
          <span className="font-barlow text-xs text-gray-500 tracking-widest">{trainer.record}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Trainers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="trainers" className="py-20 bg-[#000]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="px-5 mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-[#ff1a1a]/40 to-transparent" />
            <span className="font-barlow font-semibold tracking-[0.3em] text-[#ff1a1a] text-xs uppercase">
              Our Coaches
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-[#ff1a1a]/40 to-transparent" />
          </div>
          <h2 className="font-bebas text-[clamp(2.8rem,10vw,5rem)] tracking-wide text-white text-center leading-none">
            TRAINED BY <span className="text-[#ff1a1a]">THE BEST</span>
          </h2>
          <p className="text-center text-gray-400 text-sm font-inter mt-3">
            Swipe to meet your coaches →
          </p>
        </motion.div>

        {/* Horizontal scroll */}
        <div className="snap-x-container">
          {trainers.map((t, i) => (
            <TrainerCard key={t.id} trainer={t} index={i} />
          ))}
          {/* "Book Session" card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="snap-x-item w-[220px] border border-[#ff1a1a]/20 flex flex-col items-center justify-center
                         gap-4 p-8 flex-shrink-0 hover:border-[#ff1a1a]/60 transition-all cursor-pointer group"
              onClick={() => window.dispatchEvent(new Event('openJoinModal'))}
          >
            <div className="w-16 h-16 border-2 border-[#ff1a1a] flex items-center justify-center
                            group-hover:bg-[#ff1a1a] transition-colors duration-300">
              <span className="text-2xl">+</span>
            </div>
            <div className="text-center">
              <div className="font-bebas text-xl tracking-widest text-white mb-1">BOOK A</div>
              <div className="font-bebas text-xl tracking-widest text-[#ff1a1a]">SESSION</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
