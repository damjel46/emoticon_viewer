import type { PlatformId } from '../../config/platforms'
import soopLogo from '../../assets/logos/soop.png'
import naverLogo from '../../assets/logos/naver.jpg'

interface Props {
  id: PlatformId
  size?: number
  className?: string
}

export function PlatformLogo({ id, size = 28, className }: Props) {
  if (id === 'kakao') {
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" className={className}>
        <rect width="36" height="36" rx="8" fill="#FEE500" />
        <text
          x="18" y="25"
          textAnchor="middle"
          fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
          fontWeight="900"
          fontSize="8.5"
          fill="#3C1E1E"
          letterSpacing="-0.2"
        >KAKAO</text>
      </svg>
    )
  }

  if (id === 'ogq') {
    return (
      <img
        src={naverLogo}
        width={size}
        height={size}
        alt="Naver"
        className={className}
        style={{ borderRadius: size * 0.22, objectFit: 'cover' }}
      />
    )
  }

  if (id === 'youtube') {
    // YouTube: white bg, red rounded rect, white play triangle
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" className={className}>
        <rect width="36" height="36" rx="8" fill="white" />
        <rect x="3" y="9" width="30" height="18" rx="5" fill="#FF0000" />
        <polygon points="15,13 15,23 25,18" fill="white" />
      </svg>
    )
  }

  if (id === 'twitch') {
    // Twitch: purple bg, white Glitch chat-bubble icon
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" className={className}>
        <rect width="36" height="36" rx="8" fill="#9146FF" />
        {/* Glitch chat bubble */}
        <path d="M8,6 L8,22 L13,22 L13,27 L18,22 L24,22 L29,17 L29,6 Z" fill="white" />
        {/* Left eye bar */}
        <rect x="15" y="10" width="3" height="7" rx="0.5" fill="#9146FF" />
        {/* Right eye bar */}
        <rect x="21" y="10" width="3" height="7" rx="0.5" fill="#9146FF" />
      </svg>
    )
  }

  if (id === 'soop') {
    return (
      <img
        src={soopLogo}
        width={size}
        height={size}
        alt="SOOP"
        className={className}
        style={{ borderRadius: size * 0.22, objectFit: 'cover' }}
      />
    )
  }

  return null
}
