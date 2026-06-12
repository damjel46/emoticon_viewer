import { useState } from 'react'
import type { ShareEmoticon } from '../../types'
import { MobileEmoticonPickerTray } from './MobileEmoticonPickerTray'

const ACCENT = '#03c75a'

type ContentSegment = { kind: 'text'; value: string } | { kind: 'emoticon'; emoticonId: string }

interface NaverComment {
  id: string
  nickname: string
  timestamp: string
  segments: ContentSegment[]
}

function nowDate() {
  const d = new Date()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

interface Props {
  emoticons: ShareEmoticon[]
}

export function MobileNaverCafeSimulator({ emoticons }: Props) {
  const [title, setTitle] = useState('')
  const [postSegments, setPostSegments] = useState<ContentSegment[]>([])
  const [draftText, setDraftText] = useState('')
  const [comments, setComments] = useState<NaverComment[]>([])
  const [commentDraft, setCommentDraft] = useState('')
  const [postPickerOpen, setPostPickerOpen] = useState(false)
  const [commentPickerOpen, setCommentPickerOpen] = useState(false)

  const resolveUrl = (id: string) => emoticons.find((e) => e.id === id)?.dataUrl ?? ''

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
    setPostPickerOpen(false)
  }

  const handleSubmitPost = () => {
    const all: ContentSegment[] = [...postSegments]
    if (draftText.trim()) all.push({ kind: 'text', value: draftText })
    if (all.length === 0) return
    setPostSegments(all)
    setDraftText('')
  }

  const handleEmoticonInComment = (id: string) => {
    const segs: ContentSegment[] = []
    if (commentDraft.trim()) {
      segs.push({ kind: 'text', value: commentDraft })
      setCommentDraft('')
    }
    segs.push({ kind: 'emoticon', emoticonId: id })
    setComments((prev) => [
      ...prev,
      { id: Date.now().toString(), nickname: '나', timestamp: nowDate(), segments: segs },
    ])
    setCommentPickerOpen(false)
  }

  const handleSubmitComment = () => {
    if (!commentDraft.trim()) return
    setComments((prev) => [
      ...prev,
      { id: Date.now().toString(), nickname: '나', timestamp: nowDate(), segments: [{ kind: 'text', value: commentDraft }] },
    ])
    setCommentDraft('')
  }

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-white">
      {/* 카페 헤더 */}
      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0" style={{ backgroundColor: ACCENT }}>
        <div className="flex items-center gap-2">
          <span className="text-white font-extrabold text-sm tracking-tight">NAVER</span>
          <span className="text-white/80 text-xs">카페</span>
          <span className="text-white/60 text-xs mx-1">|</span>
          <span className="text-white font-semibold text-sm">테스트카페</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-white/80 text-xs">카페 홈</button>
          <button className="text-white/80 text-xs">검색</button>
        </div>
      </div>

      {/* breadcrumb */}
      <div className="px-4 py-2 border-b border-gray-100 flex-shrink-0">
        <span className="text-xs text-gray-400">게시판 <span className="mx-1">›</span> 이모티콘 테스트</span>
      </div>

      {/* 본문 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 flex flex-col gap-4">
          {/* 제목 */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full pb-2 text-base font-medium text-gray-800 border-b border-gray-300 outline-none placeholder-gray-400 bg-transparent"
          />

          {/* 포스트 에디터 */}
          <div className="border border-gray-200 rounded">
            {postSegments.length > 0 && (
              <div className="min-h-[60px] p-3 border-b border-gray-100 text-sm text-gray-800 leading-relaxed break-words">
                {postSegments.map((seg, i) =>
                  seg.kind === 'text' ? (
                    <span key={i} className="whitespace-pre-wrap">{seg.value}</span>
                  ) : (
                    <img key={i} src={resolveUrl(seg.emoticonId)} alt="이모티콘"
                      className="inline-block align-middle mx-0.5" style={{ width: 64, height: 64, objectFit: 'contain' }} />
                  )
                )}
              </div>
            )}
            <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50 relative">
              <button className="px-2 py-0.5 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded">B</button>
              <button className="px-2 py-0.5 text-xs italic text-gray-500 hover:bg-gray-200 rounded">I</button>
              <div className="relative">
                <MobileEmoticonPickerTray
                  emoticons={emoticons}
                  open={postPickerOpen}
                  onToggle={() => setPostPickerOpen((v) => !v)}
                  onSelect={handleEmoticonInPost}
                  accentColor={ACCENT}
                />
              </div>
              <div className="flex-1" />
              <button onClick={() => { setPostSegments([]); setDraftText(''); setTitle('') }}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-0.5 rounded">초기화</button>
            </div>
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="내용을 입력하세요..."
              rows={3}
              className="w-full px-4 py-3 text-sm text-gray-800 resize-none outline-none placeholder-gray-400"
            />
            <div className="flex justify-end gap-2 px-3 py-2 border-t border-gray-100 bg-gray-50">
              <button onClick={handleSubmitPost}
                className="text-sm font-semibold px-5 py-1.5 rounded text-white"
                style={{ backgroundColor: ACCENT }}>
                등록
              </button>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div>
            <div className="py-2 mb-1">
              <span className="text-sm font-semibold text-gray-700">댓글 {comments.length}개</span>
            </div>
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 py-3 border-b border-gray-50">
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: ACCENT }}>
                  나
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-700">{comment.nickname}</span>
                    <span className="text-[10px] text-gray-400">{comment.timestamp}</span>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed break-words">
                    {comment.segments.map((seg, i) =>
                      seg.kind === 'text' ? (
                        <span key={i} className="whitespace-pre-wrap">{seg.value}</span>
                      ) : (
                        <img key={i} src={resolveUrl(seg.emoticonId)} alt="이모티콘"
                          className="inline-block align-middle mx-0.5" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* 댓글 입력 */}
            <div className="py-3 relative">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: ACCENT }}>나</div>
                <div className="flex-1">
                  <textarea
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    rows={2}
                    className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded resize-none outline-none placeholder-gray-400"
                  />
                  <div className="flex justify-end items-center gap-2 mt-1.5 relative">
                    <MobileEmoticonPickerTray
                      emoticons={emoticons}
                      open={commentPickerOpen}
                      onToggle={() => setCommentPickerOpen((v) => !v)}
                      onSelect={handleEmoticonInComment}
                      accentColor={ACCENT}
                    />
                    <button onClick={handleSubmitComment}
                      className="text-xs font-semibold px-4 py-1.5 rounded text-white"
                      style={{ backgroundColor: ACCENT }}>
                      등록
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
