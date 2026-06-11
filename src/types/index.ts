export interface SpecWarning {
  code: 'WRONG_SIZE' | 'TOO_LARGE' | 'WRONG_FORMAT';
  message: string;
}

export interface EmoticonFile {
  id: string;
  name: string;
  dataUrl: string;
  mimeType: 'image/gif' | 'image/webp' | 'image/png';
  fileSizeBytes: number;
  width: number | null;
  height: number | null;
  frameCount: number | null;
  validationWarnings: SpecWarning[];
}

export type MessageSender = '나' | '상대방';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  type: 'text' | 'emoticon' | 'mixed';
  text?: string;
  emoticonId?: string;
  timestamp: Date;
}

export type ThemeKey = 'light' | 'dark' | 'pink' | 'yellow' | 'custom';

export interface ChatTheme {
  key: ThemeKey;
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
  themeKey: ThemeKey;
  customBg?: string;
}

export interface GifFrame {
  index: number;
  delayMs: number;
  dataUrl: string;
}
