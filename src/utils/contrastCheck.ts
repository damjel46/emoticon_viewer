function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const [rl, gl, bl] = [r, g, b].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1)
  const l2 = luminance(hex2)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

export function borderVisibilityWarning(bgColor: string): string | null {
  const whiteRatio = contrastRatio('#ffffff', bgColor)
  const blackRatio = contrastRatio('#000000', bgColor)

  if (whiteRatio < 2.0) {
    return `이 배경에서 흰색 테두리가 잘 보이지 않을 수 있습니다 (명암비 ${whiteRatio.toFixed(1)}:1)`
  }
  if (blackRatio < 2.0) {
    return `이 배경에서 검정 테두리가 잘 보이지 않을 수 있습니다 (명암비 ${blackRatio.toFixed(1)}:1)`
  }
  return null
}
