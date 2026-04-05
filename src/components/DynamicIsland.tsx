import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Sparkles, Egg, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

export default function DynamicIsland() {
  const { botStatus, botVersion, easterEggUnlocked, themeColor } = useStore();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newsIndex, setNewsIndex] = useState(0);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controls = useAnimation();

  const newsItems = [
    'v2.4.1 — Team Darkness Bot is active',
    'New: High-fidelity statistics tracking',
    'Exclusive Twitch integration for xDarkNeko_',
    'Join the Team Darkness community on Discord',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setIsExpanded(true), 180);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setIsExpanded(false), 200);
  };

  const handleClick = async () => {
    // Bounce animation on click
    await controls.start({
      scale: [1, 0.93, 1.06, 0.97, 1],
      y: [0, 2, -4, 1, 0],
      transition: { duration: 0.45, ease: 'easeInOut' },
    });
  };

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] flex justify-center w-full pointer-events-none">
      <motion.div
        layout
        animate={controls}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="pointer-events-auto cursor-pointer select-none"
        style={{ originY: 0 }}
      >
        <motion.div
          layout
          className="bg-black/92 text-white overflow-hidden shadow-2xl backdrop-blur-3xl border border-white/10 flex flex-col"
          style={{
            borderRadius: 32,
            boxShadow: isExpanded
              ? `0 20px 60px -10px ${themeColor}55, 0 0 0 1px ${themeColor}22`
              : '0 8px 32px -6px rgba(0,0,0,0.6)',
          }}
          animate={{
            width: isExpanded ? 400 : 220,
            height: isExpanded ? 'auto' : 44,
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        >
          {/* Compact bar — always visible */}
          <motion.div layout className="flex items-center justify-between px-4 h-11 w-full shrink-0">
            {/* Bot status dot + label */}
            <div className="flex items-center gap-2">
              <div className="relative flex h-2.5 w-2.5">
                {botStatus === 'LIVE' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    botStatus === 'LIVE' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
              </div>
              <span className="text-[11px] font-semibold tracking-wide text-white/80 whitespace-nowrap">
                {botStatus === 'LIVE' ? t('live') : t('offline')}
              </span>
            </div>

            {/* Version + Easter egg indicator */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/50">{botVersion}</span>
              {easterEggUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2 }}
                  title="Easter Egg unlocked!"
                >
                  <Egg size={13} className="text-yellow-400" />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.05 } }}
                exit={{ opacity: 0 }}
                className="px-4 pb-4 pt-1 flex flex-col gap-3"
              >
                {/* Divider */}
                <div className="w-full h-px bg-white/8" />

                {/* Live news ticker */}
                <div className="flex items-start gap-2">
                  <Newspaper size={13} className="mt-0.5 shrink-0 text-white/40" />
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={newsIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="text-[11px] text-white/60 leading-snug"
                    >
                      {newsItems[newsIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Status row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: botStatus === 'LIVE' ? '#22c55e' : '#ef4444' }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                      Bot {botStatus === 'LIVE' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <Link
                    to="/updates"
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full transition-colors"
                    style={{ backgroundColor: `${themeColor}22`, color: themeColor }}
                    onClick={() => setIsExpanded(false)}
                  >
                    <Sparkles size={10} />
                    Changelog
                  </Link>
                </div>

                {/* Easter egg hint */}
                {easterEggUnlocked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 rounded-xl px-3 py-2"
                    style={{ backgroundColor: `${themeColor}18`, border: `1px solid ${themeColor}30` }}
                  >
                    <Egg size={12} style={{ color: themeColor }} />
                    <span className="text-[10px] font-bold" style={{ color: themeColor }}>
                      Easter Egg Unlocked! 🎉
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
