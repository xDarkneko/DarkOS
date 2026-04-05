import { create } from 'zustand';

type AppState = {
  themeColor: string;
  setThemeColor: (color: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  easterEggClicks: number;
  incrementEasterEgg: () => void;
  easterEggUnlocked: boolean;
  easterEggStage: number;
  language: 'en' | 'de';
  setLanguage: (lang: 'en' | 'de') => void;
  botStatus: 'LIVE' | 'OFFLINE';
  botVersion: string;
};

export const useStore = create<AppState>((set) => ({
  themeColor: '#8b5cf6',
  setThemeColor: (color) => set({ themeColor: color }),
  isDarkMode: true,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  easterEggClicks: 0,
  incrementEasterEgg: () => set((state) => {
    const newClicks = state.easterEggClicks + 1;
    return {
      easterEggClicks: newClicks,
      easterEggUnlocked: newClicks >= 7 ? true : state.easterEggUnlocked,
      easterEggStage: newClicks >= 10 ? 2 : newClicks >= 7 ? 1 : 0,
    };
  }),
  easterEggUnlocked: false,
  easterEggStage: 0,
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  botStatus: 'OFFLINE',
  botVersion: 'v2.4.2',
}));
