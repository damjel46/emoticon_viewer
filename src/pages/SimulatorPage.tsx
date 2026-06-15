import { useRef, useState, useEffect } from 'react'
import { useEmoticonStore, useActiveEmoticons, useActiveThumbnailId, useActiveSetName } from '../store/emoticonStore'
import { useAuthStore } from '../store/authStore'
import { useProfileStore } from '../store/profileStore'
import { OGQStorePreview, KakaoDualStorePreview } from '../components/grid/ShopPreview'
import { usePlatformStore } from '../store/platformStore'
import { useChatStore } from '../store/chatStore'
import { convertFiles, MAX_FILE_SIZE_MB } from '../utils/fileToEmoticon'
import { useToastStore } from '../store/toastStore'
import { ThemeToolbar } from '../components/simulator/ThemeToolbar'
import { ChatSimulator } from '../components/simulator/ChatSimulator'
import { ChatInput } from '../components/simulator/ChatInput'
import { SoopChatInput } from '../components/simulator/SoopChatInput'
import { YoutubeChatInput } from '../components/simulator/YoutubeChatInput'
import { TwitchChatInput } from '../components/simulator/TwitchChatInput'
import { SpamButton } from '../components/simulator/SpamButton'

import { NaverCafeSimulator } from '../components/simulator/NaverCafeSimulator'
import { NaverBlogSimulator } from '../components/simulator/NaverBlogSimulator'
import type { PlatformId } from '../config/platforms'
import type { NaverSubMode } from '../store/platformStore'

function textOnAccent(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#1a1a1a' : '#ffffff'
}

interface HelpNote {
  type: 'amber' | 'blue'
  title: string
  body: string
}

interface PlatformHelp {
  steps: string[]
  notes: HelpNote[]
}

function getPlatformHelp(platformId: PlatformId, naverSubMode: NaverSubMode): PlatformHelp {
  if (platformId === 'kakao') {
    return {
      steps: [
        '이모티콘 파일을 업로드합니다',
        '상단 테마 버튼으로 배경을 변경합니다',
        '😄 버튼으로 이모티콘을 선택해 전송합니다',
        '"연타 전송"으로 같은 이모티콘을 연속 전송해 스팸 레이아웃을 확인합니다',
        '"상대방" 버튼으로 반대편 말풍선을 추가합니다',
      ],
      notes: [
        {
          type: 'amber',
          title: '⚠ 테두리 가시성 안내',
          body: '테마 배경색에 따라 이모티콘의 흰색/검정 테두리가 잘 안 보일 수 있습니다. 상단의 명암비 경고를 확인하세요.',
        },
        {
          type: 'blue',
          title: '💡 스팸 레이아웃이란?',
          body: '카카오톡에서 같은 이모티콘을 연속으로 여러 번 보냈을 때 채팅창에 쌓이는 모습입니다. 카카오 심사 시 이 화면도 확인합니다.',
        },
      ],
    }
  }

  if (platformId === 'soop') {
    return {
      steps: [
        '이모티콘 파일을 업로드합니다',
        '상단 테마 버튼으로 배경을 변경합니다',
        '😄 버튼으로 이모티콘을 선택해 전송합니다',
        '스트리밍 채팅 환경에서 이모티콘 표시 방식을 확인합니다',
      ],
      notes: [
        {
          type: 'amber',
          title: '⚠ 테두리 가시성 안내',
          body: '테마 배경색에 따라 이모티콘의 흰색/검정 테두리가 잘 안 보일 수 있습니다.',
        },
        {
          type: 'blue',
          title: '💡 SOOP 규격 안내',
          body: '240×240px, GIF/WEBP 지원, 최대 100프레임·3초, 파일당 최대 1MB.',
        },
      ],
    }
  }

  if (platformId === 'ogq') {
    if (naverSubMode === 'blog') {
      return {
        steps: [
          '이모티콘 파일을 업로드합니다',
          '상단 탭에서 블로그를 선택합니다',
          '포스트 에디터 툴바의 😄 버튼으로 이모티콘을 삽입합니다',
          '댓글 섹션에서도 이모티콘을 삽입해 표시를 확인합니다',
          '발행 버튼으로 포스트 내용을 확정합니다',
        ],
        notes: [
          {
            type: 'blue',
            title: '💡 블로그 이모티콘 안내',
            body: '블로그 이모티콘은 포스트 본문과 댓글 모두에 사용됩니다. 240×240px, GIF/WEBP 지원.',
          },
        ],
      }
    }
    if (naverSubMode === 'cafe') {
      return {
        steps: [
          '이모티콘 파일을 업로드합니다',
          '상단 탭에서 카페를 선택합니다',
          '게시글 에디터 툴바의 😄 버튼으로 이모티콘을 삽입합니다',
          '댓글 섹션에서도 이모티콘을 삽입해 표시를 확인합니다',
          '등록 버튼으로 게시글 내용을 확정합니다',
        ],
        notes: [
          {
            type: 'blue',
            title: '💡 카페 이모티콘 안내',
            body: '카페 이모티콘은 게시글 본문과 댓글 모두에 사용됩니다. 240×240px, GIF/WEBP 지원.',
          },
        ],
      }
    }
    // chzzk
    return {
      steps: [
        '이모티콘 파일을 업로드합니다',
        '상단 탭에서 치지직을 선택합니다',
        '😄 버튼으로 이모티콘을 선택해 전송합니다',
        '치지직 채팅 환경에서 이모티콘 표시 방식을 확인합니다',
      ],
      notes: [
        {
          type: 'blue',
          title: '💡 치지직 규격 안내',
          body: '240×240px, GIF/WEBP 지원, 최대 100프레임·3초, 파일당 최대 1MB.',
        },
      ],
    }
  }

  if (platformId === 'youtube') {
    return {
      steps: [
        '이모티콘 파일을 업로드합니다',
        '😄 버튼으로 이모티콘을 선택해 채팅창에 전송합니다',
        'YouTube 멤버십 채팅 환경에서 이모티콘 표시를 확인합니다',
      ],
      notes: [
        {
          type: 'amber',
          title: '⚠ 정적 이미지만 지원',
          body: 'YouTube는 정적 이미지(PNG/JPEG)만 지원합니다. GIF/WEBP 파일은 업로드할 수 없습니다.',
        },
        {
          type: 'blue',
          title: '💡 YouTube 규격 안내',
          body: '권장 크기: 48×48 ~ 480×480px, 파일당 최대 1MB.',
        },
      ],
    }
  }

  // twitch
  return {
    steps: [
      '이모티콘 파일을 업로드합니다',
      '😄 버튼으로 이모티콘을 선택해 채팅창에 전송합니다',
      'Twitch 채팅 환경에서 이모티콘 표시를 확인합니다',
    ],
    notes: [
      {
        type: 'blue',
        title: '💡 Twitch 규격 안내',
        body: '112×112px PNG 파일 제출, 28/56/112px 3가지 해상도가 자동 생성됩니다. 파일당 최대 512KB.',
      },
    ],
  }
}

