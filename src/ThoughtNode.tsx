import { memo, useContext, useEffect, useRef } from 'react'
import {
  Handle,
  NodeToolbar,
  Position,
  useReactFlow,
  type NodeProps,
} from '@xyflow/react'
import { CanvasOpsContext } from './history'
import { useI18n } from './i18n'
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
}: NodeProps<TN>) {
  const { setNodes, deleteElements, getViewport, setViewport } =
    useReactFlow()
  const { snapshot, copyNode, cutNode } = useContext(CanvasOpsContext)
  const { t } = useI18n()
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (data.editing && el) {
      el.focus({ preventScroll: true })
      el.setSelectionRange(el.value.length, el.value.length)
      autosize(el)
      // Pan only when a real soft keyboard reduces the visible viewport.
      const viewport = window.visualViewport
      if (!viewport || !window.matchMedia('(pointer: coarse)').matches) return
      const revealInput = () => {
        if (document.activeElement !== el || viewport.height >= window.innerHeight - 100) return
        const overflow = el.getBoundingClientRect().bottom -
          (viewport.offsetTop + viewport.height - 16)
        if (overflow > 0) {
          const vp = getViewport()
          setViewport({ ...vp, y: vp.y - overflow })
        }
      }
      viewport.addEventListener('resize', revealInput)
      revealInput()
      return () => viewport.removeEventListener('resize', revealInput)
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
      // 첫 클릭 = 선택, 선택된 노드 재클릭 = 편집. shift/cmd 클릭은 RF 다중선택에 양보.
      onClick={(e) => {
        if (data.editing || e.shiftKey || e.metaKey || e.ctrlKey) return
        if (selected) {
          snapshot() // 편집 전 텍스트를 undo 지점으로
          patch({ editing: true })
        } else {
          setNodes((ns) => ns.map((n) => ({ ...n, selected: n.id === id })))
        }
      }}
    >
      {/* pointerdown 처리: click을 기다리면 textarea blur → 편집 종료 → 버튼이 먼저 언마운트됨 */}
      <NodeToolbar isVisible={selected || !!data.editing} position={Position.Top} offset={8}>
        <div className="node-toolbar">
          <button
            type="button"
            className="node-tool"
            aria-label={t.copyNode}
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
            aria-label={t.cutNode}
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
            aria-label={t.deleteNode}
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
          placeholder={t.thoughtPlaceholder}
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
