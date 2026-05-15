import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyJoinBtn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sticky-cta"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 py-3 bg-black/90 backdrop-blur-md border-t border-white/5"
        >
          <motion.button
            id="sticky-join-btn"
            whileTap={{ scale: 0.97 }}
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-red-glow w-full bg-[#ff1a1a] text-white font-bebas tracking-[0.35em] text-xl
                       py-4 min-h-[54px] cursor-pointer"
          >
            🥊 JOIN NOW — FREE TRIAL
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
