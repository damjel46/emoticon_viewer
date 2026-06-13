import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { usePlatformStore } from '../store/platformStore'
import { PLATFORM_ORDER } from '../config/platforms'
import type { PlatformId } from '../config/platforms'
import { SimulatorPage } from './SimulatorPage'

const SEO_MAP: Record<PlatformId, { title: string; description: string }> = {
  kakao: {
    title: '카카오톡 이모티콘 미리보기 - 이모티콘 뷰어',
    description: '카카오톡 이모티콘 제출 전 실제 채팅창에서 어떻게 보일지 무료로 미리 확인하세요.',
  },
  soop: {
    title: 'SOOP 이모티콘 미리보기 - 이모티콘 뷰어',
    description: 'SOOP(숲) 이모티콘 제출 전 실제 채팅창에서 어떻게 보일지 무료로 미리 확인하세요.',
  },
  ogq: {
    title: 'OGQ 네이버 이모티콘 미리보기 - 이모티콘 뷰어',
    description: 'OGQ 마켓 이모티콘 제출 전 실제 채팅창에서 어떻게 보일지 무료로 미리 확인하세요.',
  },
  youtube: {
    title: '유튜브 이모티콘 미리보기 - 이모티콘 뷰어',
    description: '유튜브 이모티콘 제출 전 실제 채팅창에서 어떻게 보일지 무료로 미리 확인하세요.',
  },
  twitch: {
    title: '트위치 이모티콘 미리보기 - 이모티콘 뷰어',
    description: '트위치 이모티콘 제출 전 실제 채팅창에서 어떻게 보일지 무료로 미리 확인하세요.',
  },
}

export function PlatformPage() {
  const { platformId } = useParams<{ platformId: string }>()
  const setPlatform = usePlatformStore((s) => s.setPlatform)

  const validId = PLATFORM_ORDER.includes(platformId as PlatformId)
    ? (platformId as PlatformId)
    : null

  useEffect(() => {
    if (validId) setPlatform(validId)
  }, [validId, setPlatform])

  if (!validId) return <Navigate to="/kakao" replace />

  const seo = SEO_MAP[validId]

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>
      <SimulatorPage />
    </>
  )
}
