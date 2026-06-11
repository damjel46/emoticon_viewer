import clsx from 'clsx'
import type { EmoticonFile } from '../../types'

interface Props {
  emoticon: EmoticonFile
  index?: number
  selected?: boolean
  onClick?: () => void
  onRemove?: () => void
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-11 h-11',
  md: 'w-20 h-20',
  lg: 'w-28 h-28',
}

export function EmoticonCell({ emoticon, index, selected, onClick, onRemove, size = 'md' }: Props) {
  const hasWarnings = emoticon.validationWarnings.length > 0

  return (
    <div
      className={clsx(
        'relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all',
        selected ? 'border-[#fee500] shadow-lg' : 'border-transparent hover:border-gray-300',
        'bg-white'
      )}
      onClick={onClick}
    >
      <img
        src={emoticon.dataUrl}
        alt={emoticon.name}
        className={clsx('object-contain', sizeMap[size])}
      />
      {index !== undefined && (
        <span className="absolute top-0.5 left-0.5 bg-black/50 text-white text-[9px] px-1 rounded">
          {index + 1}
        </span>
      )}
      {hasWarnings && (
        <span className="absolute top-0.5 right-0.5 bg-amber-400 text-gray-900 text-[9px] px-1 rounded">
          ⚠
        </span>
      )}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="absolute bottom-0.5 right-0.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-600"
        >
          ✕
        </button>
      )}
    </div>
  )
}
