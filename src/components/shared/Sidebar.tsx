import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useAuthStore } from '../../store/authStore'
import { usePlatformStore } from '../../store/platformStore'
import { PLATFORMS, PLATFORM_ORDER } from '../../config/platforms'
import { LoginModal } from '../auth/LoginModal'
import { InfoModal } from './InfoModal'
import { PlatformLogo } from './PlatformLogo'

const NAV_ITEMS = [
  { to: '/', label: '시뮬레이터', icon: '💬' },
  { to: '/grid', label: '업로드', icon: '📂' },
  { to: '/anim', label: '애니메이션', icon: '🎬' },
  { to: '/qr', label: 'QR 연동', icon: '📱' },
]

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: Props) {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const signOut = useAuthStore((s) => s.signOut)
  const [showLogin, setShowLogin] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(false)

  const activePlatform = usePlatformStore((s) => s.activePlatform)
  const setPlatform = usePlatformStore((s) => s.setPlatform)
  const platformConfig = usePlatformStore((s) => s.getConfig())

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
            <div className="text-white/70 text-xs mt-0.5">이모티콘 워크스페이스</div>
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
                  onClick={() => setPlatform(id)}
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
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
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
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* 유저 영역 */}
        <div className={clsx('mt-4 border-t border-white/10 pt-3', collapsed ? 'flex justify-center' : '')}>
          {user ? (
            <div className={clsx('flex items-center', collapsed ? 'justify-center' : 'gap-2 px-2')}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                style={{ backgroundColor: accentColor, color: '#1a1a1a' }}
              >
                {avatarLetter}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{user.email}</p>
                  {profile?.is_premium && (
                    <p className="text-[10px]" style={{ color: accentColor }}>⭐ 프리미엄</p>
                  )}
                </div>
              )}
              {!collapsed && (
                <button
                  onClick={signOut}
                  className="text-white/40 hover:text-white/80 text-[10px] flex-shrink-0"
                  title="로그아웃"
                >
                  나가기
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowComingSoon(true)}
              title="로그인 (준비중)"
              className={clsx(
                'flex items-center rounded-xl text-sm font-medium text-white/50 hover:text-white/70 hover:bg-white/10 transition-colors',
                collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5 w-full'
              )}
            >
              <span className="text-base">👤</span>
              {!collapsed && (
                <span className="flex items-center gap-1.5">
                  로그인
                  <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded-full">준비중</span>
                </span>
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

      {showComingSoon && (
        <InfoModal title="🚀 곧 오픈됩니다!" onClose={() => setShowComingSoon(false)}>
          <p className="text-sm text-gray-500 mb-4">
            로그인 및 결제 서비스를 준비 중입니다.<br />
            오픈 후 아래 혜택을 모두 이용하실 수 있습니다.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-xl leading-none">☁️</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">이모티콘 클라우드 저장</p>
                <p className="text-xs text-gray-500">업로드한 이모티콘이 계정에 자동 저장됩니다.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl leading-none">📱</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">QR 모바일 미리보기</p>
                <p className="text-xs text-gray-500">QR 코드로 실제 스마트폰에서 바로 확인할 수 있습니다.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl leading-none">🚫</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">광고 제거</p>
                <p className="text-xs text-gray-500">광고 없는 깔끔한 환경에서 작업하세요.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl leading-none">🤏</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">카카오 미니 이모티콘 모드</p>
                <p className="text-xs text-gray-500">미니 사이즈 이모티콘 레이아웃을 시뮬레이션합니다.</p>
              </div>
            </li>
          </ul>
        </InfoModal>
      )}
    </>
  )
}
