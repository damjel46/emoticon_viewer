import type { EmoticonFile } from '../types'
import type { PlatformSpec } from '../config/platforms'
import { validateEmoticonFile, KAKAO_SPEC } from './specValidator'

export const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

export async function fileToEmoticon(
  file: File,
  spec: PlatformSpec = KAKAO_SPEC
): Promise<EmoticonFile> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`${file.name} 파일이 ${MAX_FILE_SIZE_MB}MB를 초과합니다 (${(file.size / 1024 / 1024).toFixed(1)}MB)`)
  }
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const validationWarnings = await validateEmoticonFile(file, spec)

  const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      resolve({ width: 0, height: 0 })
      URL.revokeObjectURL(url)
    }
    img.src = url
  })

  return {
    id: crypto.randomUUID(),
    name: file.name,
    dataUrl,
    mimeType: file.type as EmoticonFile['mimeType'],
    fileSizeBytes: file.size,
    width: dimensions.width,
    height: dimensions.height,
    frameCount: null,
    validationWarnings,
  }
}

export async function convertFiles(
  files: File[],
  spec?: PlatformSpec
): Promise<{ emoticons: EmoticonFile[]; rejectedCount: number }> {
  const results = await Promise.allSettled(
    files.map((f) => fileToEmoticon(f, spec ?? KAKAO_SPEC))
  )
  const emoticons = results.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []))
  const rejectedCount = results.filter((r) => r.status === 'rejected').length
  return { emoticons, rejectedCount }
}
