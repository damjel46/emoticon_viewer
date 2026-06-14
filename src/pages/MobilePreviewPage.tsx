import { useEffect, useState } from 'react'
import { fetchShare } from '../utils/uploadShare'
import type { ShareEmoticon, EmoticonFile } from '../types'
import { MobileStreamSimulator } from '../components/mobile/MobileStreamSimulator'
import { MobileNaverBlogSimulator } from '../components/mobile/MobileNaverBlogSimulator'
import { MobileNaverCafeSimulator } from '../components/mobile/MobileNaverCafeSimulator'
import { MobileKakaoPage } from './MobileKakaoPage'

export function MobilePreviewPage() {
  const [emoticons, setEmoticons] = useState<ShareEmoticon[]>([])
  const [loaded, setLoaded] = useState(false)
  const [platformId, setPlatformId] = useState<string>('kakao')
  const [naverSubMode, setNaverSubMode] = useState<string>('chzzk')

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, '')
    if (!id) { setLoaded(true); return }
    fetchShare(id).then((payload) => {
      if (payload) {
        setEmoticons(payload.emoticons as ShareEmoticon[])
        if (payload.platformId) setPlatformId(payload.platformId)
        if (payload.naverSubMode) setNaverSubMode(payload.naverSubMode)
      }
      setLoaded(true)
    })
  }, [])

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <span className="text-gray-400 text-sm">불러오는 중...</span>
      </div>
    )
  }

  if (emoticons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
        <div className="text-4xl mb-3">📂</div>
        <p className="font-semibold text-gray-700 mb-1">이모티콘이 없습니다</p>
        <p className="text-xs text-gray-400">데스크탑에서 QR 코드를 다시 생성해주세요</p>
      </div>
    )
  }

  if (platformId === 'soop' || platformId === 'youtube' || platformId === 'twitch') {
    return <MobileStreamSimulator emoticons={emoticons} platformId={platformId} />
  }

  if (platformId === 'ogq') {
    if (naverSubMode === 'blog') return <MobileNaverBlogSimulator emoticons={emoticons} />
    if (naverSubMode === 'cafe') return <MobileNaverCafeSimulator emoticons={emoticons} />
    return <MobileStreamSimulator emoticons={emoticons} platformId="ogq" />
  }

  return <MobileKakaoPage emoticons={emoticons as unknown as EmoticonFile[]} />
}
