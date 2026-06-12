import { useRef, useState } from 'react'
import { useEmoticonStore, useActiveEmoticons } from '../store/emoticonStore'
import { usePlatformStore } from '../store/platformStore'
import { useChatStore } from '../store/chatStore'
import { fileToEmoticon } from '../utils/fileToEmoticon'
import { ThemeToolbar } from '../components/simulator/ThemeToolbar'
import { ChatSimulator } from '../components/simulator/ChatSimulator'
import { ChatInput } from '../components/simulator/ChatInput'
import { SoopChatInput } from '../components/simulator/SoopChatInput'
import { SpamButton } from '../components/simulator/SpamButton'
import { NaverSubModeBar } from '../components/simulator/NaverSubModeBar'
import { NaverCafeSimulator } from '../components/simulator/NaverCafeSimulator'
import { NaverBlogSimulator } from '../components/simulator/NaverBlogSimulator'
import type { PlatformId } from '../config/platforms'
import type { NaverSubMode } from '../store/platformStore'

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
              {activePlatform === 'soop' ? <SoopChatInput /> : <ChatInput />}
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
      </div>
    </div>
  )
}
