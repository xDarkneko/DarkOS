import { motion } from 'framer-motion';
import { Home, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import clsx from 'clsx';
import { useTranslation } from '../hooks/useTranslation';

export default function BottomNav() {
  const location = useLocation();
  const { themeColor } = useStore();
  const { t } = useTranslation();

  const links = [
    { to: '/', icon: Home, label: t('home') },
    { to: '/updates', icon: Zap, label: t('updates') },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden pointer-events-auto">
      <div className="flex items-center gap-2 bg-white/75 dark:bg-black/75 backdrop-blur-xl px-4 py-3 rounded-3xl border border-black/8 dark:border-white/8 shadow-2xl">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={clsx(
                'relative flex flex-col items-center justify-center w-16 h-12 rounded-2xl transition-all duration-300',
                isActive ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bnav-bg"
                  className="absolute inset-0 rounded-2xl -z-10"
                  style={{ backgroundColor: themeColor, boxShadow: `0 4px 14px ${themeColor}50` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={isActive ? 19 : 21} />
              {isActive && (
                <span className="absolute bottom-1.5 text-[9px] font-bold tracking-wider opacity-90">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
