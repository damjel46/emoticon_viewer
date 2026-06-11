import { useState } from 'react'
import { useEmoticonStore } from '../../store/emoticonStore'
import { useThemeStore } from '../../store/themeStore'
import { buildShareUrl } from '../../utils/shareUrl'
import clsx from 'clsx'

interface Props {
  onUrlChange: (url: string) => void
}

export function SharePanel({ onUrlChange }: Props) {
  const [copied, setCopied] = useState(false)
  const emoticons = useEmoticonStore((s) => s.emoticons)
  const activeTheme = useThemeStore((s) => s.activeTheme)
  const customBgColor = useThemeStore((s) => s.customBgColor)

  const generateUrl = () => {
    const url = buildShareUrl({
      emoticons: emoticons.map((e) => ({ id: e.id, name: e.name, dataUrl: e.dataUrl, mimeType: e.mimeType })),
      themeKey: activeTheme,
      customBg: customBgColor,
    })
    onUrlChange(url)
    return url
  }

  const handleCopy = async () => {
    const url = generateUrl()
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isLargeSet = emoticons.length >= 16

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
        <p className="font-semibold mb-1">📱 모바일 QR 연동 방법</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>아래 버튼으로 QR 코드를 생성합니다</li>
          <li>같은 브라우저를 사용하는 기기에서 QR을 스캔합니다</li>
          <li>모바일 화면으로 이모티콘을 확인할 수 있습니다</li>
        </ol>
      </div>

      {isLargeSet && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-xs text-amber-700">
          ⚠ 이모티콘이 {emoticons.length}종입니다. 32종 전체 공유 시 QR코드가 복잡해질 수 있습니다.
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={generateUrl}
          disabled={emoticons.length === 0}
          className="w-full bg-[#3c1e1e] hover:bg-[#5c3333] disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          QR 코드 생성 ({emoticons.length}종)
        </button>
        <button
          onClick={handleCopy}
          disabled={emoticons.length === 0}
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
