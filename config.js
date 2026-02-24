const DARKOS_CONFIG = {

  // ── Bot & API ─────────────────────────────────────────────────
  apiUrl:   'https://your-api-host.example.com',
  guildId:  '1023175719209144380',
  clientId: '1425314501057839134',

  // ── Bot Info ──────────────────────────────────────────────────
  botName:    'DarkOS',
  botVersion: '0.0.1a',

  // ── Farben ────────────────────────────────────────────────────
  colors: {
    primary:   '#7f5af0',
    secondary: '#2cb67d',
    danger:    '#ff4757',
  },

  // ── Links ─────────────────────────────────────────────────────
  links: {
    communityServer: 'https://discord.gg/UsEmqxHEFH',
    github:          'https://github.com/xdarkneko/DarkOS',
  },

  // ── Landing Page Texte ────────────────────────────────────────
  landing: {
    en: {
      heroSub:      'The ultimate Discord bot for your community.',
      communityBtn: '💬 Team Darkness',
      statsTitle:   'Live Statistics',
      statsLive:    'Updated in real time',
      footerCopy:   '© 2026 DarkOS. All rights reserved.',
    },
    de: {
      heroSub:      'Der ultimative Discord Bot für deine Community.',
      communityBtn: '💬 Community beitreten',
      statsTitle:   'Live Statistiken',
      statsLive:    'Wird in Echtzeit aktualisiert',
      footerCopy:   '© 2025 DarkOS. Alle Rechte vorbehalten.',
    },
  },
};

if (typeof window !== 'undefined') window.DARKOS = DARKOS_CONFIG;
if (typeof module !== 'undefined') module.exports = DARKOS_CONFIG;