export function SimulatorPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const addEmoticons = useEmoticonStore((s) => s.addEmoticons)
  const activeEmoticons = useActiveEmoticons()
  const thumbnailId = useActiveThumbnailId()
  const activeSetName = useActiveSetName()
  const user = useAuthStore((s) => s.user)
  const displayName = useProfileStore((s) => s.displayName)
  const creatorName = displayName || (user?.email?.split('@')[0] ?? '나의 크리에이터')

  const [panelOpen, setPanelOpen] = useState(false)
  const [ogqOpen, setOgqOpen] = useState(false)
  const platformConfig = usePlatformStore((s) => s.getConfig())
  const activePlatform = usePlatformStore((s) => s.activePlatform)

  useEffect(() => { setOgqOpen(false); setPanelOpen(false) }, [activePlatform])
  const naverSubMode = usePlatformStore((s) => s.naverSubMode ?? 'chzzk')
  const miniEmoticonMode = useChatStore((s) => s.miniEmoticonMode)
  const activeSpec = miniEmoticonMode && platformConfig.miniSpec
    ? platformConfig.miniSpec
    : platformConfig.spec
  const acceptAttr = activeSpec.allowedTypes.join(',')

  const showToast = useToastStore((s) => s.show)

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const config = usePlatformStore.getState().getConfig()
    const miniMode = useChatStore.getState().miniEmoticonMode
    const spec = miniMode && config.miniSpec ? config.miniSpec : config.spec
    const { emoticons, rejectedCount } = await convertFiles(files, spec)
    addEmoticons(emoticons)
    if (rejectedCount > 0) showToast(`${rejectedCount}개 파일이 ${MAX_FILE_SIZE_MB}MB를 초과해 건너뛰었습니다.`, 'warning')
    e.target.value = ''
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 헤더 */}
      <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <h1 className="text-lg font-bold text-gray-800">채팅 시뮬레이터</h1>
            <p className="text-xs text-gray-400">
              {platformConfig.nameKo} 화면에서 이모티콘을 실시간 테스트하세요
            </p>
          </div>

          {/* 네이버 서브모드 탭 (헤더 인라인) */}
          {activePlatform === 'ogq' && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {(['chzzk', 'blog', 'cafe'] as const).map((mode) => {
                const labels = { chzzk: '치지직', blog: '블로그', cafe: '카페' }
                return (
                  <button
                    key={mode}
                    onClick={() => usePlatformStore.getState().setNaverSubMode(mode)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                    style={naverSubMode === mode
                      ? { backgroundColor: '#fff', color: '#03c75a', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                      : { color: '#6b7280' }}
                  >
                    {labels[mode]}
                  </button>
                )
              })}
            </div>
          )}

          {/* 카카오 스토어 탭 */}
          {activePlatform === 'kakao' && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {([['chat', '💬 채팅'], ['store', '🛒 이모티콘 스토어']] as const).map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => { setOgqOpen(mode === 'store'); setPanelOpen(false) }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                  style={(mode === 'store') === ogqOpen
                    ? { backgroundColor: '#fff', color: '#3c1e1e', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                    : { color: '#6b7280' }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* SOOP OGQ 탭 */}
          {activePlatform === 'soop' && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {([['chat', '💬 채팅'], ['ogq', '🛍️ OGQ 스토어']] as const).map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => { setOgqOpen(mode === 'ogq'); setPanelOpen(false) }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                  style={(mode === 'ogq') === ogqOpen
                    ? { backgroundColor: '#fff', color: '#0545b1', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                    : { color: '#6b7280' }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">

          <button
            onClick={() => { setPanelOpen((v) => !v); setOgqOpen(false) }}
            className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {panelOpen ? '안내 닫기 ✕' : '사용 방법 ?'}
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            style={{ backgroundColor: platformConfig.accentColor, color: textOnAccent(platformConfig.accentColor) }}
          >
            이모티콘 업로드
          </button>
          <input ref={inputRef} type="file" multiple accept={acceptAttr} onChange={handleFiles} className="hidden" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 카카오 이모티콘 스토어 */}
        {activePlatform === 'kakao' && ogqOpen ? (
          <div className="flex-1 overflow-y-auto bg-white">
            <KakaoDualStorePreview emoticons={activeEmoticons} thumbnailId={thumbnailId} setName={activeSetName} creatorName={creatorName} />
          </div>
        ) : activePlatform === 'soop' && ogqOpen ? (
          <div className="flex-1 overflow-y-auto bg-white">
            <OGQStorePreview emoticons={activeEmoticons} thumbnailId={thumbnailId} setName={activeSetName} creatorName={creatorName} />
          </div>
        ) : (
          <>
            {/* 채팅 시뮬레이터 */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden border-r border-gray-100">
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
                  {activePlatform !== 'youtube' && activePlatform !== 'twitch' && <SpamButton />}
                  {activePlatform === 'soop' ? <SoopChatInput />
                    : activePlatform === 'youtube' ? <YoutubeChatInput />
                    : activePlatform === 'twitch' ? <TwitchChatInput />
                    : <ChatInput />}
                </>
              )}
            </div>

            {/* 우측 안내 패널 (토글) */}
            {panelOpen && (() => {
              const help = getPlatformHelp(activePlatform, naverSubMode)
              return (
                <div className="w-64 flex-shrink-0 p-4 flex flex-col gap-4 bg-gray-50 overflow-y-auto border-l border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">사용 방법</h3>
                    <button onClick={() => setPanelOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-500">
                    {help.steps.map((step, i) => (
                      <li key={i} className="flex gap-1.5">
                        <span>{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                  {help.notes.map((note, i) =>
                    note.type === 'amber' ? (
                      <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <p className="text-xs font-semibold text-amber-700 mb-1">{note.title}</p>
                        <p className="text-[10px] text-amber-600 leading-relaxed">{note.body}</p>
                      </div>
                    ) : (
                      <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                        <p className="text-xs font-semibold text-blue-700 mb-1">{note.title}</p>
                        <p className="text-[10px] text-blue-600 leading-relaxed">{note.body}</p>
                      </div>
                    )
                  )}
                </div>
              )
            })()}
          </>
        )}
      </div>
    </div>
  )
}
