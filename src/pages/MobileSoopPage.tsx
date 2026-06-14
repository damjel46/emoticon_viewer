import { useEffect, useRef, useState } from 'react'
import { useActiveEmoticons, useEmoticonStore } from '../store/emoticonStore'
import { usePlatformStore } from '../store/platformStore'
import { useAuthStore } from '../store/authStore'
import { fileToEmoticon } from '../utils/fileToEmoticon'
import { MobileChatInput, type MobileChatInputHandle } from '../components/mobile/MobileChatInput'
import { MobilePlatformTabs } from '../components/mobile/MobilePlatformTabs'
import type { ContentSegment } from '../types'

const SOOP_ACCENT = '#0545b1'
const SOOP_BORDER = '#e5e7eb'

const VIEWER_NAMES = ['파란하늘123', '불꽃전사', '귀요미용용이', '달빛수호자', '초록달팽이', '하늘여우', '별빛기사']
const VIEWER_COLORS = ['#0545b1', '#e53935', '#8e24aa', '#1e88e5', '#f4511e', '#00897b', '#fb8c00']
const getViewerName = (seed: number) => VIEWER_NAMES[seed % VIEWER_NAMES.length]
const getViewerColor = (seed: number) => VIEWER_COLORS[seed % VIEWER_COLORS.length]

interface ChatMessage {
  id: string
  viewerSeed: number
  segments: ContentSegment[]
}

export function MobileSoopPage() {
  const setPlatform = usePlatformStore((s) => s.setPlatform)
  const addEmoticons = useEmoticonStore((s) => s.addEmoticons)
  const loadFromCloud = useEmoticonStore((s) => s.loadFromCloud)
  const emoticons = useActiveEmoticons()
  const profile = useAuthStore((s) => s.profile)
  const user = useAuthStore((s) => s.user)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const chatInputRef = useRef<MobileChatInputHandle>(null)
  const viewerCounter = useRef(0)

  useEffect(() => { setPlatform('soop') }, [setPlatform])
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const converted = await Promise.all(files.map((f) => fileToEmoticon(f)))
    addEmoticons(converted)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-black">

      {/* 플랫폼 탭 */}
      <MobilePlatformTabs currentPlatform="soop" bgColor="#ffffff" />

      {/* 방송화면 */}
      <div
        className="flex-shrink-0 flex flex-col items-center justify-center relative"
        style={{ height: '30%', backgroundColor: '#000', borderBottom: `2px solid ${SOOP_ACCENT}` }}
      >
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-white text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: SOOP_ACCENT }}>
            LIVE
          </span>
          <span className="text-gray-400 text-[11px]">1,247명 시청 중</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg"
            style={{ backgroundColor: SOOP_ACCENT }}
          >
            S
          </div>
          <p className="text-white font-semibold text-sm">SOOP 이모티콘 테스트방</p>
          <p className="text-gray-400 text-xs">이모티콘을 채팅에 전송해보세요</p>
        </div>
        <div className="absolute bottom-2 left-4 right-4">
          <div className="w-full h-0.5 rounded-full bg-gray-700">
            <div className="h-full w-2/5 rounded-full" style={{ backgroundColor: SOOP_ACCENT }} />
          </div>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0 bg-white relative">
        <div className="flex justify-center mb-2">
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gray-900 text-white text-xs font-medium shadow-lg">
            <span className="text-[9px]">··</span> 방송 요약
          </button>
        </div>
        {messages.length === 0 && (
          <p className="text-center text-xs text-gray-400 mt-2">채팅을 입력하거나 이모티콘을 전송해보세요</p>
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
                      <span key={i} className="text-[13px] text-gray-800 leading-5">{seg.value}</span>
                    )
                  }
                  const emote = emoticons.find((e) => e.id === seg.emoticonId)
                  return emote ? (
                    <img
                      key={i}
                      src={emote.dataUrl}
                      alt={emote.name}
                      style={{ width: 26, height: 26, objectFit: 'contain', verticalAlign: 'middle', display: 'inline-block' }}
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
        <div className="flex-shrink-0 bg-white border-t" style={{ borderColor: SOOP_BORDER }}>
          <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: SOOP_BORDER }}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
              <span className="text-gray-400 text-sm">🕐</span>
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full text-white text-xs font-bold"
              style={{ backgroundColor: SOOP_ACCENT }}
            >
              S
            </button>
            <div className="flex-1" />
            {profile?.is_premium && user && (
              <button
                onClick={async () => {
                  setSyncing(true)
                  await loadFromCloud(user.id)
                  setSyncing(false)
                }}
                disabled={syncing}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-sm disabled:opacity-40"
                title="라이브러리 동기화"
              >
                {syncing ? '⏳' : '☁️'}
              </button>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-lg"
            >
              +
            </button>
            <button
              onClick={() => setPickerOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-sm"
            >
              ✕
            </button>
          </div>
          <div className="px-3 py-1.5">
            <span className="text-xs font-semibold text-gray-400">기본</span>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: '160px' }}>
            {emoticons.length === 0 ? (
              <div className="flex flex-col items-center py-5 gap-2">
                <p className="text-xs text-gray-400">이모티콘을 업로드해주세요</p>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-xs px-4 py-2 rounded-full text-white font-semibold"
                  style={{ backgroundColor: SOOP_ACCENT }}
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
                    className="aspect-square flex items-center justify-center active:scale-95 transition-transform rounded hover:bg-gray-100"
                  >
                    <img src={e.dataUrl} alt={e.name} className="w-full h-full object-contain p-0.5" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />

      {/* 입력 바 */}
      <div className="flex-shrink-0 border-t" style={{ borderColor: SOOP_BORDER, backgroundColor: '#fff' }}>
        <MobileChatInput
          ref={chatInputRef}
          onSend={handleSend}
          placeholder="비방 욕설의 채팅은 제재될 수 있습니다."
          bgColor="#ffffff"
          inputBg="transparent"
          textColor="#141414"
        >
          <button
            onClick={() => setPickerOpen((v) => !v)}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md transition-colors"
            style={{ backgroundColor: pickerOpen ? SOOP_ACCENT : '#f3f4f6' }}
          >
            <span
              className="text-base leading-none"
              style={{ filter: pickerOpen ? 'brightness(10)' : 'none' }}
            >
              ⊞
            </span>
          </button>
        </MobileChatInput>
      </div>
    </div>
  )
}
