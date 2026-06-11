import { useCallback } from 'react'
import { useChatStore } from '../store/chatStore'

export function useSpamChat() {
  const { spamEmoticon } = useChatStore()

  const spam = useCallback(
    (emoticonId: string, count: number = 10) => {
      spamEmoticon(emoticonId, count)
    },
    [spamEmoticon]
  )

  return { spam }
}
