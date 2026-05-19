import { Dumbbell } from 'lucide-react';

// Social icons are inline SVGs (lucide-react v1 has no brand icons)

// Custom inline SVGs for brand icons (lucide-react v1 has no brand icons)
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

const TwitterXIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zM17.082 19.77h1.833L7.084 4.126H5.117L17.082 19.77z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const socials = [
  { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
  { icon: <YoutubeIcon />, href: '#', label: 'YouTube' },
  { icon: <TwitterXIcon />, href: '#', label: 'X / Twitter' },
  { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
];

const links = [
  ['Programs', '#programs'],
  ['Why Us', '#why'],
  ['Trainers', '#trainers'],
  ['Pricing', '#pricing'],
  ['Contact', '#contact'],
];

import logoImg from '../assets/logo.webp';

export default function Footer() {
  const scrollTo = (href) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-5">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoImg} alt="Getfit Academy Logo" className="h-12 md:h-14 w-auto object-contain" />
              <div>
                <span className="font-bebas tracking-widest text-xl leading-none block text-white">GETFIT</span>
                <span className="text-[#ff1a1a] text-[10px] font-barlow tracking-[0.3em] font-semibold">
                  ACADEMY
                </span>
              </div>
            </div>
            <p className="font-inter text-xs text-gray-600 max-w-[200px] leading-relaxed">
              Noida's premier MMA & combat sports training facility.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <div className="font-barlow font-bold tracking-[0.2em] text-[10px] text-gray-600 uppercase mb-3">
              Quick Links
            </div>
            <ul className="flex flex-col gap-2">
              {links.map(([label, href]) => (
                <li key={label}>
                  <button
                    onClick={() => scrollTo(href)}
                    className="font-barlow font-semibold text-sm text-gray-400 hover:text-[#ff1a1a]
                               transition-colors tracking-wider uppercase cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <div className="font-barlow font-bold tracking-[0.2em] text-[10px] text-gray-600 uppercase mb-3">
              Follow the Fight
            </div>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center
                             text-gray-500 hover:text-white hover:border-[#ff1a1a]/60
                             hover:bg-[#ff1a1a]/10 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-600 font-inter">
          <span>© 2025 Getfit Academy. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              Built with <Dumbbell size={12} className="text-[#ff1a1a]" /> in Noida
            </span>
            <button
              onClick={() => (window.location.href = '/admin')}
              className="text-gray-400 hover:text-white text-xs uppercase tracking-widest px-2 py-1 border border-white/5 rounded"
              aria-label="Open admin panel"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
