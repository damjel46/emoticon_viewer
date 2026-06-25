import { useState } from 'react'
import { QRGenerator } from '../components/qr/QRGenerator'
import { SharePanel } from '../components/qr/SharePanel'
import { PhoneFrame } from '../components/qr/PhoneFrame'
import { PremiumGate } from '../components/auth/PremiumGate'

export function QRPage() {
  const [shareUrl, setShareUrl] = useState('')

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
        <h1 className="text-lg font-bold text-gray-800">모바일 QR 코드 연동</h1>
        <p className="text-xs text-gray-400 mt-0.5">QR 코드를 스캔해 스마트폰에서 이모티콘을 확인하세요</p>
      </div>

      <PremiumGate feature="QR 연동 기능">
        <div className="flex gap-8 px-6 py-6 flex-1 flex-wrap">
          {/* 좌측: 설정 + QR */}
          <div className="flex flex-col gap-6 w-72">
            <SharePanel onUrlChange={setShareUrl} />
            {shareUrl && <QRGenerator url={shareUrl} />}

            {shareUrl && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 font-semibold mb-1">생성된 링크</p>
                <p className="text-[10px] text-gray-500 break-all leading-relaxed">
                  {shareUrl.length > 80 ? shareUrl.slice(0, 80) + '…' : shareUrl}
                </p>
              </div>
            )}
          </div>

          {/* 우측: 폰 프레임 미리보기 */}
          <div className="flex flex-col items-center gap-4">
            <PhoneFrame url={shareUrl || undefined} />
            {shareUrl && (
              <a
                href="/mobile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-700 underline"
              >
                새 탭에서 모바일 페이지 열기
              </a>
            )}
          </div>
        </div>
      </PremiumGate>
    </div>
  )
}
