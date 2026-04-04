export type NewsItem = {
  id: number;
  date: string;
  title: string;
  content: string;
  type: string;
};

export type ChangelogItem = {
  id: number;
  version: string;
  date: string;
  changes: string[];
  platform: 'Web' | 'Bot' | 'Web/Bot';
};

export const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 1,
    date: 'Nov 02, 2023',
    title: 'Vorbereitung auf Bot Integration',
    content: 'Wir arbeiten intensiv an der Anbindung der Echtzeit-Statistiken vom Discord-Bot an dieses Dashboard.',
    type: 'In Development',
  },
  {
    id: 2,
    date: 'Oct 28, 2023',
    title: 'Brandneue Website Online!',
    content: 'Das neue Team Darkness Hub ist nun live mit interaktiven Graphen, Topografie und mehr.',
    type: 'Website Launch',
  },
  {
    id: 3,
    date: 'Oct 25, 2023',
    title: 'Twitch Integrationen',
    content: 'Die Live-Status Abfrage für xDarkNeko_ wurde optimiert und ist nun direkt auf der Startseite sichtbar.',
    type: 'Update',
  },
];

export const DEFAULT_CHANGELOGS: ChangelogItem[] = [
  {
    id: 1,
    version: 'v2.4.2',
    date: 'Nov 02, 2023',
    changes: [
      'Logo-Assets erfolgreich implementiert.',
      'Inhalte aktualisiert und Community-News integriert.',
      'Performance der Graphen für mobile Geräte optimiert.',
    ],
    platform: 'Web',
  },
  {
    id: 2,
    version: 'v2.4.1',
    date: 'Oct 30, 2023',
    changes: [
      'Topografie-Hintergrund für Light Mode angepasst (Midnight Black).',
      'Sprachumschaltung zwischen GER/ENG korrigiert.',
      'Magischer Cursor-Trail feiner gestaltet.',
    ],
    platform: 'Web',
  },
  {
    id: 3,
    version: 'v2.4.0',
    date: 'Oct 28, 2023',
    changes: [
      'Initialer Release des neuen Community Dashboards.',
      'Implementierung des Dynamic Island Status-Systems.',
      'Zentrale Steuerung der Community-News.',
    ],
    platform: 'Web',
  },
];

const NEWS_KEY = 'team-darkness-news';
const CHANGELOG_KEY = 'team-darkness-changelogs';

function readJson<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJson<T>(key: string, value: T[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getMergedNews() {
  const published = readJson<NewsItem>(NEWS_KEY);
  return [...published, ...DEFAULT_NEWS].sort((a, b) => b.id - a.id);
}

export function getMergedChangelogs() {
  const published = readJson<ChangelogItem>(CHANGELOG_KEY);
  return [...published, ...DEFAULT_CHANGELOGS].sort((a, b) => b.id - a.id);
}

export function savePublishedNews(news: NewsItem[]) {
  const existing = readJson<NewsItem>(NEWS_KEY);
  writeJson(NEWS_KEY, [...news, ...existing]);
}

export function savePublishedChangelogs(changelogs: ChangelogItem[]) {
  const existing = readJson<ChangelogItem>(CHANGELOG_KEY);
  writeJson(CHANGELOG_KEY, [...changelogs, ...existing]);
}
