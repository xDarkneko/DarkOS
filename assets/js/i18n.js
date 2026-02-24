// DarkOS – i18n + Config Renderer
let currentLang = localStorage.getItem('darkos-lang') || 'en';

const UI_LABELS = {
  en: { 'stat.members':'Members','stat.tickets':'Tickets','stat.messages':'Messages','stat.joins':'Joins','stat.leaves':'Leaves','stat.version':'Version' },
  de: { 'stat.members':'Mitglieder','stat.tickets':'Tickets','stat.messages':'Nachrichten','stat.joins':'Beitritte','stat.leaves':'Abgänge','stat.version':'Version' }
};

function setText(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.textContent = val;
}

function updateFlagBtn() {
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = currentLang === 'en' ? '🇺🇸' : '🇩🇪';
}

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

  // data-key labels
  const labels = UI_LABELS[lg] || UI_LABELS.en;
  document.querySelectorAll('[data-key]').forEach(el => {
    const k = el.getAttribute('data-key');
    if (labels[k]) el.textContent = labels[k];
  });

  // Nav brand
  setText('navBotName', C.botName);

  // Hero
  setText('heroBadge', 'v' + C.botVersion + ' · ' + (lg === 'de' ? 'Jetzt Live' : 'Now Live'));
  const ht = document.getElementById('heroTitle');
  if (ht) { ht.textContent = C.botName; ht.dataset.text = C.botName; }
  setText('heroSub', t.heroSub);

  // Community button
  const cb = document.getElementById('communityBtn');
  if (cb) { cb.href = C.links.communityServer; cb.textContent = t.communityBtn; }

  setText('statVersion', C.botVersion);
  setText('statsTitle',  t.statsTitle || '');
  setText('statsLive',   t.statsLive  || '');

  // Footer
  setText('footerBrand', '⚡ ' + C.botName + ' v' + C.botVersion);
  setText('footerCopy',  t.footerCopy || '');
  const fc = document.getElementById('footerCommunity');
  const fg = document.getElementById('footerGithub');
  if (fc) fc.href = C.links.communityServer;
  if (fg) fg.href = C.links.github;

  document.title = C.botName + ' – Discord Bot';

  updateFlagBtn();
}

function toggleLang() {
  currentLang = currentLang === 'en' ? 'de' : 'en';
  localStorage.setItem('darkos-lang', currentLang);
  updateFlagBtn();
  applyPage();
}

document.addEventListener('DOMContentLoaded', function() {
  updateFlagBtn();
  applyPage();
});
