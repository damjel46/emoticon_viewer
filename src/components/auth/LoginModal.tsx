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
        )}
      </div>
    </div>
  )
}
