import { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Props {
  onClose: () => void
}

type Mode = 'login' | 'signup' | 'reset'

export function LoginModal({ onClose }: Props) {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      else onClose()
    } else if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        if (error.message.includes('already registered')) setError('이미 가입된 이메일입니다.')
        else setError('회원가입에 실패했습니다. 다시 시도해주세요.')
      } else {
        setSent(true)
      }
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) setError('비밀번호 재설정 이메일 전송에 실패했습니다.')
      else setSent(true)
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  const handleKakao = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: window.location.origin },
    })
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setError(null)
    setSent(false)
  }

  const title = mode === 'login' ? '로그인' : mode === 'signup' ? '회원가입' : '비밀번호 재설정'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">📧</div>
            <p className="font-semibold text-gray-800 mb-1">이메일을 확인해주세요</p>
            <p className="text-sm text-gray-500">
              {mode === 'signup'
                ? `${email}으로 인증 링크를 보냈습니다.`
                : `${email}으로 비밀번호 재설정 링크를 보냈습니다.`}
            </p>
            <button
              onClick={() => switchMode('login')}
              className="mt-4 text-xs text-gray-400 underline"
            >
              로그인으로 돌아가기
            </button>
          </div>
        ) : (
          <>
            {mode === 'login' && (
              <>
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-4">
                  <p className="text-xs font-semibold text-amber-700 mb-2">✨ 로그인하면 이런 게 좋아요!</p>
                  <ul className="flex flex-col gap-1.5">
                    {[
                      { icon: '☁️', text: '세트 저장 & 불러오기' },
                      { icon: '📱', text: 'QR 공유로 모바일 미리보기' },
                      { icon: '🔄', text: '기기 간 세트 동기화' },
                    ].map(({ icon, text }) => (
                      <li key={text} className="flex items-center gap-2 text-xs text-amber-800">
                        <span>{icon}</span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={handleKakao}
                  className="w-full flex items-center justify-center gap-2 font-semibold py-2.5 rounded-xl transition-colors text-sm mb-2"
                  style={{ backgroundColor: '#FEE500', color: '#1a1a1a' }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9 1C4.582 1 1 3.806 1 7.273c0 2.21 1.377 4.154 3.45 5.29L3.6 15.7a.3.3 0 0 0 .44.328L8.05 13.5c.31.03.627.046.95.046 4.418 0 8-2.806 8-6.273C17 3.806 13.418 1 9 1z" fill="#1a1a1a"/>
                  </svg>
                  카카오로 계속하기
                </button>
                <button
                  type="button"
                  onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm mb-4"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Google로 계속하기
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <hr className="flex-1 border-gray-200" />
                  <span className="text-xs text-gray-400">또는</span>
                  <hr className="flex-1 border-gray-200" />
                </div>
              </>
            )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#fee500] transition-colors"
            />
            {mode !== 'reset' && (
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#fee500] transition-colors"
              />
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3c1e1e] hover:bg-[#5c3333] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              {loading ? '처리 중...' : title}
            </button>

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                <button type="button" onClick={() => switchMode('signup')} className="hover:text-gray-600 underline">
                  회원가입
                </button>
                <button type="button" onClick={() => switchMode('reset')} className="hover:text-gray-600 underline">
                  비밀번호 찾기
                </button>
              </div>
            )}
            {mode !== 'login' && (
              <p className="text-center text-xs text-gray-400 mt-1">
                <button type="button" onClick={() => switchMode('login')} className="hover:text-gray-600 underline">
                  로그인으로 돌아가기
                </button>
              </p>
            )}
          </form>
          </>
        )}
      </div>
    </div>
  )
}
