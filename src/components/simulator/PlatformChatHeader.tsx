import type { ChatUIStyle } from '../../config/platforms'
import type { PlatformId } from '../../config/platforms'

interface Props {
  platformId: PlatformId
  chatUI: ChatUIStyle
  onClear: () => void
}

export function PlatformChatHeader({ platformId, chatUI, onClear }: Props) {
  const headerStyle = {
    backgroundColor: chatUI.headerBgColor,
    color: chatUI.headerTextColor,
    borderBottom: `1px solid ${chatUI.headerTextColor}15`,
  }

  if (platformId === 'kakao') {
    return (
      <div className="flex items-center justify-between px-4 py-3" style={headerStyle}>
        <div className="flex items-center gap-2">
          <span className="text-lg">←</span>
          <div>
            <p className="text-sm font-semibold">이모티콘 테스트방</p>
            <p className="text-[10px] opacity-60">2명</p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-xs px-2.5 py-1 rounded-lg transition-colors"
          style={{ backgroundColor: `${chatUI.headerTextColor}15`, color: chatUI.headerTextColor }}
        >
          초기화
        </button>
      </div>
    )
  }

  if (platformId === 'ogq') {
    return (
      <div className="flex items-center justify-between px-4 py-2.5" style={headerStyle}>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: chatUI.accentColor, color: '#000' }}
          >
            LIVE
          </span>
          <span className="text-sm font-semibold">테스트 채널</span>
          <span className="text-[10px] opacity-50">● {chatUI.liveViewerCount}</span>
        </div>
        <button
          onClick={onClear}
          className="text-[10px] px-2 py-0.5 rounded opacity-40 hover:opacity-70 transition-opacity"
          style={{ backgroundColor: `${chatUI.headerTextColor}20`, color: chatUI.headerTextColor }}
        >
          초기화
        </button>
      </div>
    )
  }

  if (platformId === 'soop') {
    return (
      <div className="flex items-center justify-between px-4 py-2.5" style={headerStyle}>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: chatUI.accentColor, color: '#fff' }}
          >
            LIVE
          </span>
          <span className="text-sm font-semibold">테스트 채널</span>
          <span className="text-[10px] opacity-50">● {chatUI.liveViewerCount}</span>
        </div>
        <button
          onClick={onClear}
          className="text-[10px] px-2 py-0.5 rounded opacity-40 hover:opacity-70 transition-opacity"
          style={{ backgroundColor: `${chatUI.headerTextColor}20`, color: chatUI.headerTextColor }}
        >
          초기화
        </button>
      </div>
    )
  }

  if (platformId === 'youtube') {
    return (
      <div className="flex items-center justify-between px-4 py-2.5" style={headerStyle}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">라이브 채팅</span>
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: chatUI.accentColor, color: '#fff' }}
          >
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] opacity-40">{chatUI.liveViewerCount}</span>
          <button
            onClick={onClear}
            className="text-[10px] opacity-40 hover:opacity-70 transition-opacity"
            style={{ color: chatUI.headerTextColor }}
          >
            초기화
          </button>
        </div>
      </div>
    )
  }

  if (platformId === 'twitch') {
    return (
      <div className="flex items-center justify-between px-4 py-2.5" style={headerStyle}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">채팅</span>
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: chatUI.accentColor, color: '#fff' }}
          >
            LIVE
          </span>
          <span className="text-[10px] opacity-40">{chatUI.liveViewerCount}</span>
        </div>
        <button
          onClick={onClear}
          className="text-[10px] opacity-40 hover:opacity-70 transition-opacity"
          style={{ color: chatUI.headerTextColor }}
        >
          초기화
        </button>
      </div>
    )
  }

  return null
}
