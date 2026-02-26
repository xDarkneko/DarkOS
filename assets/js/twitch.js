// DarkOS – Twitch Integration (decapi.me – no auth needed)
const TWITCH_USER = 'xDarkNeko_';

async function loadTwitchData() {
  const nameEl     = document.getElementById('twitchName');
  const metaEl     = document.getElementById('twitchMeta');
  const liveEl     = document.getElementById('twitchLiveStatus');
  const cardEl     = document.getElementById('twitchCard');

  if (nameEl) nameEl.textContent = TWITCH_USER;

  try {
    // Follower count
    const followRes  = await fetch(`https://decapi.me/twitch/followcount/${TWITCH_USER}`);
    const followText = await followRes.text();
    const followers  = followText.trim();

    // Live status
    const uptimeRes  = await fetch(`https://decapi.me/twitch/uptime/${TWITCH_USER}`);
    const uptimeText = await uptimeRes.text();
    const isLive     = !uptimeText.toLowerCase().includes('offline') && !uptimeText.toLowerCase().includes('error') && uptimeText.trim().length > 0;

    // Update followers
    const followerEl = document.getElementById('twitchFollowers');
    if (followerEl) followerEl.innerHTML = `<strong>${Number(followers).toLocaleString()}</strong> Followers`;

    // Update live badge
    if (liveEl) {
      if (isLive) {
        liveEl.innerHTML = `<span class="live-dot"></span>LIVE · ${uptimeText.trim()}`;
        liveEl.className = 'twitch-live';
        if (cardEl) {
          cardEl.style.borderColor = 'rgba(145,70,255,0.45)';
          cardEl.style.boxShadow   = '0 8px 48px rgba(145,70,255,0.22)';
        }
      } else {
        liveEl.textContent = 'Offline';
        liveEl.className   = 'twitch-offline';
      }
    }
  } catch {
    const followerEl = document.getElementById('twitchFollowers');
    if (followerEl) followerEl.textContent = '— Followers';
    if (liveEl) { liveEl.textContent = 'Offline'; liveEl.className = 'twitch-offline'; }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadTwitchData();
  setInterval(loadTwitchData, 60_000);
});
