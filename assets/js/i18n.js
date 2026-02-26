// DarkOS – i18n + Theme

// ── Theme ─────────────────────────────────────────────────────
let currentTheme = localStorage.getItem('darkos-theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function applyTheme(theme) {
  // Set class on body – CSS uses body.light for light mode
  if (theme === 'light') {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  } else {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  }

  // Button label
  var btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';

  // Logo
  var logoFile = theme === 'light' ? 'logo_white.png' : 'logo.png';
  document.querySelectorAll('.nav-logo, .hero-logo, .footer-logo').forEach(function(img) {
    img.src = img.src.replace('logo.png', logoFile).replace('logo_white.png', logoFile);
  });
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('darkos-theme', currentTheme);
  applyTheme(currentTheme);
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
  if (!localStorage.getItem('darkos-theme')) {
    currentTheme = e.matches ? 'dark' : 'light';
    applyTheme(currentTheme);
  }
});

// ── Language ──────────────────────────────────────────────────
let currentLang = localStorage.getItem('darkos-lang') || 'en';

const TEXTS = {
  en: {
    heroSub:      'Made with love for the Team Darkness community.',
    communityBtn: '💬 Join Community',
    statsTitle:   'Live Statistics',
    statsLive:    'Updated in real time',
    twitchTitle:  'Follow us on Twitch',
    footerCopy:   '© 2026 DarkOS.',
    members: 'Members', tickets: 'Tickets', messages: 'Messages',
    joins: 'Joins', leaves: 'Leaves', version: 'Version',
  },
  de: {
    heroSub:      'Gemacht mit Liebe für die Team Darkness Community.',
    communityBtn: '💬 Community beitreten',
    statsTitle:   'Live Statistiken',
    statsLive:    'Wird in Echtzeit aktualisiert',
    twitchTitle:  'Folge uns auf Twitch',
    footerCopy:   '© 2026 DarkOS.',
    members: 'Mitglieder', tickets: 'Tickets', messages: 'Nachrichten',
    joins: 'Beitritte', leaves: 'Abgänge', version: 'Version',
  }
};

function setText(id, val) {
  var el = document.getElementById(id);
  if (el && val !== undefined) el.textContent = val;
}

function applyPage() {
  var C = window.DARKOS;
  var t = TEXTS[currentLang] || TEXTS.en;

  if (C) {
    setText('navBotName', C.botName);
    setText('heroTitle',  C.botName);
    setText('heroBadge',  'v' + C.botVersion + ' · ' + (currentLang === 'de' ? 'Jetzt Live' : 'Now Live'));
    setText('statVersion', C.botVersion);
    setText('footerBrand', C.botName);
    document.title = C.botName + ' – Discord Bot';
    var cb = document.getElementById('communityBtn');
    if (cb) { cb.href = C.links.communityServer; cb.textContent = t.communityBtn; }
    var fc = document.getElementById('footerCommunity');
    var fg = document.getElementById('footerGithub');
    if (fc) fc.href = C.links.communityServer;
    if (fg) fg.href = C.links.github;
  }

  document.querySelectorAll('[data-key]').forEach(function(el) {
    var k = el.getAttribute('data-key').replace('stat.', '');
    if (t[k]) el.textContent = t[k];
  });

  setText('heroSub',    t.heroSub);
  setText('statsTitle', t.statsTitle);
  setText('statsLive',  t.statsLive);
  setText('twitchTitle',t.twitchTitle);
  setText('footerCopy', t.footerCopy);

  var langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.textContent = currentLang === 'en' ? 'ENG' : 'DEU';
}

function toggleLang() {
  currentLang = currentLang === 'en' ? 'de' : 'en';
  localStorage.setItem('darkos-lang', currentLang);
  applyPage();
}

// Init – runs after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  applyTheme(currentTheme);
  applyPage();
});
