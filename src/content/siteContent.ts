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
    date: 'Apr. 05, 2026',
    title: 'Website Version V1!',
    content: 'We released the Website now in the Full version!',
    type: 'Update',
  },
];

export const DEFAULT_CHANGELOGS: ChangelogItem[] = [
  {
    id: 1,
    version: 'v1.0.0',
    date: 'Apr. 05, 2026',
    changes: [
      'Full overhaul of the entire website.',
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
