import { useState, useRef } from 'react'
import type { GifFrame, SpecWarning } from '../types'
import { validateEmoticonFile } from '../utils/specValidator'
import { extractGifFrames } from '../utils/gifFrames'
import { useAnimStore } from '../store/animStore'
import { AnimPlayer } from '../components/animation/AnimPlayer'
import { FrameTimeline } from '../components/animation/FrameTimeline'
import { SpeedControl } from '../components/animation/SpeedControl'
import { SpecReport } from '../components/animation/SpecReport'

interface LoadedFile {
  dataUrl: string
  name: string
  mimeType: string
  frames: GifFrame[]
  warnings: SpecWarning[]
}

export function AnimationPage() {
  const [loaded, setLoaded] = useState<LoadedFile | null>(null)
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const reset = useAnimStore((s) => s.reset)

  const handleFile = async (file: File) => {
    setProcessing(true)
    reset()

    const [warnings, frames, dataUrl] = await Promise.all([
      validateEmoticonFile(file),
      file.type === 'image/gif' ? extractGifFrames(file) : Promise.resolve([] as GifFrame[]),
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      }),
    ])

    setLoaded({ dataUrl, name: file.name, mimeType: file.type, frames, warnings })
    setProcessing(false)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
        <h1 className="text-lg font-bold text-gray-800">애니메이션 컨트롤러</h1>
        <p className="text-xs text-gray-400 mt-0.5">GIF/WEBP/PNG 파일의 재생 속도와 프레임을 검사합니다</p>
      </div>

      <div className="flex gap-6 px-6 py-5 flex-1">
        {/* 좌측: 업로드 + 플레이어 */}
        <div className="flex flex-col gap-5 flex-1">
          {/* 파일 선택 */}
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-gray-100"
          >
            <div className="text-3xl mb-2">🎬</div>
            <p className="font-semibold text-gray-700">GIF / WEBP / PNG 파일 선택</p>
            <p className="text-xs text-gray-400 mt-1">클릭하여 파일을 선택합니다</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/gif,image/webp,image/png"
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = '' }}
              className="hidden"
            />
          </div>

          {processing && (
            <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
              <span className="animate-spin mr-2">⏳</span> 파일 분석 중...
            </div>
          )}

          {loaded && !processing && (
            <AnimPlayer dataUrl={loaded.dataUrl} frames={loaded.frames} mimeType={loaded.mimeType} />
          )}
        </div>

        {/* 우측: 컨트롤 + 타임라인 + 스펙 */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-5">
          {loaded && !processing && (
            <>
              <SpeedControl />
              <SpecReport warnings={loaded.warnings} fileName={loaded.name} />
              {loaded.mimeType === 'image/gif' && (
                <FrameTimeline frames={loaded.frames} />
              )}
              {loaded.mimeType === 'image/webp' && (
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-400 text-center">
                  WEBP 프레임 타임라인은 지원되지 않습니다
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                <p className="font-semibold text-gray-600 mb-2">파일 정보</p>
                <p>파일명: {loaded.name}</p>
                <p>형식: {loaded.mimeType}</p>
                {loaded.frames.length > 0 && <p>프레임 수: {loaded.frames.length}개</p>}
              </div>
            </>
          )}

          {!loaded && !processing && (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-400 text-center">
              파일을 선택하면 스펙 검사 및<br />애니메이션 컨트롤이 표시됩니다
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
