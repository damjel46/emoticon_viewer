import type { ChatTheme } from '../types'

export type PlatformId = 'kakao' | 'soop' | 'ogq' | 'youtube' | 'twitch'

export interface PlatformSpec {
  expectedWidth: number | null
  expectedHeight: number | null
  minDimension?: number
  maxDimension?: number
  maxFileSizeBytes: number
  maxStaticFileSizeBytes?: number
  allowedTypes: string[]
  multipleResolutions?: number[]
  minSetCount?: number
  maxSetCount?: number
  setCountOptions: number[]
  animMaxFrames?: number
  animMaxSeconds?: number
  staticOnly?: boolean
}

export interface ChatUIStyle {
  bubbleMode: 'bubbles' | 'inline-flow'
  chatBgColor: string
  headerBgColor: string
  headerTextColor: string
  myBubbleColor: string | null
  otherBubbleColor: string | null
  bubbleTextColor: string
  timestampColor: string
  emoticonDisplayPx: number
  miniEmoticonDisplayPx?: number
  accentColor: string
  showReadReceipt: boolean
  showAvatar: boolean
  showSenderName: boolean
  myLabel: string
  otherLabel: string
  liveViewerCount?: string
  scaleSingleEmote?: boolean
}

export interface GridConfig {
  defaultCount: number
  countOptions: number[]
  gridColumns: number
  shopPreviewLabel: string
  showShopPreview: boolean
  showKeyboardTab: boolean
}

export interface PlatformConfig {
  id: PlatformId
  nameKo: string
  nameShort: string
  icon: string
  accentColor: string
  spec: PlatformSpec
  miniSpec?: PlatformSpec
  chatUI: ChatUIStyle
  grid: GridConfig
  themes: ChatTheme[]
  defaultTheme: string
}

