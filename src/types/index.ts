export interface SpecWarning {
  code: 'WRONG_SIZE' | 'TOO_LARGE' | 'WRONG_FORMAT' | 'WRONG_SIZE_RANGE' | 'NOT_SQUARE' | 'ANIMATED_NOT_ALLOWED';
  message: string;
}

export interface EmoticonSet {
  id: string
  name: string
  emoticons: EmoticonFile[]
  thumbnailId?: string
}

export interface EmoticonFile {
  id: string;
  name: string;
  dataUrl: string;
  mimeType: 'image/gif' | 'image/webp' | 'image/png' | 'image/jpeg';
  fileSizeBytes: number;
  width: number | null;
  height: number | null;
  frameCount: number | null;
  validationWarnings: SpecWarning[];
}

export type MessageSender = '나' | '상대방';

export type ContentSegment =
  | { kind: 'text'; value: string }
  | { kind: 'emoticon'; emoticonId: string }

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  type: 'text' | 'emoticon' | 'mixed';
  text?: string;
  emoticonId?: string;
  emoticonIds?: string[];
  segments?: ContentSegment[];
  isMini?: boolean;
  timestamp: Date;
}

// ThemeKey is now a plain string to support per-platform theme keys
export type ThemeKey = string;

export interface ChatTheme {
  key: string;
  labelKo: string;
  bgColor: string;
  myBubbleColor: string;
  otherBubbleColor: string;
  textColor: string;
  timestampColor: string;
}

export interface AnimPlayerState {
  isPlaying: boolean;
  speedMultiplier: 0.5 | 1 | 1.5;
  currentFrame: number;
  totalFrames: number;
  activeEmoticonId: string | null;
}

export interface ShareEmoticon {
  id: string;
  name: string;
  dataUrl: string;
  mimeType: string;
}

export interface SharePayload {
  emoticons: ShareEmoticon[];
  themeKey: string;
  customBg?: string;
  platformId?: string;
  naverSubMode?: string;
}

export interface GifFrame {
  index: number;
  delayMs: number;
  dataUrl: string;
}
