import { useState } from 'react'
import { useEmoticonStore } from '../../store/emoticonStore'
import { useChatStore } from '../../store/chatStore'
import { useSpamChat } from '../../hooks/useSpamChat'

export function SpamButton() {
  const [selectedId, setSelectedId] = useState<string>('')
  const [count, setCount] = useState(5)
  const emoticons = useEmoticonStore((s) => s.emoticons)
  const currentSender = useChatStore((s) => s.currentSender)
  const { spam } = useSpamChat()

  if (emoticons.length === 0) return null

  const effectiveId = selectedId || emoticons[0]?.id

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
    </div>
  )
}
