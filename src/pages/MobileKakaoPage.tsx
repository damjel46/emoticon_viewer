import { useEffect, useRef, useState } from 'react'
import { useActiveEmoticons, useEmoticonStore } from '../store/emoticonStore'
import { usePlatformStore } from '../store/platformStore'
import { useAuthStore } from '../store/authStore'
import { fileToEmoticon } from '../utils/fileToEmoticon'
import { CHAT_THEMES } from '../store/themeStore'
import { MobileChatInput, type MobileChatInputHandle } from '../components/mobile/MobileChatInput'
import { MobilePlatformTabs } from '../components/mobile/MobilePlatformTabs'
import { LoginModal } from '../components/auth/LoginModal'
import { PaymentModal } from '../components/auth/PaymentModal'
import type { EmoticonFile, ContentSegment, ThemeKey } from '../types'

type TabId = 'emoticon' | 'mini'

interface Message {
  id: string
  sender: '나' | '상대방'
  segments: ContentSegment[]
  mini: boolean
  timestamp: Date
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })
}

// 이모티콘 채팅 표시 크기
function getEmoticonPx(mini: boolean, hasText: boolean, emoteCount: number): number {
  if (mini) return hasText ? 20 : emoteCount === 1 ? 68 : 36
  return hasText ? 24 : 128
}

interface Props {
  emoticons?: EmoticonFile[]
}

