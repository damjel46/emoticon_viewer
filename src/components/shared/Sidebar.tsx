import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/', label: '시뮬레이터', icon: '💬' },
  { to: '/grid', label: '그리드 콜라주', icon: '🗂️' },
  { to: '/anim', label: '애니메이션', icon: '🎬' },
  { to: '/qr', label: 'QR 연동', icon: '📱' },
]

export function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-[#3c1e1e] flex flex-col py-6 px-3 flex-shrink-0">
      <div className="mb-8 px-2">
        <div className="text-[#fee500] font-bold text-lg leading-tight">카카오</div>
        <div className="text-white/70 text-xs mt-0.5">이모티콘 워크스페이스</div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#fee500] text-[#3c1e1e]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-2 text-white/30 text-[10px] leading-relaxed">
        카카오 이모티콘<br />
        창작자 도구 v0.1
      </div>
    </aside>
  )
}
