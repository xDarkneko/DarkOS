import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Newspaper, ListChecks } from 'lucide-react';
import clsx from 'clsx';
import { getMergedChangelogs, getMergedNews } from '../content/siteContent';
import { useTranslation } from '../hooks/useTranslation';

export default function Updates() {
  const [activeTab, setActiveTab] = useState<'news' | 'changelog'>('news');
  const { themeColor } = useStore();
  const { t } = useTranslation();
  const news = getMergedNews();
  const changelogs = getMergedChangelogs();

  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {t('latestNews')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('updatesDesc')}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-white/40 dark:bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl max-w-sm mx-auto mb-12 border border-black/5 dark:border-white/10 relative">
        <button
          onClick={() => setActiveTab('news')}
          className={clsx(
            "flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 relative z-10 transition-colors",
            activeTab === 'news' ? "text-white" : "text-gray-600 dark:text-gray-400"
          )}
        >
          <Newspaper size={18} /> {t('news')}
        </button>
        <button
          onClick={() => setActiveTab('changelog')}
          className={clsx(
            "flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 relative z-10 transition-colors",
            activeTab === 'changelog' ? "text-white" : "text-gray-600 dark:text-gray-400"
          )}
        >
          <ListChecks size={18} /> {t('changelogs')}
        </button>
        
        {/* Animated active pill */}
        <motion.div
          layoutId="activeTabUpdates"
          className="absolute top-1.5 bottom-1.5 w-[calc(50%-8px)] rounded-xl"
          style={{ 
            backgroundColor: themeColor,
            left: activeTab === 'news' ? '6px' : 'calc(50% + 2px)'
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {activeTab === 'news' ? (
            <div className="space-y-6">
              {news.map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.id}
                  className="group relative overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/45 backdrop-blur-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_25%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex items-center gap-4 mb-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                      style={{ backgroundColor: themeColor }}
                    >
                      {item.type}
                    </span>
                    <span className="text-sm font-medium text-gray-500">{item.date}</span>
                  </div>
                  <h3 className="relative text-2xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="relative text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{item.content}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {changelogs.map((log, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={log.version}
                  className="relative pl-8 md:pl-0"
                >
                  <div className="hidden md:flex absolute left-0 top-0 bottom-0 w-px bg-black/10 dark:bg-white/10" />
                  <div className="md:ml-12 relative overflow-hidden bg-white/70 dark:bg-black/45 backdrop-blur-2xl rounded-[2rem] p-8 border border-black/5 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_25%)]" />
                    <div 
                      className="absolute -left-[3.5rem] top-8 w-4 h-4 rounded-full hidden md:block ring-4 ring-white dark:ring-[#09090b]"
                      style={{ backgroundColor: themeColor }}
                    />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <h3 className="text-3xl font-mono font-bold text-gray-900 dark:text-white">{log.version}</h3>
                        <span className="px-2 py-1 bg-black/5 dark:bg-white/10 rounded-lg text-xs font-bold text-gray-500 dark:text-gray-400">
                          {log.platform}
                        </span>
                      </div>
                      <span className="text-gray-500 dark:text-gray-500 font-medium">{log.date}</span>
                    </div>

                    <ul className="relative space-y-4">
                      {log.changes.map((change, j) => (
                        <li key={j} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                          <div 
                            className="w-2 h-2 rounded-full mt-2.5 shrink-0 shadow-[0_0_12px_currentColor]"
                            style={{ backgroundColor: themeColor }}
                          />
                          <span className="text-lg">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
