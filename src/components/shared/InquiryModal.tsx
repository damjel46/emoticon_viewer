import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'

interface Props {
  onClose: () => void
}

type InquiryType = 'inquiry' | 'suggestion'

export function InquiryModal({ onClose }: Props) {
  const user = useAuthStore((s) => s.user)
  const [type, setType] = useState<InquiryType>('inquiry')
  const [contactEmail, setContactEmail] = useState(user?.email ?? '')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('inquiries').insert({
      type,
      contact_email: contactEmail.trim() || null,
      content: content.trim(),
      user_id: user?.id ?? null,
    })

    if (error) setError('전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
    else setSent(true)
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">문의 / 건의하기</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">📨</div>
            <p className="font-semibold text-gray-800 mb-1">접수되었습니다</p>
            <p className="text-sm text-gray-500">소중한 의견 감사합니다. 검토 후 필요 시 회신드리겠습니다.</p>
            <button onClick={onClose} className="mt-4 text-xs text-gray-400 underline">
              닫기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
              {([['inquiry', '문의하기'], ['suggestion', '건의하기']] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className="flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors"
                  style={type === value
                    ? { backgroundColor: '#fff', color: '#1a1a1a', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                    : { color: '#6b7280' }}
                >
                  {label}
                </button>
              ))}
            </div>

            <input
              type="email"
              placeholder="회신받을 이메일 (선택)"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
            />

            <textarea
              placeholder={type === 'inquiry' ? '문의하실 내용을 입력해주세요' : '건의하실 내용을 입력해주세요'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors resize-none"
            />

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="w-full bg-[#3c1e1e] hover:bg-[#5c3333] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              {loading ? '전송 중...' : '보내기'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
