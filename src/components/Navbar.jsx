import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.webp';

const links = [
  { label: 'Programs', href: '#programs' },
  { label: 'Why Us', href: '#why' },
  { label: 'Trainers', href: '#trainers' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onAdminClick, onJoinClick }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAdminHint, setShowAdminHint] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Getfit Academy Logo" className="h-10 md:h-12 w-auto object-contain" />
            <div>
              <span className="font-bebas tracking-widest text-lg leading-none block text-white">
                GETFIT
              </span>
              <span className="text-[#ff1a1a] text-[10px] font-barlow tracking-[0.3em] font-semibold leading-none">
                ACADEMY
              </span>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNav(l.href)}
                className="font-barlow font-semibold tracking-wider text-sm text-gray-300 hover:text-white hover:text-[#ff1a1a] transition-colors uppercase cursor-pointer"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={onJoinClick}
              className="btn-red-glow bg-[#ff1a1a] text-white font-barlow font-bold tracking-widest text-sm px-5 py-2.5 uppercase cursor-pointer"
            >
              Join Now
            </button>
            <button
              onClick={() => (window.location.href = '/admin')}
              className="text-sm text-gray-400 hover:text-white hover:text-[#ff1a1a] uppercase tracking-widest px-3 py-2 border border-white/5 rounded cursor-pointer"
            >
              Admin
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2 -mr-2"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {links.map((l, i) => (
              <motion.button
                key={l.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => handleNav(l.href)}
                className="font-bebas tracking-[0.2em] text-4xl text-white hover:text-[#ff1a1a] transition-colors cursor-pointer"
              >
                {l.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: links.length * 0.07 }}
              onClick={() => {
                onJoinClick();
                setOpen(false);
              }}
              className="btn-red-glow bg-[#ff1a1a] text-white font-bebas tracking-[0.3em] text-2xl px-10 py-4 mt-4 cursor-pointer"
            >
              JOIN NOW
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
