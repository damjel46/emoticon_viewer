import { useState, useRef } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useActiveEmoticons } from '../../store/emoticonStore'
import { useActiveSetName } from '../../store/emoticonStore'
import type { ContentSegment } from '../../types'

const TWITCH_BG = '#18181b'
const TWITCH_BORDER = '#2d2d2d'
const TWITCH_ACCENT = '#9146ff'
const TWITCH_TEXT = '#efeff1'
const TWITCH_MUTED = '#adadb8'
const TWITCH_HOVER = '#26262c'

// ── 트위치 이모티콘 피커 ─────────────────────────────────────────
interface TwitchPickerProps {
  onSelect: (id: string) => void
  onClose: () => void
  packName?: string
}

function TwitchEmoticonPicker({ onSelect, onClose, packName }: TwitchPickerProps) {
  const emoticons = useActiveEmoticons()
  const [search, setSearch] = useState('')
  const [recentIds, setRecentIds] = useState<string[]>([])
  const [sectionOpen, setSectionOpen] = useState(true)

  const recent = recentIds.map(id => emoticons.find(e => e.id === id)).filter(Boolean) as typeof emoticons
  const filtered = search.trim()
    ? emoticons.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
    : emoticons

  const handleSelect = (id: string) => {
    setRecentIds(prev => [id, ...prev.filter(r => r !== id)].slice(0, 20))
    onSelect(id)
  }

  return (
    <div
      className="absolute bottom-full left-0 z-30 flex flex-col overflow-hidden"
      style={{ width: '100%', maxWidth: '360px', backgroundColor: TWITCH_BG, border: `1px solid ${TWITCH_BORDER}`, borderBottom: 'none', borderRadius: '4px 4px 0 0' }}
    >
      {/* 검색바 */}
      <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: `1px solid ${TWITCH_BORDER}` }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TWITCH_MUTED} strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="이모티콘 검색"
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: TWITCH_TEXT }}
        />
        <button onClick={onClose} style={{ color: TWITCH_MUTED }} className="hover:text-white transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: 280 }}>
        {/* 자주 사용 섹션 */}
        {!search && recent.length > 0 && (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TWITCH_MUTED} strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: TWITCH_MUTED }}>자주 사용</span>
            </div>
            <div className="grid grid-cols-5 px-1 pb-2">
              {recent.map(e => (
                <button
                  key={e.id}
                  onClick={() => handleSelect(e.id)}
                  className="aspect-square flex items-center justify-center p-2 rounded transition-colors"
                  onMouseEnter={ev => (ev.currentTarget.style.backgroundColor = TWITCH_HOVER)}
                  onMouseLeave={ev => (ev.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <img src={e.dataUrl} alt={e.name} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </>
        )}

        {/* 팩 섹션 */}
        {!search && emoticons.length > 0 && (
          <>
            {/* 팩 헤더 행 */}
            <button
              onClick={() => setSectionOpen(v => !v)}
              className="w-full flex items-center gap-2 px-3 py-2 transition-colors text-left"
              style={{ borderTop: recent.length > 0 ? `1px solid ${TWITCH_BORDER}` : undefined }}
              onMouseEnter={ev => (ev.currentTarget.style.backgroundColor = TWITCH_HOVER)}
              onMouseLeave={ev => (ev.currentTarget.style.backgroundColor = 'transparent')}
            >
              <img src={emoticons[0].dataUrl} alt="팩" className="w-7 h-7 object-contain rounded flex-shrink-0" />
              <span className="flex-1 text-sm font-medium truncate" style={{ color: TWITCH_TEXT }}>
                {packName || '이모티콘 팩'}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TWITCH_MUTED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: sectionOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {sectionOpen && (
              <div className="grid grid-cols-5 px-1 pb-2">
                {emoticons.map(e => (
                  <button
                    key={e.id}
                    onClick={() => handleSelect(e.id)}
                    className="aspect-square flex items-center justify-center p-2 rounded transition-colors"
                    onMouseEnter={ev => (ev.currentTarget.style.backgroundColor = TWITCH_HOVER)}
                    onMouseLeave={ev => (ev.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <img src={e.dataUrl} alt={e.name} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* 검색 결과 */}
        {search && (
          <div className="grid grid-cols-5 px-1 py-2">
            {filtered.length === 0 ? (
              <div className="col-span-5 flex items-center justify-center py-6 text-xs" style={{ color: TWITCH_MUTED }}>
                검색 결과 없음
              </div>
            ) : (
              filtered.map(e => (
                <button
                  key={e.id}
                  onClick={() => handleSelect(e.id)}
                  className="aspect-square flex items-center justify-center p-2 rounded"
                  onMouseEnter={ev => (ev.currentTarget.style.backgroundColor = TWITCH_HOVER)}
                  onMouseLeave={ev => (ev.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <img src={e.dataUrl} alt={e.name} className="w-full h-full object-contain" />
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── 트위치 채팅 입력 ─────────────────────────────────────────────
export function TwitchChatInput() {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [hasContent, setHasContent] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const { addMessage } = useChatStore()
  const emoticons = useActiveEmoticons()
  const packName = useActiveSetName()

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
      sender: '상대방',
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

    const img = document.createElement('img')
    img.src = emote.dataUrl
    img.dataset.eid = emoticonId
    img.style.cssText = 'width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;margin:0 1px'

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
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="relative flex flex-col" style={{ backgroundColor: TWITCH_BG, borderTop: `1px solid ${TWITCH_BORDER}` }}>
      {/* 피커 */}
      {pickerOpen && (
        <TwitchEmoticonPicker
          onSelect={handleEmoticonSelect}
          onClose={() => setPickerOpen(false)}
          packName={packName ?? undefined}
        />
      )}

      {/* 입력 행 */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* contentEditable 입력창 */}
        <div className="relative flex-1">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={checkHasContent}
            onKeyDown={handleKeyDown}
            className="w-full rounded px-3 py-1.5 text-sm outline-none min-h-[34px] max-h-20 overflow-y-auto leading-6"
            style={{ backgroundColor: '#26262c', color: TWITCH_TEXT, border: `1px solid ${TWITCH_BORDER}`, wordBreak: 'break-all' }}
          />
          {!hasContent && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none select-none" style={{ color: '#5a5a6a' }}>
              메시지 보내기
            </span>
          )}
        </div>

        {/* 스피커 (장식) */}
        <button className="w-8 h-8 flex items-center justify-center rounded transition-colors flex-shrink-0" style={{ color: TWITCH_MUTED }}
          onMouseEnter={ev => (ev.currentTarget.style.color = TWITCH_TEXT)}
          onMouseLeave={ev => (ev.currentTarget.style.color = TWITCH_MUTED)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </button>

        {/* 이모티콘 버튼 */}
        <button
          onClick={() => setPickerOpen(v => !v)}
          className="w-8 h-8 flex items-center justify-center rounded transition-colors flex-shrink-0"
          style={{ color: pickerOpen ? TWITCH_ACCENT : TWITCH_MUTED }}
          onMouseEnter={ev => { if (!pickerOpen) ev.currentTarget.style.color = TWITCH_TEXT }}
          onMouseLeave={ev => { if (!pickerOpen) ev.currentTarget.style.color = TWITCH_MUTED }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="9" cy="10" r="0.5" fill="currentColor" stroke="none" />
            <circle cx="15" cy="10" r="0.5" fill="currentColor" stroke="none" />
            <path d="M8.5 14.5c1 1.5 5.5 1.5 7 0" />
          </svg>
        </button>
      </div>

      {/* 하단 바 */}
      <div className="flex items-center justify-between px-3 pb-2">
        <div className="flex items-center gap-3">
          {/* 비트 (장식) */}
          <div className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill={TWITCH_ACCENT}>
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
            <span className="text-xs" style={{ color: TWITCH_MUTED }}>0</span>
          </div>
        </div>

        <button
          onClick={send}
          disabled={!hasContent}
          className="text-xs font-bold px-4 py-1.5 rounded transition-colors"
          style={{ backgroundColor: hasContent ? TWITCH_ACCENT : '#3d3d4a', color: hasContent ? '#fff' : '#6b6b7a' }}
        >
          채팅
        </button>
      </div>
    </div>
  )
}
