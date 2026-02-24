// DarkOS – i18n + Config Renderer
let currentLang = localStorage.getItem('darkos-lang') || 'en';

const UI_LABELS = {
  en: { 'stat.members':'Members','stat.tickets':'Tickets','stat.messages':'Messages','stat.joins':'Joins','stat.leaves':'Leaves','stat.version':'Version' },
  de: { 'stat.members':'Mitglieder','stat.tickets':'Tickets','stat.messages':'Nachrichten','stat.joins':'Beitritte','stat.leaves':'Abgänge','stat.version':'Version' }
};

function setText(id, val) { const el = document.getElementById(id); if (el && val !== undefined) el.textContent = val; }

function applyPage() {
  const C = window.DARKOS;
  if (!C) return;
  const lg = currentLang;
  const t  = C.landing[lg] || C.landing.en;

  // CSS color vars
  document.documentElement.style.setProperty('--accent',  C.colors.primary);
  document.documentElement.style.setProperty('--accent2', C.colors.secondary);
  document.documentElement.style.setProperty('--accent3', C.colors.danger);
  document.documentElement.style.setProperty('--glow',    C.colors.primary + '55');

  // Static UI labels
  const labels = UI_LABELS[lg] || UI_LABELS.en;
  document.querySelectorAll('[data-key]').forEach(el => {
    const k = el.getAttribute('data-key');
    if (labels[k]) el.textContent = labels[k];
  });

  // Nav & footer brand
  const nb = document.getElementById('navBotName');
  if (nb) nb.textContent = C.botName;

  // Hero
  setText('heroBadge', 'v' + C.botVersion + ' · ' + (lg === 'de' ? 'Jetzt Live' : 'Now Live'));
  const ht = document.getElementById('heroTitle');
  if (ht) { ht.textContent = C.botName; ht.dataset.text = C.botName; }
  setText('heroSub', t.heroSub);

  // Community button
  const cb = document.getElementById('communityBtn');
  if (cb) { cb.href = C.links.communityServer; cb.textContent = t.communityBtn; }

  setText('statVersion', C.botVersion);

  // Stats section
  setText('statsTitle', t.statsTitle || '');
  setText('statsLive',  t.statsLive  || '');

  // Team CTA
  setText('teamCtaTitle', lg === 'de' ? 'Unser Team' : 'Our Team');
  setText('teamCtaSub',   lg === 'de' ? 'Lerne die Leute hinter DarkOS kennen.' : 'Meet the people behind DarkOS.');
  setText('teamCtaBtn',   lg === 'de' ? 'Team ansehen' : 'View Team');

  // Footer
  setText('footerBrand', '⚡ ' + C.botName + ' v' + C.botVersion);
  setText('footerCopy',  t.footerCopy || '');
  const fc = document.getElementById('footerCommunity');
  const fg = document.getElementById('footerGithub');
  if (fc) fc.href = C.links.communityServer;
  if (fg) fg.href = C.links.github;

  // Admin dashboard OAuth link
  const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${C.clientId}&response_type=code&redirect_uri=${encodeURIComponent(window.location.origin + window.location.pathname.replace('index.html','') + 'callback.html')}&scope=identify+guilds`;
  window._oauthUrl = oauthUrl;

  document.title = C.botName + ' – Discord Bot';
}

function toggleLang() {
  currentLang = currentLang === 'en' ? 'de' : 'en';
  localStorage.setItem('darkos-lang', currentLang);
  const btn = document.getElementById('langToggle');
  if (btn) btn.innerHTML = currentLang === 'en' ? '🇩🇪' : '🇺🇸';
  applyPage();
}

function t(key) { return (UI_LABELS[currentLang] || UI_LABELS.en)[key] || key; }

document.addEventListener('DOMContentLoaded', function() {
  if (currentLang === 'de') {
    const btn = document.getElementById('langToggle');
    if (btn) btn.innerHTML = '🇬🇧';
  }
  applyPage();
});
