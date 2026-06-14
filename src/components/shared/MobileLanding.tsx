import { useNavigate } from 'react-router-dom'
import { PLATFORMS } from '../../config/platforms'

const FEATURED = [
  { id: 'kakao', desc: '말풍선 채팅 · 이모티콘 / 미니 탭' },
  { id: 'soop', desc: '스트리밍 채팅 · 인라인 스타일' },
  { id: 'ogq', desc: '치지직 채팅 · 다크 테마' },
] as const

export function MobileLanding() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10 font-kakao">
      <div className="w-full max-w-sm flex flex-col items-center gap-7">

        {/* 로고 & 타이틀 */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="text-5xl">🖼️</div>
          <h1 className="text-2xl font-bold text-gray-900">이모티콘뷰어</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            이모티콘 제출 전, 실제 채팅창에서<br />
            어떻게 보이는지 미리 확인하세요.
          </p>
        </div>

        {/* 플랫폼 선택 */}
        <div className="w-full flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">플랫폼 선택</p>
          {FEATURED.map(({ id, desc }) => {
            const p = PLATFORMS[id]
            return (
              <button
                key={id}
                onClick={() => navigate(`/${id}`)}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all active:scale-[0.98]"
                style={{ backgroundColor: `${p.accentColor}18`, border: `1.5px solid ${p.accentColor}40` }}
              >
                <span className="text-3xl flex-shrink-0">{p.icon}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <span className="ml-auto text-gray-400 flex-shrink-0">›</span>
              </button>
            )
          })}
        </div>

        {/* PC 안내 */}
        <div
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ backgroundColor: '#f8f9fa' }}
        >
          <span className="text-xl flex-shrink-0">💻</span>
          <p className="text-xs text-gray-500 leading-relaxed">
            GIF 검사, 스펙 확인 등 더 많은 기능은<br />
            <span className="font-semibold text-gray-700">PC에서 사용 가능합니다.</span>
          </p>
        </div>

        <p className="text-xs text-gray-300">emoticonviewer.site</p>
      </div>
    </div>
  )
}
