import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PLATFORMS } from '../../config/platforms'
import { useAuthStore } from '../../store/authStore'
import { LoginModal } from '../auth/LoginModal'

const FEATURED = [
  { id: 'kakao', desc: '말풍선 채팅 · 이모티콘 / 미니 탭' },
  { id: 'soop', desc: '스트리밍 채팅 · 인라인 스타일' },
  { id: 'ogq', desc: '치지직 채팅 · 다크 테마' },
] as const

const STORAGE_KEY = 'pc_promo_dismissed'

export function MobileLanding() {
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const signOut = useAuthStore((s) => s.signOut)

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? '?'

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setShowPopup(true)
  }, [])

  function dismissForever() {
    localStorage.setItem(STORAGE_KEY, '1')
    setShowPopup(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10 font-kakao">

      {/* PC 기능 안내 팝업 */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full max-w-sm bg-white rounded-t-3xl px-6 pt-6 pb-8 flex flex-col gap-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💻</span>
                <p className="font-bold text-gray-900 text-base leading-snug">PC에서 더 많은 기능을 이용하세요!</p>
              </div>
              <button onClick={() => setShowPopup(false)} className="text-gray-400 text-xl leading-none mt-0.5">✕</button>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> GIF 프레임 분석 · 스펙 검사</li>
              <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> 이미지 그리드 뷰 · 일괄 미리보기</li>
              <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> QR 코드 생성 · 모바일 전송</li>
              <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> 다크 / 라이트 테마 · 속도 조절</li>
            </ul>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold active:opacity-80"
              >
                확인
              </button>
              <button
                onClick={dismissForever}
                className="w-full py-2.5 text-xs text-gray-400"
              >
                다시 보지 않기
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-sm flex flex-col items-center gap-7">

        {/* 상단 유저 영역 */}
        <div className="w-full flex items-center justify-between">
          <div className="text-2xl">🖼️</div>
          {user ? (
            <div className="flex items-center gap-2">
              {profile?.is_premium && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#fff8e1', color: '#b8860b' }}>
                  ☁️ 동기화됨
                </span>
              )}
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-600 active:bg-gray-100"
              >
                <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                  {avatarLetter}
                </span>
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-white active:opacity-80"
              style={{ backgroundColor: '#3c1e1e' }}
            >
              로그인
            </button>
          )}
        </div>

        {/* 타이틀 */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900">이모티콘뷰어</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            이모티콘 제출 전, 실제 채팅창에서<br />
            어떻게 보이는지 미리 확인하세요.
          </p>
          {user && !profile?.is_premium && (
            <p className="text-xs text-gray-400 mt-1">
              💡 프리미엄 구매 시 PC ↔ 모바일 세트 동기화
            </p>
          )}
        </div>

        {/* 플랫폼 선택 */}
        <div className="w-full flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">플랫폼 선택</p>
          {FEATURED.map(({ id, desc }) => {
            const p = PLATFORMS[id]
            return (
              <button
                key={id}
                onClick={() => navigate(`/${id}`)}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all active:scale-[0.98]"
                style={{ backgroundColor: `${p.accentColor}18`, border: `1.5px solid ${p.accentColor}40` }}
              >
                <span className="text-3xl flex-shrink-0">{p.icon}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{p.nameKo}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <span className="ml-auto text-gray-400 flex-shrink-0">›</span>
              </button>
            )
          })}
        </div>

        {/* PC 안내 */}
        <div
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ backgroundColor: '#f8f9fa' }}
        >
          <span className="text-xl flex-shrink-0">💻</span>
          <p className="text-xs text-gray-500 leading-relaxed">
            GIF 검사, 스펙 확인 등 더 많은 기능은<br />
            <span className="font-semibold text-gray-700">PC에서 사용 가능합니다.</span>
          </p>
        </div>

        <p className="text-xs text-gray-300">emoticonviewer.site</p>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}
