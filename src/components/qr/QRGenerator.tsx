import { QRCodeSVG } from 'qrcode.react'

interface Props {
  url: string
}

export function QRGenerator({ url }: Props) {
  if (!url) return null

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100">
        <QRCodeSVG
          value={url}
          size={200}
          level="M"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#1a1a1a"
        />
      </div>
      <p className="text-xs text-gray-400 text-center max-w-[200px]">
        스마트폰으로 QR코드를 스캔하면<br />모바일 미리보기가 열립니다
      </p>
    </div>
  )
}
