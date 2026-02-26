// DarkOS – Twitch Integration
// Checks if streamer is live via public Twitch API (no auth needed via proxy trick)
async function checkTwitchLive() {
  const card   = document.getElementById('twitchCard');
  const badge  = document.getElementById('twitchBadge');
  const status = document.getElementById('twitchStatus');
  if (!card) return;

  try {
    // Use Twitch's public API via a no-auth endpoint
    const res  = await fetch('https://decapi.me/twitch/uptime/xdarkneko');
    const text = await res.text();
    const isLive = !text.toLowerCase().includes('offline') && !text.toLowerCase().includes('error');

    if (isLive) {
      if (badge)  badge.style.display  = 'inline-flex';
      if (status) status.textContent   = `Live for ${text.trim()}`;
      card.style.borderColor = 'rgba(145,70,255,0.4)';
      card.style.boxShadow   = '0 8px 40px rgba(145,70,255,0.2)';
    } else {
      if (badge)  badge.style.display  = 'none';
      if (status) status.textContent   = 'Click to visit channel';
    }
  } catch {
    if (status) status.textContent = 'Click to visit channel';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkTwitchLive();
  setInterval(checkTwitchLive, 60_000);
});
