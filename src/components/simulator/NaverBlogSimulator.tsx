import { useState } from 'react'
import { NaverPostEditor, type ContentSegment } from './NaverPostEditor'
import { NaverCommentSection, type NaverComment } from './NaverCommentSection'

const ACCENT = '#03c75a'

function nowDate() {
  const d = new Date()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function NaverBlogSimulator() {
  const [title, setTitle] = useState('')
  const [postSegments, setPostSegments] = useState<ContentSegment[]>([])
  const [draftText, setDraftText] = useState('')
  const [comments, setComments] = useState<NaverComment[]>([])
  const [commentDraft, setCommentDraft] = useState('')
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
    if (all.length === 0) return
    setPostSegments(all)
    setDraftText('')
  }

  const handleClearPost = () => {
    setPostSegments([])
    setDraftText('')
    setTitle('')
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
  }

  const handleSubmitComment = () => {
    if (!commentDraft.trim()) return
    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        nickname: '나',
        timestamp: nowDate(),
        segments: [{ kind: 'text', value: commentDraft }],
      },
    ])
    setCommentDraft('')
  }

  return (
    <div className="bg-white min-h-full flex flex-col">
      {/* 블로그 상단 헤더 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg leading-none" style={{ color: ACCENT }}>N</span>
          <span className="text-gray-800 font-semibold text-sm">테스트블로그</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-500 text-xs hover:text-gray-700 transition-colors">이웃</button>
          <span className="text-gray-200 text-xs">·</span>
          <button className="text-gray-500 text-xs hover:text-gray-700 transition-colors">로그인</button>
        </div>
      </div>

      {/* breadcrumb */}
      <div className="px-4 py-2 border-b border-gray-100">
        <span className="text-xs text-gray-400">블로그 <span className="mx-1">›</span> 포스트 작성</span>
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-4">
        {/* 메타 행 (장식) */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <span>카테고리:</span>
            <button className="text-gray-600 hover:text-gray-800 border border-gray-200 rounded px-2 py-0.5 text-xs">
              전체보기 ▾
            </button>
          </div>
          <span>날짜: {nowDate()}</span>
        </div>

        {/* 제목 */}
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full pb-2 text-base font-medium text-gray-800 border-b border-gray-300 outline-none placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* 게시글 에디터 */}
        <NaverPostEditor
          segments={postSegments}
          draftText={draftText}
          onDraftChange={setDraftText}
          onEmoticonSelect={handleEmoticonInPost}
          onSubmit={handleSubmitPost}
          onClear={handleClearPost}
          submitLabel="발행"
          placeholder="포스트 내용을 입력하세요..."
          displayEmoticonPx={64}
          accentColor={ACCENT}
        />

        {/* 리액션 바 */}
        <div className="flex items-center gap-4 py-3 border-t border-b border-gray-100 text-sm text-gray-500">
          <button className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
            <span>♥</span>
            <span>공감 {likes}</span>
          </button>
          <span className="text-gray-200">|</span>
          <span className="flex items-center gap-1.5">
            <span>💬</span>
            <span>댓글 {comments.length}</span>
          </span>
          <span className="text-gray-200">|</span>
          <button className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
            <span>↗</span>
            <span>공유</span>
          </button>
        </div>

        {/* 댓글 섹션 */}
        <NaverCommentSection
          comments={comments}
          draftText={commentDraft}
          onDraftTextChange={setCommentDraft}
          onEmoticonSelect={handleEmoticonInComment}
          onSubmit={handleSubmitComment}
          accentColor={ACCENT}
          displayEmoticonPx={32}
        />
      </div>
    </div>
  )
}
