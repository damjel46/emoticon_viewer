import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EmoticonFile } from '../types'
import type { PlatformId } from '../config/platforms'
import { usePlatformStore } from './platformStore'

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr]
  const [item] = result.splice(from, 1)
  result.splice(to, 0, item)
  return result
}

type ByPlatform = Partial<Record<PlatformId, EmoticonFile[]>>

interface EmoticonState {
  byPlatform: ByPlatform
  addEmoticons: (files: EmoticonFile[]) => void
  removeEmoticon: (id: string) => void
  reorder: (fromIndex: number, toIndex: number) => void
  clear: () => void
}

export const useEmoticonStore = create<EmoticonState>()(
  persist(
    (set) => ({
      byPlatform: {},
      addEmoticons: (files) => {
        const pid = usePlatformStore.getState().activePlatform
        set((s) => ({
          byPlatform: {
            ...s.byPlatform,
            [pid]: [...(s.byPlatform[pid] ?? []), ...files],
          },
        }))
      },
      removeEmoticon: (id) => {
        const pid = usePlatformStore.getState().activePlatform
        set((s) => ({
          byPlatform: {
            ...s.byPlatform,
            [pid]: (s.byPlatform[pid] ?? []).filter((e) => e.id !== id),
          },
        }))
      },
      reorder: (from, to) => {
        const pid = usePlatformStore.getState().activePlatform
        set((s) => ({
          byPlatform: {
            ...s.byPlatform,
            [pid]: arrayMove(s.byPlatform[pid] ?? [], from, to),
          },
        }))
      },
      clear: () => {
        const pid = usePlatformStore.getState().activePlatform
        set((s) => ({
          byPlatform: {
            ...s.byPlatform,
            [pid]: [],
          },
        }))
      },
    }),
    { name: 'emoticons-v2' }
  )
)

export function useActiveEmoticons(): EmoticonFile[] {
  const activePlatform = usePlatformStore((s) => s.activePlatform)
  return useEmoticonStore((s) => s.byPlatform[activePlatform] ?? [])
}
