import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    id: 'starter',
    name: 'STARTER',
    price: '999',
    period: 'mo',
    desc: 'Perfect for beginners entering the fight game.',
    features: [
      'Access to 1 program',
      '2 sessions per week',
      'Locker room access',
      'Community access',
    ],
    highlight: false,
    cta: 'Get Started',
  },
  {
    id: 'pro',
    name: 'PRO FIGHTER',
    price: '1,999',
    period: 'mo',
    desc: 'The complete fighter development package.',
    features: [
      'All 4 programs',
      'Unlimited sessions',
      'Personal trainer time',
      'Nutrition guidance',
      'Fight prep & sparring',
      'Priority booking',
    ],
    highlight: true,
    cta: 'Go Pro',
    badge: 'MOST POPULAR',
  },
  {
    id: 'elite',
    name: 'ELITE',
    price: '3,499',
    period: 'mo',
    desc: 'For serious competitors chasing the title.',
    features: [
      'Everything in Pro',
      '1-on-1 coaching (4x/mo)',
      'Competition prep',
      'Video analysis',
      'Supplement kit included',
    ],
    highlight: false,
    cta: 'Go Elite',
  },
];

function PlanCard({ plan, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative p-7 flex flex-col
        ${plan.highlight
          ? 'bg-[#111] border-2 border-[#ff1a1a] shadow-[0_0_40px_rgba(255,26,26,0.2)]'
          : 'bg-[#0d0d0d] border border-white/8'
        }`}
    >
      {/* Popular badge */}
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="pulse-red bg-[#ff1a1a] text-white font-barlow font-bold tracking-[0.2em] text-[10px] px-4 py-1.5 uppercase whitespace-nowrap">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Plan name */}
      <div className="font-barlow font-semibold text-[10px] tracking-[0.3em] text-[#ff1a1a] uppercase mb-1">
        {plan.name}
      </div>

      {/* Price */}
      <div className="flex items-end gap-1 mb-1">
        <span className="font-barlow font-bold text-gray-400 text-lg mb-1">₹</span>
        <span className="font-bebas text-6xl leading-none text-white">{plan.price}</span>
        <span className="font-barlow text-gray-400 text-sm mb-2">/{plan.period}</span>
      </div>

      <p className="font-inter text-xs text-gray-500 mb-6 leading-relaxed">{plan.desc}</p>

      <div className="h-px bg-white/8 mb-6" />

      {/* Features */}
      <ul className="flex-1 space-y-3 mb-8">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <Check
              size={14}
              className={`flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-[#ff1a1a]' : 'text-gray-500'}`}
            />
            <span className="font-inter text-sm text-gray-300">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <motion.button
        id={`plan-${plan.id}-btn`}
        whileTap={{ scale: 0.96 }}
        onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
        className={`w-full py-4 font-bebas tracking-[0.25em] text-xl min-h-[52px] transition-all cursor-pointer
          ${plan.highlight
            ? 'btn-red-glow bg-[#ff1a1a] text-white hover:bg-[#cc0000]'
            : 'border border-white/20 text-white hover:border-white/50 hover:bg-white/5'
          }`}
      >
        {plan.cta}
      </motion.button>
    </motion.div>
  );
}

export default function Membership() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="pricing" className="py-20 bg-[#060606]">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-[#ff1a1a]/40 to-transparent" />
            <span className="font-barlow font-semibold tracking-[0.3em] text-[#ff1a1a] text-xs uppercase">
              Memberships
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-[#ff1a1a]/40 to-transparent" />
          </div>
          <h2 className="font-bebas text-[clamp(2.8rem,10vw,5rem)] tracking-wide text-white text-center leading-none">
            INVEST IN YOUR <span className="text-[#ff1a1a]">FIGHT</span>
          </h2>
          <p className="text-center text-gray-400 text-sm font-inter mt-3">
            No contracts. Cancel anytime. First session free.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 pt-4">
          {plans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-600 text-xs font-inter mt-8"
        >
          All plans include locker access, equipment, and community membership. GST applicable.
        </motion.p>
      </div>
    </section>
  );
}
