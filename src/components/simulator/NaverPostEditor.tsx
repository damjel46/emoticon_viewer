import { useState } from 'react'
import { useActiveEmoticons } from '../../store/emoticonStore'
import { EmoticonPicker } from './EmoticonPicker'

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

export function NaverPostEditor({
  segments,
  draftText,
  onDraftChange,
  onEmoticonSelect,
  onSubmit,
  onClear,
  submitLabel,
  placeholder = '내용을 입력하세요...',
  displayEmoticonPx = 64,
  accentColor = '#03c75a',
}: Props) {
  const emoticons = useActiveEmoticons()
  const [pickerOpen, setPickerOpen] = useState(false)

  const resolveUrl = (id: string) => emoticons.find((e) => e.id === id)?.dataUrl ?? ''

  return (
    <div className="border border-gray-200 rounded">
      {/* 미리보기 영역 */}
      {segments.length > 0 && (
        <div className="min-h-[80px] p-4 border-b border-gray-100 text-sm text-gray-800 leading-relaxed break-words">
          {segments.map((seg, i) =>
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
      )}

      {/* 툴바 */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50">
        <button className="px-2 py-0.5 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded transition-colors">B</button>
        <button className="px-2 py-0.5 text-xs italic text-gray-500 hover:bg-gray-200 rounded transition-colors">I</button>
        <button className="px-2 py-0.5 text-xs underline text-gray-500 hover:bg-gray-200 rounded transition-colors">U</button>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <div className="relative">
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
        </div>
        <div className="flex-1" />
        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-gray-600 px-2 py-0.5 rounded hover:bg-gray-200 transition-colors"
        >
          초기화
        </button>
      </div>

      {/* 입력 영역 */}
      <textarea
        value={draftText}
        onChange={(e) => onDraftChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-3 text-sm text-gray-800 resize-none outline-none placeholder-gray-400"
      />

      {/* 하단 버튼 */}
      <div className="flex justify-end gap-2 px-3 py-2 border-t border-gray-100 bg-gray-50">
        <button
          onClick={onSubmit}
          className="text-sm font-semibold px-5 py-1.5 rounded text-white transition-colors"
          style={{ backgroundColor: accentColor }}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  )
}
