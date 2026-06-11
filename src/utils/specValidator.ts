import type { SpecWarning } from '../types'

export const KAKAO_SPEC = {
  expectedWidth: 360,
  expectedHeight: 360,
  maxFileSizeBytes: 1_000_000,
  allowedTypes: ['image/gif', 'image/webp', 'image/png'] as string[],
}

function measureImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
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
}

export async function validateEmoticonFile(file: File): Promise<SpecWarning[]> {
  const warnings: SpecWarning[] = []

  if (!KAKAO_SPEC.allowedTypes.includes(file.type)) {
    warnings.push({
      code: 'WRONG_FORMAT',
      message: `지원하지 않는 형식: ${file.type || '알 수 없음'} (GIF/WEBP/PNG만 허용)`,
    })
    return warnings
  }

  if (file.size > KAKAO_SPEC.maxFileSizeBytes) {
    warnings.push({
      code: 'TOO_LARGE',
      message: `파일 크기 초과: ${(file.size / 1024).toFixed(0)}KB (최대 1MB)`,
    })
  }

  const { width, height } = await measureImageDimensions(file)
  if (width !== KAKAO_SPEC.expectedWidth || height !== KAKAO_SPEC.expectedHeight) {
    warnings.push({
      code: 'WRONG_SIZE',
      message: `크기 불일치: ${width}×${height}px (360×360px 권장)`,
    })
  }

  return warnings
}