export function MobileKakaoPage({ emoticons: propEmoticons }: Props = {}) {
  const setPlatform = usePlatformStore((s) => s.setPlatform)
  const addEmoticons = useEmoticonStore((s) => s.addEmoticons)
  const saveAllToCloud = useEmoticonStore((s) => s.saveAllToCloud)
  const storeEmoticons = useActiveEmoticons()
  const emoticons = propEmoticons ?? storeEmoticons
  const profile = useAuthStore((s) => s.profile)
  const user = useAuthStore((s) => s.user)

  const [messages, setMessages] = useState<Message[]>([])
  const [sender, setSender] = useState<'나' | '상대방'>('나')
  const [themeKey, setThemeKey] = useState<ThemeKey>('light')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('emoticon')
  const [syncing, setSyncing] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const chatInputRef = useRef<MobileChatInputHandle>(null)

  const theme = CHAT_THEMES[themeKey]
  const isMini = activeTab === 'mini'
  // contentEditable에서 이모티콘 인라인 표시 크기
  const inlinePx = isMini ? 28 : 64

  useEffect(() => { setPlatform('kakao') }, [setPlatform])
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = (segments: ContentSegment[]) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender, segments, mini: isMini, timestamp: new Date() },
    ])
    setPickerOpen(false)
  }

  const handleEmoticonSelect = (emoticonId: string) => {
    const emote = emoticons.find((e) => e.id === emoticonId)
    if (!emote) return
    if (isMini) {
      chatInputRef.current?.insertEmoticon(emote, inlinePx)
    } else {
      handleSend([{ kind: 'emoticon', emoticonId: emote.id }])
      chatInputRef.current?.clear()
    }
  }

  const handleSave = async () => {
    if (!user) { setShowLogin(true); return }
    if (!profile?.is_premium) { setShowPayment(true); return }
    setSyncing(true)
    await saveAllToCloud(user.id)
    setSyncing(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const converted = await Promise.all(files.map((f) => fileToEmoticon(f)))
    addEmoticons(converted)
    e.target.value = ''
  }

  const tabs = [
    { id: 'search'   as const, label: '검색',   disabled: true },
    { id: 'emoticon' as const, label: '이모티콘', disabled: false },
    { id: 'mini'     as const, label: '미니',    disabled: false },
    { id: 'discover' as const, label: '발견',   disabled: true },
  ]

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden font-kakao">

      {/* 플랫폼 탭 */}
      <MobilePlatformTabs currentPlatform="kakao" bgColor="#ffffff" />

      {/* 채팅 헤더 */}
      <div
        className="flex items-center px-3 py-2 gap-2 flex-shrink-0"
        style={{ backgroundColor: theme.bgColor }}
      >
        <span className="text-base text-gray-600">←</span>
        <p className="flex-1 text-sm font-semibold" style={{ color: theme.textColor }}>
          이모티콘 테스트방
        </p>
        <div className="flex gap-1.5 items-center">
          {(Object.keys(CHAT_THEMES) as ThemeKey[]).filter((k) => k !== 'custom').map((k) => (
            <button
              key={k}
              onClick={() => setThemeKey(k)}
              className="w-3.5 h-3.5 rounded-full border-2 transition-all"
              style={{
                backgroundColor: CHAT_THEMES[k].bgColor,
                borderColor: themeKey === k ? '#1a1a1a' : 'rgba(0,0,0,0.2)',
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setSender((s) => (s === '나' ? '상대방' : '나'))}
          className="text-[10px] px-1.5 py-1 rounded-lg bg-black/10 font-medium"
          style={{ color: theme.textColor }}
        >
          {sender === '나' ? '나' : '상대방'}
        </button>
        <span className="text-base text-gray-500">🔍</span>
        <span className="text-base text-gray-500">☰</span>
      </div>

      {/* 채팅 영역 */}
      <div
        className="flex-1 overflow-y-auto px-2 py-3 min-h-0"
        style={{ backgroundColor: theme.bgColor }}
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-20">
            <p className="text-xs text-gray-400">아래 😊 버튼으로 이모티콘을 전송해보세요</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender === '나'
          const emoteSegs = msg.segments.filter((s): s is { kind: 'emoticon'; emoticonId: string } => s.kind === 'emoticon')
          const hasText = msg.segments.some((s) => s.kind === 'text')
          const emoticonPx = getEmoticonPx(msg.mini, hasText, emoteSegs.length)
          const isMiniOnly = msg.mini && !hasText && emoteSegs.length > 0

          const bubbleClass = [
            'inline-flex items-center gap-0.5',
            isMiniOnly
              ? emoteSegs.length <= 6 ? 'flex-nowrap' : 'flex-wrap'
              : 'flex-wrap',
            hasText || emoteSegs.length === 0
              ? `px-3 py-1.5 rounded-2xl ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`
              : '',
          ].join(' ')

          const bubbleStyle: React.CSSProperties = {}
          if (hasText || emoteSegs.length === 0) {
            bubbleStyle.backgroundColor = isMe ? theme.myBubbleColor! : theme.otherBubbleColor!
            bubbleStyle.boxShadow = '0 1px 2px rgba(0,0,0,0.1)'
            bubbleStyle.wordBreak = 'break-word'
          }
          if (isMiniOnly && emoteSegs.length > 6) {
            // 4열 그리드: 36px × 4 + gap 3 × 2px
            bubbleStyle.maxWidth = '150px'
          }

          return (
            <div key={msg.id} className={`flex items-end gap-1 mb-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-600 self-start mt-5">
                  상
                </div>
              )}
              <div className={`flex flex-col min-w-0 ${isMe ? 'items-end' : 'items-start'}`} style={{ maxWidth: '75%' }}>
                {!isMe && (
                  <span className="text-[11px] font-semibold mb-0.5 ml-1" style={{ color: theme.textColor }}>
                    상대방
                  </span>
                )}
                <div className={`flex items-end gap-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={bubbleClass} style={bubbleStyle}>
                    {msg.segments.map((seg, i) => {
                      if (seg.kind === 'text') {
                        return (
                          <span
                            key={i}
                            className="text-sm leading-5"
                            style={{ color: hasText ? theme.textColor : theme.textColor }}
                          >
                            {seg.value}
                          </span>
                        )
                      }
                      const emote = emoticons.find((e) => e.id === seg.emoticonId)
                      return emote ? (
                        <img
                          key={i}
                          src={emote.dataUrl}
                          alt={emote.name}
                          style={{
                            width: emoticonPx,
                            height: emoticonPx,
                            objectFit: 'contain',
                            verticalAlign: 'middle',
                            display: 'inline-block',
                          }}
                        />
                      ) : null
                    })}
                  </div>
                  <span className="text-[10px] pb-1 flex-shrink-0" style={{ color: theme.timestampColor }}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* 이모티콘 피커 트레이 */}
      {pickerOpen && (
        <div className="flex-shrink-0 bg-white border-t border-gray-200" style={{ maxHeight: '260px' }}>
          {/* 탭 바 */}
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id as TabId)}
                  className="flex-1 py-2.5 text-xs font-medium transition-colors"
                  style={{
                    color: isActive ? '#3c1e1e' : tab.disabled ? '#ccc' : '#888',
                    borderBottom: isActive ? '2px solid #3c1e1e' : '2px solid transparent',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
            <button className="px-3 py-2.5 text-gray-400 text-sm">⊞</button>
          </div>

          {/* 팩 아이콘 행 */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 overflow-x-auto">
            <button className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
              ALL
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg"
              title="이모티콘 업로드"
            >
              +
            </button>
            <button
              onClick={handleSave}
              disabled={syncing}
              className="flex-shrink-0 h-8 px-2.5 rounded-lg flex items-center justify-center text-[11px] font-semibold disabled:opacity-40"
              style={{ backgroundColor: '#fee500', color: '#3c1e1e' }}
            >
              {syncing ? '저장 중...' : '동기화하기'}
            </button>
            {emoticons.length > 0 && (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-gray-200">
                <img src={emoticons[0].dataUrl} alt="pack" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
          {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
          {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}

          {/* 이모티콘 그리드 */}
          <div className="overflow-y-auto" style={{ maxHeight: '165px' }}>
            {emoticons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <p className="text-xs text-gray-400">이모티콘을 업로드해주세요</p>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-xs px-4 py-2 rounded-full bg-[#fee500] text-[#3c1e1e] font-semibold"
                >
                  파일 선택
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-0.5 p-2">
                {emoticons.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => handleEmoticonSelect(e.id)}
                    className="aspect-square flex items-center justify-center active:scale-95 transition-transform rounded-lg hover:bg-gray-100"
                  >
                    <img
                      src={e.dataUrl}
                      alt={e.name}
                      style={{
                        width: isMini ? 44 : 60,
                        height: isMini ? 44 : 60,
                        objectFit: 'contain',
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 입력 바 */}
      <div className="flex-shrink-0 border-t border-gray-200">
        <MobileChatInput
          ref={chatInputRef}
          onSend={handleSend}
          placeholder="메시지 입력"
          bgColor="#ffffff"
          inputBg="#f3f4f6"
          textColor="#1a1a1a"
          rightSlot={
            <>
              <button
                onClick={() => setPickerOpen((v) => !v)}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: pickerOpen ? '#fee500' : '#f3f4f6' }}
              >
                <span className="text-lg leading-none">😊</span>
              </button>
              <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-500 rounded-full hover:bg-gray-100">
                <span className="text-sm font-bold">#</span>
              </button>
            </>
          }
        >
          <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 text-xl font-light rounded-full hover:bg-gray-100">
            +
          </button>
        </MobileChatInput>
      </div>
    </div>
  )
}
