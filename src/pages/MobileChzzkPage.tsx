import { useEffect, useRef, useState } from 'react'
import { useActiveEmoticons, useEmoticonStore } from '../store/emoticonStore'
import { usePlatformStore } from '../store/platformStore'
import { useAuthStore } from '../store/authStore'
import { convertFiles, MAX_FILE_SIZE_MB } from '../utils/fileToEmoticon'
import { useToastStore } from '../store/toastStore'
import { MobileChatInput, type MobileChatInputHandle } from '../components/mobile/MobileChatInput'
import { MobilePlatformTabs } from '../components/mobile/MobilePlatformTabs'
import { LoginModal } from '../components/auth/LoginModal'
import { PaymentModal } from '../components/auth/PaymentModal'
import type { ContentSegment } from '../types'

const CHZZK_ACCENT = '#02e191'
const CHZZK_BORDER = '#2a2a2a'
const CHZZK_DARK = '#1a1a1a'

const VIEWER_NAMES = ['귀요미용용이', '오대한', '나디아봇', '불꽃전사', '달빛수호자', '새벽바람', '하늘여우']
const VIEWER_COLORS = ['#7c4dff', '#4dabf7', '#69db7c', '#ffd43b', '#ff6b6b', '#da77f2', '#63e6be']
const getViewerName = (seed: number) => VIEWER_NAMES[seed % VIEWER_NAMES.length]
const getViewerColor = (seed: number) => VIEWER_COLORS[seed % VIEWER_COLORS.length]

interface ChatMessage {
  id: string
  viewerSeed: number
  segments: ContentSegment[]
}

