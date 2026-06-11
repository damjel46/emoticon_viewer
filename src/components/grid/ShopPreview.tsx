import { useEmoticonStore } from '../../store/emoticonStore'

export function ShopPreview() {
  const emoticons = useEmoticonStore((s) => s.emoticons)

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 w-full max-w-sm mx-auto font-kakao">
      {/* 상단 배너 */}
      <div className="bg-[#fee500] px-4 py-3 flex items-center gap-3">
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden">
          {emoticons[0] ? (
            <img src={emoticons[0].dataUrl} alt="대표" className="w-full h-full object-contain" />
          ) : (
            <span className="text-3xl">🎨</span>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">나의 이모티콘 세트</p>
          <p className="text-gray-600 text-xs">크리에이터</p>
          <p className="text-gray-800 font-semibold text-sm mt-1">2,200원</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex border-b border-gray-100 text-xs font-medium">
        {['이모티콘', '작가 정보', '리뷰'].map((tab, i) => (
          <div
            key={tab}
            className={`flex-1 text-center py-2.5 ${i === 0 ? 'border-b-2 border-[#3c1e1e] text-[#3c1e1e]' : 'text-gray-400'}`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* 이모티콘 그리드 */}
      <div className="p-3">
        <div className="grid grid-cols-4 gap-1.5">
          {emoticons.slice(0, 24).map((e, i) => (
            <div
              key={e.id}
              className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden"
            >
              <img src={e.dataUrl} alt={`${i + 1}`} className="w-full h-full object-contain p-0.5" />
            </div>
          ))}
          {Array.from({ length: Math.max(0, 24 - emoticons.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
            >
              <span className="text-gray-300 text-xs">{emoticons.length + i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 구매 버튼 */}
      <div className="px-3 pb-4">
        <button className="w-full bg-[#fee500] text-gray-900 font-bold py-3 rounded-xl text-sm hover:bg-yellow-400 transition-colors">
          구매하기
        </button>
      </div>
    </div>
  )
}
