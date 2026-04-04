import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Footer() {
  const [textIndex, setTextIndex] = useState(0);
  const { themeColor, language, isDarkMode } = useStore();

  const textsEn = [
    'Made with love for the Team Darkness community.',
    'Empowering the darkest corners of Discord.',
    'Built by xDarkneko for the community.',
    'Innovation meets community.',
    'One server. One bot. One family.',
  ];

  const textsDe = [
    'Mit Liebe für die Team Darkness Community gebaut.',
    'Die dunkelsten Ecken von Discord erleuchtet.',
    'Von xDarkneko für die Community erschaffen.',
    'Innovation trifft auf Gemeinschaft.',
    'Ein Server. Ein Bot. Eine Familie.',
  ];

  const texts = language === 'en' ? textsEn : textsDe;

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <footer className="w-full py-8 px-6 mt-20 relative z-40 border-t border-black/5 dark:border-white/5 bg-white/30 dark:bg-black/30 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Rotating text */}
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart size={15} fill={themeColor} color={themeColor} />
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              {texts[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Right side: logo + copyright + hidden admin */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <img 
               src={isDarkMode ? "/images/logo.png" : "/images/logo_white.png"}
               alt="Team Darkness Logo"
               className="w-8 h-8 object-contain opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
             />
             <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
               &copy; {new Date().getFullYear()} Team Darkness
             </p>
          </div>
          {/* Subtle admin link — small and unobtrusive */}
          <Link
            to="/admin"
            className="text-[10px] text-gray-300 dark:text-gray-700 hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300 font-mono tracking-widest"
            title="Admin"
          >
            ·admin·
          </Link>
        </div>
      </div>
    </footer>
  );
}
