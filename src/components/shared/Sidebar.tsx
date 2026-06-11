import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

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
  return (
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

      {/* 접기 버튼 */}
      <button
        onClick={onToggle}
        className={clsx(
          'mt-4 flex items-center justify-center rounded-xl py-2 text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors',
          collapsed ? 'px-2' : 'px-3 gap-2'
        )}
      >
        <span className="text-xs">{collapsed ? '▶' : '◀'}</span>
        {!collapsed && <span className="text-[11px]">접기</span>}
      </button>

      {!collapsed && (
        <div className="px-2 mt-2 text-white/30 text-[10px] leading-relaxed">
          카카오 이모티콘<br />창작자 도구 v0.1
        </div>
      )}
    </aside>
  )
}
