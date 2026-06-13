import { useNavigate } from 'react-router-dom'

export function PaymentFailPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full">
        <div className="text-5xl mb-4">😢</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">결제 실패</h2>
        <p className="text-gray-500 text-sm mb-6">결제가 실패했습니다. 다시 시도해주세요.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#3c1e1e] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#5c3333] transition-colors"
        >
          돌아가기
        </button>
      </div>
    </div>
  )
}
