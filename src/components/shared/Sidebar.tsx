import { useState } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useProfileStore } from '../../store/profileStore'
import { useEmoticonStore } from '../../store/emoticonStore'
import { usePlatformStore } from '../../store/platformStore'
import { PLATFORMS, PLATFORM_ORDER } from '../../config/platforms'
import { LoginModal } from '../auth/LoginModal'
import { ProfileModal } from '../auth/ProfileModal'
import { PaymentModal } from '../auth/PaymentModal'
import { InquiryModal } from './InquiryModal'
import { PlatformLogo } from './PlatformLogo'


const NAV_ITEMS = [
  { to: '/grid', label: '업로드', icon: '📂' },
  { to: '/anim', label: '애니메이션', icon: '🎬' },
  { to: '/qr', label: 'QR 연동', icon: '📱', beta: true },
]

export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const displayName = useProfileStore((s) => s.displayName)
  const saveAllToCloud = useEmoticonStore((s) => s.saveAllToCloud)
  const loadFromCloud = useEmoticonStore((s) => s.loadFromCloud)
  const [showLogin, setShowLogin] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showInquiry, setShowInquiry] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'ok' | 'err'>('idle')

  const navigate = useNavigate()
  const location = useLocation()
  const activePlatform = usePlatformStore((s) => s.activePlatform)
  const platformConfig = usePlatformStore((s) => s.getConfig())
  const isSimulatorActive = PLATFORM_ORDER.some((id) => location.pathname === `/${id}`)

  const handlePremium = () => {
    if (!user) { setShowLogin(true); return }
    setShowPayment(true)
  }

  const handleSave = async () => {
    if (!user) { setShowLogin(true); return }
    if (!profile?.is_premium) { setShowPayment(true); return }
    setSaving(true)
    setSaveStatus('idle')
    try {
      await saveAllToCloud(user.id)
      setSaveStatus('ok')
    } catch {
      setSaveStatus('err')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveStatus('idle'), 2500)
    }
  }

  const handleLoad = async () => {
    if (!user) { setShowLogin(true); return }
    if (!profile?.is_premium) { setShowPayment(true); return }
    setLoading(true)
    try {
      await loadFromCloud(user.id)
    } finally {
      setLoading(false)
    }
  }

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? '?'
  const accentColor = platformConfig.accentColor

  return (
    <>
      <aside className="w-56 px-3 bg-[#3c1e1e] flex flex-col py-6 flex-shrink-0 overflow-hidden">
        {/* 로고 */}
        <div className="mb-5 px-2">
          <div className="font-bold text-lg leading-tight" style={{ color: accentColor }}>
            {platformConfig.nameShort}
          </div>
          <div className="text-white/70 text-xs mt-0.5">이모티콘 뷰어</div>
        </div>

        {/* 플랫폼 선택기 */}
        <div className="mb-4 px-1">
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider mb-2 px-1">
            플랫폼
          </p>
          <div className="flex gap-1 flex-row flex-wrap">
            {PLATFORM_ORDER.map((id) => {
              const p = PLATFORMS[id]
              const isActive = activePlatform === id
              return (
                <button
                  key={id}
                  onClick={() => navigate(`/${id}`)}
                  title={p.nameKo}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-base transition-all ${
                    isActive ? 'scale-110' : 'opacity-40 hover:opacity-75'
                  }`}
                  style={isActive ? { outline: `2px solid ${p.accentColor}`, backgroundColor: `${p.accentColor}22` } : undefined}
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
          <Link
            to={`/${activePlatform}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isSimulatorActive ? 'text-[#1a1a1a]' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            style={isSimulatorActive ? { backgroundColor: accentColor } : undefined}
          >
            <span className="text-base">💬</span>
            <span className="flex-1">시뮬레이터</span>
          </Link>

          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'text-[#1a1a1a]' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: accentColor } : undefined}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.beta && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/15 text-white/60">BETA</span>
              )}
            </NavLink>
          ))}

          <button
            onClick={() => setShowInquiry(true)}
            className="flex items-center justify-center px-3 py-2.5 rounded-xl text-[10px] font-medium text-white/50 hover:bg-white/10 hover:text-white/70 transition-colors"
          >
            <span>문의/건의하기</span>
          </button>
        </nav>

        {/* 유저 영역 */}
        <div className="mt-4 border-t border-white/10 pt-3">
          <div className="flex gap-1.5 mb-2">
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="flex-1 rounded-xl py-2 text-xs font-semibold transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff' }}
            >
              {saving ? '저장 중...' : saveStatus === 'ok' ? '✓ 저장됨' : saveStatus === 'err' ? '✕ 실패' : '💾 저장'}
            </button>
            <button
              onClick={handleLoad}
              disabled={saving || loading}
              className="flex-1 rounded-xl py-2 text-xs font-semibold transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff' }}
            >
              {loading ? '불러오는 중...' : '☁️ 불러오기'}
            </button>
          </div>
          {!profile?.is_premium && (
            <button
              onClick={handlePremium}
              className="mb-2 w-full rounded-xl py-2 text-xs font-medium transition-colors text-white/40 hover:text-white/70"
            >
              ⭐ 프리미엄 3,300원
            </button>
          )}
          {user ? (
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 px-2 py-1.5 w-full rounded-xl transition-colors hover:bg-white/10"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                style={{ backgroundColor: accentColor, color: '#1a1a1a' }}
              >
                {avatarLetter}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-white text-xs font-medium truncate">{displayName || user.email}</p>
                {profile?.is_premium && (
                  <p className="text-[10px]" style={{ color: accentColor }}>⭐ 프리미엄</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/15 text-white/60">BETA</span>
                <span className="text-white/30 text-[10px]">✏️</span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="text-base">👤</span>
              <span className="flex-1">로그인</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/15 text-white/60">BETA</span>
            </button>
          )}
        </div>
      </aside>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}
      {showInquiry && <InquiryModal onClose={() => setShowInquiry(false)} />}
    </>
  )
}
