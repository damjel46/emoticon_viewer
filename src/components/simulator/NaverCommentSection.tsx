import { useState } from 'react'
import { useActiveEmoticons } from '../../store/emoticonStore'
import { EmoticonPicker } from './EmoticonPicker'
import type { ContentSegment } from './NaverPostEditor'

export interface NaverComment {
  id: string
  nickname: string
  timestamp: string
  segments: ContentSegment[]
}

interface Props {
  comments: NaverComment[]
  myNickname?: string
  draftText: string
  draftSegments?: ContentSegment[]
  onDraftTextChange: (text: string) => void
  onEmoticonSelect: (emoticonId: string) => void
  onSubmit: () => void
  accentColor?: string
  displayEmoticonPx?: number
}

const AVATAR_COLORS = [
  '#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7',
  '#748ffc', '#da77f2', '#f783ac', '#63e6be', '#74c0fc',
]

function getAvatarBg(nickname: string) {
  let hash = 0
  for (let i = 0; i < nickname.length; i++) hash += nickname.charCodeAt(i)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

export function NaverCommentSection({
  comments,
  myNickname = '내닉네임',
  draftText,
  draftSegments = [],
  onDraftTextChange,
  onEmoticonSelect,
  onSubmit,
  accentColor = '#03c75a',
  displayEmoticonPx = 80,
}: Props) {
  const emoticons = useActiveEmoticons()
  const [pickerOpen, setPickerOpen] = useState(false)

  const resolveUrl = (id: string) => emoticons.find((e) => e.id === id)?.dataUrl ?? ''

  return (
    <div className="border-t border-gray-100">
      {/* 헤더 */}
      <div className="px-4 py-3">
        <span className="text-sm font-bold text-gray-800">댓글 {comments.length}</span>
      </div>

      {/* 댓글 목록 */}
      {comments.length > 0 && (
        <div>
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5 px-4 py-3 border-t border-gray-100">
              {/* 아바타 */}
              <div
                className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: getAvatarBg(comment.nickname) }}
              >
                {comment.nickname[0]}
              </div>
              <div className="flex-1 min-w-0">
                {/* 닉네임 + 뱃지 */}
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-sm font-bold text-gray-800">{comment.nickname}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="7" fill={accentColor} />
                    <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {/* 댓글 내용 */}
                <div className="text-sm text-gray-800 leading-relaxed break-words">
                  {comment.segments.map((seg, i) =>
                    seg.kind === 'text' ? (
                      <span key={i} className="whitespace-pre-wrap">{seg.value}</span>
                    ) : (
                      <img
                        key={i}
                        src={resolveUrl(seg.emoticonId)}
                        alt="이모티콘"
                        className="block mt-1"
                        style={{ width: displayEmoticonPx, height: displayEmoticonPx, objectFit: 'contain' }}
                      />
                    )
                  )}
                </div>
                {/* 날짜/시간 + 답글쓰기 */}
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[11px] text-gray-400">{comment.timestamp}</span>
                  <button className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
                    답글쓰기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 댓글 입력창 */}
      <div className="border-t border-gray-200 bg-white">
        {/* 닉네임 행 */}
        <div className="px-4 pt-3 pb-1">
          <span className="text-sm font-bold text-gray-800">{myNickname}</span>
        </div>

        {/* 드래프트 미리보기 (이모티콘 선택 시) */}
        {draftSegments.length > 0 && (
          <div className="px-4 pb-1 text-sm text-gray-800 leading-relaxed break-words">
            {draftSegments.map((seg, i) =>
              seg.kind === 'text' ? (
                <span key={i} className="whitespace-pre-wrap">{seg.value}</span>
              ) : (
                <img
                  key={i}
                  src={resolveUrl(seg.emoticonId)}
                  alt="이모티콘"
                  className="inline-block align-middle mx-0.5"
                  style={{ width: 32, height: 32, objectFit: 'contain' }}
                />
              )
            )}
          </div>
        )}

        {/* 텍스트 입력 */}
        <div className="px-4">
          <textarea
            value={draftText}
            onChange={(e) => onDraftTextChange(e.target.value)}
            placeholder="댓글을 남겨보세요"
            rows={1}
            className="w-full text-sm text-gray-800 resize-none outline-none placeholder-gray-400 bg-transparent leading-relaxed"
            style={{ minHeight: '24px' }}
          />
        </div>

        {/* 하단 툴바 */}
        <div className="flex items-center justify-between px-4 py-2 relative">
          <div className="flex items-center gap-3">
            {/* 카메라 아이콘 */}
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
            {/* 이모티콘 피커 */}
            <EmoticonPicker
              open={pickerOpen}
              onToggle={() => setPickerOpen((v) => !v)}
              onSelect={onEmoticonSelect}
              accentColor={accentColor}
              queueMode={false}
              variant="naver"
            />
          </div>
          <button
            onClick={onSubmit}
            className="text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  )
}
