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
import { useEmoticonStore } from '../../store/emoticonStore'
import type { EmoticonFile } from '../../types'
import clsx from 'clsx'

interface SortableItemProps {
  emoticon: EmoticonFile
  index: number
}

function SortableItem({ emoticon, index }: SortableItemProps) {
  const removeEmoticon = useEmoticonStore((s) => s.removeEmoticon)
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
      <div className="relative group bg-white rounded-xl border border-gray-100 overflow-hidden aspect-square flex items-center justify-center hover:border-gray-300 transition-colors cursor-grab active:cursor-grabbing">
        <img
          src={emoticon.dataUrl}
          alt={emoticon.name}
          className="w-full h-full object-contain p-1"
          draggable={false}
        />
        <span className="absolute top-1 left-1 bg-black/40 text-white text-[9px] px-1 rounded">
          {index + 1}
        </span>
        {hasWarnings && (
          <span
            className="absolute top-1 right-1 bg-amber-400 text-[9px] px-1 rounded cursor-help"
            title={emoticon.validationWarnings.map((w) => w.message).join('\n')}
          >
            ⚠
          </span>
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
  columns?: 6 | 8
}

export function EmoticonGrid({ columns = 6 }: Props) {
  const emoticons = useEmoticonStore((s) => s.emoticons)
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

  const gridCols = columns === 8 ? 'grid-cols-8' : 'grid-cols-6'

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={emoticons.map((e) => e.id)} strategy={rectSortingStrategy}>
        <div className={`grid ${gridCols} gap-2`}>
          {emoticons.map((e, i) => (
            <SortableItem key={e.id} emoticon={e} index={i} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
