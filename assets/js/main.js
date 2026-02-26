// DarkOS – Main JS

// ── Theme toggle ───────────────────────────────────────────────
function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.contains('light');

  body.classList.toggle('light', !isLight);
  localStorage.setItem('darkos-theme', isLight ? 'dark' : 'light');

  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = isLight ? '🌙' : '☀️';

  updateLogos(!isLight);
}

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('darkos-theme');
  const isLight = saved === 'light';

  if (isLight) {
    document.body.classList.add('light');
  }

  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = isLight ? '🌙' : '☀️';

  updateLogos(isLight);
});

function updateLogos(isLight) {
  const logos = document.querySelectorAll(
    '.nav-logo, .hero-logo, .footer-logo'
  );

  logos.forEach(img => {
    img.src = isLight
      ? 'assets/logo_white.png'
      : 'assets/logo.png';
  });
}

// ── Animate stat cards on scroll ───────────────────────────────
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

// ── Smooth scroll ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  const href = link.getAttribute('href');
  if (href.length <= 1) return;
  link.addEventListener('click', e => {
    const target = document.querySelector(href);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── Badge typing effect ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const badge = document.querySelector('.hero-badge');
    if (!badge) return;
    const text = badge.textContent;
    badge.textContent = '';
    let i = 0;
    const type = () => { if (i < text.length) { badge.textContent += text[i++]; setTimeout(type, 35); } };
    type();
  }, 200);
});
