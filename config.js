// ============================================================
//  ⚡ DarkOS – Website Konfiguration
//  Hier alles anpassen. Keine Programmierkenntnisse nötig!
//  Nach dem Bearbeiten: Datei speichern. Das war's!
// ============================================================

const DARKOS_CONFIG = {

  // ── Bot & API ─────────────────────────────────────────────────
  // URL wo dein Bot läuft (z.B. VPS, Railway, Render)
  apiUrl: 'https://your-api-host.example.com',
  // Deine Community Server ID (Rechtsklick auf Server → ID kopieren)
  guildId: 'DEINE_SERVER_ID_HIER',
  // Discord App Client ID (discord.com/developers → App → General)
  clientId: 'DEINE_CLIENT_ID_HIER',

  // ── Bot Info ──────────────────────────────────────────────────
  botName:    'DarkOS',
  botVersion: '2.0.0',

  // ── Farben ────────────────────────────────────────────────────
  colors: {
    primary:  '#7f5af0',
    secondary:'#2cb67d',
    danger:   '#ff4757',
  },

  // ── Links ─────────────────────────────────────────────────────
  links: {
    invite:        'https://discord.com/oauth2/authorize?client_id=DEINE_CLIENT_ID_HIER&scope=bot+applications.commands&permissions=8',
    supportServer: 'https://discord.gg/dein-server',
    github:        'https://github.com/dein-username/darkos',
  },

  // ── Features (Karten auf der Startseite) ─────────────────────
  features: [
    { icon:'🎫', en:{title:'Multi-Server Ticket System',desc:'Staff reply anonymously. Double transcripts for admins & users.'}, de:{title:'Multi-Server Ticket System',desc:'Teamantworten anonym. Doppeltes Transkript für Admins & User.'}, tags:['Anonymous','Dual Transcript'], large:true },
    { icon:'👾', en:{title:'Horror Escape Game',desc:'Text-based horror. Random rooms & enemies. Smell · Feel · Scream · Walk.'}, de:{title:'Horror Flucht Spiel',desc:'Textbasiertes Horror. Zufällige Räume. Riechen · Fühlen · Schreien · Gehen.'} },
    { icon:'🔬', en:{title:'VirusTotal Scanner',desc:'Reply /vscan to scan files & URLs with 70+ AV engines.'}, de:{title:'VirusTotal Scanner',desc:'Mit /vscan Dateien & URLs mit 70+ Engines scannen.'} },
    { icon:'📺', en:{title:'Anime Tracker',desc:'/anime search + episode notifications via AniList.'}, de:{title:'Anime Tracker',desc:'/anime Suche + Episodenbenachrichtigungen.'} },
    { icon:'🎉', en:{title:'Giveaways',desc:'Start from Discord or the web dashboard. Auto winner selection.'}, de:{title:'Giveaways',desc:'Über Discord oder Dashboard starten. Automatische Gewinner.'} },
    { icon:'⚔️', en:{title:'War Feed',desc:'Live conflict updates from LiveUAMap RSS in real time.'}, de:{title:'Kriegsfeed',desc:'Live Konfliktupdates von LiveUAMap in Echtzeit.'} },
    { icon:'📊', en:{title:'Advanced Logging',desc:'6 log channels: Reports · Server · Voice · Members · Messages · Invites.'}, de:{title:'Erweiterte Logs',desc:'6 Log-Kanäle: Reports · Server · Voice · Mitglieder · Nachrichten · Einladungen.'} },
    { icon:'🔢', en:{title:'Counting',desc:'Auto ✅/❌ reactions. Highscore in channel topic.'}, de:{title:'Zählen',desc:'Auto ✅/❌ Reaktionen. Highscore im Channel-Topic.'} },
    { icon:'🖥️', en:{title:'Driver Updates',desc:'AMD · NVIDIA · Intel GPU monitoring. Instant notifications.'}, de:{title:'Treiber Updates',desc:'AMD · NVIDIA · Intel Überwachung. Sofortige Benachrichtigungen.'} },
    { icon:'🟣', en:{title:'Stream Alerts',desc:'Twitch go-live & YouTube upload notifications.'}, de:{title:'Stream Alerts',desc:'Twitch Live & YouTube Upload Benachrichtigungen.'} },
    { icon:'🇩🇪', en:{title:'Bilingual',desc:'English by default. Translate any response to German with one click.'}, de:{title:'Zweisprachig',desc:'Standard Englisch. Per Klick auf Deutsch übersetzen.'}, large:true },
  ],

  // ── Commands (Tabelle auf der Startseite) ─────────────────────
  commands: [
    { cmd:'/ticket',          en:'Open a support ticket',           de:'Support Ticket öffnen' },
    { cmd:'/anime [name]',    en:'Search anime info & episodes',    de:'Anime Infos & Episoden suchen' },
    { cmd:'/vscan',           en:'Scan file/URL with VirusTotal',   de:'Datei/URL scannen' },
    { cmd:'/horror',          en:'Play the horror escape game',     de:'Horrorspiel spielen' },
    { cmd:'/giveaway start',  en:'Launch a giveaway (admin)',       de:'Giveaway starten (Admin)' },
    { cmd:'/logs set',        en:'Configure log channels (admin)',  de:'Log-Kanäle konfigurieren' },
    { cmd:'/subscribe anime', en:'Subscribe to anime releases',     de:'Anime Releases abonnieren' },
    { cmd:'/subscribe driver',en:'Get GPU driver alerts',           de:'GPU Treiberupdates erhalten' },
    { cmd:'/counting',        en:'Set counting channel',            de:'Zähl-Kanal einrichten' },
    { cmd:'/translate',       en:'Translate to German 🇩🇪',        de:'Auf Deutsch übersetzen 🇩🇪' },
  ],
};

if (typeof window !== 'undefined') window.DARKOS = DARKOS_CONFIG;
if (typeof module !== 'undefined') module.exports = DARKOS_CONFIG;
