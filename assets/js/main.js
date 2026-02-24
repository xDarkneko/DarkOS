// DarkOS – Main JS

// ── Intersection Observer (animate in) ────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.stat-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ── Smooth scroll – nur für echte Seitenanker ─────────────────
// FIX: Nur Anker die wirklich auf der Seite existieren, nicht externe Links!
document.querySelectorAll('a[href^="#"]').forEach(link => {
  const targetId = link.getAttribute('href');
  if (targetId === '#' || !document.querySelector(targetId)) return; // skip leere/externe
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Badge typing – läuft NACH i18n (DOMContentLoaded) ─────────
document.addEventListener('DOMContentLoaded', () => {
  // Kurz warten bis applyPage() den Badge-Text gesetzt hat
  setTimeout(() => {
    const badge = document.querySelector('.hero-badge');
    if (!badge) return;
    const text = badge.textContent;
    if (!text || text === 'Loading...') return;
    badge.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) { badge.textContent += text[i++]; setTimeout(type, 35); }
    };
    type();
  }, 100);
});