export function MobileChzzkPage() {
  const setPlatform = usePlatformStore((s) => s.setPlatform)
  const addEmoticons = useEmoticonStore((s) => s.addEmoticons)
  const saveAllToCloud = useEmoticonStore((s) => s.saveAllToCloud)
  const emoticons = useActiveEmoticons()
  const profile = useAuthStore((s) => s.profile)
  const user = useAuthStore((s) => s.user)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const chatInputRef = useRef<MobileChatInputHandle>(null)
  const viewerCounter = useRef(0)

  useEffect(() => { setPlatform('ogq') }, [setPlatform])
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = (segments: ContentSegment[]) => {
    const seed = viewerCounter.current++
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), viewerSeed: seed, segments }])
    setPickerOpen(false)
  }

  const handleEmoticonSelect = (emoticonId: string) => {
    const emote = emoticons.find((e) => e.id === emoticonId)
    if (!emote) return
    chatInputRef.current?.insertEmoticon(emote, 22)
  }

  const handleSave = async () => {
    if (!user) { setShowLogin(true); return }
    if (!profile?.is_premium) { setShowPayment(true); return }
    setSyncing(true)
    await saveAllToCloud(user.id)
    setSyncing(false)
  }

  const showToast = useToastStore((s) => s.show)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const { emoticons, rejectedCount } = await convertFiles(files)
    addEmoticons(emoticons)
    if (rejectedCount > 0) showToast(`${rejectedCount}개 파일이 ${MAX_FILE_SIZE_MB}MB를 초과해 건너뛰었습니다.`, 'warning')
    e.target.value = ''
  }

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden" style={{ backgroundColor: '#111' }}>

      {/* 플랫폼 탭 */}
      <MobilePlatformTabs currentPlatform="ogq" bgColor="#1a1a1a" inactiveColor="rgba(255,255,255,0.5)" />

      {/* 영상 영역 */}
      <div className="flex-shrink-0 relative" style={{ height: '30%', backgroundColor: '#000' }}>
        <div className="absolute top-0 left-0 right-0 flex items-center px-3 py-2.5 gap-2">
          <span className="text-white text-base">∨</span>
          <span className="text-white text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#ff3b30' }}>
            LIVE
          </span>
          <button
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-medium"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            같이보기+ &gt;
          </button>
          <div className="flex-1" />
          <span className="text-white text-base">↗</span>
          <span className="text-white text-base">···</span>
        </div>
        <div className="absolute bottom-3 right-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl">😎</div>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="text-red-500 text-[10px] font-bold">● 실시간</span>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="mb-2">
          <p className="text-[11px] text-center" style={{ color: CHZZK_ACCENT }}>방송에 입장하였습니다.</p>
        </div>
        {messages.length === 0 && (
          <p className="text-center text-xs mt-2" style={{ color: '#555' }}>
            채팅을 입력하거나 이모티콘을 전송해보세요
          </p>
        )}
        {messages.map((msg) => {
          const name = getViewerName(msg.viewerSeed)
          const nameColor = getViewerColor(msg.viewerSeed)
          return (
            <div key={msg.id} className="flex items-start gap-1 mb-1.5 flex-wrap">
              <span className="text-[12px] font-semibold flex-shrink-0" style={{ color: nameColor }}>
                {name}
              </span>
              <span className="inline-flex items-center gap-0.5 flex-wrap">
                {msg.segments.map((seg, i) => {
                  if (seg.kind === 'text') {
                    return (
                      <span key={i} className="text-[13px] leading-5" style={{ color: '#e8e8e8' }}>{seg.value}</span>
                    )
                  }
                  const emote = emoticons.find((e) => e.id === seg.emoticonId)
                  return emote ? (
                    <img
                      key={i}
                      src={emote.dataUrl}
                      alt={emote.name}
                      style={{ width: 24, height: 24, objectFit: 'contain', verticalAlign: 'middle', display: 'inline-block' }}
                    />
                  ) : null
                })}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* 이모티콘 트레이 */}
      {pickerOpen && (
        <div className="flex-shrink-0" style={{ backgroundColor: CHZZK_DARK, borderTop: `1px solid ${CHZZK_BORDER}` }}>
          <div className="flex items-center gap-1.5 px-3 py-2 border-b" style={{ borderColor: CHZZK_BORDER }}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: '#2a2a2a' }}>
              <span className="text-gray-400 text-sm">🕐</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: '#2a2a2a' }}>
              <span className="text-xs text-gray-400">👤</span>
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full font-black text-black text-xs"
              style={{ backgroundColor: CHZZK_ACCENT }}
            >
              Z
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400" style={{ backgroundColor: '#2a2a2a' }}>∨</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: '#2a2a2a' }}>
              <span className="text-sm">⚾</span>
            </button>
            <div className="flex-1" />
            <button
              onClick={handleSave}
              disabled={syncing}
              className="h-7 px-2.5 flex items-center justify-center rounded-full text-black text-[11px] font-semibold disabled:opacity-40"
              style={{ backgroundColor: CHZZK_ACCENT }}
            >
              {syncing ? '저장 중...' : '동기화하기'}
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 text-lg"
              style={{ backgroundColor: '#2a2a2a' }}
            >
              +
            </button>
            <button
              onClick={() => setPickerOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 text-sm"
              style={{ backgroundColor: '#2a2a2a' }}
            >
              ✕
            </button>
          </div>
          <div className="px-3 py-1.5">
            <span className="text-xs font-semibold" style={{ color: '#888' }}>CHZZK 이모티콘</span>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: '150px' }}>
            {emoticons.length === 0 ? (
              <div className="flex flex-col items-center py-5 gap-2">
                <p className="text-xs" style={{ color: '#666' }}>이모티콘을 업로드해주세요</p>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-xs px-4 py-2 rounded-full font-semibold text-black"
                  style={{ backgroundColor: CHZZK_ACCENT }}
                >
                  파일 선택
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-0.5 p-2">
                {emoticons.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => handleEmoticonSelect(e.id)}
                    className="aspect-square flex items-center justify-center active:scale-95 transition-transform rounded"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <img src={e.dataUrl} alt={e.name} className="w-full h-full object-contain p-0.5" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-around px-4 py-2 border-t" style={{ borderColor: CHZZK_BORDER }}>
            <button className="text-gray-500 text-lg">🕐</button>
            <button className="text-gray-500 text-lg">⭐</button>
            <button className="text-gray-500 text-lg">🐦</button>
          </div>
        </div>
      )}
      <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}

      {/* 입력 바 */}
      <div className="flex-shrink-0 border-t" style={{ borderColor: CHZZK_BORDER, backgroundColor: CHZZK_DARK }}>
        <MobileChatInput
          ref={chatInputRef}
          onSend={handleSend}
          placeholder="채팅을 입력해 주세요."
          bgColor={CHZZK_DARK}
          inputBg="transparent"
          textColor="#e8e8e8"
        >
          <button
            onClick={() => setPickerOpen((v) => !v)}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ backgroundColor: pickerOpen ? CHZZK_ACCENT : '#2a2a2a' }}
          >
            <span
              className="text-lg leading-none"
              style={{ filter: pickerOpen ? 'brightness(0)' : 'none' }}
            >
              😊
            </span>
          </button>
        </MobileChatInput>
      </div>
    </div>
  )
}
