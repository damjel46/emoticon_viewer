import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useAuthStore } from '../../store/authStore'
import { LoginModal } from '../auth/LoginModal'

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

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? '?'

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
          <div className="mb-8 px-2">
            <div className="text-[#fee500] font-bold text-lg leading-tight">카카오</div>
            <div className="text-white/70 text-xs mt-0.5">이모티콘 워크스페이스</div>
          </div>
        )}
        {collapsed && <div className="mb-8 flex justify-center text-[#fee500] font-bold text-lg">카</div>}

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
                    ? 'bg-[#fee500] text-[#3c1e1e]'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )
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
              <div className="w-7 h-7 rounded-full bg-[#fee500] flex items-center justify-center text-[#3c1e1e] font-bold text-xs flex-shrink-0">
                {avatarLetter}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{user.email}</p>
                  {profile?.is_premium && (
                    <p className="text-[#fee500] text-[10px]">⭐ 프리미엄</p>
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
            <div
              title="로그인 (준비중)"
              className={clsx(
                'flex items-center rounded-xl text-sm font-medium text-white/30 cursor-not-allowed',
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
            </div>
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
    </>
  )
}
