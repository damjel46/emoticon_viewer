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
  draftText: string
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
  draftText,
  onDraftTextChange,
  onEmoticonSelect,
  onSubmit,
  accentColor = '#03c75a',
  displayEmoticonPx = 32,
}: Props) {
  const emoticons = useActiveEmoticons()
  const [pickerOpen, setPickerOpen] = useState(false)

  const resolveUrl = (id: string) => emoticons.find((e) => e.id === id)?.dataUrl ?? ''

  return (
    <div className="border-t border-gray-100 mt-4">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-700">댓글 {comments.length}개</span>
      </div>

      {/* 댓글 목록 */}
      {comments.length > 0 && (
        <div className="divide-y divide-gray-50">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 px-4 py-3">
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5"
                style={{ backgroundColor: getAvatarBg(comment.nickname) }}
              >
                {comment.nickname[0]}
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
                      <img
                        key={i}
                        src={resolveUrl(seg.emoticonId)}
                        alt="이모티콘"
                        className="inline-block align-middle mx-0.5"
                        style={{ width: displayEmoticonPx, height: displayEmoticonPx, objectFit: 'contain' }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 댓글 입력 */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <div className="flex gap-3">
          <div
            className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-1"
            style={{ backgroundColor: accentColor }}
          >
            나
          </div>
          <div className="flex-1">
            <textarea
              value={draftText}
              onChange={(e) => onDraftTextChange(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={2}
              className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded resize-none outline-none placeholder-gray-400 bg-white focus:border-[#03c75a] transition-colors"
            />
            <div className="flex justify-end items-center gap-2 mt-1.5 relative">
              <EmoticonPicker
                open={pickerOpen}
                onToggle={() => setPickerOpen((v) => !v)}
                onSelect={(id) => {
                  onEmoticonSelect(id)
                  setPickerOpen(false)
                }}
                accentColor={accentColor}
                queueMode={false}
              />
              <button
                onClick={onSubmit}
                className="text-xs font-semibold px-4 py-1.5 rounded text-white transition-colors"
                style={{ backgroundColor: accentColor }}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
