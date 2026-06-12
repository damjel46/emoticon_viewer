import type { ShareEmoticon } from '../../types'

interface Props {
  emoticons: ShareEmoticon[]
  open: boolean
  onToggle: () => void
  onSelect: (id: string) => void
  accentColor?: string
}

export function MobileEmoticonPickerTray({ emoticons, open, onToggle, onSelect, accentColor = '#fee500' }: Props) {
  return (
    <>
      <button
        onClick={onToggle}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
        style={{ backgroundColor: open ? accentColor : '#f3f4f6' }}
      >
        <span className="text-lg leading-none">😊</span>
      </button>

      {open && (
        <div
          className="absolute bottom-full left-0 right-0 bg-white border-t border-gray-200 overflow-y-auto z-10"
          style={{ maxHeight: '180px' }}
        >
          <div className="grid grid-cols-4 gap-1 p-2">
            {emoticons.map((e) => (
              <button
                key={e.id}
                onClick={() => onSelect(e.id)}
                className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
              >
                <img src={e.dataUrl} alt={e.name} className="w-full h-full object-contain p-1" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
