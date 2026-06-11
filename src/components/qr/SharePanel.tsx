import { useState } from 'react'
import { useEmoticonStore } from '../../store/emoticonStore'
import { useThemeStore } from '../../store/themeStore'
import { uploadShare } from '../../utils/uploadShare'
import clsx from 'clsx'

interface Props {
  onUrlChange: (url: string) => void
}

export function SharePanel({ onUrlChange }: Props) {
  const [copied, setCopied] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const emoticons = useEmoticonStore((s) => s.emoticons)
  const activeTheme = useThemeStore((s) => s.activeTheme)
  const customBgColor = useThemeStore((s) => s.customBgColor)

  const generate = async () => {
    setUploading(true)
    setError(null)
    try {
      const url = await uploadShare({
        emoticons: emoticons.map((e) => ({ id: e.id, name: e.name, dataUrl: e.dataUrl, mimeType: e.mimeType })),
        themeKey: activeTheme,
        customBg: customBgColor,
      })
      onUrlChange(url)
      return url
    } catch (e) {
      setError('업로드 실패. 잠시 후 다시 시도해주세요.')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleCopy = async () => {
    const url = await generate()
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
        <p className="font-semibold mb-1">📱 모바일 QR 연동 방법</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>아래 버튼으로 QR 코드를 생성합니다</li>
          <li>스마트폰 카메라로 QR을 스캔합니다</li>
          <li>모바일 화면으로 이모티콘을 확인할 수 있습니다</li>
        </ol>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={generate}
          disabled={emoticons.length === 0 || uploading}
          className="w-full bg-[#3c1e1e] hover:bg-[#5c3333] disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {uploading ? '업로드 중...' : `QR 코드 생성 (${emoticons.length}종)`}
        </button>
        <button
          onClick={handleCopy}
          disabled={emoticons.length === 0 || uploading}
          className={clsx(
            'w-full font-semibold py-3 rounded-xl transition-colors',
            copied
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40'
          )}
        >
          {copied ? '✓ 링크 복사 완료' : '링크 복사'}
        </button>
      </div>
    </div>
  )
}
