import { useAnimStore } from '../../store/animStore'
import { useAnimationPlayer } from '../../hooks/useAnimationPlayer'
import type { GifFrame } from '../../types'
import clsx from 'clsx'

interface Props {
  dataUrl: string
  frames: GifFrame[]
  mimeType: string
}

export function AnimPlayer({ dataUrl, frames, mimeType }: Props) {
  const { isPlaying, play, pause } = useAnimStore()
  const { currentFrame } = useAnimationPlayer(frames)

  const isGif = mimeType === 'image/gif'
  const hasFrames = frames.length > 0

  const displaySrc =
    isGif && hasFrames && !isPlaying
      ? frames[currentFrame]?.dataUrl ?? dataUrl
      : dataUrl

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 프리뷰 */}
      <div className="relative w-[360px] h-[360px] bg-[repeating-conic-gradient(#e5e7eb_0%_25%,white_0%_50%)] bg-[length:20px_20px] rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center">
        <img
          src={displaySrc}
          alt="이모티콘 미리보기"
          className="max-w-full max-h-full object-contain"
          style={isGif && isPlaying ? {} : undefined}
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/30 rounded-full w-14 h-14 flex items-center justify-center">
              <span className="text-white text-2xl ml-1">▶</span>
            </div>
          </div>
        )}
      </div>

      {/* 컨트롤 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => (isPlaying ? pause() : play())}
          className={clsx(
            'flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors',
            isPlaying
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-[#fee500] text-gray-900 hover:bg-yellow-400'
          )}
        >
          {isPlaying ? '⏸ 일시정지' : '▶ 재생'}
        </button>
        {isGif && hasFrames && (
          <span className="text-xs text-gray-400">
            {currentFrame + 1} / {frames.length} 프레임
          </span>
        )}
        {mimeType === 'image/webp' && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            WEBP — 브라우저 재생
          </span>
        )}
      </div>
    </div>
  )
}
