import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function PaymentSuccessPage() {
  const navigate = useNavigate()
  const refreshProfile = useAuthStore((s) => s.refreshProfile)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const approve = async () => {
      const pg_token = new URLSearchParams(window.location.search).get('pg_token')
      const tid = localStorage.getItem('kakaopay_tid')
      const partner_order_id = localStorage.getItem('kakaopay_order_id')
      const partner_user_id = localStorage.getItem('kakaopay_user_id')

      if (!pg_token || !tid || !partner_order_id || !partner_user_id) {
        setStatus('error')
        return
      }

      const { data, error } = await supabase.functions.invoke('kakaopay-approve', {
        body: { pg_token, tid, partner_order_id, partner_user_id },
      })

      if (error || data?.error_code) {
        setStatus('error')
        return
      }

      localStorage.removeItem('kakaopay_tid')
      localStorage.removeItem('kakaopay_order_id')
      localStorage.removeItem('kakaopay_user_id')

      await refreshProfile()
      setStatus('success')
    }

    approve()
  }, [refreshProfile])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full">
        {status === 'loading' && (
          <>
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-gray-600">결제 확인 중...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">결제 완료!</h2>
            <p className="text-gray-500 text-sm mb-6">이제 이모티콘을 저장할 수 있어요.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#3c1e1e] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#5c3333] transition-colors"
            >
              시작하기
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">결제 오류</h2>
            <p className="text-gray-500 text-sm mb-6">결제 처리 중 문제가 발생했습니다.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-300 transition-colors"
            >
              홈으로
            </button>
          </>
        )}
      </div>
    </div>
  )
}
