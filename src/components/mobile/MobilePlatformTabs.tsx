import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PLATFORMS } from '../../config/platforms'
import { useAuthStore } from '../../store/authStore'
import { LoginModal } from '../auth/LoginModal'

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
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const signOut = useAuthStore((s) => s.signOut)
  const [showLogin, setShowLogin] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <>
      <div
        className="flex flex-shrink-0 border-b items-center"
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

        {/* 로그인 / 유저 버튼 */}
        <div className="relative flex-shrink-0 pr-2">
          {user ? (
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{
                backgroundColor: profile?.is_premium ? '#fee500' : 'rgba(0,0,0,0.12)',
                color: profile?.is_premium ? '#3c1e1e' : 'rgba(0,0,0,0.5)',
              }}
            >
              {avatarLetter}
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="text-[10px] font-semibold px-2 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(0,0,0,0.07)', color: inactiveColor }}
            >
              로그인
            </button>
          )}

          {/* 로그아웃 드롭다운 */}
          {showMenu && user && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div
                className="absolute right-0 top-8 z-50 bg-white rounded-xl shadow-lg py-1 min-w-[120px]"
                style={{ border: '1px solid rgba(0,0,0,0.08)' }}
              >
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  {profile?.is_premium && (
                    <p className="text-[10px] font-semibold text-yellow-600">⭐ 프리미엄</p>
                  )}
                </div>
                <button
                  onClick={() => { signOut(); setShowMenu(false) }}
                  className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-gray-50"
                >
                  로그아웃
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}
