// DarkOS – i18n + Theme

// ── Theme ────────────────────────────────────────────────────
// Default: system preference, override saved in localStorage
const savedTheme = localStorage.getItem('darkos-theme');
const systemDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentTheme  = savedTheme || (systemDark ? 'dark' : 'light');

const THEMES = {
  dark: {
    '--bg':        '#080c14',
    '--bg2':       '#0d1220',
    '--surface':   '#111827',
    '--surface2':  '#1a2236',
    '--border':    'rgba(255,255,255,0.07)',
    '--text':      '#e8ecf4',
    '--text-dim':  '#6b7a99',
    '--accent':    '#7f5af0',
    '--accent2':   '#2cb67d',
    '--accent3':   '#ff4757',
    '--glow':      'rgba(127,90,240,0.25)',
    '--shadow':    '0 4px 24px rgba(0,0,0,0.3)',
    '--shadow-lg': '0 12px 48px rgba(127,90,240,0.2)',
  },
  light: {
    '--bg':        '#f0f2f7',
    '--bg2':       '#e4e8f2',
    '--surface':   '#ffffff',
    '--surface2':  '#f7f9fc',
    '--border':    'rgba(0,0,0,0.08)',
    '--text':      '#0d0f1a',
    '--text-dim':  '#6b7280',
    '--accent':    '#5b3de8',
    '--accent2':   '#0ea5a0',
    '--accent3':   '#e84040',
    '--glow':      'rgba(91,61,232,0.15)',
    '--shadow':    '0 4px 24px rgba(0,0,0,0.07)',
    '--shadow-lg': '0 12px 48px rgba(91,61,232,0.12)',
  }
};

function applyTheme(theme) {
  const vars = THEMES[theme] || THEMES.dark;
  const root = document.documentElement;

  // Set all CSS variables directly - most reliable approach
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));

  // Button icon
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';

  // Nav background (can't be a CSS variable easily)
  const nav = document.querySelector('.nav');
  if (nav) nav.style.background = theme === 'light'
    ? 'rgba(240,242,247,0.88)'
    : 'rgba(8,12,20,0.85)';

  // Logo swap
  const logoSrc = theme === 'light' ? 'logo_white.png' : 'logo.png';
  document.querySelectorAll('.nav-logo, .hero-logo, .footer-logo').forEach(img => {
    img.src = img.src.includes('logo_white')
      ? img.src.replace('logo_white.png', logoSrc)
      : img.src.replace('logo.png', logoSrc);
  });
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('darkos-theme', currentTheme);
  applyTheme(currentTheme);
}

// System preference change (only if user never manually toggled)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('darkos-theme')) {
    currentTheme = e.matches ? 'dark' : 'light';
    applyTheme(currentTheme);
  }
});

// ── Language ─────────────────────────────────────────────────
let currentLang = localStorage.getItem('darkos-lang') || 'en';

const UI_LABELS = {
  en: { 'stat.members':'Members','stat.tickets':'Tickets','stat.messages':'Messages','stat.joins':'Joins','stat.leaves':'Leaves','stat.version':'Version' },
  de: { 'stat.members':'Mitglieder','stat.tickets':'Tickets','stat.messages':'Nachrichten','stat.joins':'Beitritte','stat.leaves':'Abgänge','stat.version':'Version' }
};

const TEXTS = {
  en: {
    heroSub:      'Made with love for the Team Darkness community.',
    communityBtn: '💬 Join Community',
    statsTitle:   'Live Statistics',
    statsLive:    'Updated in real time',
    twitchTitle:  'Follow us on Twitch',
    footerCopy:   '© 2026 DarkOS. All rights reserved.',
  },
  de: {
    heroSub:      'Gemacht mit Liebe für die Team Darkness community.',
    communityBtn: '💬 Community beitreten',
    statsTitle:   'Live Statistiken',
    statsLive:    'Wird in Echtzeit aktualisiert',
    twitchTitle:  'Folge uns auf Twitch',
    footerCopy:   '© 2026 DarkOS. Alle Rechte vorbehalten.',
  }
};

function setText(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.textContent = val;
}

function applyPage() {
  const C = window.DARKOS;
  const t = TEXTS[currentLang] || TEXTS.en;
  const labels = UI_LABELS[currentLang] || UI_LABELS.en;

  if (C) {
    // Colors are defined in CSS :root / html.light-mode
    // Do NOT use style.setProperty - it overrides CSS class variables

    setText('navBotName',  C.botName);
    setText('heroTitle',   C.botName);
    setText('heroBadge',   'v' + C.botVersion + ' · ' + (currentLang === 'de' ? 'Jetzt Live' : 'Now Live'));
    setText('statVersion', C.botVersion);
    setText('footerBrand', C.botName);
    document.title = C.botName + ' – Discord Bot';

    const cb = document.getElementById('communityBtn');
    if (cb) { cb.href = C.links.communityServer; cb.textContent = t.communityBtn; }
    const fc = document.getElementById('footerCommunity');
    const fg = document.getElementById('footerGithub');
    if (fc) fc.href = C.links.communityServer;
    if (fg) fg.href = C.links.github;
  }

  document.querySelectorAll('[data-key]').forEach(el => {
    const k = el.getAttribute('data-key');
    if (labels[k]) el.textContent = labels[k];
  });

  setText('heroSub',     t.heroSub);
  setText('statsTitle',  t.statsTitle);
  setText('statsLive',   t.statsLive);
  setText('twitchTitle', t.twitchTitle);
  setText('footerCopy',  t.footerCopy);

  const langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.textContent = currentLang === 'en' ? 'ENG' : 'DEU';
}

function toggleLang() {
  currentLang = currentLang === 'en' ? 'de' : 'en';
  localStorage.setItem('darkos-lang', currentLang);
  applyPage();
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  applyPage();
});
