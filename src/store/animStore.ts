import { create } from 'zustand'
import type { AnimPlayerState } from '../types'

interface AnimStoreState extends AnimPlayerState {
  play: () => void
  pause: () => void
  setSpeed: (s: 0.5 | 1 | 1.5) => void
  setFrame: (frame: number) => void
  setTotalFrames: (total: number) => void
  setActiveEmoticon: (id: string | null) => void
  reset: () => void
}

export const useAnimStore = create<AnimStoreState>()((set) => ({
  isPlaying: false,
  speedMultiplier: 1,
  currentFrame: 0,
  totalFrames: 0,
  activeEmoticonId: null,
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setSpeed: (s) => set({ speedMultiplier: s }),
  setFrame: (frame) => set({ currentFrame: frame }),
  setTotalFrames: (total) => set({ totalFrames: total }),
  setActiveEmoticon: (id) => set({ activeEmoticonId: id, currentFrame: 0, isPlaying: false }),
  reset: () => set({ isPlaying: false, currentFrame: 0, totalFrames: 0, activeEmoticonId: null }),
}))
