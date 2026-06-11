import { useState, useCallback } from 'react'

interface UseDropZoneOptions {
  onFiles: (files: File[]) => void
  accept?: string[]
}

export function useDropZone({ onFiles, accept }: UseDropZoneOptions) {
  const [isDragging, setIsDragging] = useState(false)

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        accept ? accept.includes(f.type) : true
      )
      if (files.length > 0) onFiles(files)
    },
    [onFiles, accept]
  )

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []).filter((f) =>
        accept ? accept.includes(f.type) : true
      )
      if (files.length > 0) onFiles(files)
      e.target.value = ''
    },
    [onFiles, accept]
  )

  return { isDragging, onDragOver, onDragLeave, onDrop, onInputChange }
}
