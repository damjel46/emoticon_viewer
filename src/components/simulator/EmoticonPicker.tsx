import { useState, useRef, useEffect } from 'react'
import { useActiveEmoticons } from '../../store/emoticonStore'
import clsx from 'clsx'

function SmileyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="10" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="0.5" fill="currentColor" stroke="none" />
      <path d="M8.5 14.5c1 1.5 5.5 1.5 7 0" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

interface Props {
  onSelect: (emoticonId: string) => void
  open: boolean
  onToggle: () => void
  accentColor?: string
  queueMode?: boolean
  label?: string
  variant?: 'kakao' | 'naver'
  miniMode?: boolean
  onMiniModeChange?: (isMini: boolean) => void
}

type KakaoTab = 'emoticon' | 'mini'
type NaverTab = 'recent' | 'all'

export function EmoticonPicker({
  onSelect, open, onToggle,
  accentColor = '#fee500',
  queueMode = false,
  label,
  variant = 'kakao',
  miniMode,
  onMiniModeChange,
}: Props) {
  const emoticons = useActiveEmoticons()
  const [kakaoTab, setKakaoTab] = useState<KakaoTab>('emoticon')
  const [naverTab, setNaverTab] = useState<NaverTab>('all')
  const [recentIds, setRecentIds] = useState<string[]>([])

  // drag state
  const panelRef = useRef<HTMLDivElement>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const dragging = useRef<{ ox: number; oy: number; px: number; py: number } | null>(null)

  // sync kakaoTab with miniMode prop
  useEffect(() => {
    if (miniMode !== undefined) setKakaoTab(miniMode ? 'mini' : 'emoticon')
  }, [miniMode])

  // reset drag position when picker closes
  useEffect(() => {
    if (!open) setDragPos(null)
  }, [open])

  const isDisabled = emoticons.length === 0

  const handleSelect = (id: string) => {
    setRecentIds((prev) => [id, ...prev.filter((r) => r !== id)].slice(0, 20))
    onSelect(id)
    if (!queueMode) onToggle()
  }

  const handleKakaoTabClick = (tab: KakaoTab) => {
    setKakaoTab(tab)
    onMiniModeChange?.(tab === 'mini')
  }

  const onDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    const rect = panelRef.current?.getBoundingClientRect()
    if (!rect) return
    dragging.current = { ox: e.clientX, oy: e.clientY, px: rect.left, py: rect.top }

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return
      setDragPos({
        x: dragging.current.px + (ev.clientX - dragging.current.ox),
        y: dragging.current.py + (ev.clientY - dragging.current.oy),
      })
    }
    const onUp = () => {
      dragging.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  // ── 트리거 버튼 ──────────────────────────────────────────────
  const triggerButton = label ? (
    <button
      onClick={isDisabled ? undefined : onToggle}
      disabled={isDisabled}
      className={clsx(
        'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded transition-colors min-w-[44px]',
        isDisabled
          ? 'text-gray-300'
          : open ? 'text-gray-800 bg-gray-100' : 'text-gray-500 hover:bg-gray-100'
      )}
      title={isDisabled ? '이모티콘 없음 (먼저 업로드하세요)' : '이모티콘'}
    >
      <SmileyIcon />
      <span className="text-[10px] leading-none">{label}</span>
    </button>
  ) : (
    <button
      onClick={isDisabled ? undefined : onToggle}
      disabled={isDisabled}
      className={clsx(
        'w-9 h-9 rounded-full flex items-center justify-center transition-colors',
        isDisabled
          ? 'text-gray-300'
          : open ? 'text-gray-800' : 'text-gray-500 hover:text-gray-700'
      )}
      title={isDisabled ? '이모티콘 없음 (먼저 업로드하세요)' : '이모티콘'}
    >
      <SmileyIcon />
    </button>
  )

  if (!open) return <>{triggerButton}</>

  // ── 카카오 피커 ──────────────────────────────────────────────
  if (variant === 'kakao') {
    const panelStyle: React.CSSProperties = dragPos
      ? { position: 'fixed', left: dragPos.x, top: dragPos.y, width: '360px', borderRadius: '12px', zIndex: 50 }
      : { width: '360px', borderRadius: '12px 12px 0 0' }

    return (
      <>
        {triggerButton}
        <div
          ref={panelRef}
          className={clsx(
            'bg-white border border-gray-200 shadow-2xl flex flex-col overflow-hidden',
            !dragPos && 'absolute bottom-full left-0 z-20'
          )}
          style={panelStyle}
        >
          {/* 탭 바 (드래그 핸들) */}
          <div
            className="flex items-center border-b border-gray-200 select-none"
            style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
            onMouseDown={onDragStart}
          >
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => handleKakaoTabClick('emoticon')}
              className={clsx(
                'flex-none px-4 py-3 text-sm font-medium transition-colors relative',
                kakaoTab === 'emoticon' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              이모티콘
              {kakaoTab === 'emoticon' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />
              )}
            </button>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => handleKakaoTabClick('mini')}
              className={clsx(
                'flex-none px-4 py-3 text-sm font-medium transition-colors relative',
                kakaoTab === 'mini' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              미니 이모티콘
              {kakaoTab === 'mini' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />
              )}
            </button>
            <div className="flex-1" />
            <button
              onMouseDown={(e) => e.stopPropagation()}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-default"
            >
              <GridIcon />
            </button>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={onToggle}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 text-base cursor-default"
            >
              ✕
            </button>
          </div>

          {/* 팩 선택 행 */}
          <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-100 overflow-x-auto">
            <button className="flex-none w-9 h-9 rounded-lg flex items-center justify-center text-yellow-400 border-2 border-yellow-400 bg-yellow-50">
              <StarIcon />
            </button>
            {emoticons.length > 0 && (
              <button className="flex-none w-9 h-9 rounded-lg border-2 border-transparent hover:border-gray-200 overflow-hidden bg-gray-50 p-0.5">
                <img src={emoticons[0].dataUrl} alt="팩" className="w-full h-full object-contain" />
              </button>
            )}
          </div>

          {/* 이모티콘 그리드 */}
          <div className="grid grid-cols-4 overflow-y-auto" style={{ maxHeight: '280px' }}>
            {emoticons.length === 0 ? (
              <div className="col-span-4 flex items-center justify-center py-10 text-xs text-gray-400">
                이모티콘을 먼저 업로드하세요
              </div>
            ) : (
              emoticons.map((e) => (
                <button
                  key={e.id}
                  onClick={() => handleSelect(e.id)}
                  className="flex flex-col items-center justify-start px-1 pt-2 pb-1.5 hover:bg-gray-50 transition-colors"
                >
                  <img src={e.dataUrl} alt={e.name} className={clsx('object-contain', kakaoTab === 'mini' ? 'w-10 h-10' : 'w-16 h-16')} />
                  <span className="text-[10px] text-gray-500 mt-0.5 w-full text-center truncate leading-tight">
                    {e.name}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* 하단 프로모 배너 */}
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 border-t border-yellow-100"
            style={{ background: 'linear-gradient(90deg, #fff9e6 0%, #fffde0 100%)' }}
          >
            <div className="w-7 h-7 rounded-full bg-yellow-300 flex items-center justify-center text-sm flex-shrink-0">
              🐻
            </div>
            <span className="text-[11px] text-gray-600 flex-1">
              월 3,900원으로 미니 이모티콘까지 전부!
            </span>
            <span className="text-[11px] font-bold text-yellow-600 flex-shrink-0">구독하기</span>
          </div>
        </div>
      </>
    )
  }

  // ── 네이버 피커 (댓글용) ──────────────────────────────────────
  const naverDisplayed = naverTab === 'recent'
    ? recentIds.map((id) => emoticons.find((e) => e.id === id)).filter(Boolean) as typeof emoticons
    : emoticons

  return (
    <>
      {triggerButton}
      <div className="absolute bottom-full left-0 bg-white border border-gray-200 shadow-xl z-20 flex flex-col" style={{ width: '400px' }}>
        {/* 탭 바 */}
        <div className="flex items-center border-b border-gray-100 px-1">
          <button
            onClick={() => setNaverTab('recent')}
            className={clsx(
              'flex items-center justify-center w-10 h-10 transition-colors relative',
              naverTab === 'recent' ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'
            )}
            title="최근 사용"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {naverTab === 'recent' && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                style={{ backgroundColor: accentColor === '#fee500' ? '#666' : accentColor }}
              />
            )}
          </button>
          <button
            onClick={() => setNaverTab('all')}
            className={clsx(
              'flex items-center justify-center w-10 h-10 transition-colors relative',
              naverTab === 'all' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'
            )}
            title="이모티콘"
          >
            <img src={emoticons[0].dataUrl} alt="팩" className="w-6 h-6 object-contain rounded" />
            {naverTab === 'all' && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                style={{ backgroundColor: accentColor === '#fee500' ? '#666' : accentColor }}
              />
            )}
          </button>
          <div className="flex-1" />
          <button onClick={onToggle} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 text-lg">
            ✕
          </button>
        </div>

        {/* 섹션 레이블 */}
        <div className="px-3 py-1.5 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-medium text-gray-500">
            {naverTab === 'recent' ? '최근 사용' : '내 이모티콘'}
          </span>
        </div>

        {/* 그리드 */}
        <div className="grid grid-cols-4 overflow-y-auto max-h-64">
          {naverDisplayed.length === 0 ? (
            <div className="col-span-4 flex items-center justify-center py-8 text-xs text-gray-400">
              {naverTab === 'recent' ? '최근 사용한 이모티콘이 없습니다' : '이모티콘 없음'}
            </div>
          ) : (
            naverDisplayed.map((e) => (
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

        {queueMode && (
          <div className="px-3 py-1.5 border-t border-gray-100 bg-gray-50 text-[10px] text-gray-400">
            이모티콘을 클릭하면 입력창에 추가됩니다
          </div>
        )}
      </div>
    </>
  )
}
