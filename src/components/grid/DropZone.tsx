import { useRef } from 'react'
import { useDropZone } from '../../hooks/useDropZone'
import { useEmoticonStore, useActiveEmoticons } from '../../store/emoticonStore'
import { usePlatformStore } from '../../store/platformStore'
import { convertFiles, MAX_FILE_SIZE_MB } from '../../utils/fileToEmoticon'
import { useToastStore } from '../../store/toastStore'
import clsx from 'clsx'

export function DropZone() {
  const inputRef = useRef<HTMLInputElement>(null)
  const addEmoticons = useEmoticonStore((s) => s.addEmoticons)
  const clear = useEmoticonStore((s) => s.clear)
  const count = useActiveEmoticons().length
  const platformConfig = usePlatformStore((s) => s.getConfig())
  const { spec, grid, accentColor } = platformConfig

  const accepted = spec.allowedTypes
  const formatList = accepted.map((t) => t.split('/')[1].toUpperCase()).join(' / ')
  const sizeHint =
    spec.expectedWidth != null
      ? `${spec.expectedWidth}×${spec.expectedHeight ?? spec.expectedWidth}px`
      : `${spec.minDimension ?? 48}~${spec.maxDimension ?? 480}px (정사각)`
  const countHint =
    grid.countOptions.length > 0
      ? `${grid.countOptions.join('종 또는 ')}종`
      : spec.minSetCount
        ? `${spec.minSetCount}종 이상`
        : '제한 없음'

  const showToast = useToastStore((s) => s.show)

  const handleFiles = async (files: File[]) => {
    const spec = usePlatformStore.getState().getConfig().spec
    const { emoticons, rejectedCount } = await convertFiles(files, spec)
    addEmoticons(emoticons)
    if (rejectedCount > 0) {
      showToast(`${rejectedCount}개 파일이 ${MAX_FILE_SIZE_MB}MB를 초과해 건너뛰었습니다.`, 'warning')
    }
  }

  const { isDragging, onDragOver, onDragLeave, onDrop, onInputChange } = useDropZone({
    onFiles: handleFiles,
    accept: accepted,
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
            ? 'scale-[1.01]'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        )}
        style={
          isDragging
            ? { borderColor: accentColor, backgroundColor: `${accentColor}10` }
            : undefined
        }
      >
        <div className="text-4xl mb-3">📂</div>
        <p className="font-semibold text-gray-700 mb-1">
          이미지를 드래그하거나 클릭하여 업로드
        </p>
        <p className="text-sm text-gray-400">
          {formatList} 지원 · {sizeHint} · {countHint} · 개당 {MAX_FILE_SIZE_MB}MB 이하
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accepted.join(',')}
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
