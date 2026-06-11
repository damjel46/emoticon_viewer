import { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Props {
  onClose: () => void
}

type Mode = 'login' | 'signup'

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
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError('회원가입에 실패했습니다. 다시 시도해주세요.')
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            {mode === 'login' ? '로그인' : '회원가입'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">📧</div>
            <p className="font-semibold text-gray-800 mb-1">이메일을 확인해주세요</p>
            <p className="text-sm text-gray-500">{email}으로 인증 링크를 보냈습니다.</p>
          </div>
        ) : (
          <>
            {/* 소셜 로그인 */}
            <div className="flex flex-col gap-2 mb-4">
              <button
                onClick={handleKakao}
                className="w-full flex items-center justify-center gap-2 bg-[#fee500] hover:bg-yellow-400 text-[#3c1e1e] font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                <span>💬</span> 카카오로 계속하기
              </button>
              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                <span>G</span> Google로 계속하기
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <hr className="flex-1 border-gray-200" />
              <span className="text-xs text-gray-400">또는</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            {/* 이메일 폼 */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#fee500]"
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#fee500]"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3c1e1e] hover:bg-[#5c3333] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                {loading ? '처리 중...' : mode === 'login' ? '로그인' : '가입하기'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-4">
              {mode === 'login' ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
                className="text-[#3c1e1e] font-semibold underline"
              >
                {mode === 'login' ? '회원가입' : '로그인'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
