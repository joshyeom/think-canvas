import { getBezierPath, Position, useReactFlow, type ConnectionLineComponentProps } from '@xyflow/react'
import { anchor, center, dropRect, facingSides, overlaps } from './geometry'
import { useI18n, getDropPreviewLabel } from './i18n'

const positions = { t: Position.Top, r: Position.Right, b: Position.Bottom, l: Position.Left }

/** Preview uses the same receiving face and facing sides as the committed node/edge. */
export function ConnectionPreview({ fromNode, toNode, toX, toY }: ConnectionLineComponentProps) {
  const { getNodes, getInternalNode, flowToScreenPosition } = useReactFlow()
  const { locale } = useI18n()
  const parent = { ...fromNode.internals.positionAbsolute,
    width: fromNode.measured.width ?? 140, height: fromNode.measured.height ?? 44 }
  const point = { x: toX, y: toY }
  const sides = facingSides(center(parent), point)
  const screen = flowToScreenPosition(point)
  const onPane = !!document.elementFromPoint(screen.x, screen.y)?.closest('.react-flow__pane')
  const preview = dropRect(point, sides.target)
  const target = toNode ? { ...toNode.internals.positionAbsolute,
    width: toNode.measured.width ?? 140, height: toNode.measured.height ?? 44 } : null
  const edgeSides = target ? facingSides(center(parent), center(target)) : sides
  const start = anchor(parent, edgeSides.source)
  const end = target ? anchor(target, edgeSides.target) : point
  const [path] = getBezierPath({ sourceX: start.x, sourceY: start.y,
    targetX: end.x, targetY: end.y,
    sourcePosition: positions[edgeSides.source], targetPosition: positions[edgeSides.target] })
  const showNode = onPane && !toNode
  const overlapping = showNode && getNodes().some((node) => {
    const internal = getInternalNode(node.id)
    return !node.hidden && internal && overlaps(preview, {
      ...internal.internals.positionAbsolute,
      width: internal.measured.width ?? 140, height: internal.measured.height ?? 44,
    })
  })

  return (
    <g className={`connection-preview${overlapping ? ' is-overlapping' : ''}`} pointerEvents="none">
      <path className="react-flow__connection-path" d={path} fill="none" />
      {showNode && (
        <g className="drop-preview" aria-hidden="true">
          <rect x={preview.x} y={preview.y} width={preview.width} height={preview.height} rx={12} />
          <text x={preview.x + 12} y={preview.y + preview.height / 2} dominantBaseline="middle">
            {getDropPreviewLabel(locale, !!overlapping)}
          </text>
          <circle cx={point.x} cy={point.y} r={5} />
        </g>
      )}
    </g>
  )
}
