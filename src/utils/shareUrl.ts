import LZString from 'lz-string'
import type { SharePayload } from '../types'

export function buildShareUrl(payload: SharePayload): string {
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload))
  return `${window.location.origin}/mobile#${compressed}`
}

export function parseShareUrl(hash: string): SharePayload | null {
  try {
    const raw = LZString.decompressFromEncodedURIComponent(hash.replace(/^#/, ''))
    if (!raw) return null
    return JSON.parse(raw) as SharePayload
  } catch {
    return null
  }
}