export const PLATFORMS: Record<PlatformId, PlatformConfig> = {
  kakao: {
    id: 'kakao',
    nameKo: '카카오톡',
    nameShort: '카카오',
    icon: '💛',
    accentColor: '#fee500',
    spec: {
      expectedWidth: 360,
      expectedHeight: 360,
      maxFileSizeBytes: 1_000_000,
      maxStaticFileSizeBytes: 150_000,
      allowedTypes: ['image/gif', 'image/webp', 'image/png'],
      setCountOptions: [24, 32],
      staticOnly: false,
    },
    chatUI: {
      bubbleMode: 'bubbles',
      chatBgColor: '#b2c7d9',
      headerBgColor: '#b2c7d9',
      headerTextColor: '#1a1a1a',
      myBubbleColor: '#fee500',
      otherBubbleColor: '#ffffff',
      bubbleTextColor: '#1a1a1a',
      timestampColor: '#6b7280',
      emoticonDisplayPx: 112,
      miniEmoticonDisplayPx: 68,
      accentColor: '#fee500',
      showReadReceipt: true,
      showAvatar: true,
      showSenderName: true,
      myLabel: '나',
      otherLabel: '상대방',
    },
    grid: {
      defaultCount: 24,
      countOptions: [24, 32],
      gridColumns: 6,
      shopPreviewLabel: '🏪 샵 미리보기',
      showShopPreview: true,
      showKeyboardTab: true,
    },
    themes: [
      { key: 'light', labelKo: '기본 (하늘)', bgColor: '#b2c7d9', myBubbleColor: '#fee500', otherBubbleColor: '#ffffff', textColor: '#1a1a1a', timestampColor: '#6b7280' },
      { key: 'dark', labelKo: '다크', bgColor: '#1a1a2e', myBubbleColor: '#fee500', otherBubbleColor: '#2d2d3a', textColor: '#f0f0f0', timestampColor: '#9ca3af' },
      { key: 'pink', labelKo: '핑크', bgColor: '#f9cdd4', myBubbleColor: '#fee500', otherBubbleColor: '#ffffff', textColor: '#1a1a1a', timestampColor: '#6b7280' },
      { key: 'yellow', labelKo: '노랑', bgColor: '#fff9c4', myBubbleColor: '#fee500', otherBubbleColor: '#ffffff', textColor: '#1a1a1a', timestampColor: '#6b7280' },
      { key: 'custom', labelKo: '커스텀', bgColor: '#e8e8e8', myBubbleColor: '#fee500', otherBubbleColor: '#ffffff', textColor: '#1a1a1a', timestampColor: '#6b7280' },
    ],
    defaultTheme: 'light',
    miniSpec: {
      expectedWidth: null,
      expectedHeight: null,
      minDimension: 60,
      maxDimension: 360,
      maxFileSizeBytes: 500_000,
      allowedTypes: ['image/png', 'image/gif', 'image/webp'],
      setCountOptions: [],
      staticOnly: false,
    },
  },

  soop: {
    id: 'soop',
    nameKo: 'SOOP',
    nameShort: 'SOOP',
    icon: '🔵',
    accentColor: '#0545b1',
    spec: {
      expectedWidth: 240,
      expectedHeight: 240,
      maxFileSizeBytes: 1_000_000,
      allowedTypes: ['image/png', 'image/gif'],
      setCountOptions: [],
      minSetCount: 16,
      maxSetCount: 24,
      animMaxFrames: 100,
      animMaxSeconds: 3,
      staticOnly: false,
    },
    chatUI: {
      bubbleMode: 'inline-flow',
      chatBgColor: '#ffffff',
      headerBgColor: '#f5f5f5',
      headerTextColor: '#141414',
      myBubbleColor: null,
      otherBubbleColor: null,
      bubbleTextColor: '#141414',
      timestampColor: '#888888',
      emoticonDisplayPx: 26,
      accentColor: '#0545b1',
      showReadReceipt: false,
      showAvatar: false,
      showSenderName: true,
      myLabel: '나',
      otherLabel: '시청자',
      liveViewerCount: '12,847명 시청 중',
    },
    grid: {
      defaultCount: 16,
      countOptions: [16, 24],
      gridColumns: 6,
      shopPreviewLabel: '📺 채널 미리보기',
      showShopPreview: true,
      showKeyboardTab: false,
    },
    themes: [
      { key: 'light', labelKo: '기본 (화이트)', bgColor: '#ffffff', myBubbleColor: '#0545b1', otherBubbleColor: '#f2f2f2', textColor: '#141414', timestampColor: '#666666' },
      { key: 'dark', labelKo: '다크', bgColor: '#111111', myBubbleColor: '#0545b1', otherBubbleColor: '#1e1e1e', textColor: '#e0e0e0', timestampColor: '#888888' },
    ],
    defaultTheme: 'light',
  },

  ogq: {
    id: 'ogq',
    nameKo: '네이버',
    nameShort: '네이버',
    icon: '🟢',
    accentColor: '#02e191',
    spec: {
      expectedWidth: 240,
      expectedHeight: 240,
      maxFileSizeBytes: 1_000_000,
      allowedTypes: ['image/png', 'image/gif', 'image/webp'],
      setCountOptions: [],
      minSetCount: 16,
      maxSetCount: 24,
      animMaxFrames: 100,
      animMaxSeconds: 3,
      staticOnly: false,
    },
    chatUI: {
      bubbleMode: 'inline-flow',
      chatBgColor: '#0a0a0a',
      headerBgColor: '#111111',
      headerTextColor: '#ffffff',
      myBubbleColor: null,
      otherBubbleColor: null,
      bubbleTextColor: '#e8e8e8',
      timestampColor: '#888888',
      emoticonDisplayPx: 24,
      accentColor: '#02e191',
      showReadReceipt: false,
      showAvatar: false,
      showSenderName: true,
      myLabel: '나',
      otherLabel: '시청자',
      liveViewerCount: '8,341명 시청 중',
    },
    grid: {
      defaultCount: 16,
      countOptions: [16, 24],
      gridColumns: 6,
      shopPreviewLabel: '🛒 OGQ 마켓 미리보기',
      showShopPreview: true,
      showKeyboardTab: false,
    },
    themes: [
      { key: 'dark', labelKo: '다크 (기본)', bgColor: '#0a0a0a', myBubbleColor: '#02e191', otherBubbleColor: '#1a1a1a', textColor: '#e8e8e8', timestampColor: '#888888' },
      { key: 'darker', labelKo: '더 다크', bgColor: '#000000', myBubbleColor: '#02e191', otherBubbleColor: '#111111', textColor: '#cccccc', timestampColor: '#666666' },
    ],
    defaultTheme: 'dark',
  },

  youtube: {
    id: 'youtube',
    nameKo: 'YouTube',
    nameShort: 'YT',
    icon: '▶️',
    accentColor: '#ff0000',
    spec: {
      expectedWidth: null,
      expectedHeight: null,
      minDimension: 48,
      maxDimension: 480,
      maxFileSizeBytes: 999_999,
      allowedTypes: ['image/png', 'image/jpeg'],
      setCountOptions: [],
      staticOnly: true,
    },
    chatUI: {
      bubbleMode: 'inline-flow',
      chatBgColor: '#ffffff',
      headerBgColor: '#f9f9f9',
      headerTextColor: '#0f0f0f',
      myBubbleColor: null,
      otherBubbleColor: null,
      bubbleTextColor: '#0f0f0f',
      timestampColor: '#606060',
      emoticonDisplayPx: 24,
      accentColor: '#ff0000',
      showReadReceipt: false,
      showAvatar: true,
      showSenderName: true,
      myLabel: '나',
      otherLabel: '시청자',
      liveViewerCount: '28,493명 시청 중',
    },
    grid: {
      defaultCount: 10,
      countOptions: [],
      gridColumns: 5,
      shopPreviewLabel: '',
      showShopPreview: false,
      showKeyboardTab: false,
    },
    themes: [
      { key: 'light', labelKo: '기본 (화이트)', bgColor: '#ffffff', myBubbleColor: '#ff0000', otherBubbleColor: '#f2f2f2', textColor: '#0f0f0f', timestampColor: '#606060' },
      { key: 'dark', labelKo: '다크', bgColor: '#0f0f0f', myBubbleColor: '#ff0000', otherBubbleColor: '#1a1a1a', textColor: '#e0e0e0', timestampColor: '#aaaaaa' },
    ],
    defaultTheme: 'light',
  },

  twitch: {
    id: 'twitch',
    nameKo: 'Twitch',
    nameShort: 'Twitch',
    icon: '🟣',
    accentColor: '#9146ff',
    spec: {
      expectedWidth: 112,
      expectedHeight: 112,
      maxFileSizeBytes: 512_000,
      maxStaticFileSizeBytes: 25_600,
      allowedTypes: ['image/png'],
      multipleResolutions: [28, 56, 112],
      setCountOptions: [],
      staticOnly: false,
    },
    chatUI: {
      bubbleMode: 'inline-flow',
      chatBgColor: '#18181b',
      headerBgColor: '#1f1f23',
      headerTextColor: '#efeff1',
      myBubbleColor: null,
      otherBubbleColor: null,
      bubbleTextColor: '#efeff1',
      timestampColor: '#adadb8',
      emoticonDisplayPx: 28,
      accentColor: '#9146ff',
      showReadReceipt: false,
      showAvatar: false,
      showSenderName: true,
      myLabel: '나',
      otherLabel: '채터',
      liveViewerCount: '5,291명 시청 중',
    },
    grid: {
      defaultCount: 10,
      countOptions: [],
      gridColumns: 5,
      shopPreviewLabel: '🎮 채널 에모트 패널',
      showShopPreview: true,
      showKeyboardTab: false,
    },
    themes: [
      { key: 'dark', labelKo: '다크 (기본)', bgColor: '#18181b', myBubbleColor: '#9146ff', otherBubbleColor: '#26262c', textColor: '#efeff1', timestampColor: '#adadb8' },
    ],
    defaultTheme: 'dark',
  },
}

export const PLATFORM_ORDER: PlatformId[] = ['kakao', 'soop', 'ogq', 'youtube', 'twitch']
