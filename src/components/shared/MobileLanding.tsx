import { PLATFORMS, PLATFORM_ORDER } from '../../config/platforms'

export function MobileLanding() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 font-kakao">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* 로고 & 타이틀 */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-5xl">🖼️</div>
          <h1 className="text-2xl font-bold text-gray-900">이모티콘뷰어</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            이모티콘 제출 전, 실제 채팅창에서<br />
            어떻게 보이는지 미리 확인하세요.
          </p>
        </div>

        {/* 플랫폼 칩 */}
        <div className="flex flex-wrap justify-center gap-2">
          {PLATFORM_ORDER.map((id) => {
            const p = PLATFORMS[id]
            return (
              <span
                key={id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: p.accentColor }}
              >
                <span>{p.icon}</span>
                <span>{p.nameShort}</span>
              </span>
            )
          })}
        </div>

        {/* 주요 기능 */}
        <div className="w-full flex flex-col gap-3">
          {[
            { icon: '💬', text: '실제 채팅창 시뮬레이터로 미리보기' },
            { icon: '🎞️', text: 'GIF 프레임·용량 스펙 자동 검사' },
            { icon: '📱', text: 'QR로 모바일에서 실제 크기 확인' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-xl">{icon}</span>
              <span className="text-sm text-gray-700">{text}</span>
            </div>
          ))}
        </div>

        {/* PC 유도 안내 */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">💻</div>
          <p className="text-sm font-medium text-gray-800">PC 또는 태블릿에서 사용하세요</p>
          <p className="text-xs text-gray-400">
            이모티콘 작업 특성상 PC 환경에 최적화되어 있습니다.
          </p>
        </div>

        {/* URL */}
        <p className="text-xs text-gray-300">emoticonviewer.site</p>
      </div>
    </div>
  )
}
