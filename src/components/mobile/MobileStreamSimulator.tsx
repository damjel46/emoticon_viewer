import { useRef, useState } from 'react'
import type { ShareEmoticon } from '../../types'
import { PLATFORMS } from '../../config/platforms'
import type { PlatformId } from '../../config/platforms'

// ─── 플랫폼 설정 ────────────────────────────────────────────────────────────
const PLATFORM_NAMES: Record<string, string> = {
  soop: 'SOOP',
  youtube: 'YouTube',
  twitch: 'Twitch',
  ogq: '치지직',
}

// hex 색상의 밝기 판별 (0.5 이하 = 다크)
function isColorDark(hex: string): boolean {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance < 0.5
}

// ─── 이모티콘 크기 계산 ────────────────────────────────────────────────────
function getEmoticonPx(
  count: number,
  hasText: boolean,
  emoticonDisplayPx: number,
  scaleSingleEmote?: boolean,
): number {
  if (hasText) return Math.min(emoticonDisplayPx, 28) // 텍스트 혼합: 인라인 소형
  if (scaleSingleEmote) {
    return count === 1
      ? emoticonDisplayPx                       // 단독 1개: 원본 크기
      : Math.round(emoticonDisplayPx * 0.32)    // 다중: 32% 축소
  }
  return emoticonDisplayPx
}

// ─── 뷰어 닉네임/색상 ─────────────────────────────────────────────────────
const VIEWER_NAMES = [
  '불꽃전사', '달빛수호자', '새벽바람', '하늘여우', '별빛기사',
  '바람의아들', '봄날의곰', '도전자123', '구름위의새', '초록달팽이',
  '무지개전사', '파란하늘', '노을빛고양이', '은빛늑대', '황금독수리',
]
const VIEWER_COLORS = [
  '#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7',
  '#748ffc', '#da77f2', '#f783ac', '#63e6be', '#74c0fc',
]
const AVATAR_BG_COLORS = [
  '#e53935', '#8e24aa', '#1e88e5', '#00897b',
  '#f4511e', '#3949ab', '#039be5', '#43a047',
  '#fb8c00', '#6d4c41', '#546e7a', '#e91e63',
]
const getViewerName = (seed: number) => VIEWER_NAMES[seed % VIEWER_NAMES.length]
const getViewerColor = (seed: number) => VIEWER_COLORS[seed % VIEWER_COLORS.length]
const getAvatarBg = (seed: number) => AVATAR_BG_COLORS[seed % AVATAR_BG_COLORS.length]

// ─── 타입 정의 ────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string
  viewerSeed: number
  type: 'text' | 'emoticon' | 'mixed'
  text?: string
  emoticonIds?: string[]
}

