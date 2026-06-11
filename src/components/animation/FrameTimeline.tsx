import { useAnimStore } from '../../store/animStore'
import type { GifFrame } from '../../types'
import clsx from 'clsx'

interface Props {
  frames: GifFrame[]
}

export function FrameTimeline({ frames }: Props) {
  const { currentFrame, setFrame } = useAnimStore()

  if (frames.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-400 text-center">
        GIF 파일을 업로드하면 프레임 타임라인이 표시됩니다
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600">
          프레임 타임라인 ({frames.length}프레임)
        </span>
        <span className="text-xs text-gray-400">
          현재: {currentFrame + 1} / {frames.length} 프레임
        </span>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {frames.map((frame, i) => (
          <button
            key={i}
            onClick={() => setFrame(i)}
            className={clsx(
              'flex-shrink-0 w-12 rounded-lg overflow-hidden border-2 transition-all',
              currentFrame === i ? 'border-[#fee500] shadow-md' : 'border-transparent hover:border-gray-300'
            )}
            title={`프레임 ${i + 1} (${frame.delayMs}ms)`}
          >
            <img
              src={frame.dataUrl}
              alt={`프레임 ${i + 1}`}
              className="w-12 h-12 object-contain bg-gray-50"
            />
            <div className={clsx(
              'text-[8px] text-center py-0.5',
              currentFrame === i ? 'bg-[#fee500] text-gray-800' : 'bg-gray-100 text-gray-400'
            )}>
              {i + 1}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
