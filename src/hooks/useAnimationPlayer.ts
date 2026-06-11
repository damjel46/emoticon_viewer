import { useEffect, useRef } from 'react'
import { useAnimStore } from '../store/animStore'
import type { GifFrame } from '../types'

export function useAnimationPlayer(frames: GifFrame[]) {
  const { isPlaying, speedMultiplier, currentFrame, setFrame, setTotalFrames } = useAnimStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setTotalFrames(frames.length)
  }, [frames.length, setTotalFrames])

  useEffect(() => {
    if (!isPlaying || frames.length === 0) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    const frame = frames[currentFrame]
    if (!frame) return

    const delay = frame.delayMs / speedMultiplier

    timerRef.current = setTimeout(() => {
      setFrame((currentFrame + 1) % frames.length)
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isPlaying, currentFrame, frames, speedMultiplier, setFrame])

  return { currentFrame, totalFrames: frames.length }
}
