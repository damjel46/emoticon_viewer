import { useEffect, useState } from 'react'
import { fetchShare } from '../utils/uploadShare'
import type { EmoticonFile } from '../types'

export function MobilePreviewPage() {
  const [emoticons, setEmoticons] = useState<EmoticonFile[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, '')
    if (!id) { setLoaded(true); return }

    fetchShare(id).then((payload) => {
      if (payload) setEmoticons(payload.emoticons as EmoticonFile[])
      setLoaded(true)
    })
  }, [])

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <span className="text-gray-400 text-sm">불러오는 중...</span>
      </div>
    )
  }

  if (emoticons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
        <div className="text-5xl mb-4">📂</div>
        <p className="font-semibold text-gray-700 mb-2">이모티콘이 없습니다</p>
        <p className="text-sm text-gray-400">
          데스크탑에서 이모티콘을 업로드하고<br />QR 코드를 다시 스캔해주세요
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#b2c7d9]">
      <div className="bg-[#b2c7d9] px-4 py-3 flex items-center gap-2 sticky top-0 z-10">
        <div className="text-sm font-semibold text-gray-800">이모티콘 미리보기</div>
        <div className="ml-auto text-xs text-gray-500">{emoticons.length}종</div>
      </div>

      <div className="px-4 pb-8">
        <div className="grid grid-cols-3 gap-3">
          {emoticons.map((e) => (
            <div
              key={e.id}
              className="aspect-square bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm"
            >
              <img
                src={e.dataUrl}
                alt={e.name}
                className="w-full h-full object-contain p-2"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-center">
        <p className="text-[10px] text-gray-400">카카오 이모티콘 워크스페이스 · 모바일 미리보기</p>
      </div>
    </div>
  )
}
