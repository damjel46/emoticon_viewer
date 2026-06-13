import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { useAuthStore } from '../../store/authStore'
import { useProfileStore } from '../../store/profileStore'
import { usePlatformStore } from '../../store/platformStore'
import { PLATFORMS, PLATFORM_ORDER } from '../../config/platforms'
import { LoginModal } from '../auth/LoginModal'
import { ProfileModal } from '../auth/ProfileModal'
import { PlatformLogo } from './PlatformLogo'

declare global { interface Window { adsbygoogle: unknown[] } }

function SidebarAd() {
  const ref = useRef<HTMLModElement>(null)
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])
  return (
    <div className="mx-1 mb-3">
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5497677824149260"
        data-ad-slot="6490827669"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

const NAV_ITEMS = [
  { to: '/grid', label: '업로드', icon: '📂' },
  { to: '/anim', label: '애니메이션', icon: '🎬' },
  { to: '/qr', label: 'QR 연동', icon: '📱', beta: true },
]

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: Props) {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const displayName = useProfileStore((s) => s.displayName)
  const [showLogin, setShowLogin] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const activePlatform = usePlatformStore((s) => s.activePlatform)
  const platformConfig = usePlatformStore((s) => s.getConfig())
  const isSimulatorActive = PLATFORM_ORDER.some((id) => location.pathname === `/${id}`)

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? '?'
  const accentColor = platformConfig.accentColor

  return (
    <>
      <aside
        className={clsx(
          'min-h-screen bg-[#3c1e1e] flex flex-col py-6 flex-shrink-0 transition-all duration-200',
          collapsed ? 'w-14 px-2' : 'w-56 px-3'
        )}
      >
        {/* 로고 */}
        {!collapsed && (
          <div className="mb-5 px-2">
            <div className="font-bold text-lg leading-tight" style={{ color: accentColor }}>
              {platformConfig.nameShort}
            </div>
            <div className="text-white/70 text-xs mt-0.5">이모티콘 뷰어</div>
          </div>
        )}
        {collapsed && (
          <div className="mb-5 flex justify-center">
            <PlatformLogo id={platformConfig.id} size={28} />
          </div>
        )}

        {/* 플랫폼 선택기 */}
        <div className={clsx('mb-4', collapsed ? 'flex flex-col items-center gap-1' : 'px-1')}>
          {!collapsed && (
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider mb-2 px-1">
              플랫폼
            </p>
          )}
          <div className={clsx('flex gap-1', collapsed ? 'flex-col' : 'flex-row flex-wrap')}>
            {PLATFORM_ORDER.map((id) => {
              const p = PLATFORMS[id]
              const isActive = activePlatform === id
              return (
                <button
                  key={id}
                  onClick={() => navigate(`/${id}`)}
                  title={p.nameKo}
                  className={clsx(
                    'w-8 h-8 flex items-center justify-center rounded-lg text-base transition-all',
                    isActive ? 'scale-110' : 'opacity-40 hover:opacity-75'
                  )}
                  style={
                    isActive
                      ? { outline: `2px solid ${p.accentColor}`, backgroundColor: `${p.accentColor}22` }
                      : undefined
                  }
                >
                  <PlatformLogo id={p.id} size={22} />
                </button>
              )
            })}
          </div>
        </div>

        <div className="border-t border-white/10 mb-3" />

        {/* 네비게이션 */}
        <nav className="flex flex-col gap-1 flex-1">
          {/* 시뮬레이터 - 현재 플랫폼 URL로 연결 */}
          <Link
            to={`/${activePlatform}`}
            title="시뮬레이터"
            className={clsx(
              'flex items-center rounded-xl text-sm font-medium transition-colors',
              collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
              isSimulatorActive
                ? 'text-[#1a1a1a]'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            )}
            style={isSimulatorActive ? { backgroundColor: accentColor } : undefined}
          >
            <span className="text-base">💬</span>
            {!collapsed && <span className="flex-1">시뮬레이터</span>}
          </Link>

          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                clsx(
                  'flex items-center rounded-xl text-sm font-medium transition-colors',
                  collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
                  isActive
                    ? 'text-[#1a1a1a]'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: accentColor } : undefined
              }
            >
              <span className="text-base">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.beta && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/15 text-white/60">
                      BETA
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* 광고 */}
        {!collapsed && <SidebarAd />}

        {/* 유저 영역 */}
        <div className={clsx('mt-4 border-t border-white/10 pt-3', collapsed ? 'flex justify-center' : '')}>
          {user ? (
            <button
              onClick={() => setShowProfile(true)}
              title="프로필 설정"
              className={clsx(
                'flex items-center w-full rounded-xl transition-colors hover:bg-white/10',
                collapsed ? 'justify-center p-1.5' : 'gap-2 px-2 py-1.5'
              )}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                style={{ backgroundColor: accentColor, color: '#1a1a1a' }}
              >
                {avatarLetter}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-white text-xs font-medium truncate">
                    {displayName || user.email}
                  </p>
                  {profile?.is_premium && (
                    <p className="text-[10px]" style={{ color: accentColor }}>⭐ 프리미엄</p>
                  )}
                </div>
              )}
              {!collapsed && (
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/15 text-white/60">BETA</span>
                  <span className="text-white/30 text-[10px]">✏️</span>
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              title="로그인"
              className={clsx(
                'flex items-center rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors',
                collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5 w-full'
              )}
            >
              <span className="text-base">👤</span>
              {!collapsed && (
                <>
                  <span className="flex-1">로그인</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/15 text-white/60">
                    BETA
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* 접기 버튼 */}
        <button
          onClick={onToggle}
          className={clsx(
            'mt-3 flex items-center justify-center rounded-xl py-2 text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors',
            collapsed ? 'px-2' : 'px-3 gap-2'
          )}
        >
          <span className="text-xs">{collapsed ? '▶' : '◀'}</span>
          {!collapsed && <span className="text-[11px]">접기</span>}
        </button>
      </aside>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  )
}
