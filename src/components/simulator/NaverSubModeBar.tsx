import clsx from 'clsx'
import { usePlatformStore, type NaverSubMode } from '../../store/platformStore'

const TABS: { id: NaverSubMode; label: string }[] = [
  { id: 'blog', label: '블로그' },
  { id: 'cafe', label: '카페' },
  { id: 'chzzk', label: '치지직' },
]

export function NaverSubModeBar() {
  const naverSubMode = usePlatformStore((s) => s.naverSubMode ?? 'chzzk')
  const setNaverSubMode = usePlatformStore((s) => s.setNaverSubMode)

  return (
    <div className="flex items-center border-b border-gray-200 bg-white px-4">
      {TABS.map((tab) => {
        const isActive = naverSubMode === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setNaverSubMode(tab.id)}
            className={clsx(
              'px-5 py-2.5 text-sm font-medium transition-colors relative',
              isActive ? 'text-[#03c75a]' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#03c75a]" />
            )}
          </button>
        )
      })}
    </div>
  )
}
