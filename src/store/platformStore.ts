import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PLATFORMS, type PlatformId, type PlatformConfig } from '../config/platforms'

export type NaverSubMode = 'chzzk' | 'cafe' | 'blog'

interface PlatformState {
  activePlatform: PlatformId
  setPlatform: (id: PlatformId) => void
  getConfig: () => PlatformConfig
  naverSubMode: NaverSubMode
  setNaverSubMode: (mode: NaverSubMode) => void
}

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set, get) => ({
      activePlatform: 'kakao' as PlatformId,
      naverSubMode: 'blog' as NaverSubMode,
      setNaverSubMode: (mode) => set({ naverSubMode: mode }),
      setPlatform: (id) => {
        set({ activePlatform: id })
        // sync themes into themeStore — lazy import to avoid circular dep at module load
        import('./themeStore').then(({ useThemeStore }) => {
          const config = PLATFORMS[id]
          useThemeStore.getState().resetForPlatform(config.themes, config.defaultTheme)
        })
      },
      getConfig: () => PLATFORMS[get().activePlatform],
    }),
    {
      name: 'platform-v1',
      onRehydrateStorage: () => (state) => {
        if (!state) return
        // after rehydration, sync platform themes into themeStore
        import('./themeStore').then(({ useThemeStore }) => {
          const config = PLATFORMS[state.activePlatform]
          useThemeStore.getState().resetForPlatform(config.themes, config.defaultTheme)
        })
      },
    }
  )
)
