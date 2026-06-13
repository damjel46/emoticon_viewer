import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEmoticonStore, useActiveEmoticons, useActiveThumbnailId } from '../../store/emoticonStore'
import type { EmoticonFile } from '../../types'
import clsx from 'clsx'

interface SortableItemProps {
  emoticon: EmoticonFile
  index: number
  isThumbnail: boolean
}

function SortableItem({ emoticon, index, isThumbnail }: SortableItemProps) {
  const removeEmoticon = useEmoticonStore((s) => s.removeEmoticon)
  const setThumbnail = useEmoticonStore((s) => s.setThumbnail)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: emoticon.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  const hasWarnings = emoticon.validationWarnings.length > 0

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={clsx(
        'relative group bg-white rounded-xl border overflow-hidden aspect-square flex items-center justify-center hover:border-gray-300 transition-colors cursor-grab active:cursor-grabbing',
        isThumbnail ? 'border-yellow-400 ring-1 ring-yellow-300' : 'border-gray-100'
      )}>
        <img
          src={emoticon.dataUrl}
          alt={emoticon.name}
          className="w-full h-full object-contain p-1"
          draggable={false}
        />
        <span className="absolute top-1 left-1 bg-black/40 text-white text-[9px] px-1 rounded">
          {index + 1}
        </span>
        {/* 대표 이미지 배지 */}
        {isThumbnail && (
          <span className="absolute bottom-1 left-1 bg-yellow-400 text-[8px] text-white px-1 rounded font-bold">
            대표
          </span>
        )}
        {hasWarnings && (
          <span
            className="absolute top-1 right-1 bg-amber-400 text-[9px] px-1 rounded cursor-help"
            title={emoticon.validationWarnings.map((w) => w.message).join('\n')}
          >
            ⚠
          </span>
        )}
        {/* 대표 이미지 설정 버튼 */}
        {!isThumbnail && (
          <button
            onClick={(e) => { e.stopPropagation(); setThumbnail(emoticon.id) }}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute bottom-1 left-1 bg-black/50 text-yellow-300 text-[9px] w-4 h-4 rounded-full items-center justify-center hidden group-hover:flex hover:bg-black/70"
            title="대표 이미지로 설정"
          >
            ★
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); removeEmoticon(emoticon.id) }}
          onPointerDown={(e) => e.stopPropagation()}
          className={clsx(
            'absolute bottom-1 right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full items-center justify-center',
            'hidden group-hover:flex hover:bg-red-600'
          )}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

interface Props {
  columns?: number
}

export function EmoticonGrid({ columns = 6 }: Props) {
  const emoticons = useActiveEmoticons()
  const thumbnailId = useActiveThumbnailId()
  const reorder = useEmoticonStore((s) => s.reorder)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const fromIndex = emoticons.findIndex((e) => e.id === active.id)
    const toIndex = emoticons.findIndex((e) => e.id === over.id)
    reorder(fromIndex, toIndex)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={emoticons.map((e) => e.id)} strategy={rectSortingStrategy}>
        {/* inline style for dynamic columns — Tailwind purges dynamic class names */}
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {emoticons.map((e, i) => (
            <SortableItem key={e.id} emoticon={e} index={i} isThumbnail={(thumbnailId ?? emoticons[0]?.id) === e.id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
