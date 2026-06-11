import { supabase } from '../lib/supabase'
import type { ShareEmoticon } from '../types'

interface UploadPayload {
  emoticons: ShareEmoticon[]
  themeKey: string
  customBg?: string
}

export async function uploadShare(payload: UploadPayload): Promise<string> {
  const id = crypto.randomUUID()
  const json = JSON.stringify(payload)
  const blob = new Blob([json], { type: 'application/json' })

  const { error } = await supabase.storage
    .from('shares')
    .upload(`${id}.json`, blob, { contentType: 'application/json', upsert: false })

  if (error) throw new Error(error.message)

  return `${window.location.origin}/mobile#${id}`
}

export async function fetchShare(id: string): Promise<UploadPayload | null> {
  const { data, error } = await supabase.storage
    .from('shares')
    .download(`${id}.json`)

  if (error || !data) return null

  try {
    return JSON.parse(await data.text()) as UploadPayload
  } catch {
    return null
  }
}
