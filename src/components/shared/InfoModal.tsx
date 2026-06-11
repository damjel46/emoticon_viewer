interface Props {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export function InfoModal({ title, onClose, children }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>
        <div className="mb-5">{children}</div>
        <button
          onClick={onClose}
          className="w-full bg-[#3c1e1e] hover:bg-[#5c3333] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          확인
        </button>
      </div>
    </div>
  )
}
