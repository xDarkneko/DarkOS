// ============================================================
//  DarkOS – Live Stats Fetcher
// ============================================================
const API_URL = 'https://your-api-host.example.com'; // Change this!
const GUILD_ID = 'YOUR_COMMUNITY_GUILD_ID';           // Change this!

function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

async function loadStats() {
  try {
    const res  = await fetch(`${API_URL}/api/stats?guild=${GUILD_ID}`);
    const data = await res.json();

    // Strip
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('statMembers',  formatNum(data.members));
    set('statTickets',  formatNum(data.ticketCount));
    set('statMessages', formatNum(data.msgCount));
    set('statJoins',    formatNum(data.joins));
    set('statLeaves',   formatNum(data.leaves));
    set('statVersion',  data.botVersion);

    // Big stats section
    set('s2Members',  formatNum(data.members));
    set('s2Tickets',  formatNum(data.ticketCount));
    set('s2Messages', formatNum(data.msgCount));
    set('s2Joins',    formatNum(data.joins));
    set('s2Leaves',   formatNum(data.leaves));

    // Team/admin page stats
    set('dashMembers',  formatNum(data.members));
    set('dashTickets',  formatNum(data.ticketCount));
    set('dashMessages', formatNum(data.msgCount));
    set('dashUptime',   formatUptime(data.uptime));

  } catch (err) {
    console.warn('[Stats] Could not load:', err.message);
    // Show placeholder
    ['statMembers','statTickets','statMessages','statJoins','statLeaves',
     's2Members','s2Tickets','s2Messages','s2Joins','s2Leaves'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '—';
    });
  }
}

function formatUptime(s) {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

document.addEventListener('DOMContentLoaded', loadStats);
// Refresh every 60 seconds
setInterval(loadStats, 60_000);
