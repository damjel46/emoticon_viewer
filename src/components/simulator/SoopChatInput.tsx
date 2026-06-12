import { useState, useRef } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useActiveEmoticons } from '../../store/emoticonStore'
import { useThemeStore } from '../../store/themeStore'
import type { ContentSegment } from '../../types'

// ── 아이콘 ─────────────────────────────────────────────────────
function PlusCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function SmileyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="10" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="0.5" fill="currentColor" stroke="none" />
      <path d="M8.5 14.5c1 1.5 5.5 1.5 7 0" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

// ── SOOP 이모티콘 피커 ─────────────────────────────────────────
interface PickerProps {
  onSelect: (id: string) => void
  onClose: () => void
  isDark: boolean
  accentColor: string
}

type SoopTab = 'recent' | 'all'

function SoopEmoticonPicker({ onSelect, onClose, isDark, accentColor }: PickerProps) {
  const emoticons = useActiveEmoticons()
  const [tab, setTab] = useState<SoopTab>('all')
  const [recentIds, setRecentIds] = useState<string[]>([])

  const bg = isDark ? '#1e1e1e' : '#ffffff'
  const border = isDark ? '#333333' : '#e5e7eb'
  const textPrimary = isDark ? '#e0e0e0' : '#141414'
  const textSecondary = isDark ? '#888888' : '#9ca3af'
  const sectionBg = isDark ? '#2a2a2a' : '#f3f4f6'

  const displayed = tab === 'recent'
    ? recentIds.map(id => emoticons.find(e => e.id === id)).filter(Boolean) as typeof emoticons
    : emoticons

  const handleSelect = (id: string) => {
    setRecentIds(prev => [id, ...prev.filter(r => r !== id)].slice(0, 20))
    onSelect(id)
  }

  return (
    <div
      className="absolute bottom-full left-0 flex flex-col overflow-hidden z-30"
      style={{ width: '100%', maxWidth: '372px', background: bg, border: `1px solid ${border}`, borderBottom: 'none', borderRadius: '8px 8px 0 0' }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: `1px solid ${border}` }}>
        <span className="text-sm font-semibold" style={{ color: textPrimary }}>이모티콘</span>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100" style={{ color: textSecondary }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* 탭 바 */}
      <div className="flex items-center px-1" style={{ borderBottom: `1px solid ${border}` }}>
        {/* 이전 화살표 */}
        <button className="w-7 h-10 flex items-center justify-center flex-shrink-0" style={{ color: textSecondary }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* 최근 탭 (시계) */}
        <button
          onClick={() => setTab('recent')}
          className="flex items-center justify-center w-10 h-10 relative transition-colors"
          style={{ color: tab === 'recent' ? accentColor : textSecondary }}
        >
          <ClockIcon />
          {tab === 'recent' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ background: accentColor }} />
          )}
        </button>

        {/* 즐겨찾기 (별) */}
        <button
          className="flex items-center justify-center w-10 h-10 relative"
          style={{ color: textSecondary }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>

        {/* 전체 탭 (이모티콘 썸네일) */}
        <button
          onClick={() => setTab('all')}
          className="flex items-center justify-center w-10 h-10 relative transition-colors"
        >
          {emoticons.length > 0 ? (
            <img src={emoticons[0].dataUrl} alt="팩" className="w-6 h-6 object-contain rounded" />
          ) : (
            <SmileyIcon />
          )}
          {tab === 'all' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ background: accentColor }} />
          )}
        </button>

        {/* 동물 아이콘 (장식) */}
        <button
          className="flex items-center justify-center w-10 h-10"
          style={{ color: textSecondary }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M7 8 Q6 4 9 5" /><path d="M17 8 Q18 4 15 5" />
            <circle cx="9" cy="11" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="11" r="1" fill="currentColor" stroke="none" />
            <path d="M9 15c1 1.5 5 1.5 6 0" />
          </svg>
        </button>

        <div className="flex-1" />

        {/* 다음 화살표 */}
        <button className="w-7 h-10 flex items-center justify-center flex-shrink-0" style={{ color: textSecondary }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* 섹션 레이블 */}
      <div className="px-3 py-1" style={{ background: sectionBg }}>
        <span className="text-xs" style={{ color: textSecondary }}>
          {tab === 'recent' ? '최근 사용' : '기본'}
        </span>
      </div>

      {/* 이모티콘 그리드 */}
      <div className="grid grid-cols-6 overflow-y-auto" style={{ maxHeight: '168px', background: bg }}>
        {displayed.length === 0 ? (
          <div className="col-span-6 flex items-center justify-center py-8 text-xs" style={{ color: textSecondary }}>
            {tab === 'recent' ? '최근 사용한 이모티콘이 없습니다' : '이모티콘 없음'}
          </div>
        ) : (
          displayed.map((e) => (
            <button
              key={e.id}
              onClick={() => handleSelect(e.id)}
              className="aspect-square flex items-center justify-center p-2 transition-colors"
              style={{ ['--hover-bg' as string]: isDark ? '#2a2a2a' : '#f3f4f6' }}
              onMouseEnter={ev => (ev.currentTarget.style.background = isDark ? '#2a2a2a' : '#f3f4f6')}
              onMouseLeave={ev => (ev.currentTarget.style.background = 'transparent')}
            >
              <img src={e.dataUrl} alt={e.name} className="w-full h-full object-contain" />
            </button>
          ))
        )}
      </div>
    </div>
  )
}

