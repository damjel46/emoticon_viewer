import { useRef, useState } from 'react'
import { useEmoticonStore, useActiveEmoticons } from '../store/emoticonStore'
import { usePlatformStore } from '../store/platformStore'
import { useChatStore } from '../store/chatStore'
import { fileToEmoticon } from '../utils/fileToEmoticon'
import { ThemeToolbar } from '../components/simulator/ThemeToolbar'
import { ChatSimulator } from '../components/simulator/ChatSimulator'
import { ChatInput } from '../components/simulator/ChatInput'
import { SpamButton } from '../components/simulator/SpamButton'
import { NaverSubModeBar } from '../components/simulator/NaverSubModeBar'
import { NaverCafeSimulator } from '../components/simulator/NaverCafeSimulator'
import { NaverBlogSimulator } from '../components/simulator/NaverBlogSimulator'

export function SimulatorPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const addEmoticons = useEmoticonStore((s) => s.addEmoticons)
  const count = useActiveEmoticons().length
  const [panelOpen, setPanelOpen] = useState(false)
  const platformConfig = usePlatformStore((s) => s.getConfig())
  const activePlatform = usePlatformStore((s) => s.activePlatform)
  const naverSubMode = usePlatformStore((s) => s.naverSubMode ?? 'chzzk')
  const miniEmoticonMode = useChatStore((s) => s.miniEmoticonMode)
  const activeSpec = miniEmoticonMode && platformConfig.miniSpec
    ? platformConfig.miniSpec
    : platformConfig.spec
  const acceptAttr = activeSpec.allowedTypes.join(',')

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const config = usePlatformStore.getState().getConfig()
    const miniMode = useChatStore.getState().miniEmoticonMode
    const spec = miniMode && config.miniSpec ? config.miniSpec : config.spec
    const converted = await Promise.all(files.map((f) => fileToEmoticon(f, spec)))
    addEmoticons(converted)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">채팅 시뮬레이터</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {platformConfig.nameKo} 채팅 화면에서 이모티콘을 실시간 테스트하세요
          </p>
        </div>
        <div className="flex items-center gap-3">
          {count > 0 && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
              이모티콘 {count}종 로드됨
            </span>
          )}
          <button
            onClick={() => setPanelOpen((v) => !v)}
            className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            title="사용 방법"
          >
            {panelOpen ? '안내 닫기 ✕' : '사용 방법 ?'}
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors text-gray-900"
            style={{ backgroundColor: platformConfig.accentColor }}
          >
            이모티콘 업로드
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={acceptAttr}
            onChange={handleFiles}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 채팅 시뮬레이터 */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden border-r border-gray-100">
          {activePlatform === 'ogq' && <NaverSubModeBar />}

          {activePlatform === 'ogq' && naverSubMode === 'cafe' ? (
            <div className="flex-1 overflow-y-auto">
              <NaverCafeSimulator />
            </div>
          ) : activePlatform === 'ogq' && naverSubMode === 'blog' ? (
            <div className="flex-1 overflow-y-auto">
              <NaverBlogSimulator />
            </div>
          ) : (
            <>
              <ThemeToolbar />
              <div className="flex-1 overflow-hidden">
                <ChatSimulator />
              </div>
              <SpamButton />
              <ChatInput />
            </>
          )}
        </div>

        {/* 우측 안내 패널 (토글) */}
        {panelOpen && (
          <div className="w-64 flex-shrink-0 p-4 flex flex-col gap-4 bg-gray-50 overflow-y-auto border-l border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">사용 방법</h3>
              <button onClick={() => setPanelOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
            </div>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex gap-1.5"><span>1.</span><span>이모티콘 파일을 업로드합니다</span></li>
              <li className="flex gap-1.5"><span>2.</span><span>상단 테마 버튼으로 배경을 변경합니다</span></li>
              <li className="flex gap-1.5"><span>3.</span><span>😄 버튼으로 이모티콘을 선택해 전송합니다</span></li>
              <li className="flex gap-1.5"><span>4.</span><span>"연타 전송"으로 같은 이모티콘을 연속 전송해 스팸 레이아웃을 확인합니다</span></li>
              <li className="flex gap-1.5"><span>5.</span><span>"상대방" 버튼으로 반대편 말풍선을 추가합니다</span></li>
            </ul>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-700 mb-1">⚠ 테두리 가시성 안내</p>
              <p className="text-[10px] text-amber-600 leading-relaxed">
                테마 배경색에 따라 이모티콘의 흰색/검정 테두리가 잘 안 보일 수 있습니다.
                상단의 명암비 경고를 확인하세요.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-blue-700 mb-1">💡 스팸 레이아웃이란?</p>
              <p className="text-[10px] text-blue-600 leading-relaxed">
                카카오톡에서 같은 이모티콘을 연속으로 여러 번 보냈을 때 채팅창에 쌓이는 모습입니다.
                카카오 심사 시 이 화면도 확인합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
