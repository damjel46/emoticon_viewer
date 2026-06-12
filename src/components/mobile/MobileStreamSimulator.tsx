import { useRef, useState } from 'react'
import type { ShareEmoticon } from '../../types'
import { MobileEmoticonPickerTray } from './MobileEmoticonPickerTray'

interface StreamPlatformConfig {
  name: string
  accentColor: string
  bgColor: string
  chatBgColor: string
  chatTextColor: string
  badgeColor: string
}

const PLATFORM_CONFIGS: Record<string, StreamPlatformConfig> = {
  soop: {
    name: 'SOOP',
    accentColor: '#FF6D00',
    bgColor: '#1a1a1a',
    chatBgColor: '#111111',
    chatTextColor: '#e5e5e5',
    badgeColor: '#FF6D00',
  },
  youtube: {
    name: 'YouTube',
    accentColor: '#FF0000',
    bgColor: '#0f0f0f',
    chatBgColor: '#0f0f0f',
    chatTextColor: '#e5e5e5',
    badgeColor: '#FF0000',
  },
  twitch: {
    name: 'Twitch',
    accentColor: '#9146FF',
    bgColor: '#18181b',
    chatBgColor: '#18181b',
    chatTextColor: '#e5e5e5',
    badgeColor: '#9146FF',
  },
  ogq: {
    name: '치지직',
    accentColor: '#00D564',
    bgColor: '#141517',
    chatBgColor: '#1a1c1f',
    chatTextColor: '#e5e5e5',
    badgeColor: '#00D564',
  },
}

const VIEWER_NAMES = [
  '불꽃전사', '달빛수호자', '새벽바람', '하늘여우', '별빛기사',
  '바람의아들', '봄날의곰', '도전자123', '구름위의새', '초록달팽이',
  '무지개전사', '파란하늘', '노을빛고양이', '은빛늑대', '황금독수리',
]

const VIEWER_COLORS = [
  '#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7',
  '#748ffc', '#da77f2', '#f783ac', '#63e6be', '#74c0fc',
]

function getViewerName(seed: number) {
  return VIEWER_NAMES[seed % VIEWER_NAMES.length]
}

function getViewerColor(seed: number) {
  return VIEWER_COLORS[seed % VIEWER_COLORS.length]
}

interface ChatMessage {
  id: string
  viewerSeed: number
  type: 'text' | 'emoticon'
  text?: string
  emoticonId?: string
}

interface Props {
  emoticons: ShareEmoticon[]
  platformId: string
}

export function MobileStreamSimulator({ emoticons, platformId }: Props) {
  const config = PLATFORM_CONFIGS[platformId] ?? PLATFORM_CONFIGS.soop
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [viewerCounter, setViewerCounter] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  const addMessage = (msg: Omit<ChatMessage, 'id' | 'viewerSeed'>) => {
    setViewerCounter((n) => {
      const seed = n
      setMessages((prev) => {
        const next = [...prev, { ...msg, id: crypto.randomUUID(), viewerSeed: seed }]
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0)
        return next
      })
      return n + 1
    })
  }

  const sendText = () => {
    if (!text.trim()) return
    addMessage({ type: 'text', text: text.trim() })
    setText('')
  }

  const sendEmoticon = (id: string) => {
    addMessage({ type: 'emoticon', emoticonId: id })
    setPickerOpen(false)
  }

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden" style={{ backgroundColor: config.bgColor }}>

      {/* 방송화면 영역 */}
      <div
        className="flex-shrink-0 flex flex-col items-center justify-center relative"
        style={{ height: '35%', backgroundColor: '#000', borderBottom: `2px solid ${config.accentColor}` }}
      >
        {/* LIVE 배지 */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className="text-white text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ backgroundColor: config.badgeColor }}
          >
            LIVE
          </span>
          <span className="text-gray-400 text-[11px]">시청자 1,247명</span>
        </div>

        {/* 플랫폼 로고 영역 */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg"
            style={{ backgroundColor: config.accentColor }}
          >
            {config.name[0]}
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">{config.name} 이모티콘 테스트방</p>
            <p className="text-gray-400 text-xs mt-0.5">이모티콘을 채팅에 전송해보세요</p>
          </div>
        </div>

        {/* 재생 컨트롤 (장식) */}
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-4">
          <div className="w-full mx-4 h-0.5 rounded-full bg-gray-700">
            <div className="h-full w-1/3 rounded-full" style={{ backgroundColor: config.accentColor }} />
          </div>
        </div>
      </div>

      {/* 채팅창 */}
      <div
        className="flex-1 overflow-y-auto px-2 py-2 min-h-0"
        style={{ backgroundColor: config.chatBgColor }}
      >
        {messages.length === 0 && (
          <p className="text-center text-gray-600 text-xs mt-4">채팅을 입력하거나 이모티콘을 전송해보세요</p>
        )}
        {messages.map((msg) => {
          const name = getViewerName(msg.viewerSeed)
          const color = getViewerColor(msg.viewerSeed)
          const emoticon = msg.emoticonId ? emoticons.find((e) => e.id === msg.emoticonId) : null
          return (
            <div key={msg.id} className="flex items-start gap-1.5 mb-1.5">
              <span className="text-[11px] font-semibold flex-shrink-0 mt-0.5" style={{ color }}>
                {name}
              </span>
              {emoticon ? (
                <img src={emoticon.dataUrl} alt={emoticon.name} className="w-8 h-8 object-contain flex-shrink-0" />
              ) : (
                <span className="text-[13px] break-words min-w-0" style={{ color: config.chatTextColor }}>
                  {msg.text}
                </span>
              )}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div
        className="flex-shrink-0 px-2 py-1.5 flex items-center gap-1.5 border-t relative"
        style={{ backgroundColor: config.chatBgColor, borderColor: '#333' }}
      >
        <MobileEmoticonPickerTray
          emoticons={emoticons}
          open={pickerOpen}
          onToggle={() => { setPickerOpen((v) => !v) }}
          onSelect={sendEmoticon}
          accentColor={config.accentColor}
        />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setPickerOpen(false)}
          onKeyDown={(e) => e.key === 'Enter' && sendText()}
          placeholder="채팅 입력..."
          className="flex-1 min-w-0 rounded-full px-3 py-1.5 text-sm outline-none text-gray-200 placeholder-gray-600"
          style={{ backgroundColor: '#2a2a2a' }}
        />
        <button
          onClick={sendText}
          disabled={!text.trim()}
          className="flex-shrink-0 text-[11px] px-2.5 py-1.5 rounded-lg font-semibold text-white disabled:opacity-40"
          style={{ backgroundColor: config.accentColor }}
        >
          전송
        </button>
      </div>
    </div>
  )
}
