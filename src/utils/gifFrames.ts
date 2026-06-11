import type { GifFrame } from '../types'

export async function extractGifFrames(file: File): Promise<GifFrame[]> {
  try {
    const { GifReader } = await import('omggif')
    const buffer = await file.arrayBuffer()
    const reader = new GifReader(new Uint8Array(buffer))
    const frames: GifFrame[] = []
    const canvas = document.createElement('canvas')
    canvas.width = reader.width
    canvas.height = reader.height
    const ctx = canvas.getContext('2d')!

    // Accumulate frames properly (GIF disposal method)
    const prev = ctx.createImageData(reader.width, reader.height)

    for (let i = 0; i < reader.numFrames(); i++) {
      const info = reader.frameInfo(i)
      const frameData = new Uint8ClampedArray(reader.width * reader.height * 4)
      reader.decodeAndBlitFrameRGBA(i, frameData)
      const imageData = new ImageData(frameData, reader.width, reader.height)

      // Respect disposal method 2 (restore to bg) — simple composite
      if (info.disposal === 2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      } else if (i > 0) {
        ctx.putImageData(prev, 0, 0)
      }
      ctx.putImageData(imageData, info.x ?? 0, info.y ?? 0)

      // Save current frame as dataUrl
      const dataUrl = canvas.toDataURL('image/png')
      frames.push({
        index: i,
        delayMs: Math.max((info.delay ?? 10) * 10, 50),
        dataUrl,
      })

      // Store for next iteration
      const current = ctx.getImageData(0, 0, canvas.width, canvas.height)
      prev.data.set(current.data)
    }

    return frames
  } catch (err) {
    console.warn('GIF 프레임 추출 실패:', err)
    return []
  }
}
