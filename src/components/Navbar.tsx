import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

export default function Navbar() {
  const {
    isDarkMode, toggleDarkMode, themeColor,
    incrementEasterEgg, easterEggUnlocked, easterEggStage,
    language, setLanguage,
  } = useStore();
  const { t } = useTranslation();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/updates', label: t('updates') },
  ];

  return (
    <nav className="fixed top-14 w-full z-40 px-4 py-2 flex items-center justify-between pointer-events-none">
      {/* Logo */}
      <div className="flex-1 pointer-events-auto flex items-center gap-3">
        <motion.div
          whileTap={{ scale: 0.92 }}
          onClick={incrementEasterEgg}
          className="cursor-pointer relative flex items-center gap-2.5 select-none"
        >
          {/* Glow ring when unlocked */}
          <AnimatePresence>
            {easterEggUnlocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -inset-2 rounded-2xl pointer-events-none"
                style={{
                  boxShadow: `0 0 18px ${themeColor}70, 0 0 40px ${themeColor}35`,
                }}
              />
            )}
          </AnimatePresence>

          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-500 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-black/5 dark:border-white/10"
          >
            <motion.img
              src={isDarkMode ? "/images/logo.png" : "/images/logo_white.png"}
              alt="Team Darkness Logo"
              className="w-10 h-10 object-contain relative z-10 p-1"
              animate={easterEggUnlocked ? { scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] } : {}}
              transition={{ duration: 1.8, repeat: easterEggUnlocked ? Infinity : 0, ease: 'easeInOut' }}
              onError={(e) => {
                // Fallback if logo images not found
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.logo-fallback')) {
                  const fallback = document.createElement('span');
                  fallback.className = 'logo-fallback text-lg font-black relative z-10';
                  fallback.style.color = themeColor;
                  fallback.textContent = 'TD';
                  parent.appendChild(fallback);
                }
              }}
            />
            {easterEggUnlocked && (
              <motion.div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle, ${themeColor}44, transparent 70%)` }}
                animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            )}
          </div>
          <span className="font-bold text-base dark:text-white text-gray-900 hidden sm:block leading-tight">
            Team Darkness
          </span>

          {/* Stage badges */}
          {easterEggStage >= 1 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute -top-5 left-0 text-[9px] font-black uppercase tracking-widest text-white px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: themeColor }}
            >
              Awake
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* Center nav links */}
      <div className="hidden md:flex pointer-events-auto items-center gap-1 bg-white/70 dark:bg-black/30 backdrop-blur-xl px-2 py-1.5 rounded-2xl border border-black/8 dark:border-white/8 shadow-sm">
        {navLinks.map(({ to, label }) => (
          <NavLink key={to} to={to} current={location.pathname === to}>
            {label}
          </NavLink>
        ))}
      </div>

      {/* Right controls */}
      <div className="flex-1 pointer-events-auto flex items-center justify-end gap-2.5">
        {/* Language toggle - smooth animated pill */}
        <div className="relative flex items-center rounded-xl border border-black/8 dark:border-white/8 bg-white/70 dark:bg-black/30 backdrop-blur-xl overflow-hidden shadow-sm">
          <motion.div
            className="absolute top-1 bottom-1 rounded-lg"
            style={{ backgroundColor: themeColor }}
            animate={{
              left: language === 'en' ? '4px' : 'calc(50% + 2px)',
              width: 'calc(50% - 6px)',
            }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          />
          <button
            onClick={() => setLanguage('en')}
            className={`relative z-10 px-3 py-2 text-[11px] font-bold transition-colors duration-200 rounded-lg ${
              language === 'en' ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            ENG
          </button>
          <button
            onClick={() => setLanguage('de')}
            className={`relative z-10 px-3 py-2 text-[11px] font-bold transition-colors duration-200 rounded-lg ${
              language === 'de' ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            GER
          </button>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/70 dark:bg-black/30 backdrop-blur-xl border border-black/8 dark:border-white/8 shadow-sm text-gray-700 dark:text-gray-300 hover:scale-110 transition-transform"
        >
          <motion.div
            animate={{ rotate: isDarkMode ? 180 : 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </motion.div>
        </button>
      </div>
    </nav>
  );
}

function NavLink({ to, children, current }: { to: string; children: React.ReactNode; current: boolean }) {
  const { themeColor } = useStore();
  return (
    <Link
      to={to}
      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
        current
          ? 'text-white shadow-md'
          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
      }`}
      style={current ? { backgroundColor: themeColor, boxShadow: `0 4px 14px ${themeColor}50` } : {}}
    >
      {children}
    </Link>
  );
}
