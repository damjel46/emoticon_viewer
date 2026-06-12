import { useState } from 'react'
import { useActiveEmoticons } from '../../store/emoticonStore'
import clsx from 'clsx'

export type ContentSegment =
  | { kind: 'text'; value: string }
  | { kind: 'emoticon'; emoticonId: string }

interface Props {
  segments: ContentSegment[]
  draftText: string
  onDraftChange: (text: string) => void
  onEmoticonSelect: (emoticonId: string) => void
  onSubmit: () => void
  onClear: () => void
  submitLabel: string
  placeholder?: string
  displayEmoticonPx?: number
  accentColor?: string
}

// 카페 스티커 모달 (floating popup)
function CafeStickerModal({
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
    <div className="absolute left-1/2 -translate-x-1/2 z-30 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden"
      style={{ top: '100%', marginTop: '4px', width: '560px', maxWidth: 'calc(100vw - 32px)' }}>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-800">스티커</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-0.5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* 가로 탭 바 (팩 썸네일 + 스크롤) */}
      <div className="flex items-center border-b border-gray-100 px-1 py-1">
        <button className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        {/* 최근 탭 */}
        <button
          onClick={() => setActiveTab('recent')}
          className={clsx(
            'w-10 h-10 rounded flex items-center justify-center transition-colors relative shrink-0',
            activeTab === 'recent' ? 'bg-gray-50' : 'hover:bg-gray-50'
          )}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {activeTab === 'recent' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ backgroundColor: accentColor }}/>
          )}
        </button>

        {/* 팩 썸네일 탭 목록 (가로 스크롤) */}
        <div className="flex items-center gap-1 overflow-x-auto flex-1 px-1 scrollbar-none">
          {emoticons.length > 0 && (
            <button
              onClick={() => setActiveTab('all')}
              className={clsx(
                'w-10 h-10 rounded flex items-center justify-center transition-colors relative shrink-0',
                activeTab === 'all' ? 'bg-gray-50' : 'hover:bg-gray-50'
              )}
            >
              <img src={emoticons[0].dataUrl} alt="팩" className="w-8 h-8 object-contain rounded"/>
              {activeTab === 'all' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ backgroundColor: accentColor }}/>
              )}
            </button>
          )}
        </div>

        <button className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* 3열 이모티콘 그리드 */}
      <div className="overflow-y-auto" style={{ maxHeight: '340px' }}>
        {displayed.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-xs text-gray-400">
            {activeTab === 'recent' ? '최근 사용한 스티커가 없습니다' : '스티커 없음'}
          </div>
        ) : (
          <div className="grid grid-cols-6">
            {displayed.map((e) => (
              <button
                key={e.id}
                onClick={() => handleSelect(e.id)}
                className="aspect-square flex items-center justify-center p-1.5 hover:bg-gray-100 transition-colors"
              >
                <img src={e.dataUrl} alt={e.name} className="w-full h-full object-contain"/>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 장식용 아이콘 툴바 아이템
const TOP_TOOLS: { label: string; icon: React.ReactNode }[] = [
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

export function NaverPostEditor({
  segments,
  draftText,
  onDraftChange,
  onEmoticonSelect,
  onSubmit,
  onClear,
  submitLabel,
  placeholder = '내용을 입력하세요.',
  displayEmoticonPx = 120,
  accentColor = '#03c75a',
}: Props) {
  const emoticons = useActiveEmoticons()
  const [stickerOpen, setStickerOpen] = useState(false)

  const resolveUrl = (id: string) => emoticons.find((e) => e.id === id)?.dataUrl ?? ''

  return (
    <div className="border border-gray-200 rounded bg-white">
      {/* 상단 아이콘 툴바 */}
      <div className="border-b border-gray-200 px-3 py-2 relative">
        <div className="flex flex-wrap gap-x-1 gap-y-1">
          {TOP_TOOLS.map(({ label, icon }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded text-gray-500 hover:bg-gray-100 transition-colors min-w-[44px]"
            >
              {icon}
              <span className="text-[10px] leading-none text-gray-500">{label}</span>
            </button>
          ))}

          {/* 스티커 버튼 */}
          <button
            onClick={() => setStickerOpen((v) => !v)}
            className={clsx(
              'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded transition-colors min-w-[44px]',
              stickerOpen ? 'text-white' : 'text-gray-500 hover:bg-gray-100'
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

        {/* 스티커 모달 팝업 */}
        {stickerOpen && (
          <CafeStickerModal
            onSelect={onEmoticonSelect}
            onClose={() => setStickerOpen(false)}
            accentColor={accentColor}
          />
        )}
      </div>

      {/* 서식 툴바 */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-gray-100 bg-white">
        <button className="flex items-center gap-0.5 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors border border-gray-200">
          본문 <span className="text-gray-400 text-[10px]">▾</span>
        </button>
        <button className="flex items-center gap-0.5 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors border border-gray-200">
          기본서체 <span className="text-gray-400 text-[10px]">▾</span>
        </button>
        <button className="flex items-center gap-0.5 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors border border-gray-200">
          15 <span className="text-gray-400 text-[10px]">▾</span>
        </button>
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        <button className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded">B</button>
        <button className="px-2 py-1 text-xs italic text-gray-600 hover:bg-gray-100 rounded">I</button>
        <button className="px-2 py-1 text-xs underline text-gray-600 hover:bg-gray-100 rounded">U</button>
        <button className="px-2 py-1 text-xs line-through text-gray-500 hover:bg-gray-100 rounded">T</button>
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        <button className="px-1.5 py-1 text-gray-500 hover:bg-gray-100 rounded"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
        <button className="px-1.5 py-1 text-gray-500 hover:bg-gray-100 rounded"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg></button>
        <button className="px-1.5 py-1 text-gray-500 hover:bg-gray-100 rounded"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg></button>
        <div className="flex-1" />
        <button onClick={onClear} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-0.5 rounded hover:bg-gray-100 transition-colors">
          초기화
        </button>
      </div>

      {/* 본문 입력 영역 */}
      <div className="px-5 py-4 min-h-[280px] flex flex-col gap-2">
        {segments.map((seg, i) =>
          seg.kind === 'text' ? (
            <span key={i} className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{seg.value}</span>
          ) : (
            <img
              key={i}
              src={resolveUrl(seg.emoticonId)}
              alt="이모티콘"
              className="block"
              style={{ width: displayEmoticonPx, height: displayEmoticonPx, objectFit: 'contain' }}
            />
          )
        )}
        <textarea
          value={draftText}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder={segments.length === 0 ? placeholder : '계속 입력하세요...'}
          className="flex-1 w-full text-sm text-gray-800 resize-none outline-none placeholder-gray-400 bg-transparent leading-relaxed"
          rows={segments.length > 0 ? 3 : 8}
        />
      </div>

      {/* 하단 태그 + 등록 */}
      <div className="border-t border-gray-100">
        <div className="px-5 py-2.5 border-b border-gray-100">
          <span className="text-sm" style={{ color: accentColor }}>#태그를 입력해주세요 (최대 10개)</span>
        </div>
        <div className="flex justify-end px-4 py-2.5 bg-gray-50">
          <button
            onClick={onSubmit}
            className="text-sm font-semibold px-6 py-1.5 rounded text-white transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
