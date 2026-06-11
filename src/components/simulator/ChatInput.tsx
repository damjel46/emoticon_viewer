import { useState } from 'react'
import clsx from 'clsx'
import { useChatStore } from '../../store/chatStore'
import { EmoticonPicker } from './EmoticonPicker'

export function ChatInput() {
  const [text, setText] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const { addMessage, currentSender, toggleSender } = useChatStore()
  const isOther = currentSender === '상대방'

  const send = () => {
    if (!text.trim()) return
    addMessage({ sender: currentSender, type: 'text', text: text.trim() })
    setText('')
  }

  const handleEmoticonSelect = (emoticonId: string) => {
    addMessage({ sender: currentSender, type: 'emoticon', emoticonId })
    setPickerOpen(false)
  }

  return (
    <div className="relative border-t border-gray-200 bg-white">
      {/* 입력 바 */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* 좌측 + 버튼 */}
        <button className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center flex-shrink-0">
          ＋
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          onFocus={() => setPickerOpen(false)}
          placeholder="메시지 입력"
          className="flex-1 bg-gray-100 rounded-2xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#fee500]"
        />

        {/* 이모티콘 버튼 + 패널 */}
        <EmoticonPicker
          onSelect={handleEmoticonSelect}
          open={pickerOpen}
          onToggle={() => setPickerOpen((p) => !p)}
        />

        <button
          onClick={toggleSender}
          className={clsx(
            'text-[10px] px-2.5 py-1.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0 font-medium border',
            isOther
              ? 'bg-[#3c1e1e] text-white border-[#3c1e1e]'
              : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
          )}
          title="상대방 모드 토글"
        >
          상대방
        </button>
        <button
          onClick={send}
          disabled={!text.trim()}
          className="text-xs bg-[#fee500] hover:bg-yellow-400 disabled:opacity-40 text-gray-800 font-bold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
        >
          전송
        </button>
      </div>
    </div>
  )
}
