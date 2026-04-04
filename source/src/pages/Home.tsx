import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import StatsCard from '../components/StatsCard';
import { Users, Zap, Code2, MessageSquare, Ticket, UserPlus, Tv } from 'lucide-react';
import { useStore } from '../store/useStore';
import TwitchStream from '../components/TwitchStream';
import { useTranslation } from '../hooks/useTranslation';

export default function Home() {
  const { themeColor, easterEggUnlocked } = useStore();
  const [showEaster, setShowEaster] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="inline-block px-4 py-1.5 rounded-full bg-white/40 dark:bg-black/20 backdrop-blur-md border border-black/10 dark:border-white/10 mb-6 text-sm font-semibold"
          style={{ color: themeColor }}
        >
          {t('heroTag')}
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
          Team <br className="hidden md:block"/>
          <span 
            className="text-transparent bg-clip-text bg-gradient-to-r"
            style={{ backgroundImage: `linear-gradient(to right, ${themeColor}, #a855f7)` }}
          >
            Darkness Bot
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          {t('heroDesc')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="https://discord.gg/team-darkness" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-2xl font-bold text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-lg w-full sm:w-auto"
            style={{ backgroundColor: themeColor }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            {t('joinBtn')}
          </a>
        </div>

        {/* Easter Egg Visual */}
        {easterEggUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-8 relative"
          >
            <motion.div
              className="absolute inset-x-[-24px] top-[-18px] h-24 rounded-full blur-3xl opacity-40"
              style={{ background: `radial-gradient(circle, ${themeColor}66, transparent 70%)` }}
              animate={{ opacity: [0.15, 0.45, 0.15], scale: [0.96, 1.06, 0.96] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.button
              onClick={() => setShowEaster(!showEaster)}
              className="relative z-10 text-3xl"
              animate={{ rotate: [0, 12, -12, 0], y: [0, -2, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              🥚
            </motion.button>
            <AnimatePresence>
              {showEaster && (
                <motion.div
                  initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                  className="relative z-10 mt-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl px-4 py-3 text-sm text-gray-600 dark:text-gray-300 shadow-xl"
                >
                  {t('easterEggAwake')}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Cards Section */}
      <div className="w-full mb-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <span className="w-2 h-6 rounded-full" style={{ backgroundColor: themeColor }} />
          {t('statsTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <StatsCard delay={0.1} metricKey="users" title={t('totalUsers')} value="2.4K" icon={Users} />
          <StatsCard delay={0.2} metricKey="status" title={t('botStatus')} value={t('live')} icon={Zap} />
          <StatsCard delay={0.3} metricKey="commands" title={t('commandsRun')} value="84.2K" icon={Code2} />
          <StatsCard delay={0.4} metricKey="tickets" title={t('openTickets')} value="1,240" icon={Ticket} />
          <StatsCard delay={0.5} metricKey="messages" title={t('messagesProcessed')} value="412K" icon={MessageSquare} />
          <StatsCard delay={0.6} metricKey="joins" title={t('joinLeaveStats')} value="+1,203" icon={UserPlus} />
        </div>
      </div>

      {/* Twitch Integration Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full mb-20"
      >
        <div className="flex items-center gap-3 mb-8">
          <span className="w-2 h-6 rounded-full" style={{ backgroundColor: themeColor }} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Tv size={24} style={{ color: themeColor }} /> {t('twitchStream')}
          </h2>
        </div>
        <TwitchStream channel="xDarkNeko_" themeColor={themeColor} />
      </motion.div>
    </div>
  );
}
