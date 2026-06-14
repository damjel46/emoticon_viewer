import { useRef, useState, useImperativeHandle, forwardRef } from 'react'
import type { EmoticonFile, ContentSegment } from '../../types'

export interface MobileChatInputHandle {
  insertEmoticon: (emoticon: EmoticonFile, inlinePx: number) => void
  clear: () => void
}

interface Props {
  onSend: (segments: ContentSegment[]) => void
  placeholder?: string
  bgColor?: string
  textColor?: string
  inputBg?: string
  accentColor?: string
  className?: string
  children?: React.ReactNode // 추가 버튼 슬롯 (왼쪽)
  rightSlot?: React.ReactNode // 오른쪽 버튼 슬롯
}

function extractSegments(el: HTMLElement): ContentSegment[] {
  const segments: ContentSegment[] = []
  let currentText = ''

  const flush = () => {
    const t = currentText
    // 앞뒤 공백은 유지하되 완전히 빈 것만 무시
    if (t) segments.push({ kind: 'text', value: t })
    currentText = ''
  }

  const walk = (nodes: NodeList) => {
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        currentText += node.textContent ?? ''
      } else if ((node as Element).nodeName === 'IMG') {
        flush()
        const id = (node as HTMLElement).dataset.eid
        if (id) segments.push({ kind: 'emoticon', emoticonId: id })
      } else if ((node as Element).nodeName === 'BR') {
        currentText += ' '
      } else {
        walk(node.childNodes)
      }
    })
  }

  walk(el.childNodes)
  flush()

  // 앞뒤 텍스트 공백 정리
  const result: ContentSegment[] = []
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    if (seg.kind === 'text') {
      const trimmed = seg.value.trim()
      if (trimmed) result.push({ kind: 'text', value: trimmed })
    } else {
      result.push(seg)
    }
  }
  return result
}

function restoreCursorAfter(el: HTMLElement, target: Node) {
  const selection = window.getSelection()
  if (!selection) return
  const range = document.createRange()
  range.setStartAfter(target)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
  el.focus()
}

export const MobileChatInput = forwardRef<MobileChatInputHandle, Props>(
  (
    {
      onSend,
      placeholder = '메시지 입력',
      bgColor = '#ffffff',
      textColor = '#1a1a1a',
      inputBg = '#f3f4f6',
      children,
      rightSlot,
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const [hasContent, setHasContent] = useState(false)
    // 저장된 selection 범위 (피커 열릴 때 blur 전에 저장)
    const savedRange = useRef<Range | null>(null)

    useImperativeHandle(ref, () => ({
      insertEmoticon(emoticon: EmoticonFile, inlinePx: number) {
        const editor = editorRef.current
        if (!editor) return

        const img = document.createElement('img')
        img.src = emoticon.dataUrl
        img.dataset.eid = emoticon.id
        img.alt = emoticon.name
        img.style.cssText = `width:${inlinePx}px;height:${inlinePx}px;object-fit:contain;display:inline-block;vertical-align:middle;margin:0 1px;flex-shrink:0`

        // 저장된 커서 위치에 삽입, 없으면 끝에
        const sel = window.getSelection()
        if (savedRange.current) {
          sel?.removeAllRanges()
          sel?.addRange(savedRange.current)
        }

        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0)
          if (editor.contains(range.commonAncestorContainer)) {
            range.deleteContents()
            range.insertNode(img)
            restoreCursorAfter(editor, img)
          } else {
            editor.appendChild(img)
            restoreCursorAfter(editor, img)
          }
        } else {
          editor.appendChild(img)
          restoreCursorAfter(editor, img)
        }

        savedRange.current = null
        checkContent()
      },
      clear() {
        if (editorRef.current) editorRef.current.innerHTML = ''
        setHasContent(false)
      },
    }))

    const checkContent = () => {
      const editor = editorRef.current
      if (!editor) return
      const segs = extractSegments(editor)
      setHasContent(segs.length > 0)
    }

    const saveSelection = () => {
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        if (editorRef.current?.contains(range.commonAncestorContainer)) {
          savedRange.current = range.cloneRange()
        }
      }
    }

    const send = () => {
      const editor = editorRef.current
      if (!editor || !hasContent) return
      const segments = extractSegments(editor)
      if (segments.length === 0) return
      onSend(segments)
      editor.innerHTML = ''
      setHasContent(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        send()
      }
    }

    return (
      <div
        className="flex items-center gap-1.5 px-2 py-1.5"
        style={{ backgroundColor: bgColor }}
      >
        {children}

        {/* contentEditable 입력창 */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={checkContent}
          onKeyDown={handleKeyDown}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          data-placeholder={placeholder}
          className="flex-1 min-w-0 rounded-full px-3 py-1.5 text-sm outline-none overflow-hidden max-h-20 overflow-y-auto"
          style={{
            backgroundColor: inputBg,
            color: textColor,
            minHeight: '34px',
            lineHeight: '20px',
          }}
          // placeholder CSS는 tailwind에서 처리 안 되므로 인라인 스타일 + data attr 조합
        />

        {rightSlot}

        {/* 전송 버튼 */}
        <button
          onClick={send}
          disabled={!hasContent}
          className="flex-shrink-0 text-[11px] px-2.5 py-1.5 rounded-lg font-semibold text-white disabled:opacity-30 transition-opacity"
          style={{ backgroundColor: '#fee500', color: '#3c1e1e' }}
        >
          전송
        </button>
      </div>
    )
  }
)

MobileChatInput.displayName = 'MobileChatInput'
