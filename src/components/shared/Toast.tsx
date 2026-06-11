import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

interface Props {
  message: string
  type?: 'success' | 'warning' | 'error' | 'info'
  onDismiss: () => void
  duration?: number
}

export function Toast({ message, type = 'info', onDismiss, duration = 3000 }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration)
    return () => clearTimeout(t)
  }, [onDismiss, duration])

  return createPortal(
    <div
      className={clsx(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm text-center',
        type === 'success' && 'bg-green-500 text-white',
        type === 'warning' && 'bg-amber-400 text-gray-900',
        type === 'error' && 'bg-red-500 text-white',
        type === 'info' && 'bg-gray-800 text-white'
      )}
    >
      {message}
    </div>,
    document.body
  )
}
