import { CHAT_THEMES, useThemeStore } from '../../store/themeStore'
import { ContrastBadge } from '../shared/ContrastBadge'
import clsx from 'clsx'
import type { ThemeKey } from '../../types'

const THEME_KEYS: ThemeKey[] = ['light', 'dark', 'pink', 'yellow', 'custom']

export function ThemeToolbar() {
  const { activeTheme, customBgColor, setTheme, setCustomBg, getCurrentTheme } = useThemeStore()
  const theme = getCurrentTheme()

  return (
    <div className="flex flex-col gap-2 px-4 py-3 bg-white border-b border-gray-100">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-500">테마:</span>
        {THEME_KEYS.map((key) => {
          const t = CHAT_THEMES[key]
          return (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={clsx(
                'px-3 py-1 rounded-full text-xs font-medium border-2 transition-all',
                activeTheme === key
                  ? 'border-[#3c1e1e] shadow-sm scale-105'
                  : 'border-transparent hover:border-gray-300'
              )}
              style={{ backgroundColor: t.bgColor, color: t.textColor }}
            >
              {t.labelKo}
            </button>
          )
        })}
        {activeTheme === 'custom' && (
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
      <ContrastBadge bgColor={theme.bgColor} />
    </div>
  )
}
