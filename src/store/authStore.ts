import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface Profile {
  id: string
  email: string | null
  is_premium: boolean
  purchased_at: string | null
}

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  init: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  deleteAccount: () => Promise<{ error: string | null }>
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null, loading: false })
    if (session?.user) await get().refreshProfile()

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ user: session?.user ?? null })
      if (session?.user) await get().refreshProfile()
      else set({ profile: null })
    })
  },

  refreshProfile: async () => {
    const user = get().user
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (data) {
      set({ profile: data as Profile })
    }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },

  deleteAccount: async () => {
    const { data, error } = await supabase.functions.invoke('delete-account')
    if (error || data?.error) {
      return { error: data?.error ?? error?.message ?? '탈퇴 처리에 실패했습니다.' }
    }
    await supabase.auth.signOut()
    set({ user: null, profile: null })
    return { error: null }
  },
}))
