import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EmoticonFile, EmoticonSet } from '../types'
import type { PlatformId } from '../config/platforms'
import { usePlatformStore } from './platformStore'

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr]
  const [item] = result.splice(from, 1)
  result.splice(to, 0, item)
  return result
}

function makeSet(name: string): EmoticonSet {
  return { id: crypto.randomUUID(), name, emoticons: [] }
}

type ByPlatform = Partial<Record<PlatformId, EmoticonSet[]>>
type ActiveSetIds = Partial<Record<PlatformId, string>>

interface EmoticonState {
  byPlatform: ByPlatform
  activeSetId: ActiveSetIds

  addSet: () => string
  renameSet: (setId: string, name: string) => void
  deleteSet: (setId: string) => void
  switchSet: (setId: string) => void
  setThumbnail: (emoticonId: string) => void

  addEmoticons: (files: EmoticonFile[]) => void
  removeEmoticon: (id: string) => void
  reorder: (fromIndex: number, toIndex: number) => void
  clear: () => void
}

export const useEmoticonStore = create<EmoticonState>()(
  persist(
    (set, get) => ({
      byPlatform: {},
      activeSetId: {},

      addSet: () => {
        const pid = usePlatformStore.getState().activePlatform
        const currentSets = get().byPlatform[pid] ?? []
        const newSet = makeSet(`세트 ${currentSets.length + 1}`)
        set((s) => ({
          byPlatform: {
            ...s.byPlatform,
            [pid]: [...currentSets, newSet],
          },
          activeSetId: { ...s.activeSetId, [pid]: newSet.id },
        }))
        return newSet.id
      },

      renameSet: (setId, name) => {
        const pid = usePlatformStore.getState().activePlatform
        set((s) => ({
          byPlatform: {
            ...s.byPlatform,
            [pid]: (s.byPlatform[pid] ?? []).map((st) =>
              st.id === setId ? { ...st, name } : st
            ),
          },
        }))
      },

      deleteSet: (setId) => {
        const pid = usePlatformStore.getState().activePlatform
        const currentSets = get().byPlatform[pid] ?? []
        const remaining = currentSets.filter((s) => s.id !== setId)
        const currentActiveId = get().activeSetId[pid]
        const newActiveId =
          currentActiveId === setId ? remaining[0]?.id : currentActiveId
        set((s) => ({
          byPlatform: { ...s.byPlatform, [pid]: remaining },
          activeSetId: { ...s.activeSetId, [pid]: newActiveId },
        }))
      },

      switchSet: (setId) => {
        const pid = usePlatformStore.getState().activePlatform
        set((s) => ({
          activeSetId: { ...s.activeSetId, [pid]: setId },
        }))
      },

      setThumbnail: (emoticonId) => {
        const pid = usePlatformStore.getState().activePlatform
        const activeId = get().activeSetId[pid]
        set((s) => ({
          byPlatform: {
            ...s.byPlatform,
            [pid]: (s.byPlatform[pid] ?? []).map((st) =>
              st.id === activeId ? { ...st, thumbnailId: emoticonId } : st
            ),
          },
        }))
      },

      addEmoticons: (files) => {
        const pid = usePlatformStore.getState().activePlatform
        const state = get()
        let sets = state.byPlatform[pid] ?? []
        let activeId = state.activeSetId[pid]

        if (sets.length === 0) {
          const defaultSet = makeSet('세트 1')
          sets = [defaultSet]
          activeId = defaultSet.id
        }

        if (!activeId || !sets.find((s) => s.id === activeId)) {
          activeId = sets[0].id
        }

        const resolvedId = activeId
        set((s) => ({
          byPlatform: {
            ...s.byPlatform,
            [pid]: sets.map((st) =>
              st.id === resolvedId
                ? { ...st, emoticons: [...st.emoticons, ...files] }
                : st
            ),
          },
          activeSetId: { ...s.activeSetId, [pid]: resolvedId },
        }))
      },

      removeEmoticon: (id) => {
        const pid = usePlatformStore.getState().activePlatform
        const activeId = get().activeSetId[pid]
        set((s) => ({
          byPlatform: {
            ...s.byPlatform,
            [pid]: (s.byPlatform[pid] ?? []).map((st) =>
              st.id === activeId
                ? { ...st, emoticons: st.emoticons.filter((e) => e.id !== id) }
                : st
            ),
          },
        }))
      },

      reorder: (from, to) => {
        const pid = usePlatformStore.getState().activePlatform
        const activeId = get().activeSetId[pid]
        set((s) => ({
          byPlatform: {
            ...s.byPlatform,
            [pid]: (s.byPlatform[pid] ?? []).map((st) =>
              st.id === activeId
                ? { ...st, emoticons: arrayMove(st.emoticons, from, to) }
                : st
            ),
          },
        }))
      },

      clear: () => {
        const pid = usePlatformStore.getState().activePlatform
        const activeId = get().activeSetId[pid]
        set((s) => ({
          byPlatform: {
            ...s.byPlatform,
            [pid]: (s.byPlatform[pid] ?? []).map((st) =>
              st.id === activeId ? { ...st, emoticons: [] } : st
            ),
          },
        }))
      },
    }),
    { name: 'emoticons-v3' }
  )
)

export function useActiveSets(): EmoticonSet[] {
  const activePlatform = usePlatformStore((s) => s.activePlatform)
  return useEmoticonStore((s) => s.byPlatform[activePlatform] ?? [])
}

export function useActiveSetId(): string | undefined {
  const activePlatform = usePlatformStore((s) => s.activePlatform)
  const sets = useEmoticonStore((s) => s.byPlatform[activePlatform] ?? [])
  const activeId = useEmoticonStore((s) => s.activeSetId[activePlatform])
  if (!activeId && sets.length > 0) return sets[0].id
  return activeId
}

export function useActiveSetName(): string {
  const activePlatform = usePlatformStore((s) => s.activePlatform)
  const sets = useEmoticonStore((s) => s.byPlatform[activePlatform] ?? [])
  const activeId = useEmoticonStore((s) => s.activeSetId[activePlatform])
  const activeSet = sets.find((s) => s.id === activeId) ?? sets[0]
  return activeSet?.name ?? '나의 이모티콘 세트'
}

export function useActiveThumbnailId(): string | undefined {
  const activePlatform = usePlatformStore((s) => s.activePlatform)
  const sets = useEmoticonStore((s) => s.byPlatform[activePlatform] ?? [])
  const activeId = useEmoticonStore((s) => s.activeSetId[activePlatform])
  const activeSet = sets.find((s) => s.id === activeId) ?? sets[0]
  return activeSet?.thumbnailId
}

export function useActiveEmoticons(): EmoticonFile[] {
  const activePlatform = usePlatformStore((s) => s.activePlatform)
  const sets = useEmoticonStore((s) => s.byPlatform[activePlatform] ?? [])
  const activeId = useEmoticonStore((s) => s.activeSetId[activePlatform])
  if (sets.length === 0) return []
  const activeSet = sets.find((s) => s.id === activeId) ?? sets[0]
  return activeSet?.emoticons ?? []
}
