import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react'
import { useI18n } from './i18n'
import { IconX } from './icons'

/** 기본 엣지 + 선택 시 중앙 삭제 버튼 — 터치에서 엣지를 지울 유일한 수단 */
export function ThoughtEdge({
  id,
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
