import { useState } from 'react'
import { useEmoticonStore } from '../store/emoticonStore'
import { DropZone } from '../components/grid/DropZone'
import { EmoticonGrid } from '../components/grid/EmoticonGrid'
import { ShopPreview } from '../components/grid/ShopPreview'
import { KeyboardTabView } from '../components/grid/KeyboardTabView'
import { Modal } from '../components/shared/Modal'

type GridMode = 24 | 32

export function GridPage() {
  const [gridMode, setGridMode] = useState<GridMode>(24)
  const [showShop, setShowShop] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const count = useEmoticonStore((s) => s.emoticons.length)

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-800">그리드 콜라주 & 샵 미리보기</h1>
          <p className="text-xs text-gray-400 mt-0.5">전체 이모티콘 세트의 색감과 균형을 확인하세요</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyboard(true)}
            className="text-sm border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-2 rounded-xl transition-colors"
          >
            ⌨️ 키보드 탭 보기
          </button>
          <button
            onClick={() => setShowShop(true)}
            className="text-sm bg-[#fee500] hover:bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            🏪 샵 미리보기
          </button>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">
        {/* 업로드 존 */}
        <DropZone />

        {/* 그리드 모드 토글 */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-600">세트 크기:</span>
          <div className="flex rounded-xl overflow-hidden border border-gray-200">
            {([24, 32] as GridMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setGridMode(mode)}
                className={`px-5 py-1.5 text-sm font-medium transition-colors ${
                  gridMode === mode
                    ? 'bg-[#3c1e1e] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {mode}종
              </button>
            ))}
          </div>
          {count > 0 && (
            <span className="text-xs text-gray-400">
              {count}종 업로드됨 / {gridMode}종 기준
            </span>
          )}
        </div>

        {/* 그리드 */}
        {count > 0 ? (
          <EmoticonGrid columns={gridMode === 32 ? 8 : 6} />
        ) : (
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 text-sm">
            이모티콘을 업로드하면 그리드가 표시됩니다
          </div>
        )}
      </div>

      {showShop && (
        <Modal title="카카오 이모티콘 샵 미리보기" onClose={() => setShowShop(false)}>
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
