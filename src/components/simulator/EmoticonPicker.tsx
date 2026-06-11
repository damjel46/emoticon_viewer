import { useState } from 'react'
import { useEmoticonStore } from '../../store/emoticonStore'
import clsx from 'clsx'

interface Props {
  onSelect: (emoticonId: string) => void
  open: boolean
  onToggle: () => void
  accentColor?: string
  queueMode?: boolean
}

type PickerTab = 'recent' | 'all'

export function EmoticonPicker({ onSelect, open, onToggle, accentColor = '#fee500', queueMode = false }: Props) {
  const emoticons = useEmoticonStore((s) => s.emoticons)
  const [tab, setTab] = useState<PickerTab>('all')
  const [recentIds, setRecentIds] = useState<string[]>([])

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

  const handleSelect = (id: string) => {
    setRecentIds((prev) => [id, ...prev.filter((r) => r !== id)].slice(0, 20))
    onSelect(id)
    if (!queueMode) onToggle()
  }

  const displayed = tab === 'recent'
    ? recentIds.map((id) => emoticons.find((e) => e.id === id)).filter(Boolean) as typeof emoticons
    : emoticons

  return (
    <>
      <button
        onClick={onToggle}
        className={clsx(
          'w-9 h-9 rounded-full flex items-center justify-center text-xl transition-colors',
          open ? 'opacity-100' : 'text-gray-500 hover:text-gray-700'
        )}
        title="이모티콘"
      >
        😄
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20 flex flex-col">
          {/* 탭 바 */}
          <div className="flex items-center border-b border-gray-100 px-1">
            <button
              onClick={() => setTab('recent')}
              className={clsx(
                'flex items-center justify-center w-10 h-10 transition-colors text-base',
                tab === 'recent' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'
              )}
              title="최근 사용"
            >
              🕐
            </button>
            <button
              onClick={() => setTab('all')}
              className={clsx(
                'flex items-center justify-center w-10 h-10 transition-colors relative text-base',
                tab === 'all' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'
              )}
              title="이모티콘"
            >
              😊
              {tab === 'all' && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                  style={{ backgroundColor: accentColor === '#fee500' ? '#666' : accentColor }}
                />
              )}
            </button>
            <div className="flex-1" />
            <button
              onClick={onToggle}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          </div>

          {/* 섹션 레이블 */}
          <div className="px-3 py-1.5 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-medium text-gray-500">
              {tab === 'recent' ? '최근 사용' : '기본'}
            </span>
          </div>

          {/* 이모티콘 그리드 */}
          <div className="grid grid-cols-5 overflow-y-auto max-h-52">
            {displayed.length === 0 ? (
              <div className="col-span-5 flex items-center justify-center py-8 text-xs text-gray-400">
                {tab === 'recent' ? '최근 사용한 이모티콘이 없습니다' : '이모티콘 없음'}
              </div>
            ) : (
              displayed.map((e) => (
                <button
                  key={e.id}
                  onClick={() => handleSelect(e.id)}
                  className="aspect-square flex items-center justify-center p-1.5 hover:bg-gray-100 transition-colors"
                >
                  <img src={e.dataUrl} alt={e.name} className="w-full h-full object-contain" />
                </button>
              ))
            )}
          </div>

          {/* 하단 툴바 (큐 모드일 때 안내) */}
          {queueMode && (
            <div className="px-3 py-1.5 border-t border-gray-100 bg-gray-50 text-[10px] text-gray-400">
              이모티콘을 클릭하면 입력창에 추가됩니다
            </div>
          )}
        </div>
      )}
    </>
  )
}
