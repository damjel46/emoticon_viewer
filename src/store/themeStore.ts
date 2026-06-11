import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeKey, ChatTheme } from '../types'

export const CHAT_THEMES: Record<ThemeKey, ChatTheme> = {
  light: {
    key: 'light',
    labelKo: '기본 (하늘)',
    bgColor: '#b2c7d9',
    myBubbleColor: '#fee500',
    otherBubbleColor: '#ffffff',
    textColor: '#1a1a1a',
    timestampColor: '#6b7280',
  },
  dark: {
    key: 'dark',
    labelKo: '다크',
    bgColor: '#1a1a2e',
    myBubbleColor: '#fee500',
    otherBubbleColor: '#2d2d3a',
    textColor: '#f0f0f0',
    timestampColor: '#9ca3af',
  },
  pink: {
    key: 'pink',
    labelKo: '핑크',
    bgColor: '#f9cdd4',
    myBubbleColor: '#fee500',
    otherBubbleColor: '#ffffff',
    textColor: '#1a1a1a',
    timestampColor: '#6b7280',
  },
  yellow: {
    key: 'yellow',
    labelKo: '노랑',
    bgColor: '#fff9c4',
    myBubbleColor: '#fee500',
    otherBubbleColor: '#ffffff',
    textColor: '#1a1a1a',
    timestampColor: '#6b7280',
  },
  custom: {
    key: 'custom',
    labelKo: '커스텀',
    bgColor: '#e8e8e8',
    myBubbleColor: '#fee500',
    otherBubbleColor: '#ffffff',
    textColor: '#1a1a1a',
    timestampColor: '#6b7280',
  },
}

interface ThemeState {
  activeTheme: ThemeKey
  customBgColor: string
  setTheme: (key: ThemeKey) => void
  setCustomBg: (color: string) => void
  getCurrentTheme: () => ChatTheme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      activeTheme: 'light',
      customBgColor: '#e8e8e8',
      setTheme: (key) => set({ activeTheme: key }),
      setCustomBg: (color) =>
        set((s) => ({
          customBgColor: color,
          activeTheme: s.activeTheme === 'custom' ? 'custom' : s.activeTheme,
        })),
      getCurrentTheme: () => {
        const { activeTheme, customBgColor } = get()
        const base = CHAT_THEMES[activeTheme]
        if (activeTheme === 'custom') return { ...base, bgColor: customBgColor }
        return base
      },
    }),
    { name: 'kakao-theme' }
  )
)
