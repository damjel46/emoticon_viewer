import { supabase } from '../lib/supabase'
import type { ShareEmoticon } from '../types'

interface UploadPayload {
  emoticons: ShareEmoticon[]
  themeKey: string
  customBg?: string
  platformId?: string
  naverSubMode?: string
}

export async function uploadShare(payload: UploadPayload): Promise<string> {
  const { data, error } = await supabase
    .from('shares')
    .insert({ payload })
    .select('id')
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Upload failed')

  return `${window.location.origin}/mobile#${data.id}`
}

export async function fetchShare(id: string): Promise<UploadPayload | null> {
  const { data, error } = await supabase
    .from('shares')
    .select('payload, created_at')
    .eq('id', id)
    .single()

  if (error || !data) return null

  return data.payload as UploadPayload
}
