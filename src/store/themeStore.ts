import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatTheme } from '../types'
import { PLATFORMS } from '../config/platforms'

// Kakao themes kept as named export for backward compat (MobilePreviewPage uses this)
export const CHAT_THEMES: Record<string, ChatTheme> = Object.fromEntries(
  PLATFORMS.kakao.themes.map((t) => [t.key, t])
)

interface ThemeState {
  activeTheme: string
  customBgColor: string
  platformThemes: ChatTheme[]
  setTheme: (key: string) => void
  setCustomBg: (color: string) => void
  resetForPlatform: (themes: ChatTheme[], defaultTheme: string) => void
  getCurrentTheme: () => ChatTheme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      activeTheme: 'light',
      customBgColor: '#e8e8e8',
      platformThemes: PLATFORMS.kakao.themes,

      setTheme: (key) => set({ activeTheme: key }),

      setCustomBg: (color) =>
        set((s) => ({
          customBgColor: color,
          activeTheme: s.activeTheme === 'custom' ? 'custom' : s.activeTheme,
        })),

      resetForPlatform: (themes, defaultTheme) => {
        set({
          platformThemes: themes,
          activeTheme: defaultTheme,
        })
      },

      getCurrentTheme: () => {
        const { activeTheme, customBgColor, platformThemes } = get()
        const found = platformThemes.find((t) => t.key === activeTheme)
        const base = found ?? platformThemes[0] ?? PLATFORMS.kakao.themes[0]
        if (activeTheme === 'custom') return { ...base, bgColor: customBgColor }
        return base
      },
    }),
    {
      name: 'kakao-theme',
      // do NOT persist platformThemes — it's rehydrated from platformStore on load
      partialize: (s) => ({ activeTheme: s.activeTheme, customBgColor: s.customBgColor }),
    }
  )
)
