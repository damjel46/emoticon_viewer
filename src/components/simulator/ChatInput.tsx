import { useState } from 'react'
import clsx from 'clsx'
import { useChatStore } from '../../store/chatStore'
import { useActiveEmoticons } from '../../store/emoticonStore'
import { useActiveSetName } from '../../store/emoticonStore'
import { usePlatformStore } from '../../store/platformStore'
import { EmoticonPicker } from './EmoticonPicker'

export function ChatInput() {
  const [text, setText] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [queuedIds, setQueuedIds] = useState<string[]>([])
  const { addMessage, currentSender, toggleSender, miniEmoticonMode, setMiniEmoticonMode } = useChatStore()
  const emoticons = useActiveEmoticons()
  const activeSetName = useActiveSetName()
  const chatUI = usePlatformStore((s) => s.getConfig().chatUI)
  const accentColor = usePlatformStore((s) => s.getConfig().accentColor)
  const activePlatform = usePlatformStore((s) => s.activePlatform)

  // 큐 모드: inline-flow 플랫폼(숲 등) 또는 카카오 미니이모티콘 모드
  const isQueueMode = chatUI.bubbleMode === 'inline-flow' || miniEmoticonMode
  const isOther = currentSender === '상대방'

  const send = () => {
    const hasText = text.trim().length > 0
    const hasEmotes = queuedIds.length > 0
    if (!hasText && !hasEmotes) return

    if (isQueueMode) {
      const type = hasText && hasEmotes ? 'mixed' : hasEmotes ? 'emoticon' : 'text'
      addMessage({
        sender: currentSender,
        type,
        text: hasText ? text.trim() : undefined,
        emoticonIds: hasEmotes ? [...queuedIds] : undefined,
        isMini: miniEmoticonMode && chatUI.bubbleMode === 'bubbles',
      })
      setQueuedIds([])
      setText('')
    } else {
      if (!hasText) return
      addMessage({ sender: currentSender, type: 'text', text: text.trim() })
      setText('')
    }
    setPickerOpen(false)
  }

  const handleEmoticonSelect = (emoticonId: string) => {
    if (isQueueMode) {
      setQueuedIds((prev) => [...prev, emoticonId])
    } else {
      addMessage({ sender: currentSender, type: 'emoticon', emoticonId })
      setPickerOpen(false)
    }
  }

  const removeQueued = (index: number) => {
    setQueuedIds((prev) => prev.filter((_, i) => i !== index))
  }

  const canSend = isQueueMode ? (text.trim().length > 0 || queuedIds.length > 0) : text.trim().length > 0
  const accentIsDark = accentColor === '#fee500'
  const sendBtnText = accentIsDark ? '#1a1a1a' : '#ffffff'

  // ── YouTube 전용 입력 바 ─────────────────────────────────────
  if (activePlatform === 'youtube') {
    return (
      <div className="relative border-t" style={{ borderColor: '#e0e0e0', backgroundColor: '#fff' }}>
        {/* 이모티콘 큐 미리보기 */}
        {queuedIds.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 pt-2 pb-0 flex-wrap">
            {queuedIds.map((id, i) => {
              const emote = emoticons.find((e) => e.id === id)
              if (!emote) return null
              return (
                <div key={i} className="relative group/q">
                  <img src={emote.dataUrl} alt={emote.name} className="w-8 h-8 object-contain rounded" />
                  <button
                    onClick={() => removeQueued(i)}
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gray-500 text-white text-[8px] flex items-center justify-center opacity-0 group-hover/q:opacity-100 transition-opacity"
                  >✕</button>
                </div>
              )
            })}
          </div>
        )}

        {/* 입력 영역 */}
        <div className="flex items-center gap-1 px-3 py-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            onFocus={() => setPickerOpen(false)}
            placeholder="구독자로 채팅..."
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: '#0f0f0f' }}
          />

          {/* 이모티콘 버튼 (피커) */}
          <div className="relative flex-shrink-0">
            <EmoticonPicker
              onSelect={handleEmoticonSelect}
              open={pickerOpen}
              onToggle={() => setPickerOpen((p) => !p)}
              accentColor="#ff0000"
              queueMode={true}
              variant="youtube"
              packName={activeSetName ?? undefined}
            />
          </div>

          {/* 슈퍼챗 버튼 (장식) */}
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="6" width="18" height="13" rx="2" fill="#1565c0" />
              <rect x="3" y="9" width="18" height="4" fill="#42a5f5" />
              <text x="12" y="8" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">$</text>
            </svg>
          </button>

          {/* 좋아요 버튼 (장식) */}
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 flex-shrink-0 text-gray-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
            </svg>
          </button>
        </div>

        {/* 하단 바 */}
        <div className="flex items-center justify-between px-3 pb-2">
          <button
            onClick={toggleSender}
            className={clsx(
              'text-[10px] px-2.5 py-1 rounded-full transition-colors whitespace-nowrap font-medium border',
              isOther
                ? 'bg-gray-700 text-white border-gray-700'
                : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
            )}
          >
            상대방
          </button>
          <button
            onClick={send}
            disabled={!canSend}
            className="text-xs font-bold px-4 py-1.5 rounded-full transition-colors whitespace-nowrap disabled:opacity-40"
            style={{ backgroundColor: canSend ? '#ff0000' : '#e0e0e0', color: canSend ? '#fff' : '#aaa' }}
          >
            채팅
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative border-t border-gray-200 bg-white">
      {/* 큐 모드: 이모티콘 미리보기 */}
      {isQueueMode && queuedIds.length > 0 && (
        <div className="flex items-center gap-1.5 px-3 pt-2 pb-0 flex-wrap">
          {queuedIds.map((id, i) => {
            const emote = emoticons.find((e) => e.id === id)
            if (!emote) return null
            return (
              <div key={i} className="relative group/q">
                <img
                  src={emote.dataUrl}
                  alt={emote.name}
                  className="w-10 h-10 object-contain rounded border border-gray-200 bg-gray-50"
                />
                <button
                  onClick={() => removeQueued(i)}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-500 text-white text-[9px] flex items-center justify-center opacity-0 group-hover/q:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* 입력 바 */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center flex-shrink-0">
          ＋
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          onFocus={() => setPickerOpen(false)}
          placeholder={
            miniEmoticonMode
              ? '미니 이모티콘 모드 — 😄로 이모티콘 추가'
              : isQueueMode
                ? '메시지 입력 (이모티콘은 위 😄 버튼으로 추가)'
                : '메시지 입력'
          }
          className="flex-1 bg-gray-100 rounded-2xl px-3 py-1.5 text-sm outline-none focus:ring-2"
          style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
        />

        <EmoticonPicker
          onSelect={handleEmoticonSelect}
          open={pickerOpen}
          onToggle={() => setPickerOpen((p) => !p)}
          accentColor={accentColor}
          queueMode={isQueueMode}
          miniMode={miniEmoticonMode}
          onMiniModeChange={setMiniEmoticonMode}
          variant="kakao"
        />

        <button
          onClick={toggleSender}
          className={clsx(
            'text-[10px] px-2.5 py-1.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0 font-medium border',
            isOther
              ? 'bg-gray-700 text-white border-gray-700'
              : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
          )}
          title="상대방 모드 토글"
        >
          상대방
        </button>
        <button
          onClick={send}
          disabled={!canSend}
          className="text-xs font-bold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0 disabled:opacity-40"
          style={{ backgroundColor: accentColor, color: sendBtnText }}
        >
          전송
        </button>
      </div>
    </div>
  )
}
