import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FileText, Plus, Trash2, LogOut, ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';
import { savePublishedChangelogs, savePublishedNews } from '../content/siteContent';
import { useTranslation } from '../hooks/useTranslation';

interface AdminNews {
  id: number;
  title: string;
  content: string;
  date: string;
  type: string;
}

interface AdminChangelog {
  id: number;
  version: string;
  date: string;
  platform: 'Web' | 'Bot' | 'Web/Bot';
  changes: string[];
}

const OWNER_USERNAME = 'xDarkneko';
const GITHUB_CLIENT_ID = ''; // Set your GitHub OAuth App Client ID here for production

export default function Admin() {
  const { themeColor } = useStore();
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'news' | 'changelog'>('news');
  const [loading, setLoading] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState('');
  const [loginError, setLoginError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // News form
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsType, setNewsType] = useState('Update');
  const [savedNews, setSavedNews] = useState<AdminNews[]>([]);

  // Changelog form
  const [clVersion, setClVersion] = useState('');
  const [clPlatform, setClPlatform] = useState('both');
  const [clChanges, setClChanges] = useState(['']);
  const [savedChangelogs, setSavedChangelogs] = useState<AdminChangelog[]>([]);

  // Check if returning from GitHub OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      // In production, exchange code for token via your backend
      // For now, we handle GitHub OAuth flow preparation
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check stored session
    const stored = sessionStorage.getItem('td-admin-user');
    if (stored && stored.toLowerCase() === OWNER_USERNAME.toLowerCase()) {
      setIsAuthenticated(true);
      setAuthenticatedUser(stored);
    }
  }, []);

  const handleGithubOAuth = () => {
    if (GITHUB_CLIENT_ID) {
      // Real GitHub OAuth redirect
      const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname);
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=read:user`;
    } else {
      // Fallback: Token-based authentication
      const token = prompt('Enter your GitHub Personal Access Token (ghp_...)');
      if (!token) return;
      
      setLoading(true);
      setLoginError('');
      
      fetch('https://api.github.com/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then(data => {
        setLoading(false);
        if (data.login?.toLowerCase() === OWNER_USERNAME.toLowerCase()) {
          setIsAuthenticated(true);
          setAuthenticatedUser(data.login);
          sessionStorage.setItem('td-admin-user', data.login);
        } else {
          setLoginError(`Access denied. "${data.login}" is not the authorized owner. Only ${OWNER_USERNAME} can access this panel.`);
        }
      })
      .catch(() => {
        setLoading(false);
        setLoginError('Authentication failed. Please check your token and try again.');
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthenticatedUser('');
    sessionStorage.removeItem('td-admin-user');
  };

  const addChangeLine = () => setClChanges([...clChanges, '']);
  const removeChangeLine = (index: number) => {
    if (clChanges.length > 1) setClChanges(clChanges.filter((_, i) => i !== index));
  };
  const updateChangeLine = (index: number, value: string) => {
    const updated = [...clChanges];
    updated[index] = value;
    setClChanges(updated);
  };

  const publishNews = () => {
    if (!newsTitle.trim() || !newsContent.trim()) return;
    const newEntry: AdminNews = {
      id: Date.now(),
      title: newsTitle,
      content: newsContent,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: newsType,
    };
    const updated = [newEntry, ...savedNews];
    setSavedNews(updated);
    savePublishedNews([newEntry]);
    setNewsTitle('');
    setNewsContent('');
    setSuccessMsg(t('success') + '!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const publishChangelog = () => {
    if (!clVersion.trim() || clChanges.every(c => !c.trim())) return;
    const newEntry: AdminChangelog = {
      id: Date.now(),
      version: clVersion,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      platform: clPlatform === 'web' ? 'Web' : clPlatform === 'bot' ? 'Bot' : 'Web/Bot',
      changes: clChanges.filter(c => c.trim()),
    };
    const updated = [newEntry, ...savedChangelogs];
    setSavedChangelogs(updated);
    savePublishedChangelogs([newEntry]);
    setClVersion('');
    setClChanges(['']);
    setSuccessMsg(t('success') + '!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 px-6 max-w-md mx-auto min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/70 dark:bg-black/60 backdrop-blur-xl p-10 rounded-[3rem] border border-black/10 dark:border-white/10 shadow-2xl w-full flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-gray-900 dark:bg-white/10 flex items-center justify-center mb-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Owner Access Only</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-6">
            {t('onlyOwner')}<br/>
            <code className="bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded font-mono text-xs mt-1 inline-block">{OWNER_USERNAME}</code>
          </p>
          
          <AnimatePresence>
            {loginError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-sm font-medium mb-4"
              >
                {loginError}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={handleGithubOAuth}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-wait"
            style={{ backgroundColor: themeColor }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> Authenticating...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Sign in with GitHub
                <ExternalLink size={14} className="opacity-60" />
              </>
            )}
          </button>
          
          <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-4">
            Uses GitHub API to verify your identity.
          </p>
        </motion.div>
      </div>
    );
  }

  // Authenticated Panel
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
      {/* Success notification */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl text-white font-bold shadow-2xl"
            style={{ backgroundColor: themeColor }}
          >
            ✓ {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Manager</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t('login')}: <span className="font-mono font-bold" style={{ color: themeColor }}>{authenticatedUser}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm flex items-center gap-2"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-white/40 dark:bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl max-w-xs mb-10 border border-black/5 dark:border-white/10 relative">
        <button
          onClick={() => setActiveTab('news')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold relative z-10 transition-colors ${activeTab === 'news' ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}
        >
          {t('news')}
        </button>
        <button
          onClick={() => setActiveTab('changelog')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold relative z-10 transition-colors ${activeTab === 'changelog' ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}
        >
          {t('changelogs')}
        </button>
        <motion.div
          className="absolute top-1.5 bottom-1.5 rounded-xl"
          style={{
            backgroundColor: themeColor,
            width: 'calc(50% - 6px)',
            left: activeTab === 'news' ? '6px' : 'calc(50% + 2px)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'news' ? (
          <motion.div
            key="news-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* News Form */}
            <div className="bg-white/70 dark:bg-black/45 backdrop-blur-2xl rounded-[2rem] p-8 border border-black/5 dark:border-white/10 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FileText size={20} style={{ color: themeColor }} /> {t('publishNews')}
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder={t('newsTitle')}
                  className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/30 px-4 py-3 text-gray-900 dark:text-white shadow-sm outline-none transition-all placeholder:text-gray-400 font-medium focus:ring-2"
                  style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
                />

                <textarea
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder={t('newsContent')}
                  rows={4}
                  className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/30 px-4 py-3 text-gray-900 dark:text-white shadow-sm outline-none transition-all placeholder:text-gray-400 font-medium resize-none focus:ring-2"
                  style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
                />

                <select
                  value={newsType}
                  onChange={(e) => setNewsType(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/30 px-4 py-3 text-gray-900 dark:text-white shadow-sm outline-none font-medium"
                >
                  <option value="Update">Update</option>
                  <option value="Feature">Feature</option>
                  <option value="Announcement">Announcement</option>
                  <option value="Fix">Fix</option>
                </select>

                <button
                  onClick={publishNews}
                  className="w-full py-4 rounded-2xl font-bold text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{ backgroundColor: themeColor }}
                >
                  <Save size={18} /> {t('publish')}
                </button>
              </div>
            </div>

            {/* Published News List */}
            {savedNews.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('publishedNews')}</h3>
                {savedNews.map((item) => (
                  <div key={item.id} className="bg-white/50 dark:bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-black/5 dark:border-white/10 flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white mr-2" style={{ backgroundColor: themeColor }}>{item.type}</span>
                      <span className="text-sm text-gray-500">{item.date}</span>
                      <h4 className="font-bold text-gray-900 dark:text-white mt-2">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{item.content}</p>
                    </div>
                    <button
                      onClick={() => setSavedNews(savedNews.filter(n => n.id !== item.id))}
                      className="text-red-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="changelog-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Changelog Form */}
            <div className="bg-white/70 dark:bg-black/45 backdrop-blur-2xl rounded-[2rem] p-8 border border-black/5 dark:border-white/10 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FileText size={20} style={{ color: themeColor }} /> {t('publishChangelog')}
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  value={clVersion}
                  onChange={(e) => setClVersion(e.target.value)}
                  placeholder={t('versionNumber') + ' (e.g. v2.5.0)'}
                  className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/30 px-4 py-3 text-gray-900 dark:text-white shadow-sm outline-none transition-all placeholder:text-gray-400 font-medium font-mono focus:ring-2"
                  style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
                />

                <select
                  value={clPlatform}
                  onChange={(e) => setClPlatform(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/30 px-4 py-3 text-gray-900 dark:text-white shadow-sm outline-none font-medium"
                >
                  <option value="both">{t('webBot')}</option>
                  <option value="web">{t('web')}</option>
                  <option value="bot">{t('bot')}</option>
                </select>

                <div className="space-y-3">
                  {clChanges.map((change, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={change}
                        onChange={(e) => updateChangeLine(i, e.target.value)}
                        placeholder={`${t('changes')} ${i + 1}`}
                        className="flex-1 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/30 px-4 py-3 text-gray-900 dark:text-white shadow-sm outline-none transition-all placeholder:text-gray-400 font-medium focus:ring-2"
                        style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
                      />
                      {clChanges.length > 1 && (
                        <button
                          onClick={() => removeChangeLine(i)}
                          className="px-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addChangeLine}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center gap-2 hover:border-black/20 dark:hover:border-white/20 transition-colors"
                  >
                    <Plus size={16} /> {t('addChange')}
                  </button>
                </div>

                <button
                  onClick={publishChangelog}
                  className="w-full py-4 rounded-2xl font-bold text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{ backgroundColor: themeColor }}
                >
                  <Save size={18} /> {t('publish')}
                </button>
              </div>
            </div>

            {/* Published Changelogs List */}
            {savedChangelogs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('publishedChangelogs')}</h3>
                {savedChangelogs.map((log) => (
                  <div key={log.id} className="bg-white/50 dark:bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-black/5 dark:border-white/10 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono font-bold text-gray-900 dark:text-white">{log.version}</span>
                        <span className="px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded text-xs font-bold text-gray-500">{log.platform}</span>
                        <span className="text-sm text-gray-500">{log.date}</span>
                      </div>
                      <ul className="space-y-1">
                        {log.changes.map((c, j) => (
                          <li key={j} className="text-gray-600 dark:text-gray-400 text-sm flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColor }} />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => setSavedChangelogs(savedChangelogs.filter(cl => cl.id !== log.id))}
                      className="text-red-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
