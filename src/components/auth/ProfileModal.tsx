import { useState } from 'react'
import { useProfileStore } from '../../store/profileStore'
import { useAuthStore } from '../../store/authStore'

interface Props {
  onClose: () => void
}

export function ProfileModal({ onClose }: Props) {
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const displayName = useProfileStore((s) => s.displayName)
  const setDisplayName = useProfileStore((s) => s.setDisplayName)
  const [name, setName] = useState(displayName)

  const handleSave = () => {
    setDisplayName(name.trim())
    onClose()
  }

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">프로필 설정</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* 이메일 표시 */}
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
          <p className="text-[10px] text-gray-400 mb-0.5">계정</p>
          <p className="text-sm text-gray-700 font-medium">{user?.email}</p>
        </div>

        {/* 표시 이름 */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            표시 이름 <span className="text-gray-400 font-normal">(스토어 미리보기에 사용됩니다)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="이름을 입력하세요"
            maxLength={20}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[#3c1e1e] hover:bg-[#5c3333] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors mb-3"
        >
          저장
        </button>

        <button
          onClick={handleSignOut}
          className="w-full text-gray-400 hover:text-gray-600 text-xs py-1.5 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
