import clsx from 'clsx'
import type { ChatMessage, ChatTheme } from '../../types'
import { useEmoticonStore } from '../../store/emoticonStore'

interface Props {
  message: ChatMessage
  theme: ChatTheme
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export function ChatBubble({ message, theme }: Props) {
  const emoticons = useEmoticonStore((s) => s.emoticons)
  const isMe = message.sender === '나'
  const emoticon = message.emoticonId
    ? emoticons.find((e) => e.id === message.emoticonId)
    : null

  const isEmoticonOnly = message.type === 'emoticon'

  return (
    <div className={clsx('flex items-end gap-1 mb-2', isMe ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar — 상대방만 표시 */}
      {!isMe && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600 self-start mt-4">
          상
        </div>
      )}

      <div className={clsx('flex flex-col gap-0.5 max-w-[240px]', isMe ? 'items-end' : 'items-start')}>
        {!isMe && (
          <span className="text-xs font-semibold mb-0.5" style={{ color: theme.textColor }}>
            상대방
          </span>
        )}

        {/* 이모티콘 단독 — 말풍선 없이 이미지만 */}
        {isEmoticonOnly && emoticon ? (
          <div className={clsx('flex items-end gap-1', isMe ? 'flex-row-reverse' : 'flex-row')}>
            <img
              src={emoticon.dataUrl}
              alt={emoticon.name}
              className="w-28 h-28 object-contain"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))' }}
            />
            <div className={clsx('flex flex-col text-[10px] pb-1', isMe ? 'items-end' : 'items-start')}>
              {isMe && <span style={{ color: theme.timestampColor }}>읽음</span>}
              <span style={{ color: theme.timestampColor }}>{formatTime(message.timestamp)}</span>
            </div>
          </div>
        ) : (
          /* 텍스트 / 혼합 — 말풍선으로 표시 */
          <div className={clsx('flex items-end gap-1', isMe ? 'flex-row-reverse' : 'flex-row')}>
            <div
              className={clsx(
                'px-3 py-2 rounded-2xl text-sm break-words',
                isMe ? 'rounded-br-sm' : 'rounded-bl-sm'
              )}
              style={{
                backgroundColor: isMe ? theme.myBubbleColor : theme.otherBubbleColor,
                color: theme.textColor,
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
                      className="w-24 h-24 object-contain"
                    />
                  )}
                  {message.text && <span>{message.text}</span>}
                </div>
              )}
            </div>
            <div className={clsx('flex flex-col text-[10px] pb-1', isMe ? 'items-end' : 'items-start')}>
              {isMe && <span style={{ color: theme.timestampColor }}>읽음</span>}
              <span style={{ color: theme.timestampColor }}>{formatTime(message.timestamp)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
