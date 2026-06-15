import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EmoticonFile, EmoticonSet } from '../types'
import type { PlatformId } from '../config/platforms'
import { usePlatformStore } from './platformStore'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './authStore'

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',')
  const mimeType = header.match(/:(.*?);/)?.[1] ?? 'application/octet-stream'
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mimeType })
}

async function uploadEmoticonToStorage(
  userId: string,
  setId: string,
  emoticon: EmoticonFile
): Promise<string> {
  const ext = emoticon.mimeType.split('/')[1]
  const path = `${userId}/${setId}/${emoticon.id}.${ext}`
  const blob = dataUrlToBlob(emoticon.dataUrl)
  const { error } = await supabase.storage
    .from('emoticon-images')
    .upload(path, blob, { upsert: true, contentType: emoticon.mimeType })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from('emoticon-images').getPublicUrl(path)
  return publicUrl
}

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr]
  const [item] = result.splice(from, 1)
  result.splice(to, 0, item)
  return result
}

function makeSet(name: string): EmoticonSet {
  return { id: crypto.randomUUID(), name, emoticons: [] }
}

function getCloudUserId(): string | null {
  const { user, profile } = useAuthStore.getState()
  if (!user || !profile?.is_premium) return null
  return user.id
}

async function syncSetToCloud(
  userId: string,
  platformId: string,
  targetSet: EmoticonSet,
  order: number
): Promise<void> {
  // Upload base64 images to storage; already-uploaded URLs pass through
  const emoticonsMeta = await Promise.all(
    targetSet.emoticons.map(async (e) => {
      if (!e.dataUrl.startsWith('data:')) return e  // already a URL
      const publicUrl = await uploadEmoticonToStorage(userId, targetSet.id, e)
      return { ...e, dataUrl: publicUrl }
    })
  )

  const { error } = await supabase.from('emoticon_sets').upsert({
    id: targetSet.id,
    user_id: userId,
    platform_id: platformId,
    name: targetSet.name,
    emoticons: emoticonsMeta,
    thumbnail_id: targetSet.thumbnailId ?? null,
    display_order: order,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}

async function deleteSetFromCloud(setId: string): Promise<void> {
  await supabase.from('emoticon_sets').delete().eq('id', setId)
}

type ByPlatform = Partial<Record<PlatformId, EmoticonSet[]>>
type ActiveSetIds = Partial<Record<PlatformId, string>>

interface EmoticonState {
  byPlatform: ByPlatform
  activeSetId: ActiveSetIds

  loadFromCloud: (userId: string) => Promise<void>
  saveAllToCloud: (userId: string) => Promise<void>

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

      saveAllToCloud: async (userId) => {
        const state = get()
        for (const [pid, sets] of Object.entries(state.byPlatform)) {
          if (!sets) continue
          for (let i = 0; i < sets.length; i++) {
            await syncSetToCloud(userId, pid, sets[i], i)
          }
        }
      },

      loadFromCloud: async (userId) => {
        const { data, error } = await supabase
          .from('emoticon_sets')
          .select('*')
          .eq('user_id', userId)
          .order('display_order', { ascending: true })

        if (error) throw error
        if (!data) return

        const cloudByPlatform: ByPlatform = {}
        for (const row of data) {
          const pid = row.platform_id as PlatformId
          if (!cloudByPlatform[pid]) cloudByPlatform[pid] = []
          cloudByPlatform[pid]!.push({
            id: row.id,
            name: row.name,
            emoticons: row.emoticons as EmoticonFile[],
            thumbnailId: row.thumbnail_id ?? undefined,
          })
        }

        // Upload local-only sets to cloud so no data is lost
        const currentState = get()
        for (const [pid, localSets] of Object.entries(currentState.byPlatform)) {
          if (!localSets) continue
          for (let i = 0; i < localSets.length; i++) {
            const localSet = localSets[i]
            const cloudSets = cloudByPlatform[pid as PlatformId] ?? []
            if (!cloudSets.find((cs) => cs.id === localSet.id)) {
              void syncSetToCloud(userId, pid, localSet, cloudSets.length + i)
              cloudByPlatform[pid as PlatformId] = [...cloudSets, localSet]
            }
          }
        }

        // Always prefer cloud set IDs — local IDs may not match cloud sets
        const newActiveSetId: ActiveSetIds = { ...currentState.activeSetId }
        for (const [pid, sets] of Object.entries(cloudByPlatform)) {
          if (sets && sets.length > 0) {
            newActiveSetId[pid as PlatformId] = sets[0].id
          }
        }

        set({ byPlatform: cloudByPlatform, activeSetId: newActiveSetId })
      },

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
        const userId = getCloudUserId()
        if (userId) void syncSetToCloud(userId, pid, newSet, currentSets.length)
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
        const userId = getCloudUserId()
        if (userId) {
          const sets = get().byPlatform[pid] ?? []
          const updated = sets.find((s) => s.id === setId)
          if (updated) void syncSetToCloud(userId, pid, updated, sets.indexOf(updated))
        }
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
        const userId = getCloudUserId()
        if (userId) void deleteSetFromCloud(setId)
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
        const userId = getCloudUserId()
        if (userId) {
          const sets = get().byPlatform[pid] ?? []
          const updated = sets.find((s) => s.id === activeId)
          if (updated) void syncSetToCloud(userId, pid, updated, sets.indexOf(updated))
        }
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
        const userId = getCloudUserId()
        if (userId) {
          const newSets = get().byPlatform[pid] ?? []
          const updated = newSets.find((st) => st.id === resolvedId)
          if (updated) void syncSetToCloud(userId, pid, updated, newSets.indexOf(updated))
        }
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
        const userId = getCloudUserId()
        if (userId) {
          const sets = get().byPlatform[pid] ?? []
          const updated = sets.find((s) => s.id === activeId)
          if (updated) void syncSetToCloud(userId, pid, updated, sets.indexOf(updated))
        }
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
        const userId = getCloudUserId()
        if (userId) {
          const sets = get().byPlatform[pid] ?? []
          const updated = sets.find((s) => s.id === activeId)
          if (updated) void syncSetToCloud(userId, pid, updated, sets.indexOf(updated))
        }
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
        const userId = getCloudUserId()
        if (userId) {
          const sets = get().byPlatform[pid] ?? []
          const updated = sets.find((s) => s.id === activeId)
          if (updated) void syncSetToCloud(userId, pid, updated, sets.indexOf(updated))
        }
      },
    }),
    {
      name: 'emoticons-v3',
      // base64 dataUrls are too large for localStorage — only persist storage URLs
      partialize: (state) => ({
        activeSetId: state.activeSetId,
        byPlatform: Object.fromEntries(
          Object.entries(state.byPlatform).map(([pid, sets]) => [
            pid,
            (sets ?? []).map((set) => ({
              ...set,
              emoticons: set.emoticons.filter((e) => !e.dataUrl.startsWith('data:')),
            })),
          ])
        ),
      }),
    }
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
