import { useEffect, useRef } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useThemeStore } from '../../store/themeStore'
import { ChatBubble } from '../shared/ChatBubble'

export function ChatSimulator() {
  const messages = useChatStore((s) => s.messages)
  const clearMessages = useChatStore((s) => s.clearMessages)
  const theme = useThemeStore((s) => s.getCurrentTheme())
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: theme.bgColor }}>
      {/* 채팅방 상단 헤더 */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ backgroundColor: theme.bgColor, borderColor: 'rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">←</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: theme.textColor }}>
              이모티콘 테스트방
            </p>
            <p className="text-[10px]" style={{ color: theme.timestampColor }}>
              2명
            </p>
          </div>
        </div>
        <button
          onClick={clearMessages}
          className="text-xs px-2.5 py-1 rounded-lg bg-black/10 hover:bg-black/20 transition-colors"
          style={{ color: theme.textColor }}
        >
          초기화
        </button>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm" style={{ color: theme.timestampColor }}>
              메시지를 입력하거나 이모티콘을 전송해보세요
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} theme={theme} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
