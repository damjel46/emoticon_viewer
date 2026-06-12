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
  const resolveUrl = (id: string) => emoticons.find((e) => e.id === id)?.dataUrl ?? ''

  // ── 게시글 상태 ──────────────────────────────────────────────────────────
  const [title, setTitle] = useState('')
  const [postDraftSegs, setPostDraftSegs] = useState<ContentSegment[]>([])
  const [postDraftText, setPostDraftText] = useState('')
  const [publishedPost, setPublishedPost] = useState<{ title: string; segments: ContentSegment[] } | null>(null)
  const [postPickerOpen, setPostPickerOpen] = useState(false)

  // ── 댓글 상태 ────────────────────────────────────────────────────────────
  const [comments, setComments] = useState<NaverComment[]>([])
  const [commentDraftSegs, setCommentDraftSegs] = useState<ContentSegment[]>([])
  const [commentDraftText, setCommentDraftText] = useState('')
  const [commentPickerOpen, setCommentPickerOpen] = useState(false)

  // ── 게시글 핸들러 ─────────────────────────────────────────────────────────
  const handleEmoticonInPost = (id: string) => {
    const newSegs = [...postDraftSegs]
    if (postDraftText.trim()) {
      newSegs.push({ kind: 'text', value: postDraftText })
      setPostDraftText('')
    }
    newSegs.push({ kind: 'emoticon', emoticonId: id })
    setPostDraftSegs(newSegs)
    setPostPickerOpen(false)
  }

  const handlePublishPost = () => {
    const all: ContentSegment[] = [...postDraftSegs]
    if (postDraftText.trim()) all.push({ kind: 'text', value: postDraftText })
    if (all.length === 0 && !title.trim()) return
    setPublishedPost({ title: title || '(제목 없음)', segments: all })
    setPostDraftSegs([])
    setPostDraftText('')
  }

  const handleEditPost = () => {
    if (!publishedPost) return
    setPostDraftSegs(publishedPost.segments)
    setTitle(publishedPost.title === '(제목 없음)' ? '' : publishedPost.title)
    setPublishedPost(null)
  }

  const handleClearPost = () => {
    setPostDraftSegs([])
    setPostDraftText('')
    setTitle('')
    setPublishedPost(null)
  }

  // ── 댓글 핸들러 ──────────────────────────────────────────────────────────
  const handleEmoticonInComment = (id: string) => {
    const newSegs = [...commentDraftSegs]
    if (commentDraftText.trim()) {
      newSegs.push({ kind: 'text', value: commentDraftText })
      setCommentDraftText('')
    }
    newSegs.push({ kind: 'emoticon', emoticonId: id })
    setCommentDraftSegs(newSegs)
    setCommentPickerOpen(false)
  }

  const handleSubmitComment = () => {
    const all: ContentSegment[] = [...commentDraftSegs]
    if (commentDraftText.trim()) all.push({ kind: 'text', value: commentDraftText })
    if (all.length === 0) return
    setComments((prev) => [
      ...prev,
      { id: Date.now().toString(), nickname: '나', timestamp: nowDate(), segments: all },
    ])
    setCommentDraftSegs([])
    setCommentDraftText('')
  }

  // ── 드래프트 미리보기 렌더 ────────────────────────────────────────────────
  const renderSegments = (segs: ContentSegment[], emPx: number) =>
    segs.map((seg, i) =>
      seg.kind === 'text' ? (
        <span key={i} className="whitespace-pre-wrap">{seg.value}</span>
      ) : (
        <img key={i} src={resolveUrl(seg.emoticonId)} alt="이모티콘"
          className="inline-block align-middle mx-0.5" style={{ width: emPx, height: emPx, objectFit: 'contain' }} />
      )
    )

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

          {/* ── 발행된 게시글 표시 ── */}
          {publishedPost ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">{publishedPost.title}</span>
                <button
                  onClick={handleEditPost}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-0.5 rounded border border-gray-200"
                >
                  수정
                </button>
              </div>
              <div className="px-4 py-3 text-sm text-gray-800 leading-relaxed break-words min-h-[60px]">
                {renderSegments(publishedPost.segments, 64)}
              </div>
            </div>
          ) : (
            /* ── 게시글 에디터 (드래프트) ── */
            <div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full pb-2 mb-3 text-base font-medium text-gray-800 border-b border-gray-300 outline-none placeholder-gray-400 bg-transparent"
              />
              <div className="border border-gray-200 rounded">
                {/* 드래프트 미리보기 */}
                {(postDraftSegs.length > 0 || postDraftText.trim()) && (
                  <div className="min-h-[40px] px-4 py-2 border-b border-dashed border-gray-200 text-sm text-gray-800 leading-relaxed break-words bg-gray-50">
                    <span className="text-[10px] text-gray-400 block mb-1">작성 중 미리보기</span>
                    {renderSegments(postDraftSegs, 64)}
                    {postDraftText && <span className="whitespace-pre-wrap text-gray-500">{postDraftText}</span>}
                  </div>
                )}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50 relative">
                  <button className="px-2 py-0.5 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded">B</button>
                  <button className="px-2 py-0.5 text-xs italic text-gray-500 hover:bg-gray-200 rounded">I</button>
                  <MobileEmoticonPickerTray
                    emoticons={emoticons}
                    open={postPickerOpen}
                    onToggle={() => setPostPickerOpen((v) => !v)}
                    onSelect={handleEmoticonInPost}
                    accentColor={ACCENT}
                  />
                  <div className="flex-1" />
                  <button onClick={handleClearPost}
                    className="text-xs text-gray-400 hover:text-gray-600 px-2 py-0.5 rounded">초기화</button>
                </div>
                <textarea
                  value={postDraftText}
                  onChange={(e) => setPostDraftText(e.target.value)}
                  placeholder="내용을 입력하세요..."
                  rows={3}
                  className="w-full px-4 py-3 text-sm text-gray-800 resize-none outline-none placeholder-gray-400"
                />
                <div className="flex justify-end gap-2 px-3 py-2 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={handlePublishPost}
                    disabled={postDraftSegs.length === 0 && !postDraftText.trim() && !title.trim()}
                    className="text-sm font-semibold px-5 py-1.5 rounded text-white disabled:opacity-40"
                    style={{ backgroundColor: ACCENT }}
                  >
                    등록
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 댓글 섹션 */}
          <div>
            <div className="py-2 mb-1">
              <span className="text-sm font-semibold text-gray-700">댓글 {comments.length}개</span>
            </div>

            {/* 댓글 목록 */}
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 py-3 border-b border-gray-50">
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: ACCENT }}>나</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-700">{comment.nickname}</span>
                    <span className="text-[10px] text-gray-400">{comment.timestamp}</span>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed break-words">
                    {renderSegments(comment.segments, 32)}
                  </div>
                </div>
              </div>
            ))}

            {/* 댓글 입력 */}
            <div className="py-3">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: ACCENT }}>나</div>
                <div className="flex-1">
                  {/* 드래프트 세그먼트 미리보기 */}
                  {commentDraftSegs.length > 0 && (
                    <div className="px-3 py-2 mb-1 bg-green-50 border border-green-100 rounded text-sm text-gray-700 leading-relaxed break-words">
                      {renderSegments(commentDraftSegs, 28)}
                    </div>
                  )}
                  <textarea
                    value={commentDraftText}
                    onChange={(e) => setCommentDraftText(e.target.value)}
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
                    <button
                      onClick={handleSubmitComment}
                      disabled={commentDraftSegs.length === 0 && !commentDraftText.trim()}
                      className="text-xs font-semibold px-4 py-1.5 rounded text-white disabled:opacity-40"
                      style={{ backgroundColor: ACCENT }}
                    >
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