// ── SOOP 채팅 입력 ─────────────────────────────────────────────
export function SoopChatInput() {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [hasContent, setHasContent] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const { addMessage, currentSender } = useChatStore()
  const emoticons = useActiveEmoticons()
  const theme = useThemeStore(s => s.getCurrentTheme())

  // 다크 모드 판별
  const bgHex = theme.bgColor.replace('#', '')
  const r = parseInt(bgHex.slice(0, 2), 16)
  const g = parseInt(bgHex.slice(2, 4), 16)
  const b = parseInt(bgHex.slice(4, 6), 16)
  const isDark = (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.4

  const accentColor = '#0545b1'
  const bg = isDark ? '#111111' : '#ffffff'
  const border = isDark ? '#2a2a2a' : '#e5e7eb'
  const textColor = isDark ? '#e0e0e0' : '#141414'
  const inputBg = isDark ? '#1e1e1e' : '#f3f4f6'
  const iconColor = isDark ? '#888888' : '#6b7280'

  // contentEditable 노드를 순서대로 순회해서 세그먼트 추출
  const extractSegments = (): ContentSegment[] => {
    if (!editorRef.current) return []
    const segments: ContentSegment[] = []
    let currentText = ''

    const flush = () => {
      const t = currentText.trim()
      if (t) segments.push({ kind: 'text', value: t })
      currentText = ''
    }

    const walk = (nodes: NodeList) => {
      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          currentText += node.textContent ?? ''
        } else if ((node as Element).nodeName === 'IMG') {
          flush()
          const id = (node as HTMLElement).dataset.eid
          if (id) segments.push({ kind: 'emoticon', emoticonId: id })
        } else if ((node as Element).nodeName === 'BR') {
          currentText += ' '
        } else {
          walk(node.childNodes)
        }
      })
    }

    walk(editorRef.current.childNodes)
    flush()
    return segments
  }

  const checkHasContent = () => {
    if (!editorRef.current) return
    const segs = extractSegments()
    setHasContent(segs.length > 0)
  }

  const send = () => {
    if (!editorRef.current || !hasContent) return
    const segments = extractSegments()
    if (segments.length === 0) return

    const textSegs = segments.filter((s): s is { kind: 'text'; value: string } => s.kind === 'text')
    const emoteSegs = segments.filter((s): s is { kind: 'emoticon'; emoticonId: string } => s.kind === 'emoticon')
    const hasText = textSegs.length > 0
    const hasEmotes = emoteSegs.length > 0
    const type = hasText && hasEmotes ? 'mixed' : hasEmotes ? 'emoticon' : 'text'

    addMessage({
      sender: currentSender,
      type,
      segments,
      text: hasText ? textSegs.map(s => s.value).join(' ') : undefined,
      emoticonIds: hasEmotes ? emoteSegs.map(s => s.emoticonId) : undefined,
    })
    editorRef.current.innerHTML = ''
    setHasContent(false)
    setPickerOpen(false)
  }

  const handleEmoticonSelect = (emoticonId: string) => {
    const emote = emoticons.find(e => e.id === emoticonId)
    if (!emote || !editorRef.current) return

    // 커서 위치에 이모티콘 이미지 삽입
    const img = document.createElement('img')
    img.src = emote.dataUrl
    img.dataset.eid = emoticonId
    img.style.cssText = 'width:22px;height:22px;object-fit:contain;display:inline-block;vertical-align:middle;margin:0 1px'

    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && editorRef.current.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      const range = sel.getRangeAt(0)
      range.deleteContents()
      range.insertNode(img)
      range.setStartAfter(img)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    } else {
      editorRef.current.appendChild(img)
    }

    editorRef.current.focus()
    setHasContent(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="relative flex flex-col" style={{ background: bg, borderTop: `1px solid ${border}` }}>
      {/* SOOP 이모티콘 피커 */}
      {pickerOpen && (
        <SoopEmoticonPicker
          onSelect={handleEmoticonSelect}
          onClose={() => setPickerOpen(false)}
          isDark={isDark}
          accentColor={accentColor}
        />
      )}

      {/* 아이콘 툴바 */}
      <div className="flex items-center gap-3 px-3 py-2" style={{ borderBottom: `1px solid ${border}` }}>
        <button className="flex items-center justify-center transition-opacity hover:opacity-70" style={{ color: iconColor }}>
          <PlusCircleIcon />
        </button>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border" style={{ color: iconColor, borderColor: border }}>
          AD
        </span>
        <button className="flex items-center justify-center transition-opacity hover:opacity-70" style={{ color: iconColor }}>
          <CartIcon />
        </button>
      </div>

      {/* 통합 입력 행 */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* contentEditable 인라인 입력창 */}
        <div className="relative flex-1">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={checkHasContent}
            onKeyDown={handleKeyDown}
            className="w-full rounded px-3 py-1.5 text-sm outline-none min-h-[34px] max-h-20 overflow-y-auto leading-6"
            style={{
              background: inputBg,
              color: textColor,
              border: `1px solid ${border}`,
              wordBreak: 'break-all',
            }}
          />
          {/* placeholder */}
          {!hasContent && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none select-none"
              style={{ color: isDark ? '#555' : '#9ca3af' }}
            >
              채팅 입력(c)
            </span>
          )}
        </div>

        <button
          onClick={() => setPickerOpen(v => !v)}
          className="flex items-center justify-center w-8 h-8 rounded transition-colors flex-shrink-0"
          style={{ color: pickerOpen ? accentColor : iconColor }}
        >
          <SmileyIcon />
        </button>
        <button
          onClick={send}
          disabled={!hasContent}
          className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded transition-colors disabled:opacity-30"
          style={{ background: accentColor, color: '#ffffff' }}
        >
          전송
        </button>
      </div>
    </div>
  )
}
