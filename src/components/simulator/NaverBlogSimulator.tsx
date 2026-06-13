import { useState } from 'react'
import { useActiveEmoticons } from '../../store/emoticonStore'
import clsx from 'clsx'
import { NaverCommentSection, type NaverComment } from './NaverCommentSection'
import { useAuthStore } from '../../store/authStore'
import type { ContentSegment } from './NaverPostEditor'

const ACCENT = '#03c75a'

function nowDateTime() {
  const d = new Date()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}. ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function getDisplayName(user: ReturnType<typeof useAuthStore.getState>['user']): string {
  if (!user) return '나'
  return user.user_metadata?.full_name
    ?? user.user_metadata?.name
    ?? user.email?.split('@')[0]
    ?? '나'
}

const ICON_TOOLS = [
  { label: '사진', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { label: 'MYBOX', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
  { label: '동영상', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> },
  { label: '인용구', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg> },
  { label: '구분선', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="16" x2="21" y2="16"/></svg> },
  { label: '링크', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
  { label: '파일', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg> },
  { label: '일정', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: '소스코드', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
  { label: '표', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg> },
  { label: '수식', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19l4-8 4 8"/><path d="M6 15h4"/><path d="M19 5l-5 14"/><path d="M14 5h6"/></svg> },
  { label: '장소', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  { label: '글감', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
]

const RIGHT_TOOLS = [
  { label: '내 클립', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { label: '라이브러리', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="7" height="18"/><rect x="9.5" y="3" width="5" height="18"/><rect x="17" y="3" width="5" height="18"/></svg> },
  { label: '템플릿', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> },
]

// 우측 스티커 패널 (블로그 전용)
function BlogStickerPanel({
  onSelect,
  onClose,
  accentColor,
}: {
  onSelect: (id: string) => void
  onClose: () => void
  accentColor: string
}) {
  const emoticons = useActiveEmoticons()
  const [recentIds, setRecentIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'recent' | 'all'>('all')

  const handleSelect = (id: string) => {
    setRecentIds((prev) => [id, ...prev.filter((r) => r !== id)].slice(0, 20))
    onSelect(id)
  }

  const displayed = activeTab === 'recent'
    ? recentIds.map((id) => emoticons.find((e) => e.id === id)).filter(Boolean) as typeof emoticons
    : emoticons

  return (
    <div className="w-60 border-l border-gray-200 bg-white flex flex-col shrink-0">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-800">스티커</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* 탭 (팩 선택) */}
      <div className="flex items-center border-b border-gray-100 px-1 py-1 gap-0.5">
        <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        {/* 최근 탭 */}
        <button
          onClick={() => setActiveTab('recent')}
          className={clsx(
            'w-10 h-10 rounded flex items-center justify-center transition-colors relative shrink-0',
            activeTab === 'recent' ? 'bg-gray-100' : 'hover:bg-gray-50'
          )}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {activeTab === 'recent' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ backgroundColor: accentColor }} />
          )}
        </button>

        {/* 팩 썸네일 탭들 */}
        {emoticons.length > 0 && (
          <button
            onClick={() => setActiveTab('all')}
            className={clsx(
              'w-10 h-10 rounded flex items-center justify-center transition-colors relative shrink-0',
              activeTab === 'all' ? 'bg-gray-100' : 'hover:bg-gray-50'
            )}
          >
            <img src={emoticons[0].dataUrl} alt="팩" className="w-8 h-8 object-contain rounded" />
            {activeTab === 'all' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ backgroundColor: accentColor }} />
            )}
          </button>
        )}

        <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0 ml-auto">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* 이모티콘 그리드 (3열) */}
      <div className="flex-1 overflow-y-auto">
        {displayed.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-xs text-gray-400">
            {activeTab === 'recent' ? '최근 사용한 스티커가 없습니다' : '스티커 없음'}
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {displayed.map((e) => (
              <button
                key={e.id}
                onClick={() => handleSelect(e.id)}
                className="aspect-square flex items-center justify-center p-1.5 hover:bg-gray-100 transition-colors"
              >
                <img src={e.dataUrl} alt={e.name} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BlogEditor({
  segments,
  draftText,
  title,
  onTitleChange,
  onDraftChange,
  onEmoticonSelect,
  onSubmit,
  onClear,
  accentColor,
}: {
  segments: ContentSegment[]
  draftText: string
  title: string
  onTitleChange: (v: string) => void
  onDraftChange: (v: string) => void
  onEmoticonSelect: (id: string) => void
  onSubmit: () => void
  onClear: () => void
  accentColor: string
}) {
  const emoticons = useActiveEmoticons()
  const [stickerOpen, setStickerOpen] = useState(false)
  const resolveUrl = (id: string) => emoticons.find((e) => e.id === id)?.dataUrl ?? ''

  return (
    <div className="flex flex-col bg-white">
      {/* 최상단 바: N blog + 저장/발행 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-base" style={{ color: accentColor }}>N</span>
          <span className="text-gray-800 font-semibold text-sm">blog</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs text-gray-500 px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            저장 &nbsp;<span className="text-gray-400">0</span>
          </button>
          <button
            onClick={onSubmit}
            className="text-xs font-bold px-4 py-1.5 rounded text-white flex items-center gap-1.5 transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            발행
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="1"/></svg>
          </button>
          <button className="text-gray-400 hover:text-gray-600 px-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
          </button>
        </div>
      </div>

      {/* 아이콘 툴바 — 전체 너비 */}
      <div className="flex items-center border-b border-gray-200 px-2">
        <div className="flex items-center flex-1 overflow-x-auto">
          {ICON_TOOLS.map(({ label, icon }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-0.5 px-2 py-2 text-gray-500 hover:bg-gray-100 rounded transition-colors shrink-0"
            >
              {icon}
              <span className="text-[10px] leading-none">{label}</span>
            </button>
          ))}
          {/* 스티커 버튼 */}
          <button
            onClick={() => setStickerOpen((v) => !v)}
            className={clsx(
              'flex flex-col items-center gap-0.5 px-2 py-2 rounded transition-colors shrink-0',
              stickerOpen
                ? 'text-white'
                : 'text-gray-500 hover:bg-gray-100'
            )}
            style={stickerOpen ? { backgroundColor: accentColor } : {}}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="9" cy="10" r="0.5" fill="currentColor" stroke="none"/>
              <circle cx="15" cy="10" r="0.5" fill="currentColor" stroke="none"/>
              <path d="M8.5 14.5c1 1.5 5.5 1.5 7 0"/>
            </svg>
            <span className="text-[10px] leading-none">스티커</span>
          </button>
        </div>
        <div className="flex items-center border-l border-gray-200 ml-1 pl-1 shrink-0">
          {RIGHT_TOOLS.map(({ label, icon }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-0.5 px-2 py-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
            >
              {icon}
              <span className="text-[10px] leading-none">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 서식 툴바 — 전체 너비 */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-gray-200 flex-wrap">
        <button className="flex items-center gap-0.5 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded border border-gray-200 transition-colors">본문 <span className="text-gray-400 text-[10px]">▾</span></button>
        <button className="flex items-center gap-0.5 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded border border-gray-200 transition-colors">나눔고딕 <span className="text-gray-400 text-[10px]">▾</span></button>
        <button className="flex items-center gap-0.5 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded border border-gray-200 transition-colors">15 <span className="text-gray-400 text-[10px]">▾</span></button>
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        <button className="px-1.5 py-1 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded">B</button>
        <button className="px-1.5 py-1 text-xs italic text-gray-700 hover:bg-gray-100 rounded">I</button>
        <button className="px-1.5 py-1 text-xs underline text-gray-700 hover:bg-gray-100 rounded">U</button>
        <button className="px-1.5 py-1 text-xs line-through text-gray-500 hover:bg-gray-100 rounded">T</button>
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        <button className="px-1.5 py-1 text-gray-500 hover:bg-gray-100 rounded"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
        <button className="px-1.5 py-1 text-gray-500 hover:bg-gray-100 rounded"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/></svg></button>
        <button className="px-1.5 py-1 text-gray-500 hover:bg-gray-100 rounded"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg></button>
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        <button className="px-1.5 py-0.5 text-[11px] text-gray-500 hover:bg-gray-100 rounded">T<sup>1</sup></button>
        <button className="px-1.5 py-0.5 text-[11px] text-gray-500 hover:bg-gray-100 rounded">T<sub>1</sub></button>
        <div className="flex-1" />
        <button className="text-xs text-gray-400 hover:text-gray-600 px-2 py-0.5 rounded hover:bg-gray-100" onClick={onClear}>초기화</button>
      </div>

      {/* 컨텐츠 행: 에디터 | 스티커 패널 */}
      <div className="flex flex-1 relative">
        {/* 에디터 영역 (회색 배경 + 흰 종이) */}
        <div className="flex-1 bg-gray-100 py-5 overflow-y-auto min-h-[360px]">
          <div className="relative mx-auto bg-white min-h-[320px] px-12 py-8" style={{ maxWidth: '860px' }}>
            <button className="absolute left-3 top-8 w-7 h-7 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-400 transition-colors text-base leading-none">
              +
            </button>
            <input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="제목"
              className="w-full text-2xl font-bold text-gray-800 outline-none placeholder-gray-300 bg-transparent mb-4 pb-4 border-b border-gray-200"
            />
            <div className="min-h-[160px]">
              {segments.map((seg, i) =>
                seg.kind === 'text' ? (
                  <span key={i} className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{seg.value}</span>
                ) : (
                  <img
                    key={i}
                    src={resolveUrl(seg.emoticonId)}
                    alt="이모티콘"
                    className="block my-1"
                    style={{ width: 120, height: 120, objectFit: 'contain' }}
                  />
                )
              )}
              <textarea
                value={draftText}
                onChange={(e) => onDraftChange(e.target.value)}
                placeholder={segments.length === 0 ? '글감과 함께 나의 일상을 기록해보세요!' : '계속 입력하세요...'}
                rows={segments.length > 0 ? 3 : 6}
                className="w-full text-sm text-gray-800 resize-none outline-none bg-transparent leading-relaxed placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* 우측 스티커 패널 (에디터 위에 떠있음) */}
        {stickerOpen && (
          <div className="absolute right-0 top-0 h-full z-10">
            <BlogStickerPanel
              onSelect={onEmoticonSelect}
              onClose={() => setStickerOpen(false)}
              accentColor={accentColor}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export function NaverBlogSimulator() {
  const user = useAuthStore((s) => s.user)
  const myNickname = getDisplayName(user)
  const [title, setTitle] = useState('')
  const [postSegments, setPostSegments] = useState<ContentSegment[]>([])
  const [draftText, setDraftText] = useState('')
  const [comments, setComments] = useState<NaverComment[]>([])
  const [commentDraft, setCommentDraft] = useState('')
  const [commentDraftSegs, setCommentDraftSegs] = useState<ContentSegment[]>([])
  const [likes] = useState(5)

  const handleEmoticonInPost = (id: string) => {
    setPostSegments((prev) => {
      const next = [...prev]
      if (draftText.trim()) {
        next.push({ kind: 'text', value: draftText })
        setDraftText('')
      }
      next.push({ kind: 'emoticon', emoticonId: id })
      return next
    })
  }

  const handleSubmitPost = () => {
    const all: ContentSegment[] = [...postSegments]
    if (draftText.trim()) all.push({ kind: 'text', value: draftText })
    setPostSegments(all)
    setDraftText('')
  }

  const handleClearPost = () => {
    setPostSegments([])
    setDraftText('')
    setTitle('')
  }

  const handleEmoticonInComment = (id: string) => {
    setCommentDraftSegs((prev) => {
      const next = [...prev]
      if (commentDraft.trim()) {
        next.push({ kind: 'text', value: commentDraft })
        setCommentDraft('')
      }
      next.push({ kind: 'emoticon', emoticonId: id })
      return next
    })
  }

  const handleSubmitComment = () => {
    const segs: ContentSegment[] = [...commentDraftSegs]
    if (commentDraft.trim()) segs.push({ kind: 'text', value: commentDraft })
    if (segs.length === 0) return
    setComments((prev) => [
      ...prev,
      { id: Date.now().toString(), nickname: myNickname, timestamp: nowDateTime(), segments: segs },
    ])
    setCommentDraftSegs([])
    setCommentDraft('')
  }

  return (
    <div className="bg-gray-100 min-h-full flex flex-col">
      <BlogEditor
        segments={postSegments}
        draftText={draftText}
        title={title}
        onTitleChange={setTitle}
        onDraftChange={setDraftText}
        onEmoticonSelect={handleEmoticonInPost}
        onSubmit={handleSubmitPost}
        onClear={handleClearPost}
        accentColor={ACCENT}
      />

      {/* 리액션 바 */}
      <div className="bg-gray-100">
        <div className="mx-auto bg-white border-t border-gray-200 px-12 py-3" style={{ maxWidth: '860px' }}>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
              <span>♥</span><span>공감 {likes}</span>
            </button>
            <span className="text-gray-200">|</span>
            <span className="flex items-center gap-1.5">
              <span>💬</span><span>댓글 {comments.length}</span>
            </span>
            <span className="text-gray-200">|</span>
            <button className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
              <span>↗</span><span>공유</span>
            </button>
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="bg-white mx-auto w-full" style={{ maxWidth: '860px' }}>
        <NaverCommentSection
          comments={comments}
          myNickname={myNickname}
          draftText={commentDraft}
          draftSegments={commentDraftSegs}
          onDraftTextChange={setCommentDraft}
          onEmoticonSelect={handleEmoticonInComment}
          onSubmit={handleSubmitComment}
          accentColor={ACCENT}
        />
      </div>
    </div>
  )
}
