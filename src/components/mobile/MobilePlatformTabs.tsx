import { useNavigate } from 'react-router-dom'
import { PLATFORMS } from '../../config/platforms'

const TABS = [
  { id: 'kakao', label: '카카오톡' },
  { id: 'soop',  label: 'Soop' },
  { id: 'ogq',   label: '치지직' },
] as const

interface Props {
  currentPlatform: 'kakao' | 'soop' | 'ogq'
  bgColor?: string
  inactiveColor?: string
}

export function MobilePlatformTabs({ currentPlatform, bgColor = '#ffffff', inactiveColor = 'rgba(0,0,0,0.35)' }: Props) {
  const navigate = useNavigate()

  return (
    <div
      className="flex flex-shrink-0 border-b"
      style={{ backgroundColor: bgColor, borderColor: 'rgba(0,0,0,0.08)' }}
    >
      {TABS.map(({ id, label }) => {
        const isActive = id === currentPlatform
        const accent = PLATFORMS[id].accentColor
        return (
          <button
            key={id}
            onClick={() => navigate(`/${id}`)}
            className="flex-1 py-2 text-xs font-semibold transition-colors relative"
            style={{
              color: isActive ? accent : inactiveColor,
              borderBottom: isActive ? `2px solid ${accent}` : '2px solid transparent',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
