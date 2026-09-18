import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Position,
  useInternalNode,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react'
import { useI18n } from './i18n'
import { IconX } from './icons'
import { anchor, center, facingSides } from './geometry'

const positions = { t: Position.Top, r: Position.Right, b: Position.Bottom, l: Position.Left }

/** 기본 엣지 + 선택 시 중앙 삭제 버튼 — 터치에서 엣지를 지울 유일한 수단 */
export function ThoughtEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  markerEnd,
  style,
}: EdgeProps) {
  const { deleteElements } = useReactFlow()
  const { t } = useI18n()
  const sourceNode = useInternalNode(source)
  const targetNode = useInternalNode(target)
  if (sourceNode?.measured.width && sourceNode.measured.height &&
      targetNode?.measured.width && targetNode.measured.height) {
    const sourceRect = { ...sourceNode.internals.positionAbsolute,
      width: sourceNode.measured.width, height: sourceNode.measured.height }
    const targetRect = { ...targetNode.internals.positionAbsolute,
      width: targetNode.measured.width, height: targetNode.measured.height }
    const sides = facingSides(center(sourceRect), center(targetRect))
    const start = anchor(sourceRect, sides.source)
    const end = anchor(targetRect, sides.target)
    sourceX = start.x
    sourceY = start.y
    targetX = end.x
    targetY = end.y
    sourcePosition = positions[sides.source]
    targetPosition = positions[sides.target]
  }
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      {selected && (
        <EdgeLabelRenderer>
          <button
            type="button"
            className="edge-del nodrag nopan"
            aria-label={t.deleteEdge}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation()
              deleteElements({ edges: [{ id }] })
            }}
          >
            <IconX size={13} />
          </button>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
