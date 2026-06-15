import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useKakaoPay } from '../../hooks/useKakaoPay'

interface Props {
  onClose: () => void
}

export function PaymentModal({ onClose }: Props) {
  const user = useAuthStore((s) => s.user)
  const { startPayment } = useKakaoPay()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePay = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      await startPayment(user.id)
    } catch {
      setError('결제 요청에 실패했습니다. 다시 시도해주세요.')
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* 8:7 비율 박스 */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
        style={{ maxWidth: '360px', maxHeight: '90dvh' }}
      >
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-sm hover:bg-gray-200 transition-colors"
        >
          ✕
        </button>

        {/* 상단 색상 띠 */}
        <div className="h-1.5 w-full bg-[#fee500] flex-shrink-0" />

        {/* 본문 */}
        <div className="flex flex-col items-center justify-between flex-1 px-6 py-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-3xl">⭐</span>
            <p className="font-bold text-gray-900 text-base mt-1">이모티콘뷰어 프리미엄</p>
            <p className="text-[11px] text-gray-400">일회성 결제 · 영구 이용</p>
          </div>

          {/* 가격 */}
          <div className="text-center">
            <p className="text-3xl font-black text-gray-900">3,300<span className="text-xl font-bold">원</span></p>
          </div>

          <div className="w-full flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5">
            <span className="text-blue-500 text-base flex-shrink-0 mt-0.5">ℹ️</span>
            <div>
              <p className="text-[11px] font-bold text-blue-700">테스트 기간 안내</p>
              <p className="text-[10.5px] text-blue-600 leading-snug mt-0.5">
                현재 테스트 기간으로 실제 결제가 이루어지지 않습니다. 카카오페이 결제창이 열리더라도 실제 금액이 청구되지 않으니 안심하세요.
              </p>
            </div>
          </div>

          {/* 혜택 */}
          <ul className="w-full space-y-1">
            {[
              '이모티콘 세트 저장 · 클라우드 동기화',
              '카카오톡 / Soop 스토어 미리보기',
              '광고 제거',
              'QR 공유 기능',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-[11px] text-gray-600">
                <span className="text-[#fee500] font-bold text-sm flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>

          {/* 에러 */}
          {error && <p className="text-[11px] text-red-500 text-center">{error}</p>}

          {/* 버튼 */}
          <div className="flex gap-2 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handlePay}
              disabled={loading}
              className="flex-[2] py-2.5 rounded-xl text-sm font-bold text-[#3c1e1e] bg-[#fee500] hover:bg-yellow-400 transition-colors disabled:opacity-60"
            >
              {loading ? '처리 중...' : '카카오페이로 결제'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
