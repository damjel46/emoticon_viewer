import { create } from 'zustand'
import type { ChatMessage, MessageSender } from '../types'

interface ChatState {
  messages: ChatMessage[]
  currentSender: MessageSender
  miniEmoticonMode: boolean
  setSender: (sender: MessageSender) => void
  toggleSender: () => void
  setMiniEmoticonMode: (v: boolean) => void
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  clearMessages: () => void
  spamEmoticon: (emoticonId: string, count: number) => void
}

export const useChatStore = create<ChatState>()((set, get) => ({
  messages: [],
  currentSender: '나',
  miniEmoticonMode: false,
  setSender: (sender) => set({ currentSender: sender }),
  toggleSender: () =>
    set((s) => ({ currentSender: s.currentSender === '나' ? '상대방' : '나' })),
  setMiniEmoticonMode: (v) => set({ miniEmoticonMode: v }),
  addMessage: (msg) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { ...msg, id: crypto.randomUUID(), timestamp: new Date() },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
  spamEmoticon: (emoticonId, count) => {
    const sender = get().currentSender
    const newMsgs: ChatMessage[] = Array.from({ length: count }, (_, i) => ({
      id: crypto.randomUUID(),
      sender: sender as MessageSender,
      type: 'emoticon' as const,
      emoticonId,
      timestamp: new Date(Date.now() + i * 100),
    }))
    set((s) => ({ messages: [...s.messages, ...newMsgs] }))
  },
}))
