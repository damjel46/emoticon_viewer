import type { EmoticonFile } from '../types'
import type { PlatformSpec } from '../config/platforms'
import { validateEmoticonFile, KAKAO_SPEC } from './specValidator'

export async function fileToEmoticon(
  file: File,
  spec: PlatformSpec = KAKAO_SPEC
): Promise<EmoticonFile> {
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
