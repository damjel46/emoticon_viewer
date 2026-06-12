import { useRef, useEffect } from 'react'
import type { ChatMessage, EmoticonFile } from '../../types'
import type { ChatUIStyle } from '../../config/platforms'
import { useActiveEmoticons } from '../../store/emoticonStore'

const VIEWER_NAMES = [
  '별빛소나기', '파란하늘92', 'cooluser99', 'haneul_j', '진주조개',
  'streamer_fan', '도넛러버', 'pixel_king', '새벽달빛', 'anime_lover',
  'gamer123', '초코무스', 'sky_watcher', '퍼플스타', 'night_owl88',
]

const BADGE_COLORS = ['#ff6600', '#9146ff', '#ff0000', '#03c75a', '#0099ff', '#e91e8c']

const AVATAR_BG_COLORS = [
  '#e53935', '#8e24aa', '#1e88e5', '#00897b',
  '#f4511e', '#3949ab', '#039be5', '#43a047',
  '#fb8c00', '#6d4c41', '#546e7a', '#e91e63',
]

function getViewerName(sender: string, msgId: string): string {
  if (sender === '나') return '나'
  const hash = msgId.charCodeAt(0) + msgId.charCodeAt(msgId.length - 1)
  return VIEWER_NAMES[hash % VIEWER_NAMES.length]
}

function getBadgeColor(name: string): string {
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return BADGE_COLORS[Math.abs(hash) % BADGE_COLORS.length]
}

function getAvatarBg(name: string): string {
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return AVATAR_BG_COLORS[Math.abs(hash) % AVATAR_BG_COLORS.length]
}

interface Props {
  messages: ChatMessage[]
  chatUI: ChatUIStyle
  bgColor: string
  textColor: string
}

export function LiveChatView({ messages, chatUI, bgColor, textColor }: Props) {
  const emoticons = useActiveEmoticons()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div
      className="flex-1 overflow-y-auto px-3 py-2 text-sm"
      style={{ backgroundColor: bgColor }}
    >
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full opacity-30 text-xs" style={{ color: textColor }}>
          메시지를 입력하거나 이모티콘을 전송해보세요
        </div>
      )}
      {messages.map((msg) => {
        const ids = msg.emoticonIds ?? (msg.emoticonId ? [msg.emoticonId] : [])
        const emotes = ids.map((id) => emoticons.find((e) => e.id === id)).filter(Boolean)
        const displayName = getViewerName(msg.sender, msg.id)
        const badgeColor = msg.sender === '나' ? chatUI.accentColor : getBadgeColor(displayName)
        const avatarBg = msg.sender === '나' ? chatUI.accentColor : getAvatarBg(displayName)
        const avatarLetter = displayName.charAt(0).toUpperCase()

        return (
          <div key={msg.id} className={`flex items-start gap-2 group ${chatUI.showAvatar ? 'py-1' : 'py-0.5'}`}>
            {/* 아바타 */}
            {chatUI.showAvatar && (
              <div
                className="flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold text-[11px] mt-0.5"
                style={{ width: 28, height: 28, backgroundColor: avatarBg }}
              >
                {avatarLetter}
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* 유저명 */}
              <span
                className="text-[12px] font-semibold"
                style={{ color: chatUI.showAvatar ? 'rgba(0,0,0,0.35)' : badgeColor }}
              >
                {chatUI.showAvatar ? `@${displayName}` : displayName}
              </span>
              {!chatUI.showAvatar && (
                <span className="text-[11px] opacity-40 mx-0.5" style={{ color: textColor }}>:</span>
              )}

              {/* 메시지 내용 */}
              {chatUI.showAvatar ? (
                // 아바타 모드: 유저명 아래 줄에 메시지
                <div className="flex items-center gap-1 flex-wrap mt-0.5">
                  <MessageContent msg={msg} emotes={emotes} chatUI={chatUI} textColor={textColor} />
                </div>
              ) : (
                // 인라인 모드: 유저명 옆에 메시지
                <span className="inline-flex items-center gap-1 flex-wrap">
                  <MessageContent msg={msg} emotes={emotes} chatUI={chatUI} textColor={textColor} />
                </span>
              )}
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}

function MessageContent({
  msg, emotes, chatUI, textColor,
}: {
  msg: ChatMessage
  emotes: (EmoticonFile | undefined)[]
  chatUI: ChatUIStyle
  textColor: string
}) {
  return (
    <>
      {(msg.type === 'text' || msg.type === 'mixed') && msg.text && (
        <span className="text-[13px] leading-5" style={{ color: textColor }}>
          {msg.text}
        </span>
      )}
      {emotes.map((emoticon, i) => {
        const px = (chatUI.scaleSingleEmote && emotes.length === 1)
          ? chatUI.emoticonDisplayPx
          : chatUI.scaleSingleEmote
            ? Math.round(chatUI.emoticonDisplayPx * 0.32)
            : chatUI.emoticonDisplayPx
        return emoticon ? (
          <img
            key={i}
            src={emoticon.dataUrl}
            alt={emoticon.name}
            style={{
              width: px,
              height: px,
              display: 'inline-block',
              verticalAlign: 'middle',
              objectFit: 'contain',
            }}
          />
        ) : null
      })}
      {msg.type === 'emoticon' && emotes.length === 0 && (
        <span className="text-[11px] opacity-30" style={{ color: textColor }}>
          [이모티콘]
        </span>
      )}
    </>
  )
}
