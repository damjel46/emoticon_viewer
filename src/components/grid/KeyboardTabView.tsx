import { useEmoticonStore } from '../../store/emoticonStore'

export function KeyboardTabView() {
  const emoticons = useEmoticonStore((s) => s.emoticons)

  return (
    <div className="bg-[#d1d5db] rounded-xl overflow-hidden border border-gray-300">
      {/* 키보드 헤더 */}
      <div className="bg-[#adb5bd] px-3 py-1.5 flex items-center gap-2 border-b border-gray-400">
        <div className="flex gap-1 text-[10px] text-gray-600">
          {['이모티콘', '최근', '즐겨찾기'].map((t, i) => (
            <span
              key={t}
              className={`px-2 py-0.5 rounded ${i === 0 ? 'bg-white text-gray-800 font-semibold' : 'text-gray-500'}`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 탭 아이콘 */}
      <div className="bg-[#c8ced4] px-2 py-1.5 flex gap-1 overflow-x-auto">
        {emoticons.slice(0, 10).map((e) => (
          <div
            key={e.id}
            className="w-11 h-11 flex-shrink-0 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200"
          >
            <img src={e.dataUrl} alt={e.name} className="w-full h-full object-contain p-0.5" />
          </div>
        ))}
        {emoticons.length === 0 && (
          <p className="text-xs text-gray-500 px-2 py-1">이모티콘을 업로드하면 탭 아이콘이 표시됩니다</p>
        )}
      </div>

      {/* 이모티콘 썸네일 */}
      <div className="bg-white p-2 min-h-[100px]">
        <div className="grid grid-cols-5 gap-1">
          {emoticons.slice(0, 15).map((e, i) => (
            <div
              key={e.id}
              className="aspect-square rounded flex items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <img src={e.dataUrl} alt={`${i + 1}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
        {emoticons.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-gray-400">
            업로드된 이모티콘 없음
          </div>
        )}
      </div>
    </div>
  )
}
