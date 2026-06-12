import { useState } from 'react'
import { useActiveEmoticons } from '../../store/emoticonStore'
import { useChatStore } from '../../store/chatStore'
import { useSpamChat } from '../../hooks/useSpamChat'

export function SpamButton() {
  const [selectedId, setSelectedId] = useState<string>('')
  const [count, setCount] = useState(5)
  const [collapsed, setCollapsed] = useState(false)
  const emoticons = useActiveEmoticons()
  const currentSender = useChatStore((s) => s.currentSender)
  const { spam } = useSpamChat()

  if (emoticons.length === 0) return null

  const effectiveId = selectedId || emoticons[0]?.id

  if (collapsed) {
    return (
      <div className="flex items-center justify-between px-4 py-1.5 bg-amber-50 border-t border-amber-100">
        <span className="text-xs text-amber-600 font-semibold">연타 테스트</span>
        <button
          onClick={() => setCollapsed(false)}
          className="text-amber-500 hover:text-amber-700 transition-colors"
          title="연타 테스트 펼치기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 rotate-180" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-t border-amber-100">
      <span className="text-xs font-semibold text-amber-700">
        연타 테스트 <span className="text-amber-500">({currentSender})</span>:
      </span>
      <select
        value={effectiveId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white max-w-[120px]"
      >
        {emoticons.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name.replace(/\.[^.]+$/, '')}
          </option>
        ))}
      </select>
      <select
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white w-16"
      >
        {[3, 5, 10, 20].map((n) => (
          <option key={n} value={n}>{n}회</option>
        ))}
      </select>
      <button
        onClick={() => spam(effectiveId, count)}
        className="text-xs bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-3 py-1 rounded-lg transition-colors"
      >
        연타 전송
      </button>
      <button
        onClick={() => setCollapsed(true)}
        className="ml-auto text-amber-500 hover:text-amber-700 transition-colors"
        title="연타 테스트 숨기기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}
