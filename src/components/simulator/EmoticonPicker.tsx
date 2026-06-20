import { useState, useRef, useEffect } from 'react'
import { useActiveEmoticons, useActiveThumbnailId } from '../../store/emoticonStore'
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
  variant?: 'kakao' | 'naver' | 'youtube'
  miniMode?: boolean
  onMiniModeChange?: (isMini: boolean) => void
  packName?: string
}

type KakaoTab = 'emoticon' | 'mini'
type NaverTab = 'recent' | 'all'
type YouTubeTab = 'recent' | 'pack'

export function EmoticonPicker({
  onSelect, open, onToggle,
  accentColor = '#fee500',
  queueMode = false,
  label,
  variant = 'kakao',
  miniMode,
  onMiniModeChange,
  packName,
}: Props) {
  const emoticons = useActiveEmoticons()
  const thumbnailId = useActiveThumbnailId()
  const packIcon = emoticons.find((e) => e.id === thumbnailId) ?? emoticons[0]
  const [kakaoTab, setKakaoTab] = useState<KakaoTab>('emoticon')
  const [naverTab, setNaverTab] = useState<NaverTab>('all')
  const [youtubeTab, setYoutubeTab] = useState<YouTubeTab>('pack')
  const [ytSearch, setYtSearch] = useState('')
  const [recentIds, setRecentIds] = useState<string[]>([])

  // drag state
  const panelRef = useRef<HTMLDivElement>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const dragging = useRef<{ ox: number; oy: number; px: number; py: number } | null>(null)

  // sync kakaoTab with miniMode prop
  useEffect(() => {
    if (miniMode !== undefined) setKakaoTab(miniMode ? 'mini' : 'emoticon')
  }, [miniMode])

  // reset drag position and cleanup listeners when picker closes
  useEffect(() => {
    if (!open) {
      setDragPos(null)
      dragging.current = null
    }
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
            {packIcon && (
              <button className="flex-none w-9 h-9 rounded-lg border-2 border-transparent hover:border-gray-200 overflow-hidden bg-gray-50 p-0.5">
                <img src={packIcon.dataUrl} alt="팩" className="w-full h-full object-contain" />
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

  // ── YouTube 피커 ─────────────────────────────────────────────
  if (variant === 'youtube') {
    const ytRecent = recentIds.map((id) => emoticons.find((e) => e.id === id)).filter(Boolean) as typeof emoticons
    const ytDisplayed = youtubeTab === 'recent' ? ytRecent : emoticons
    const ytFiltered = ytSearch.trim()
      ? ytDisplayed.filter((e) => e.name.toLowerCase().includes(ytSearch.toLowerCase()))
      : ytDisplayed

    return (
      <>
        {triggerButton}
        <div
          className="absolute bottom-full right-0 z-20 flex flex-col overflow-hidden"
          style={{ width: 360, borderRadius: 12, backgroundColor: '#1f1f1f', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
        >
          {/* 검색바 */}
          <div className="px-3 pt-3 pb-2">
            <div className="flex items-center gap-2 rounded-full px-3 py-1.5" style={{ backgroundColor: '#383838' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={ytSearch}
                onChange={(e) => setYtSearch(e.target.value)}
                placeholder="이모티콘 검색"
                className="flex-1 bg-transparent text-xs outline-none"
                style={{ color: '#e0e0e0' }}
              />
              {ytSearch && (
                <button onClick={() => setYtSearch('')} className="text-gray-400 hover:text-gray-200 text-xs">✕</button>
              )}
            </div>
          </div>

          {/* 카테고리 탭 */}
          <div className="flex items-center gap-0.5 px-2 pb-1 border-b" style={{ borderColor: '#383838' }}>
            {/* 최근 탭 */}
            <button
              onClick={() => setYoutubeTab('recent')}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
              style={{ backgroundColor: youtubeTab === 'recent' ? '#383838' : 'transparent' }}
              title="최근 사용"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={youtubeTab === 'recent' ? '#fff' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
            {/* 팩 탭 — YouTube 로고 */}
            <button
              onClick={() => setYoutubeTab('pack')}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
              style={{ backgroundColor: youtubeTab === 'pack' ? '#383838' : 'transparent' }}
              title="이모티콘 팩"
            >
              <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
                <rect width="18" height="13" rx="3" fill="#ff0000" />
                <polygon points="7,3 14,6.5 7,10" fill="#fff" />
              </svg>
            </button>
            {/* 장식 아이콘들 (비활성) */}
            {[
              <svg key="face" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
              <svg key="gear" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
            ].map((icon, i) => (
              <button key={i} className="w-9 h-9 flex items-center justify-center rounded-lg">
                {icon}
              </button>
            ))}
          </div>

          {/* 팩 이름 헤더 */}
          {!ytSearch && (
            <div className="px-3 py-1.5">
              <span className="text-[11px] font-medium" style={{ color: '#aaa' }}>
                {youtubeTab === 'recent' ? '최근 사용' : (packName || '내 이모티콘')}
              </span>
            </div>
          )}

          {/* 이모티콘 그리드 */}
          <div className="grid grid-cols-6 overflow-y-auto px-1 pb-2" style={{ maxHeight: 240 }}>
            {ytFiltered.length === 0 ? (
              <div className="col-span-6 flex items-center justify-center py-8 text-xs" style={{ color: '#666' }}>
                {ytSearch ? '검색 결과 없음' : youtubeTab === 'recent' ? '최근 사용한 이모티콘 없음' : '이모티콘을 먼저 업로드하세요'}
              </div>
            ) : (
              ytFiltered.map((e) => (
                <button
                  key={e.id}
                  onClick={() => handleSelect(e.id)}
                  className="flex items-center justify-center p-1 rounded-lg transition-colors"
                  style={{ aspectRatio: '1' }}
                  onMouseEnter={(ev) => (ev.currentTarget.style.backgroundColor = '#383838')}
                  onMouseLeave={(ev) => (ev.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <img src={e.dataUrl} alt={e.name} className="w-10 h-10 object-contain" />
                </button>
              ))
            )}
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
            {packIcon
              ? <img src={packIcon.dataUrl} alt="팩" className="w-6 h-6 object-contain rounded" />
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="9" cy="10" r="0.5" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="0.5" fill="currentColor" stroke="none"/><path d="M8.5 14.5c1 1.5 5.5 1.5 7 0"/></svg>
            }
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
