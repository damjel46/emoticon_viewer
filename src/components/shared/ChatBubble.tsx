import clsx from 'clsx'
import type { ChatMessage, ChatTheme } from '../../types'
import type { ChatUIStyle } from '../../config/platforms'
import { useEmoticonStore } from '../../store/emoticonStore'

interface Props {
  message: ChatMessage
  theme: ChatTheme
  chatUI: ChatUIStyle
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function bubbleTextColor(bgHex: string, darkFallback: string): string {
  const r = parseInt(bgHex.slice(1, 3), 16)
  const g = parseInt(bgHex.slice(3, 5), 16)
  const b = parseInt(bgHex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#1a1a1a' : darkFallback
}

export function ChatBubble({ message, theme, chatUI }: Props) {
  const emoticons = useEmoticonStore((s) => s.emoticons)
  const isMe = message.sender === '나'
  const myBubble = chatUI.myBubbleColor ?? '#fee500'
  const otherBubble = chatUI.otherBubbleColor ?? '#ffffff'
  const miniPx = chatUI.miniEmoticonDisplayPx ?? 68

  // 미니 이모티콘: 여러 개 가로 행
  if (message.isMini && message.emoticonIds && message.emoticonIds.length > 0) {
    const miniEmotes = message.emoticonIds
      .map((id) => emoticons.find((e) => e.id === id))
      .filter(Boolean) as typeof emoticons

    return (
      <div className={clsx('flex items-end gap-1 mb-2', isMe ? 'flex-row-reverse' : 'flex-row')}>
        {!isMe && chatUI.showAvatar && (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600 self-start mt-4">
            {chatUI.otherLabel.charAt(0)}
          </div>
        )}
        <div className={clsx('flex flex-col gap-0.5', isMe ? 'items-end' : 'items-start')}>
          {!isMe && chatUI.showSenderName && (
            <span className="text-xs font-semibold mb-0.5" style={{ color: theme.textColor }}>
              {chatUI.otherLabel}
            </span>
          )}
          <div className={clsx('flex items-end gap-1', isMe ? 'flex-row-reverse' : 'flex-row')}>
            <div className="flex gap-0.5">
              {miniEmotes.map((e, i) => (
                <img
                  key={i}
                  src={e.dataUrl}
                  alt={e.name}
                  style={{ width: miniPx, height: miniPx, objectFit: 'contain' }}
                  className="drop-shadow-sm"
                />
              ))}
            </div>
            <div className={clsx('flex flex-col text-[10px] pb-1', isMe ? 'items-end' : 'items-start')}>
              {isMe && chatUI.showReadReceipt && (
                <span style={{ color: theme.timestampColor }}>읽음</span>
              )}
              <span style={{ color: theme.timestampColor }}>{formatTime(message.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 일반 이모티콘 (단일)
  const emoticon = message.emoticonId
    ? emoticons.find((e) => e.id === message.emoticonId)
    : null
  const isEmoticonOnly = message.type === 'emoticon'
  const emoticonPx = chatUI.emoticonDisplayPx

  return (
    <div className={clsx('flex items-end gap-1 mb-2', isMe ? 'flex-row-reverse' : 'flex-row')}>
      {!isMe && chatUI.showAvatar && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600 self-start mt-4">
          {chatUI.otherLabel.charAt(0)}
        </div>
      )}

      <div className={clsx('flex flex-col gap-0.5 max-w-[240px]', isMe ? 'items-end' : 'items-start')}>
        {!isMe && chatUI.showSenderName && (
          <span className="text-xs font-semibold mb-0.5" style={{ color: theme.textColor }}>
            {chatUI.otherLabel}
          </span>
        )}

        {isEmoticonOnly && emoticon ? (
          <div className={clsx('flex items-end gap-1', isMe ? 'flex-row-reverse' : 'flex-row')}>
            <img
              src={emoticon.dataUrl}
              alt={emoticon.name}
              style={{ width: emoticonPx, height: emoticonPx, objectFit: 'contain' }}
              className="drop-shadow-sm"
            />
            <div className={clsx('flex flex-col text-[10px] pb-1', isMe ? 'items-end' : 'items-start')}>
              {isMe && chatUI.showReadReceipt && (
                <span style={{ color: theme.timestampColor }}>읽음</span>
              )}
              <span style={{ color: theme.timestampColor }}>{formatTime(message.timestamp)}</span>
            </div>
          </div>
        ) : (
          <div className={clsx('flex items-end gap-1', isMe ? 'flex-row-reverse' : 'flex-row')}>
            <div
              className={clsx(
                'px-3 py-2 rounded-2xl text-sm break-words',
                isMe ? 'rounded-br-sm' : 'rounded-bl-sm'
              )}
              style={{
                backgroundColor: isMe ? myBubble : otherBubble,
                color: bubbleTextColor(isMe ? myBubble : otherBubble, theme.textColor),
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                maxWidth: '200px',
              }}
            >
              {message.type === 'text' && <span>{message.text}</span>}
              {message.type === 'mixed' && (
                <div className="flex flex-col gap-1">
                  {emoticon && (
                    <img
                      src={emoticon.dataUrl}
                      alt={emoticon.name}
                      style={{ width: emoticonPx * 0.85, height: emoticonPx * 0.85, objectFit: 'contain' }}
                    />
                  )}
                  {message.text && <span>{message.text}</span>}
                </div>
              )}
            </div>
            <div className={clsx('flex flex-col text-[10px] pb-1', isMe ? 'items-end' : 'items-start')}>
              {isMe && chatUI.showReadReceipt && (
                <span style={{ color: theme.timestampColor }}>읽음</span>
              )}
              <span style={{ color: theme.timestampColor }}>{formatTime(message.timestamp)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
