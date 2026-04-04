import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FileText, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { savePublishedChangelogs, savePublishedNews } from '../content/siteContent';

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

export default function Admin() {
  const { themeColor } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'news' | 'changelog'>('news');
  const [loading, setLoading] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [loginError, setLoginError] = useState('');

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

  const OWNER_USERNAME = 'xDarkneko'; // The only allowed GitHub username

  const [githubToken] = useState('');

  const handleGithubLogin = () => {
    if (!githubUsername.trim()) {
      setLoginError('Please enter your GitHub username.');
      return;
    }
    if (!githubToken.trim() || !githubToken.startsWith('ghp_')) {
      setLoginError('Please enter a valid GitHub Personal Access Token (starts with ghp_).');
      return;
    }
    setLoading(true);
    setLoginError('');
    
    setTimeout(() => {
      setLoading(false);
      if (githubUsername.trim().toLowerCase() === OWNER_USERNAME.toLowerCase()) {
        setIsAuthenticated(true);
      } else {
        setLoginError(`Access denied. "${githubUsername}" is not the authorized owner.`);
      }
    }, 1500);
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
    setSavedNews([newEntry, ...savedNews]);
    savePublishedNews([newEntry]);
    setNewsTitle('');
    setNewsContent('');
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
    setSavedChangelogs([newEntry, ...savedChangelogs]);
    savePublishedChangelogs([newEntry]);
    setClVersion('');
    setClChanges(['']);
  };

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
            Sign in with your GitHub username. Only <code className="bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded font-mono text-xs">{OWNER_USERNAME}</code> is authorized.
          </p>
          
          <div className="w-full space-y-4">
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => { setGithubUsername(e.target.value); setLoginError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleGithubLogin()}
              placeholder="GitHub username"
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/50 px-4 py-3 text-gray-900 dark:text-white shadow-sm outline-none ring-0 transition-all placeholder:text-gray-400 focus:border-transparent focus:shadow-[0_0_0_2px_var(--tw-ring-color)] font-medium"
              style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
            />
            <AnimatePresence>
              {loginError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm font-medium"
                >
                  {loginError}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              onClick={handleGithubLogin}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-wait"
              style={{ backgroundColor: themeColor }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> Checking GitHub...
                </span>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Sign in via GitHub
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
      {/* Header */}
        <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-white dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Content Manager
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Logged in as <span className="font-mono font-bold" style={{ color: themeColor }}>{OWNER_USERNAME}</span> · No dev skills required.
          </p>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
        <div className="flex gap-2 mb-8 rounded-[1.5rem] bg-white/45 dark:bg-black/35 p-1.5 backdrop-blur-2xl border border-black/5 dark:border-white/10 w-fit">
        <button
          onClick={() => setActiveTab('news')}
          className={`px-5 py-2.5 rounded-[1rem] font-bold text-sm transition-all ${activeTab === 'news' ? 'text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white bg-transparent'}`}
          style={activeTab === 'news' ? { backgroundColor: themeColor } : {}}
        >
          📰 Publish News
        </button>
        <button
          onClick={() => setActiveTab('changelog')}
          className={`px-5 py-2.5 rounded-[1rem] font-bold text-sm transition-all ${activeTab === 'changelog' ? 'text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white bg-transparent'}`}
          style={activeTab === 'changelog' ? { backgroundColor: themeColor } : {}}
        >
          🔧 Add Changelog
        </button>
      </div>

      {/* Form */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-black/55 backdrop-blur-2xl p-8 rounded-[2rem] border border-black/10 dark:border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.16)]"
      >
        {activeTab === 'news' ? (
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">News Title</label>
              <input 
                type="text" 
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                placeholder="e.g. Halloween Event is Here! 🎃" 
                className="w-full bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-lg font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Type</label>
              <select
                value={newsType}
                onChange={(e) => setNewsType(e.target.value)}
                className="bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 font-medium"
              >
                <option value="Update">Update</option>
                <option value="Event">Event</option>
                <option value="Announcement">Announcement</option>
                <option value="Major Update">Major Update</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Content</label>
              <textarea 
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                placeholder="Write the full news content here..."
                rows={6}
                className="w-full bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 resize-none placeholder:text-gray-400"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[150px]">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Version</label>
                <input 
                  type="text" 
                  value={clVersion}
                  onChange={(e) => setClVersion(e.target.value)}
                  placeholder="e.g. v2.4.2" 
                  className="w-full bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-lg font-bold font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 placeholder:text-gray-400"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Platform</label>
                <select 
                  value={clPlatform}
                  onChange={(e) => setClPlatform(e.target.value)}
                  className="w-full bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 font-semibold"
                >
                  <option value="both">Web & Bot</option>
                  <option value="web">Web Only</option>
                  <option value="bot">Bot Only</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Changes (one per line)</label>
              <div className="space-y-3">
                {clChanges.map((change, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: themeColor }} />
                    <input 
                      type="text" 
                      value={change}
                      onChange={(e) => updateChangeLine(i, e.target.value)}
                      placeholder={`Change #${i + 1}...`} 
                      className="flex-1 bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 placeholder:text-gray-400"
                    />
                    <button 
                      onClick={() => removeChangeLine(i)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={addChangeLine}
                  className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mt-2"
                >
                  <Plus size={16} /> Add another line
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex justify-end gap-3 border-t border-black/10 dark:border-white/10 pt-6">
          <button className="px-5 py-3 rounded-xl font-bold text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2 text-sm">
            <FileText size={16} /> Preview
          </button>
          <button 
            onClick={activeTab === 'news' ? publishNews : publishChangelog}
            className="px-8 py-3 rounded-xl font-bold text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 text-sm"
            style={{ backgroundColor: themeColor }}
          >
            <Save size={16} /> Publish Live
          </button>
        </div>

        {/* Saved entries preview */}
        {savedNews.length > 0 && activeTab === 'news' && (
          <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Saved News ({savedNews.length})</h3>
            <div className="space-y-3">
              {savedNews.map(n => (
                <div key={n.id} className="bg-white/50 dark:bg-black/50 rounded-xl p-4 border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: themeColor }}>{n.type}</span>
                    <span className="text-xs text-gray-400">{n.date}</span>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">{n.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {savedChangelogs.length > 0 && activeTab === 'changelog' && (
          <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Saved Changelogs ({savedChangelogs.length})</h3>
            <div className="space-y-3">
              {savedChangelogs.map(c => (
                <div key={c.id} className="bg-white/50 dark:bg-black/50 rounded-xl p-4 border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono font-bold text-gray-900 dark:text-white">{c.version}</span>
                    <span className="px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded text-[10px] font-bold text-gray-500">{c.platform}</span>
                    <span className="text-xs text-gray-400 ml-auto">{c.date}</span>
                  </div>
                  <ul className="space-y-1">
                    {c.changes.map((ch, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColor }} />
                        {ch}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
