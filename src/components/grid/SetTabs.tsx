import { useState, useRef, useEffect } from 'react'
import { useEmoticonStore, useActiveSets, useActiveSetId } from '../../store/emoticonStore'
import { usePlatformStore } from '../../store/platformStore'
import clsx from 'clsx'

export function SetTabs() {
  const sets = useActiveSets()
  const activeId = useActiveSetId()
  const { addSet, renameSet, deleteSet, switchSet } = useEmoticonStore()
  const accentColor = usePlatformStore((s) => s.getConfig().accentColor)
  const activePlatform = usePlatformStore((s) => s.activePlatform)

  useEffect(() => {
    if (sets.length === 0) addSet()
  }, [activePlatform])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingId])

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id)
    setEditValue(currentName)
  }

  const commitEdit = () => {
    if (editingId && editValue.trim()) {
      renameSet(editingId, editValue.trim())
    }
    setEditingId(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditingId(null)
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {sets.map((set) => {
        const isActive = set.id === activeId
        const isEditing = editingId === set.id

        return (
          <div
            key={set.id}
            className={clsx(
              'group relative flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium transition-all cursor-pointer select-none',
              isActive
                ? 'text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            )}
            style={isActive ? { backgroundColor: accentColor } : undefined}
            onClick={() => !isEditing && switchSet(set.id)}
            onDoubleClick={() => startEdit(set.id, set.name)}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                className="w-20 bg-transparent outline-none text-sm font-medium"
                style={{ color: isActive ? '#fff' : '#374151' }}
              />
            ) : (
              <span>{set.name}</span>
            )}

            <span
              className={clsx(
                'text-[10px] px-1 py-0.5 rounded-md font-normal',
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              )}
            >
              {set.emoticons.length}
            </span>

            {sets.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteSet(set.id)
                }}
                className={clsx(
                  'hidden group-hover:flex items-center justify-center w-3.5 h-3.5 rounded-full text-[9px] transition-colors',
                  isActive
                    ? 'bg-white/30 hover:bg-white/50 text-white'
                    : 'bg-gray-200 hover:bg-red-100 hover:text-red-500 text-gray-400'
                )}
                title="세트 삭제"
              >
                ✕
              </button>
            )}
          </div>
        )
      })}

      <button
        onClick={addSet}
        className="flex items-center justify-center w-8 h-8 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors text-base font-light"
        title="세트 추가"
      >
        +
      </button>

      {sets.length > 0 && (
        <span className="text-xs text-gray-400 ml-1">
          이름 변경: 탭 더블클릭
        </span>
      )}
    </div>
  )
}
