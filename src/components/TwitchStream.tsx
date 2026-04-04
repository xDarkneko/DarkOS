import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

declare global {
  interface Window {
    Twitch: any;
  }
}

interface TwitchStreamProps {
  channel: string;
  themeColor: string;
}

export default function TwitchStream({ channel, themeColor }: TwitchStreamProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewers, setViewers] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [streamTitle, setStreamTitle] = useState('');
  const [game, setGame] = useState('');

  // Load Twitch Embed
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://embed.twitch.tv/embed/v1.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.Twitch) {
        new window.Twitch.Embed('twitch-embed', {
          channel,
          width: '100%',
          height: 420,
          parent: [window.location.hostname || 'localhost'],
          autoplay: false,
          theme: 'dark',
        });
        setIsLoading(false);
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [channel]);

  // Check live status via multiple APIs for reliability
  useEffect(() => {
    let mounted = true;

    const checkLiveStatus = async () => {
      try {
        // Try multiple sources for live status
        const [uptimeRes, viewersRes] = await Promise.allSettled([
          fetch(`https://decapi.me/twitch/uptime/${channel}`, { cache: 'no-store' }),
          fetch(`https://decapi.me/twitch/viewercount/${channel}`, { cache: 'no-store' }),
        ]);

        if (!mounted) return;

        let uptimeText = '';
        let viewersText = '';

        if (uptimeRes.status === 'fulfilled' && uptimeRes.value.ok) {
          uptimeText = await uptimeRes.value.text();
        }
        if (viewersRes.status === 'fulfilled' && viewersRes.value.ok) {
          viewersText = await viewersRes.value.text();
        }

        // Determine live status
        const offlineKeywords = ['offline', 'not live', 'no stream', 'error', 'not found', ''];
        const isUptimeOffline = offlineKeywords.some(kw => uptimeText.toLowerCase().includes(kw));
        const isViewersOffline = offlineKeywords.some(kw => viewersText.toLowerCase().includes(kw)) || viewersText === '0';

        // Stream is live if uptime shows time AND viewer count is a number > 0
        const isCurrentlyLive = !isUptimeOffline && !isViewersOffline;
        
        setIsLive(isCurrentlyLive);

        if (isCurrentlyLive) {
          const viewerCount = parseInt(viewersText.replace(/[^0-9]/g, ''), 10) || 0;
          setViewers(viewerCount);
        } else {
          setViewers(0);
        }

        // Fetch followers (independent of live status)
        try {
          const followersRes = await fetch(`https://decapi.me/twitch/followcount/${channel}`, { cache: 'no-store' });
          if (followersRes.ok && mounted) {
            const followersText = await followersRes.text();
            setFollowers(parseInt(followersText.replace(/[^0-9]/g, ''), 10) || 0);
          }
        } catch {
          // Followers fetch failed, keep current value
        }

        // Fetch stream title and game
        try {
          const [titleRes, gameRes] = await Promise.allSettled([
            fetch(`https://decapi.me/twitch/title/${channel}`, { cache: 'no-store' }),
            fetch(`https://decapi.me/twitch/game/${channel}`, { cache: 'no-store' }),
          ]);

          if (mounted) {
            if (titleRes.status === 'fulfilled' && titleRes.value.ok) {
              const titleText = await titleRes.value.text();
              setStreamTitle(titleText.trim() || (isCurrentlyLive ? 'Live now' : t('streamOffline')));
            }
            if (gameRes.status === 'fulfilled' && gameRes.value.ok) {
              const gameText = await gameRes.value.text();
              setGame(gameText.trim() || (isCurrentlyLive ? 'Just Chatting' : t('offline')));
            }
          }
        } catch {
          // Title/game fetch failed
        }

      } catch {
        if (!mounted) return;
        setIsLive(false);
        setViewers(0);
      }
    };

    checkLiveStatus();
    const interval = window.setInterval(checkLiveStatus, 30000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [channel, t]);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-black/10 dark:border-white/10 bg-zinc-950 text-white shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(145,70,255,0.22),transparent_24%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.18),transparent_20%)]" />

      <div className="relative flex flex-col gap-4 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9146FF] to-cyan-500 text-sm font-black shadow-lg shadow-purple-500/20">
            TD
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-white">xDarkNeko_</h3>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.28em] ${
                isLive === null 
                  ? 'bg-yellow-500/15 text-yellow-400' 
                  : isLive 
                    ? 'bg-red-500/15 text-red-400' 
                    : 'bg-white/10 text-white/55'
              }`}>
                {isLive === null ? t('checking') : isLive ? t('live') : t('offline')}
              </span>
            </div>
            <p className="truncate text-sm text-white/60">{streamTitle || (isLive ? 'Live now' : t('streamOffline'))}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">{t('followers')}</p>
            <p className="mt-1 text-sm font-semibold text-white">{followers.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">{t('viewers')}</p>
            <p className="mt-1 text-sm font-semibold text-white">{isLive ? viewers.toLocaleString() : '—'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">{t('status')}</p>
            <p className="mt-1 text-sm font-semibold text-white">{game || '—'}</p>
          </div>
        </div>
      </div>

      <div className="relative" style={{ minHeight: '420px' }}>
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/90">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white"
            />
          </div>
        )}

        <div id="twitch-embed" ref={containerRef} className="relative z-0 w-full" style={{ minHeight: '420px' }} />

        {isLive === false && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950/96 via-zinc-950/90 to-[#24123e]/92 px-8 text-center"
          >
            <motion.div
              animate={{ y: [0, -6, 0], scale: [1, 1.03, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/5 text-3xl shadow-[0_0_50px_rgba(145,70,255,0.2)]"
            >
              📺
            </motion.div>
            <h3 className="text-3xl font-semibold text-white">{t('streamOffline')}</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
              {t('followNotification')}
            </p>
            <a
              href="https://twitch.tv/xDarkNeko_"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#9146FF', boxShadow: '0 16px 40px rgba(145,70,255,0.28)' }}
            >
              {t('openTwitchChannel')}
            </a>
          </motion.div>
        )}

        {isLive && (
          <div
            className="pointer-events-none absolute -inset-1 rounded-[2rem] opacity-30 blur-2xl"
            style={{ backgroundColor: themeColor }}
          />
        )}
      </div>
    </div>
  );
}
