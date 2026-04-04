import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';

// Components
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import MagicalCursor from './components/MagicalCursor';
import TopographicBackground from './components/TopographicBackground';
import DynamicIsland from './components/DynamicIsland';
import EasterEggOverlay from './components/EasterEggOverlay';

// Pages
import Home from './pages/Home';
import Updates from './pages/Updates';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

const pageVariants = {
  initial: { opacity: 0, y: 18, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.42, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(3px)',
    transition: { duration: 0.28, ease: 'easeIn' as const },
  },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen flex flex-col"
      >
        <main className="flex-1 relative z-10 w-full pt-28 md:pt-32">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { isDarkMode } = useStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      * { cursor: none !important; }
      *:focus-visible { outline: 2px solid #8b5cf6; outline-offset: 2px; }
      *:focus:not(:focus-visible) { outline: none; }
      html { scroll-behavior: smooth; }
      ::selection { background-color: rgba(139, 92, 246, 0.3); }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="relative min-h-screen text-gray-900 dark:text-gray-100 font-sans overflow-x-hidden transition-colors duration-700 ease-in-out">
        <TopographicBackground />

        {/* Custom cursor */}
        <MagicalCursor />

        {/* Dynamic Island — topmost */}
        <DynamicIsland />

        {/* Navbar below Dynamic Island */}
        <Navbar />

        <EasterEggOverlay />

        <AnimatedRoutes />

        {/* Bottom nav for mobile */}
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
