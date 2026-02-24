// ============================================================
//  DarkOS – Main JS (animations, interactions)
// ============================================================

// ── Intersection Observer (animate in) ────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feat-card, .stat-card, .cmd-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ── Number counter animation ───────────────────────────────────
function animateNumber(el, target) {
  const duration = 1200;
  const start    = performance.now();
  const from     = 0;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(from + (target - from) * ease);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Re-animate when stats load
window.onStatsLoaded = (data) => {
  const pairs = [
    ['statMembers', data.members],
    ['statTickets', data.ticketCount],
    ['statMessages', data.msgCount],
  ];
  pairs.forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && typeof val === 'number') animateNumber(el, val);
  });
};

// ── Smooth scroll for nav links ────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Terminal typing effect for hero badge ─────────────────────
const badge = document.querySelector('.hero-badge');
if (badge) {
  const text = badge.textContent;
  badge.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      badge.textContent += text[i++];
      setTimeout(type, 40);
    }
  };
  setTimeout(type, 400);
}
