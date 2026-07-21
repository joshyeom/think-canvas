import { memo, useContext, useEffect, useRef } from 'react'
import {
  Handle,
  NodeToolbar,
  Position,
  useReactFlow,
  type NodeProps,
} from '@xyflow/react'
import { CanvasOpsContext } from './history'
import { IconCopy, IconCut, IconTrash } from './icons'
import type { ThoughtNode as TN } from './store'

function autosize(el: HTMLTextAreaElement) {
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

export const ThoughtNode = memo(function ThoughtNode({
  id,
  data,
  selected,
  positionAbsoluteX,
  positionAbsoluteY,
}: NodeProps<TN>) {
  const { setNodes, deleteElements, flowToScreenPosition, getViewport, setViewport } =
    useReactFlow()
  const { snapshot, copyNode, cutNode } = useContext(CanvasOpsContext)
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (data.editing && el) {
      el.focus()
      el.setSelectionRange(el.value.length, el.value.length)
      autosize(el)
      // 하단 노드 편집 시 소프트 키보드에 가리지 않게 화면 위쪽 40% 안으로 패닝
      const p = flowToScreenPosition({ x: positionAbsoluteX, y: positionAbsoluteY })
      const limit = window.innerHeight * 0.4
      if (p.y > limit) {
        const vp = getViewport()
        setViewport({ ...vp, y: vp.y - (p.y - limit) }, { duration: 200 })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 편집 진입 시 1회만
  }, [data.editing])

  const patch = (p: Partial<TN['data']>) =>
    setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...p } } : n)))

  const finish = () => {
    // 빈 노드는 실수로 만든 것 — 정리
    if (!data.text.trim()) deleteElements({ nodes: [{ id }] })
    else patch({ editing: false })
  }

  return (
    <div
      className={`thought kind-${data.kind ?? 'note'} ${selected ? 'is-selected' : ''}`}
      onClick={() => {
        if (!data.editing) {
          snapshot() // 편집 전 텍스트를 undo 지점으로
          patch({ editing: true })
        }
      }}
    >
      {/* pointerdown 처리: click을 기다리면 textarea blur → 편집 종료 → 버튼이 먼저 언마운트됨 */}
      <NodeToolbar isVisible={selected || !!data.editing} position={Position.Top} offset={8}>
        <div className="node-toolbar">
          <button
            type="button"
            className="node-tool"
            aria-label="복사"
            onPointerDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              copyNode(id)
            }}
          >
            <IconCopy size={13} />
          </button>
          <button
            type="button"
            className="node-tool"
            aria-label="잘라내기"
            onPointerDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              cutNode(id)
            }}
          >
            <IconCut size={13} />
          </button>
          <button
            type="button"
            className="node-tool danger"
            aria-label="노드 삭제"
            onPointerDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              deleteElements({ nodes: [{ id }] })
            }}
          >
            <IconTrash size={13} />
          </button>
        </div>
      </NodeToolbar>

      {/* 4방향 핸들 — Loose 모드라 전부 출발·도착 겸용 */}
      <Handle id="t" type="source" position={Position.Top} />
      <Handle id="r" type="source" position={Position.Right} />
      <Handle id="l" type="source" position={Position.Left} />
      {data.editing ? (
        <textarea
          ref={ref}
          className="nodrag nopan nowheel"
          value={data.text}
          rows={1}
          placeholder="생각 입력…"
          onChange={(e) => {
            patch({ text: e.target.value })
            autosize(e.target)
          }}
          onBlur={finish}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || (e.key === 'Enter' && (e.metaKey || e.ctrlKey))) {
              e.currentTarget.blur()
            }
          }}
        />
      ) : (
        <div className="thought-text">{data.text}</div>
      )}
      <Handle id="b" type="source" position={Position.Bottom} />
      {/* export의 "n." 번호와 캔버스 노드를 매핑하는 시각 배지 */}
      <span className="seq" aria-hidden="true">
        {data.seq}
      </span>
    </div>
  )
})
