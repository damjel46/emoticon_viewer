import { useState, useEffect } from 'react'
import { useEmoticonStore } from '../store/emoticonStore'
import { usePlatformStore } from '../store/platformStore'
import { DropZone } from '../components/grid/DropZone'
import { EmoticonGrid } from '../components/grid/EmoticonGrid'
import { ShopPreview } from '../components/grid/ShopPreview'
import { KeyboardTabView } from '../components/grid/KeyboardTabView'
import { Modal } from '../components/shared/Modal'

export function GridPage() {
  const { grid, accentColor, nameShort } = usePlatformStore((s) => s.getConfig())
  const [gridCount, setGridCount] = useState(grid.defaultCount)
  const [showShop, setShowShop] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const count = useEmoticonStore((s) => s.emoticons.length)

  // Reset count when platform changes
  useEffect(() => {
    setGridCount(grid.defaultCount)
  }, [grid.defaultCount])

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-800">그리드 콜라주 & 미리보기</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {nameShort} 이모티콘 세트의 색감과 균형을 확인하세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          {grid.showKeyboardTab && (
            <button
              onClick={() => setShowKeyboard(true)}
              className="text-sm border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-2 rounded-xl transition-colors"
            >
              ⌨️ 키보드 탭 보기
            </button>
          )}
          {grid.showShopPreview && (
            <button
              onClick={() => setShowShop(true)}
              className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors text-gray-900"
              style={{ backgroundColor: accentColor }}
            >
              {grid.shopPreviewLabel}
            </button>
          )}
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">
        <DropZone />

        {/* 세트 크기 토글 — countOptions가 있을 때만 표시 */}
        {grid.countOptions.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-600">세트 크기:</span>
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              {grid.countOptions.map((n) => (
                <button
                  key={n}
                  onClick={() => setGridCount(n)}
                  className="px-5 py-1.5 text-sm font-medium transition-colors"
                  style={
                    gridCount === n
                      ? { backgroundColor: '#3c1e1e', color: '#fff' }
                      : { backgroundColor: '#fff', color: '#4b5563' }
                  }
                >
                  {n}종
                </button>
              ))}
            </div>
            {count > 0 && (
              <span className="text-xs text-gray-400">
                {count}종 업로드됨 / {gridCount}종 기준
              </span>
            )}
          </div>
        )}

        {/* countOptions 없는 플랫폼 (YouTube, Twitch) 업로드 카운트 */}
        {grid.countOptions.length === 0 && count > 0 && (
          <p className="text-xs text-gray-400">{count}종 업로드됨 · 세트 수 제한 없음</p>
        )}

        {/* 그리드 */}
        {count > 0 ? (
          <EmoticonGrid columns={grid.gridColumns} />
        ) : (
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 text-sm">
            이모티콘을 업로드하면 그리드가 표시됩니다
          </div>
        )}
      </div>

      {showShop && (
        <Modal title={`${nameShort} 미리보기`} onClose={() => setShowShop(false)}>
          <ShopPreview />
        </Modal>
      )}

      {showKeyboard && (
        <Modal title="키보드 탭 아이콘 미리보기" onClose={() => setShowKeyboard(false)}>
          <div className="max-w-sm mx-auto">
            <KeyboardTabView />
          </div>
        </Modal>
      )}
    </div>
  )
}
