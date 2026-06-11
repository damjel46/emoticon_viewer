import type { SpecWarning } from '../../types'

interface Props {
  warnings: SpecWarning[]
  fileName?: string
}

export function SpecReport({ warnings, fileName }: Props) {
  if (warnings.length === 0) {
    return (
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <span className="text-green-500 text-lg">✓</span>
        <div>
          <p className="text-sm font-semibold text-green-700">검사 통과</p>
          {fileName && <p className="text-xs text-green-500">{fileName}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-amber-500 text-lg">⚠</span>
        <p className="text-sm font-semibold text-amber-700">스펙 경고</p>
        {fileName && <span className="text-xs text-amber-500 ml-auto">{fileName}</span>}
      </div>
      <ul className="space-y-1">
        {warnings.map((w, i) => (
          <li key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
            <span className="flex-shrink-0 mt-0.5">•</span>
            <span>{w.message}</span>
          </li>
        ))}
      </ul>
      <p className="text-[10px] text-amber-500 mt-2">
        카카오 이모티콘 제안 기준: 360×360px, 최대 1MB, GIF/WEBP/PNG 형식
      </p>
    </div>
  )
}
