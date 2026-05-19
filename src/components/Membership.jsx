import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    id: 'male',
    name: 'Male',
    desc: 'Standard adult male membership.',
    prices: { monthly: 4000, three: 9600, six: 16800, yearly: 24000 },
    features: ['All classes access', 'Locker access', 'Community events'],
  },
  {
    id: 'female',
    name: 'Female',
    desc: 'Tailored programs for female athletes.',
    prices: { monthly: 3500, three: 8400, six: 14700, yearly: 21000 },
    features: ['Women-only sessions', 'Locker access', 'Nutrition tips'],
  },
  {
    id: 'couple',
    name: 'Couple',
    desc: 'Bring a partner and save together.',
    prices: { monthly: 6500, three: 15600, six: 27700, yearly: 39000 },
    features: ['Partner discounts', 'Shared locker', 'Couples training plans'],
  },
  {
    id: 'kids',
    name: 'Kids',
    desc: 'Youth classes focused on fundamentals.',
    prices: { monthly: 3500, three: 8400, six: 14700, yearly: 21000 },
    features: ['Age-appropriate classes', 'Safety-first coaching', 'Progress reports'],
  },
];

function PlanCard({ plan, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const fmt = (n) => n.toLocaleString('en-IN');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative p-5 sm:p-7 flex flex-col gap-3 min-h-[420px]
        ${plan.highlight
          ? 'bg-[#111] border-2 border-[#ff1a1a] shadow-[0_0_40px_rgba(255,26,26,0.12)]'
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
      <div className="font-barlow font-semibold text-[11px] sm:text-[12px] tracking-[0.25em] text-[#ff1a1a] uppercase mb-1">
        {plan.name}
      </div>

      {/* Price matrix */}
      <div className="mb-3">
        <p className="font-inter text-[13px] sm:text-sm text-gray-400 mb-3 leading-relaxed">{plan.desc}</p>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4 sm:text-sm">
          <div className="text-gray-400 text-xs sm:text-sm">Monthly</div>
          <div className="text-white text-sm">₹{fmt(plan.prices.monthly)}</div>

          <div className="text-gray-400 text-xs sm:text-sm">3 Months</div>
          <div className="text-white text-sm">₹{fmt(plan.prices.three)}</div>

          <div className="text-gray-400 text-xs sm:text-sm">6 Months</div>
          <div className="text-white text-sm">₹{fmt(plan.prices.six)}</div>

          <div className="text-gray-400 text-xs sm:text-sm">Yearly</div>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <div className="text-white">₹{fmt(plan.prices.yearly)}</div>
            <div className="text-[11px] text-gray-300">(₹{fmt(Math.round(plan.prices.yearly / 12))}/mo)</div>
            <span className="ml-2 bg-[#ff1a1a] text-white text-[10px] px-2 py-0.5 rounded">Yearly – Save More 🔥</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/8 mb-6" />

      {/* Features */}
      <ul className="flex-1 space-y-2 mb-6">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <Check
              size={14}
              className={`flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-[#ff1a1a]' : 'text-gray-500'}`}
            />
            <span className="font-inter text-sm sm:text-sm text-gray-300">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <motion.button
        id={`plan-${plan.id}-btn`}
        whileTap={{ scale: 0.96 }}
        onClick={() => window.dispatchEvent(new Event('openJoinModal'))}
        className="btn-red-glow bg-[#ff1a1a] text-white font-barlow font-bold tracking-widest text-sm sm:text-sm px-4 py-3 sm:px-5 sm:py-2.5 uppercase cursor-pointer w-full"
      >
        Join Now
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 pt-4">
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
