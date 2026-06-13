import { useEffect, useRef } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useThemeStore } from '../../store/themeStore'
import { usePlatformStore } from '../../store/platformStore'
import { ChatBubble } from '../shared/ChatBubble'
import { PlatformChatHeader } from './PlatformChatHeader'
import { LiveChatView } from './LiveChatView'

export function ChatSimulator() {
  const allMessages = useChatStore((s) => s.messages)
  const clearMessages = useChatStore((s) => s.clearMessages)
  const theme = useThemeStore((s) => s.getCurrentTheme())
  const platformId = usePlatformStore((s) => s.activePlatform)
  const chatUI = usePlatformStore((s) => s.getConfig().chatUI)

  // bubbles 모드(카카오)에서 타 플랫폼 multi-emote 메시지 필터링
  const messages = chatUI.bubbleMode === 'bubbles'
    ? allMessages.filter((m) => !m.emoticonIds || m.emoticonIds.length <= 1 || m.isMini)
    : allMessages
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length])

  const effectiveBg = theme.bgColor

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: effectiveBg }}>
      <PlatformChatHeader platformId={platformId} chatUI={chatUI} onClear={clearMessages} />

      {chatUI.bubbleMode === 'inline-flow' ? (
        <LiveChatView messages={messages} chatUI={chatUI} bgColor={effectiveBg} textColor={theme.textColor} />
      ) : (
        <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm" style={{ color: theme.timestampColor }}>
                메시지를 입력하거나 이모티콘을 전송해보세요
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} theme={theme} chatUI={chatUI} />
          ))}
          <div />
        </div>
      )}
    </div>
  )
}
