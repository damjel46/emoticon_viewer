import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EmoticonFile } from '../types'

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr]
  const [item] = result.splice(from, 1)
  result.splice(to, 0, item)
  return result
}

interface EmoticonState {
  emoticons: EmoticonFile[]
  addEmoticons: (files: EmoticonFile[]) => void
  removeEmoticon: (id: string) => void
  reorder: (fromIndex: number, toIndex: number) => void
  clear: () => void
}

export const useEmoticonStore = create<EmoticonState>()(
  persist(
    (set) => ({
      emoticons: [],
      addEmoticons: (files) =>
        set((s) => ({ emoticons: [...s.emoticons, ...files] })),
      removeEmoticon: (id) =>
        set((s) => ({ emoticons: s.emoticons.filter((e) => e.id !== id) })),
      reorder: (from, to) =>
        set((s) => ({ emoticons: arrayMove(s.emoticons, from, to) })),
      clear: () => set({ emoticons: [] }),
    }),
    { name: 'kakao-emoticons' }
  )
)
