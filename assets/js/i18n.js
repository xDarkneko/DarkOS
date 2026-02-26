// DarkOS – i18n + Theme

// ── Theme ────────────────────────────────────────────────────
// Default: system preference, override saved in localStorage
const savedTheme = localStorage.getItem('darkos-theme');
const systemDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentTheme  = savedTheme || (systemDark ? 'dark' : 'light');

function applyTheme(theme) {
  // Direct, no closures
  document.body.classList.toggle('light-mode', theme === 'light');

  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';

  // Logo swap
  const logoSrc = theme === 'light' ? 'logo_white.png' : 'logo.png';
  document.querySelectorAll('.nav-logo, .hero-logo, .footer-logo').forEach(img => {
    img.src = img.src.replace(/logo(_white)?\.png/, logoSrc);
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
    document.documentElement.style.setProperty('--accent',  C.colors.primary);
    document.documentElement.style.setProperty('--accent2', C.colors.secondary);
    document.documentElement.style.setProperty('--accent3', C.colors.danger);
    document.documentElement.style.setProperty('--glow',    C.colors.primary + '40');

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
