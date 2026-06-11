import type { SpecWarning } from '../types'
import type { PlatformSpec } from '../config/platforms'

// Legacy export for any remaining direct imports
export const KAKAO_SPEC: PlatformSpec = {
  expectedWidth: 360,
  expectedHeight: 360,
  maxFileSizeBytes: 1_000_000,
  maxStaticFileSizeBytes: 150_000,
  allowedTypes: ['image/gif', 'image/webp', 'image/png'],
  setCountOptions: [24, 32],
  staticOnly: false,
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

export async function validateEmoticonFile(
  file: File,
  spec: PlatformSpec = KAKAO_SPEC
): Promise<SpecWarning[]> {
  const warnings: SpecWarning[] = []

  if (!spec.allowedTypes.includes(file.type)) {
    const fmtList = spec.allowedTypes.map((t) => t.split('/')[1].toUpperCase()).join('/')
    warnings.push({
      code: 'WRONG_FORMAT',
      message: `지원하지 않는 형식: ${file.type || '알 수 없음'} (${fmtList}만 허용)`,
    })
    return warnings
  }

  // Animated files not allowed on static-only platforms (e.g. YouTube)
  if (spec.staticOnly && file.type === 'image/gif') {
    warnings.push({
      code: 'ANIMATED_NOT_ALLOWED',
      message: `이 플랫폼은 정적 이미지만 지원합니다 (GIF 불가)`,
    })
  }

  // File size — static PNG gets stricter limit if defined
  const isStaticImage = file.type === 'image/png' || file.type === 'image/jpeg'
  const sizeLimit =
    isStaticImage && spec.maxStaticFileSizeBytes != null
      ? spec.maxStaticFileSizeBytes
      : spec.maxFileSizeBytes
  if (file.size > sizeLimit) {
    const limitKb = (sizeLimit / 1024).toFixed(0)
    warnings.push({
      code: 'TOO_LARGE',
      message: `파일 크기 초과: ${(file.size / 1024).toFixed(0)}KB (최대 ${limitKb}KB)`,
    })
  }

  const { width, height } = await measureImageDimensions(file)

  // Flexible dimension platforms (YouTube): check square + range
  if (spec.expectedWidth === null) {
    if (width !== height) {
      warnings.push({
        code: 'NOT_SQUARE',
        message: `정사각형이어야 합니다: 현재 ${width}×${height}px`,
      })
    } else {
      const min = spec.minDimension ?? 0
      const max = spec.maxDimension ?? Infinity
      if (width < min || width > max) {
        warnings.push({
          code: 'WRONG_SIZE_RANGE',
          message: `크기 범위 벗어남: ${width}px (${min}~${max}px 권장)`,
        })
      }
    }
  } else {
    // Exact dimension check
    if (width !== spec.expectedWidth || height !== (spec.expectedHeight ?? spec.expectedWidth)) {
      const expected = `${spec.expectedWidth}×${spec.expectedHeight ?? spec.expectedWidth}px`
      warnings.push({
        code: 'WRONG_SIZE',
        message: `크기 불일치: ${width}×${height}px (${expected} 권장)`,
      })
    }
  }

  return warnings
}
