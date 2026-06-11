import { useState } from 'react'
import { useEmoticonStore } from '../../store/emoticonStore'
import clsx from 'clsx'

interface Props {
  onSelect: (emoticonId: string) => void
  open: boolean
  onToggle: () => void
}

export function EmoticonPicker({ onSelect, open, onToggle }: Props) {
  const emoticons = useEmoticonStore((s) => s.emoticons)
  const [tab, setTab] = useState(0)

  if (emoticons.length === 0) {
    return (
      <button
        disabled
        className="w-9 h-9 rounded-full flex items-center justify-center text-xl text-gray-300"
        title="이모티콘 없음 (먼저 업로드하세요)"
      >
        😄
      </button>
    )
  }

  return (
    <>
      <button
        onClick={onToggle}
        className={clsx(
          'w-9 h-9 rounded-full flex items-center justify-center text-xl transition-colors',
          open ? 'text-[#3c1e1e]' : 'text-gray-500 hover:text-gray-700'
        )}
        title="이모티콘"
      >
        😄
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
          {/* 탭 헤더 */}
          <div className="flex border-b border-gray-100 text-xs font-medium">
            {['이모티콘', '최근 사용'].map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={clsx(
                  'px-4 py-2.5 border-b-2 transition-colors',
                  tab === i
                    ? 'border-[#3c1e1e] text-[#3c1e1e] font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                )}
              >
                {t}
              </button>
            ))}
            <div className="flex-1" />
            <button onClick={onToggle} className="px-3 text-gray-400 hover:text-gray-600 text-base">
              ✕
            </button>
          </div>

          {/* 세트 탭 아이콘 스크롤 바 */}
          <div className="flex gap-1 px-2 py-1.5 border-b border-gray-100 overflow-x-auto bg-gray-50">
            {emoticons.slice(0, 8).map((e) => (
              <div
                key={e.id}
                className="w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center bg-white border border-gray-200 overflow-hidden"
              >
                <img src={e.dataUrl} alt="" className="w-full h-full object-contain p-0.5" />
              </div>
            ))}
          </div>

          {/* 이모티콘 그리드 */}
          <div className="grid grid-cols-4 gap-0 overflow-y-auto max-h-48">
            {emoticons.map((e) => (
              <button
                key={e.id}
                onClick={() => { onSelect(e.id); onToggle() }}
                className="aspect-square flex items-center justify-center p-2 hover:bg-gray-100 transition-colors"
              >
                <img src={e.dataUrl} alt={e.name} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
