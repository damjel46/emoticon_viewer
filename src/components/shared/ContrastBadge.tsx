import { borderVisibilityWarning } from '../../utils/contrastCheck'

interface Props {
  bgColor: string
}

export function ContrastBadge({ bgColor }: Props) {
  const warning = borderVisibilityWarning(bgColor)

  if (!warning) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
        <span>✓</span>
        <span>테두리 가시성 양호</span>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
      <span className="flex-shrink-0 mt-0.5">⚠</span>
      <span>{warning}</span>
    </div>
  )
}
