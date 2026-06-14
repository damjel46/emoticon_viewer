import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { LoginModal } from './LoginModal'
import { PaymentModal } from './PaymentModal'

interface Props {
  children: React.ReactNode
  feature?: string
}

export function PremiumGate({ children, feature = '이 기능' }: Props) {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const [showLogin, setShowLogin] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  if (profile?.is_premium) return <>{children}</>

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-4">
        <div className="text-5xl">⭐</div>
        <div>
          <p className="font-bold text-gray-800 text-lg mb-1">{feature}은 프리미엄 전용입니다</p>
          <p className="text-sm text-gray-500">
            {user ? '4,900원 일회성 결제 후 바로 이용 가능합니다.' : '로그인 후 이용해주세요.'}
          </p>
        </div>
        {user ? (
          <button
            onClick={() => setShowPayment(true)}
            className="bg-[#fee500] hover:bg-yellow-400 text-[#3c1e1e] font-bold px-6 py-3 rounded-xl transition-colors"
          >
            프리미엄 구매하기 · 4,900원
          </button>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="bg-[#3c1e1e] hover:bg-[#5c3333] text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            로그인
          </button>
        )}
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}
    </>
  )
}
