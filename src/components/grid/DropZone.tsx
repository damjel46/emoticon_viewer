import { useRef } from 'react'
import { useDropZone } from '../../hooks/useDropZone'
import { useEmoticonStore } from '../../store/emoticonStore'
import { fileToEmoticon } from '../../utils/fileToEmoticon'
import clsx from 'clsx'

const ACCEPTED = ['image/gif', 'image/webp', 'image/png']

export function DropZone() {
  const inputRef = useRef<HTMLInputElement>(null)
  const addEmoticons = useEmoticonStore((s) => s.addEmoticons)
  const clear = useEmoticonStore((s) => s.clear)
  const count = useEmoticonStore((s) => s.emoticons.length)

  const handleFiles = async (files: File[]) => {
    const converted = await Promise.all(files.map(fileToEmoticon))
    addEmoticons(converted)
  }

  const { isDragging, onDragOver, onDragLeave, onDrop, onInputChange } = useDropZone({
    onFiles: handleFiles,
    accept: ACCEPTED,
  })

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
          isDragging
            ? 'border-[#fee500] bg-amber-50 scale-[1.01]'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        )}
      >
        <div className="text-4xl mb-3">📂</div>
        <p className="font-semibold text-gray-700 mb-1">
          이미지를 드래그하거나 클릭하여 업로드
        </p>
        <p className="text-sm text-gray-400">
          GIF / WEBP / PNG 지원 · 한 번에 24종 또는 32종 업로드 가능
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(',')}
          onChange={onInputChange}
          className="hidden"
        />
      </div>
      {count > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>업로드된 이모티콘: <strong className="text-gray-800">{count}종</strong></span>
          <button
            onClick={clear}
            className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
          >
            전체 삭제
          </button>
        </div>
      )}
    </div>
  )
}
