import { useEffect, useRef, useState } from 'react'
import { fetchShare } from '../utils/uploadShare'
import { CHAT_THEMES } from '../store/themeStore'
import type { ShareEmoticon, ThemeKey } from '../types'

interface Message {
  id: string
  sender: '나' | '상대방'
  type: 'text' | 'emoticon'
  text?: string
  emoticonId?: string
  timestamp: Date
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export function MobilePreviewPage() {
  const [emoticons, setEmoticons] = useState<ShareEmoticon[]>([])
  const [loaded, setLoaded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [sender, setSender] = useState<'나' | '상대방'>('나')
  const [themeKey, setThemeKey] = useState<ThemeKey>('light')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const theme = CHAT_THEMES[themeKey]

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, '')
    if (!id) { setLoaded(true); return }
    fetchShare(id).then((payload) => {
      if (payload) setEmoticons(payload.emoticons as ShareEmoticon[])
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const addMessage = (msg: Omit<Message, 'id' | 'timestamp'>) =>
    setMessages((prev) => [...prev, { ...msg, id: crypto.randomUUID(), timestamp: new Date() }])

  const sendEmoticon = (emoticonId: string) => addMessage({ sender, type: 'emoticon', emoticonId })

  const sendText = () => {
    if (!text.trim()) return
    addMessage({ sender, type: 'text', text: text.trim() })
    setText('')
    inputRef.current?.focus()
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <span className="text-gray-400 text-sm">불러오는 중...</span>
      </div>
    )
  }

  if (emoticons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
        <div className="text-5xl mb-4">📂</div>
        <p className="font-semibold text-gray-700 mb-2">이모티콘이 없습니다</p>
        <p className="text-sm text-gray-400">
          데스크탑에서 이모티콘을 업로드하고<br />QR 코드를 다시 스캔해주세요
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden" style={{ backgroundColor: theme.bgColor }}>
      {/* 헤더 */}
      <div
        className="flex items-center px-4 py-2.5 border-b flex-shrink-0"
        style={{ backgroundColor: theme.bgColor, borderColor: 'rgba(0,0,0,0.08)' }}
      >
        <p className="text-sm font-semibold flex-1" style={{ color: theme.textColor }}>
          이모티콘 테스트방
        </p>
        <div className="flex gap-1.5 mr-3">
          {(Object.keys(CHAT_THEMES) as ThemeKey[]).filter((k) => k !== 'custom').map((k) => (
            <button
              key={k}
              onClick={() => setThemeKey(k)}
              className="w-5 h-5 rounded-full border-2 transition-all"
              style={{
                backgroundColor: CHAT_THEMES[k].bgColor,
                borderColor: themeKey === k ? '#1a1a1a' : 'rgba(0,0,0,0.15)',
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setMessages([])}
          className="text-xs px-2.5 py-1 rounded-lg bg-black/10 transition-colors"
          style={{ color: theme.textColor }}
        >
          초기화
        </button>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-20">
            <p className="text-xs text-gray-400">아래 이모티콘을 탭하면 전송됩니다</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender === '나'
          const emoticon = msg.emoticonId ? emoticons.find((e) => e.id === msg.emoticonId) : null
          return (
            <div key={msg.id} className={`flex items-end gap-1 mb-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-600 self-start mt-4">
                  상
                </div>
              )}
              <div className={`flex flex-col max-w-[200px] ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && (
                  <span className="text-xs font-semibold mb-0.5" style={{ color: theme.textColor }}>
                    상대방
                  </span>
                )}
                {emoticon ? (
                  <div className={`flex items-end gap-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <img src={emoticon.dataUrl} alt={emoticon.name} className="w-24 h-24 object-contain" />
                    <span className="text-[10px] pb-1" style={{ color: theme.timestampColor }}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                ) : (
                  <div className={`flex items-end gap-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm break-words ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                      style={{
                        backgroundColor: isMe ? theme.myBubbleColor : theme.otherBubbleColor,
                        color: theme.textColor,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                        maxWidth: '180px',
                      }}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] pb-1" style={{ color: theme.timestampColor }}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* 이모티콘 피커 */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 overflow-y-auto" style={{ maxHeight: '160px' }}>
        <div className="grid grid-cols-4 gap-1 p-2">
          {emoticons.map((e) => (
            <button
              key={e.id}
              onClick={() => sendEmoticon(e.id)}
              className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
            >
              <img src={e.dataUrl} alt={e.name} className="w-full h-full object-contain p-1" />
            </button>
          ))}
        </div>
      </div>

      {/* 입력창 */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-3 py-2 flex items-center gap-2">
        <button
          onClick={() => setSender((s) => (s === '나' ? '상대방' : '나'))}
          className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 font-medium flex-shrink-0"
        >
          {sender}
        </button>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendText()}
          placeholder="메시지 입력..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
        />
        <button
          onClick={sendText}
          disabled={!text.trim()}
          className="text-xs px-3 py-1.5 rounded-lg bg-[#fee500] text-[#3c1e1e] font-semibold disabled:opacity-40 flex-shrink-0"
        >
          전송
        </button>
      </div>
    </div>
  )
}
