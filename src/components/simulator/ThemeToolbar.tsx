import { useState } from 'react'
import { useThemeStore } from '../../store/themeStore'
import { usePlatformStore } from '../../store/platformStore'
import { useChatStore } from '../../store/chatStore'
import { useAuthStore } from '../../store/authStore'
import { ContrastBadge } from '../shared/ContrastBadge'
import { InfoModal } from '../shared/InfoModal'
import clsx from 'clsx'

export function ThemeToolbar() {
  const { activeTheme, customBgColor, setTheme, setCustomBg, getCurrentTheme, platformThemes } = useThemeStore()
  const accentColor = usePlatformStore((s) => s.getConfig().accentColor)
  const platformId = usePlatformStore((s) => s.activePlatform)
  const { miniEmoticonMode, setMiniEmoticonMode } = useChatStore()
  const profile = useAuthStore((s) => s.profile)
  const [showPremiumPopup, setShowPremiumPopup] = useState(false)
  const theme = getCurrentTheme()
  const isKakao = platformId === 'kakao'
  const isPremium = profile?.is_premium ?? false

  const hasCustomTheme = platformThemes.some((t) => t.key === 'custom')

  // Single locked theme — just show a label
  if (platformThemes.length === 1) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-100">
        <span className="text-xs text-gray-400">테마 고정됨:</span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: theme.bgColor, color: theme.textColor, border: `1px solid ${accentColor}` }}
        >
          {theme.labelKo}
        </span>
        <ContrastBadge bgColor={theme.bgColor} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 px-4 py-3 bg-white border-b border-gray-100">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-500">테마:</span>
        {platformThemes.map((t) => (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            className={clsx(
              'px-3 py-1 rounded-full text-xs font-medium border-2 transition-all',
              activeTheme === t.key
                ? 'shadow-sm scale-105'
                : 'border-transparent hover:border-gray-300'
            )}
            style={{
              backgroundColor: t.bgColor,
              color: t.textColor,
              borderColor: activeTheme === t.key ? accentColor : undefined,
            }}
          >
            {t.labelKo}
          </button>
        ))}
        {hasCustomTheme && activeTheme === 'custom' && (
          <div className="flex items-center gap-1.5 ml-1">
            <label className="text-xs text-gray-500">배경색:</label>
            <input
              type="color"
              value={customBgColor}
              onChange={(e) => setCustomBg(e.target.value)}
              className="w-7 h-7 rounded cursor-pointer border border-gray-200"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <ContrastBadge bgColor={theme.bgColor} />
        {isKakao && (
          <button
            onClick={() => isPremium ? setMiniEmoticonMode(!miniEmoticonMode) : setShowPremiumPopup(true)}
            className={clsx(
              'flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border-2 font-medium transition-all',
              miniEmoticonMode && isPremium
                ? 'border-[#fee500] bg-[#fee500] text-gray-800 shadow-sm scale-105'
                : 'border-transparent bg-gray-100 text-gray-500 hover:border-gray-300'
            )}
          >
            <span>🤏</span>
            미니 이모티콘 모드
            {!isPremium && <span className="text-[9px] bg-gray-300 text-gray-600 px-1.5 py-0.5 rounded-full ml-0.5">PRO</span>}
          </button>
        )}
        {showPremiumPopup && (
          <InfoModal title="⭐ 프리미엄 전용 기능" onClose={() => setShowPremiumPopup(false)}>
            <p className="text-sm text-gray-600 mb-4">
              카카오 미니 이모티콘 모드는 <span className="font-semibold text-gray-800">결제 후 사용</span>할 수 있습니다.
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-2">
              <p className="text-xs font-semibold text-amber-700 mb-3">프리미엄 혜택</p>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2 text-xs text-gray-700">
                  <span>🤏</span> 카카오 미니 이모티콘 모드
                </li>
                <li className="flex items-center gap-2 text-xs text-gray-700">
                  <span>☁️</span> 이모티콘 클라우드 저장
                </li>
                <li className="flex items-center gap-2 text-xs text-gray-700">
                  <span>📱</span> QR 코드로 모바일 미리보기
                </li>
                <li className="flex items-center gap-2 text-xs text-gray-700">
                  <span>🚫</span> 광고 제거
                </li>
              </ul>
            </div>
            <p className="text-xs text-gray-400 text-center">로그인 · 결제 서비스 오픈 준비 중입니다.</p>
          </InfoModal>
        )}
      </div>
    </div>
  )
}