interface Props {
  emoticons: ShareEmoticon[]
  platformId: string
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────
export function MobileStreamSimulator({ emoticons, platformId }: Props) {
  const safePlatformId = (platformId in PLATFORMS ? platformId : 'soop') as PlatformId
  const platformCfg = PLATFORMS[safePlatformId]
  const chatUI = platformCfg.chatUI
  const accentColor = platformCfg.accentColor
  const platformName = PLATFORM_NAMES[platformId] ?? platformId

  const chatBgColor = chatUI.chatBgColor
  const textColor = chatUI.bubbleTextColor
  const dark = isColorDark(chatBgColor)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [emoticonQueue, setEmoticonQueue] = useState<string[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const viewerCounter = useRef(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  const addMessage = (msg: Omit<ChatMessage, 'id' | 'viewerSeed'>) => {
    const seed = viewerCounter.current++
    setMessages((prev) => {
      const next = [...prev, { ...msg, id: crypto.randomUUID(), viewerSeed: seed }]
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0)
      return next
    })
  }

  const handleSend = () => {
    const hasText = inputText.trim().length > 0
    const hasEmoticons = emoticonQueue.length > 0
    if (!hasText && !hasEmoticons) return

    const type: 'text' | 'emoticon' | 'mixed' =
      hasText && hasEmoticons ? 'mixed' : hasText ? 'text' : 'emoticon'

    addMessage({
      type,
      text: hasText ? inputText.trim() : undefined,
      emoticonIds: hasEmoticons ? [...emoticonQueue] : undefined,
    })
    setInputText('')
    setEmoticonQueue([])
    setPickerOpen(false)
  }

  const handleEmoticonSelect = (id: string) => {
    setEmoticonQueue((prev) => [...prev, id])
    // 피커는 닫지 않음 → 연속 선택 가능
  }

  const removeFromQueue = (index: number) => {
    setEmoticonQueue((prev) => prev.filter((_, i) => i !== index))
  }

  const canSend = inputText.trim().length > 0 || emoticonQueue.length > 0

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden" style={{ backgroundColor: '#000' }}>

      {/* ── 방송화면 영역 ── */}
      <div
        className="flex-shrink-0 flex flex-col items-center justify-center relative"
        style={{ height: '35%', backgroundColor: '#000', borderBottom: `2px solid ${accentColor}` }}
      >
        {/* LIVE 배지 + 시청자 수 */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className="text-white text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ backgroundColor: accentColor }}
          >
            LIVE
          </span>
          <span className="text-gray-400 text-[11px]">
            {chatUI.liveViewerCount ?? '1,247명 시청 중'}
          </span>
        </div>

        {/* 플랫폼 로고 */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg"
            style={{ backgroundColor: accentColor }}
          >
            {platformName[0]}
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">{platformName} 이모티콘 테스트방</p>
            <p className="text-gray-400 text-xs mt-0.5">이모티콘을 채팅에 전송해보세요</p>
          </div>
        </div>

        {/* 재생 진행바 (장식) */}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="w-full h-0.5 rounded-full bg-gray-700">
            <div className="h-full w-1/3 rounded-full" style={{ backgroundColor: accentColor }} />
          </div>
        </div>
      </div>

      {/* ── 채팅창 ── */}
      <div
        className="flex-1 overflow-y-auto px-2 py-2 min-h-0"
        style={{ backgroundColor: chatBgColor }}
      >
        {messages.length === 0 && (
          <p
            className="text-center text-xs mt-4"
            style={{ color: dark ? '#555' : '#bbb' }}
          >
            채팅을 입력하거나 이모티콘을 전송해보세요
          </p>
        )}

        {messages.map((msg) => {
          const name = getViewerName(msg.viewerSeed)
          const nameColor = getViewerColor(msg.viewerSeed)
          const avatarBg = getAvatarBg(msg.viewerSeed)
          const ids = msg.emoticonIds ?? []
          const hasText = !!msg.text
          const px = getEmoticonPx(ids.length, hasText, chatUI.emoticonDisplayPx, chatUI.scaleSingleEmote)

          const messageContent = (
            <span className="inline-flex items-center gap-1 flex-wrap min-w-0">
              {hasText && (
                <span className="text-[13px] leading-5 break-words" style={{ color: textColor }}>
                  {msg.text}
                </span>
              )}
              {ids.map((id, i) => {
                const e = emoticons.find((x) => x.id === id)
                return e ? (
                  <img
                    key={i}
                    src={e.dataUrl}
                    alt={e.name}
                    style={{ width: px, height: px, objectFit: 'contain', verticalAlign: 'middle', flexShrink: 0 }}
                  />
                ) : null
              })}
            </span>
          )

          if (chatUI.showAvatar) {
            // YouTube 스타일: 아바타 + @아이디 + 메시지
            return (
              <div key={msg.id} className="flex items-start gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold mt-0.5"
                  style={{ backgroundColor: avatarBg }}
                >
                  {name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] font-semibold" style={{ color: nameColor }}>
                    @{name}
                  </span>
                  <div className="flex items-center gap-1 flex-wrap mt-0.5">
                    {messageContent}
                  </div>
                </div>
              </div>
            )
          }

          // 인라인 스타일 (SOOP, Twitch, 치지직)
          return (
            <div key={msg.id} className="flex items-start gap-1.5 mb-1.5 flex-wrap">
              <span className="text-[11px] font-semibold flex-shrink-0 mt-0.5 leading-5" style={{ color: nameColor }}>
                {name}
              </span>
              {messageContent}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── 입력창 영역 ── */}
      <div
        className="flex-shrink-0 border-t relative"
        style={{ backgroundColor: chatBgColor, borderColor: dark ? '#333' : '#e5e5e5' }}
      >
        {/* 이모티콘 큐 미리보기 행 */}
        {emoticonQueue.length > 0 && (
          <div
            className="flex items-center gap-1 px-2 py-1.5 overflow-x-auto border-b"
            style={{ borderColor: dark ? '#333' : '#e5e5e5' }}
          >
            <span className="text-[10px] flex-shrink-0" style={{ color: dark ? '#888' : '#aaa' }}>
              큐:
            </span>
            {emoticonQueue.map((id, i) => {
              const e = emoticons.find((x) => x.id === id)
              return e ? (
                <button
                  key={i}
                  onClick={() => removeFromQueue(i)}
                  className="flex-shrink-0 relative"
                  title="클릭해서 제거"
                >
                  <img src={e.dataUrl} alt={e.name} className="w-7 h-7 object-contain rounded" />
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center leading-none">
                    ×
                  </span>
                </button>
              ) : null
            })}
          </div>
        )}

        {/* 입력 바 */}
        <div className="flex items-center gap-1.5 px-2 py-1.5">
          {/* 이모티콘 피커 버튼 */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setPickerOpen((v) => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{ backgroundColor: pickerOpen ? accentColor : (dark ? '#2a2a2a' : '#f0f0f0') }}
            >
              <span className="text-lg leading-none">😊</span>
            </button>
            {emoticonQueue.length > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[14px] h-3.5 rounded-full text-white text-[8px] font-bold flex items-center justify-center px-0.5"
                style={{ backgroundColor: accentColor }}
              >
                {emoticonQueue.length}
              </span>
            )}

            {/* 이모티콘 피커 트레이 */}
            {pickerOpen && (
              <div
                className="absolute bottom-full left-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-y-auto z-20"
                style={{ width: '240px', maxHeight: '180px', marginBottom: '4px' }}
              >
                <div className="grid grid-cols-4 gap-1 p-2">
                  {emoticons.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => handleEmoticonSelect(e.id)}
                      className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center active:scale-95 transition-transform hover:bg-gray-100"
                    >
                      <img src={e.dataUrl} alt={e.name} className="w-full h-full object-contain p-0.5" />
                    </button>
                  ))}
                </div>
                <div className="px-2 py-1 border-t border-gray-100 text-center">
                  <span className="text-[10px] text-gray-400">클릭하여 큐에 추가 · 여러 개 선택 가능</span>
                </div>
              </div>
            )}
          </div>

          {/* 텍스트 입력 */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={() => setPickerOpen(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="채팅 입력..."
            className="flex-1 min-w-0 rounded-full px-3 py-1.5 text-sm outline-none"
            style={{
              backgroundColor: dark ? '#2a2a2a' : '#f0f0f0',
              color: dark ? '#e5e5e5' : '#1a1a1a',
            }}
          />

          {/* 전송 버튼 */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="flex-shrink-0 text-[11px] px-2.5 py-1.5 rounded-lg font-semibold text-white disabled:opacity-40 transition-opacity"
            style={{ backgroundColor: accentColor }}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  )
}
