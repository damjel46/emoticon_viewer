import { useState } from 'react'
import { NaverPostEditor, type ContentSegment } from './NaverPostEditor'
import { NaverCommentSection, type NaverComment } from './NaverCommentSection'
import { useAuthStore } from '../../store/authStore'

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

export function NaverCafeSimulator() {
  const user = useAuthStore((s) => s.user)
  const myNickname = getDisplayName(user)
  const [title, setTitle] = useState('')
  const [postSegments, setPostSegments] = useState<ContentSegment[]>([])
  const [draftText, setDraftText] = useState('')
  const [comments, setComments] = useState<NaverComment[]>([])
  const [commentDraft, setCommentDraft] = useState('')
  const [commentDraftSegs, setCommentDraftSegs] = useState<ContentSegment[]>([])

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
    <div className="bg-white min-h-full flex flex-col">
      {/* 카페 상단 헤더 */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: ACCENT }}>
        <div className="flex items-center gap-2">
          <span className="text-white font-extrabold text-sm tracking-tight">NAVER</span>
          <span className="text-white/80 text-xs">카페</span>
          <span className="text-white/60 text-xs mx-1">|</span>
          <span className="text-white font-semibold text-sm">테스트카페</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-white/80 text-xs hover:text-white transition-colors">카페 홈</button>
          <button className="text-white/80 text-xs hover:text-white transition-colors">검색</button>
        </div>
      </div>

      {/* breadcrumb */}
      <div className="px-4 py-2 border-b border-gray-100">
        <span className="text-xs text-gray-400">게시판 <span className="mx-1">›</span> 이모티콘 테스트</span>
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-4">
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
          submitLabel="등록"
          placeholder="내용을 입력하세요..."
          displayEmoticonPx={64}
          accentColor={ACCENT}
        />

        {/* 댓글 섹션 */}
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
