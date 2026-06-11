import { useAnimStore } from '../../store/animStore'
import clsx from 'clsx'

const SPEEDS: { value: 0.5 | 1 | 1.5; label: string }[] = [
  { value: 0.5, label: '0.5×' },
  { value: 1, label: '1×' },
  { value: 1.5, label: '1.5×' },
]

export function SpeedControl() {
  const { speedMultiplier, setSpeed } = useAnimStore()

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 font-medium">재생 속도:</span>
      <div className="flex rounded-xl overflow-hidden border border-gray-200">
        {SPEEDS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSpeed(value)}
            className={clsx(
              'px-4 py-1.5 text-sm font-medium transition-colors',
              speedMultiplier === value
                ? 'bg-[#3c1e1e] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
