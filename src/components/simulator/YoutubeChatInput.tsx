import { useState, useRef } from 'react'
import clsx from 'clsx'
import { useChatStore } from '../../store/chatStore'
import { useActiveEmoticons } from '../../store/emoticonStore'
import { useActiveSetName } from '../../store/emoticonStore'
import type { ContentSegment } from '../../types'

// ── YouTube 이모티콘 피커 ─────────────────────────────────────────
interface YTPickerProps {
  onSelect: (id: string) => void
  onClose: () => void
  packName?: string
}

function YoutubeEmoticonPicker({ onSelect, onClose, packName }: YTPickerProps) {
  const emoticons = useActiveEmoticons()
  const [tab, setTab] = useState<'recent' | 'pack'>('pack')
  const [search, setSearch] = useState('')
  const [recentIds, setRecentIds] = useState<string[]>([])

  const recent = recentIds.map(id => emoticons.find(e => e.id === id)).filter(Boolean) as typeof emoticons
  const displayed = tab === 'recent' ? recent : emoticons
  const filtered = search.trim()
    ? emoticons.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
    : displayed

  const handleSelect = (id: string) => {
    setRecentIds(prev => [id, ...prev.filter(r => r !== id)].slice(0, 20))
    onSelect(id)
  }

  return (
    <div
      className="absolute bottom-full right-0 z-30 flex flex-col overflow-hidden"
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
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="이모티콘 검색"
            className="flex-1 bg-transparent text-xs outline-none"
            style={{ color: '#e0e0e0' }}
          />
          {search
            ? <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-200 text-xs">✕</button>
            : <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-xs">✕</button>
          }
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex items-center gap-0.5 px-2 pb-1 border-b" style={{ borderColor: '#383838' }}>
        <button
          onClick={() => setTab('recent')}
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
          style={{ backgroundColor: tab === 'recent' ? '#383838' : 'transparent' }}
          title="최근 사용"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tab === 'recent' ? '#fff' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
        <button
          onClick={() => setTab('pack')}
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
          style={{ backgroundColor: tab === 'pack' ? '#383838' : 'transparent' }}
          title="이모티콘 팩"
        >
          <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
            <rect width="18" height="13" rx="3" fill="#ff0000" />
            <polygon points="7,3 14,6.5 7,10" fill="#fff" />
          </svg>
        </button>
        {[
          <svg key="face" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>,
          <svg key="gear" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>,
        ].map((icon, i) => (
          <button key={i} className="w-9 h-9 flex items-center justify-center rounded-lg">{icon}</button>
        ))}
      </div>

      {/* 팩 이름 헤더 */}
      {!search && (
        <div className="px-3 py-1.5">
          <span className="text-[11px] font-medium" style={{ color: '#aaa' }}>
            {tab === 'recent' ? '최근 사용' : (packName || '내 이모티콘')}
          </span>
        </div>
      )}

      {/* 그리드 */}
      <div className="grid grid-cols-6 overflow-y-auto px-1 pb-2" style={{ maxHeight: 240 }}>
        {filtered.length === 0 ? (
          <div className="col-span-6 flex items-center justify-center py-8 text-xs" style={{ color: '#666' }}>
            {search ? '검색 결과 없음' : tab === 'recent' ? '최근 사용한 이모티콘 없음' : '이모티콘을 먼저 업로드하세요'}
          </div>
        ) : (
          filtered.map(e => (
            <button
              key={e.id}
              onClick={() => handleSelect(e.id)}
              className="flex items-center justify-center p-1 rounded-lg"
              style={{ aspectRatio: '1' }}
              onMouseEnter={ev => (ev.currentTarget.style.backgroundColor = '#383838')}
              onMouseLeave={ev => (ev.currentTarget.style.backgroundColor = 'transparent')}
            >
              <img src={e.dataUrl} alt={e.name} className="w-10 h-10 object-contain" />
            </button>
          ))
        )}
      </div>
    </div>
  )
}

// ── YouTube 채팅 입력 ─────────────────────────────────────────────
export function YoutubeChatInput() {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [hasContent, setHasContent] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const { addMessage, currentSender, toggleSender } = useChatStore()
  const emoticons = useActiveEmoticons()
  const packName = useActiveSetName()
  const isOther = currentSender === '상대방'

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
    <div className="relative flex flex-col border-t" style={{ borderColor: '#e0e0e0', backgroundColor: '#fff' }}>
      {/* 입력 영역 */}
      <div className="flex items-center gap-1 px-3 py-2">
        {/* contentEditable */}
        <div className="relative flex-1">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={checkHasContent}
            onKeyDown={handleKeyDown}
            className="w-full text-sm outline-none min-h-[32px] max-h-20 overflow-y-auto leading-6 bg-transparent"
            style={{ color: '#0f0f0f', wordBreak: 'break-all' }}
          />
          {!hasContent && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm pointer-events-none select-none" style={{ color: '#aaa' }}>
              구독자로 채팅...
            </span>
          )}
        </div>

        {/* 이모티콘 버튼 */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setPickerOpen(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ color: pickerOpen ? '#ff0000' : '#606060' }}
            onMouseEnter={ev => { if (!pickerOpen) ev.currentTarget.style.color = '#0f0f0f' }}
            onMouseLeave={ev => { if (!pickerOpen) ev.currentTarget.style.color = '#606060' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="9" cy="10" r="0.5" fill="currentColor" stroke="none" />
              <circle cx="15" cy="10" r="0.5" fill="currentColor" stroke="none" />
              <path d="M8.5 14.5c1 1.5 5.5 1.5 7 0" />
            </svg>
          </button>
          {pickerOpen && (
            <YoutubeEmoticonPicker
              onSelect={handleEmoticonSelect}
              onClose={() => setPickerOpen(false)}
              packName={packName ?? undefined}
            />
          )}
        </div>

        {/* 슈퍼챗 (장식) */}
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="13" rx="2" fill="#1565c0" />
            <rect x="3" y="9" width="18" height="4" fill="#42a5f5" />
          </svg>
        </button>

        {/* 좋아요 (장식) */}
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 flex-shrink-0 text-gray-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
          </svg>
        </button>
      </div>

      {/* 하단 바 */}
      <div className="flex items-center justify-between px-3 pb-2">
        <button
          onClick={toggleSender}
          className={clsx(
            'text-[10px] px-2.5 py-1 rounded-full font-medium border transition-colors',
            isOther
              ? 'bg-gray-700 text-white border-gray-700'
              : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
          )}
        >
          상대방
        </button>
        <button
          onClick={send}
          disabled={!hasContent}
          className="text-xs font-bold px-4 py-1.5 rounded-full transition-colors"
          style={{ backgroundColor: hasContent ? '#ff0000' : '#e0e0e0', color: hasContent ? '#fff' : '#aaa' }}
        >
          채팅
        </button>
      </div>
    </div>
  )
}
