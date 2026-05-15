import { motion } from 'framer-motion';
import logoImg from '../assets/logo.webp';

export default function LoadingScreen() {
  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] bg-[#000] flex flex-col items-center justify-center"
    >
      {/* Pulsing Logo */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-10"
      >
        <img src={logoImg} alt="Getfit Academy Loading..." className="h-24 md:h-32 w-auto object-contain" />
      </motion.div>

      {/* Sweeping Progress Bar */}
      <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1/2 h-full bg-[#ff1a1a] shadow-[0_0_10px_#ff1a1a]"
        />
      </div>
    </motion.div>
  );
}
