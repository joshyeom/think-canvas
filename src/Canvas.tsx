import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type FinalConnectionState,
} from '@xyflow/react'
import { toMarkdown } from './export'
import { ConnectionPreview } from './ConnectionPreview'
import { center, facingSides, origins } from './geometry'
import { CanvasOpsContext } from './history'
import { useI18n } from './i18n'
import { IconBack, IconCheck, IconCopy, IconPlus, IconUndo, IconX } from './icons'
import { LanguageButton } from './LanguageButton'
import { ThoughtEdge } from './ThoughtEdge'
import { ThoughtNode } from './ThoughtNode'
import type { NodeKind, Session, ThoughtNode as TN } from './store'

const nodeTypes = { thought: ThoughtNode }
// 'default' 오버라이드 — 기존 저장 엣지(type 없음)도 커스텀 엣지로 렌더
const edgeTypes = { default: ThoughtEdge }

const defaultEdgeOptions = {
  markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
}

// 데스크톱(마우스·트랙패드): 빈 곳 드래그 = 박스 선택, 팬은 스크롤·중간/우클릭 드래그.
// 터치(폰): 드래그 = 팬 유지 — 한 손 조작이 코어 시나리오.
const finePointer = window.matchMedia('(pointer: fine)').matches

type Props = {
  session: Session
  onChange: (patch: Partial<Session>) => void
  onBack: () => void
}

/** 저장 전 일시 상태(선택·편집·드래그) 제거 */
function stripTransient(nodes: TN[], edges: Edge[]) {
  return {
    nodes: nodes.map(({ selected: _s, dragging: _d, ...n }) => ({
      ...n,
      data: { ...n.data, editing: undefined },
    })),
    edges: edges.map(({ selected: _s, ...e }) => e),
  }
}

function CanvasInner({ session, onChange, onBack }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<TN>(session.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(session.edges)
  const nextSeq = useRef(session.nextSeq)
  const { screenToFlowPosition, deleteElements } = useReactFlow()
  const [toast, setToast] = useState<'' | 'ok' | 'fail'>('')
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [canUndo, setCanUndo] = useState(false)
  const { locale, t } = useI18n()

  // 그래프 변경을 상위(localStorage)로 디바운스 반영
  useEffect(() => {
    const t = setTimeout(
      () => onChange({ ...stripTransient(nodes, edges), nextSeq: nextSeq.current }),
      400,
    )
    return () => clearTimeout(t)
  }, [nodes, edges, onChange])

  // 마지막 변경 flush — 언마운트(뒤로가기)·백그라운드 전환(iOS 타이머 정지) 시 유실 방지
  const latest = useRef({ nodes, edges })
  latest.current = { nodes, edges }
  useEffect(() => {
    const flush = () => {
      const { nodes, edges } = latest.current
      onChange({ ...stripTransient(nodes, edges), nextSeq: nextSeq.current })
    }
    const onVis = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVis)
      flush()
    }
  }, [onChange])

  const showToast = (msg: 'ok' | 'fail') => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2200)
  }

  // undo 히스토리 + 내부 클립보드. 변이 직전 snapshot() 호출이 계약.
  // ponytail: redo 없음·스냅샷 100개 상한 — 필요해지면 확장.
  const past = useRef<{ nodes: TN[]; edges: Edge[] }[]>([])
  const clip = useRef<{ nodes: TN[]; edges: Edge[] } | null>(null)
  const snapshot = useCallback(() => {
    past.current.push({ nodes: latest.current.nodes, edges: latest.current.edges })
    if (past.current.length > 100) past.current.shift()
    setCanUndo(true)
  }, [])

  const undo = useCallback(() => {
    const prev = past.current.pop()
    if (!prev) return false
    setNodes(prev.nodes)
    setEdges(prev.edges)
    setCanUndo(past.current.length > 0)
    return true
  }, [setNodes, setEdges])

  // 노드들을 내부 클립보드로 (엣지는 복사 대상 노드 사이 것만)
  const [hasClip, setHasClip] = useState(false)
  const copyNodes = useCallback((ids: string[]) => {
    const set = new Set(ids)
    clip.current = {
      nodes: latest.current.nodes.filter((n) => set.has(n.id)),
      edges: latest.current.edges.filter((ed) => set.has(ed.source) && set.has(ed.target)),
    }
    setHasClip(true)
  }, [])

  const pasteClipboard = useCallback(() => {
    if (!clip.current) return
    snapshot()
    const idMap = new Map(clip.current.nodes.map((n) => [n.id, crypto.randomUUID()]))
    const now = Date.now()
    const pasted = clip.current.nodes.map((n) => ({
      ...n,
      id: idMap.get(n.id)!,
      position: { x: n.position.x + 24, y: n.position.y + 24 },
      selected: true,
      data: { ...n.data, seq: nextSeq.current++, createdAt: now, editing: false },
    }))
    const pastedEdges = clip.current.edges.map((ed) => ({
      ...ed,
      id: crypto.randomUUID(),
      source: idMap.get(ed.source)!,
      target: idMap.get(ed.target)!,
      selected: false,
    }))
    setNodes((ns) => [...ns.map((n) => ({ ...n, selected: false })), ...pasted])
    setEdges((es) => [...es, ...pastedEdges])
  }, [snapshot, setNodes, setEdges])

  // Cmd/Ctrl + C·X·V·Z — 텍스트 입력 중엔 브라우저 기본 동작에 양보
  useEffect(() => {
    const isEditable = (t: EventTarget | null) =>
      t instanceof HTMLElement &&
      (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || isEditable(e.target)) return
      const key = e.key.toLowerCase()
      if (key === 'c' || key === 'x') {
        const sel = latest.current.nodes.filter((n) => n.selected)
        if (sel.length === 0) return
        const ids = new Set(sel.map((n) => n.id))
        copyNodes(sel.map((n) => n.id))
        if (key === 'x') {
          snapshot()
          setNodes((ns) => ns.filter((n) => !ids.has(n.id)))
          setEdges((es) => es.filter((ed) => !ids.has(ed.source) && !ids.has(ed.target)))
        }
        e.preventDefault()
      } else if (key === 'v') {
        if (!clip.current) return
        pasteClipboard()
        e.preventDefault()
      } else if (key === 'z' && !e.shiftKey) {
        if (undo()) e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setNodes, setEdges, snapshot, undo, copyNodes, pasteClipboard])

  const addNode = useCallback(
    (position?: { x: number; y: number }, kind: NodeKind = 'note') => {
      snapshot()
      const node: TN = {
        id: crypto.randomUUID(),
        type: 'thought',
        // 연속 추가 시 겹침 방지 — seq 기반 소량 산개
        position:
          position ??
          screenToFlowPosition({
            x: window.innerWidth / 2 + ((nextSeq.current % 3) - 1) * 48,
            y: window.innerHeight * 0.4 + (nextSeq.current % 4) * 32,
          }),
        data: { text: '', seq: nextSeq.current++, createdAt: Date.now(), kind, editing: true },
      }
      setNodes((ns) => [...ns, node])
    },
    [screenToFlowPosition, setNodes, snapshot],
  )

  const [fabOpen, setFabOpen] = useState(false)
  const pickKind = (kind: NodeKind) => {
    setFabOpen(false)
    addNode(undefined, kind)
  }

  // 빈 곳 더블탭 → 그 자리에 노드 (RF에 pane 더블클릭 이벤트가 없어 직접 감지)
  const lastTap = useRef({ t: 0, x: 0, y: 0 })
  const onPaneClick = useCallback(
    (e: React.MouseEvent) => {
      setFabOpen(false)
      const now = Date.now()
      const { t, x, y } = lastTap.current
      if (now - t < 350 && Math.hypot(e.clientX - x, e.clientY - y) < 40) {
        addNode(screenToFlowPosition({ x: e.clientX, y: e.clientY }))
        lastTap.current = { t: 0, x: 0, y: 0 }
      } else {
        lastTap.current = { t: now, x: e.clientX, y: e.clientY }
      }
    },
    [addNode, screenToFlowPosition],
  )

  const onConnect = useCallback(
    (c: Connection) => {
      snapshot()
      setEdges((es) => addEdge(c, es))
    },
    [setEdges, snapshot],
  )

  // RF 내부 삭제(Backspace·deleteElements) 직전 훅 — undo 스냅샷 지점
  const onBeforeDelete = useCallback(async () => {
    snapshot()
    return true
  }, [snapshot])

  // 노드 툴바(복사·잘라내기)용 오퍼레이션 — 삭제는 deleteElements 경유라 스냅샷 자동
  const ops = useMemo(
    () => ({
      snapshot,
      copyNode: (id: string) => copyNodes([id]),
      cutNode: (id: string) => {
        copyNodes([id])
        deleteElements({ nodes: [{ id }] })
      },
    }),
    [snapshot, copyNodes, deleteElements],
  )

  // 핸들 드래그를 빈 곳에 놓으면 그 자리에 새 노드 + 자동 연결
  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, state: FinalConnectionState) => {
      if (state.isValid || !state.fromNode || state.toNode) return
      const { clientX, clientY } =
        'changedTouches' in event ? event.changedTouches[0] : event
      // Touch events retain their starting target; hit-test the release point.
      if (!document.elementFromPoint(clientX, clientY)?.closest('.react-flow__pane')) return
      const pos = screenToFlowPosition({ x: clientX, y: clientY })
      const parent = state.fromNode
      const sides = facingSides(center({
        ...parent.internals.positionAbsolute,
        width: parent.measured.width ?? 140,
        height: parent.measured.height ?? 44,
      }), pos)
      snapshot()
      const id = crypto.randomUUID()
      const node: TN = {
        id,
        type: 'thought',
        position: pos,
        // Keep the receiving face at the drop point, even as text changes size.
        origin: origins[sides.target],
        data: { text: '', seq: nextSeq.current++, createdAt: Date.now(), editing: true },
      }
      setNodes((ns) => [...ns, node])
      setEdges((es) =>
        addEdge(
          {
            source: state.fromNode!.id,
            target: id,
            sourceHandle: sides.source,
            targetHandle: sides.target,
          },
          es,
        ),
      )
    },
    [screenToFlowPosition, setNodes, setEdges, snapshot],
  )

  const currentMd = () => toMarkdown({ ...session, nodes, edges }, locale)

  const doCopy = async () => {
    const md = currentMd()
    try {
      await navigator.clipboard.writeText(md)
      showToast('ok')
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = md
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      let copied = false
      try {
        textarea.select()
        copied = document.execCommand('copy')
      } catch {
        copied = false
      } finally {
        textarea.remove()
      }
      showToast(copied ? 'ok' : 'fail')
    }
  }

  return (
    <div className="canvas-view">
      <header className="topbar">
        <button type="button" className="icon-btn" aria-label={t.goToSessionList} onClick={onBack}>
          <IconBack />
        </button>
        <input
          className="title-input"
          value={session.title}
          aria-label={t.sessionTitle}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <LanguageButton />
        <button type="button" className="icon-btn" aria-label={t.undo} onClick={undo} disabled={!canUndo}>
          <IconUndo />
        </button>
        <button type="button" className="icon-btn primary" aria-label={t.copyPrompt} onClick={doCopy}>
          <IconCopy />
        </button>
      </header>

      <CanvasOpsContext.Provider value={ops}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        connectionLineComponent={ConnectionPreview}
        onPaneClick={onPaneClick}
        onBeforeDelete={onBeforeDelete}
        onNodeDragStart={snapshot}
        onSelectionDragStart={snapshot}
        selectionOnDrag={finePointer}
        selectionMode={SelectionMode.Partial}
        panOnDrag={finePointer ? [1, 2] : true}
        panOnScroll={finePointer}
        isValidConnection={(c) => c.source !== c.target}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={defaultEdgeOptions}
        deleteKeyCode={['Backspace', 'Delete']}
        zoomOnDoubleClick={false}
        fitView
        fitViewOptions={{ padding: 0.3, maxZoom: 1 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.5} />
      </ReactFlow>
      </CanvasOpsContext.Provider>

      {nodes.length === 0 && (
        <p className="canvas-hint">{t.canvasHint}</p>
      )}

      {fabOpen && (
        <div className="fab-menu" role="menu">
          <button type="button" className="fab-option" onClick={() => pickKind('note')}>
            <span className="kind-swatch swatch-note" aria-hidden="true" />
            {t.note}
          </button>
          <button type="button" className="fab-option" onClick={() => pickKind('branch')}>
            <span className="kind-swatch swatch-branch" aria-hidden="true" />
            {t.branch}
          </button>
          <button type="button" className="fab-option" onClick={() => pickKind('exception')}>
            <span className="kind-swatch swatch-exception" aria-hidden="true" />
            {t.exception}
          </button>
          {hasClip && (
            <button
              type="button"
              className="fab-option"
              onClick={() => {
                setFabOpen(false)
                pasteClipboard()
              }}
            >
              <span className="kind-swatch swatch-paste" aria-hidden="true" />
              {t.paste}
            </button>
          )}
        </div>
      )}
      <button
        type="button"
        className={`fab ${fabOpen ? 'open' : ''}`}
        aria-label={t.addNode}
        aria-expanded={fabOpen}
        onClick={() => setFabOpen((o) => !o)}
      >
        <IconPlus size={22} />
      </button>

      {toast && (
        <div className={`toast ${toast}`} role="status" aria-label={toast === 'ok' ? t.copied : t.copyFailed}>
          {toast === 'ok' ? <IconCheck /> : <IconX />}
          <span>{toast === 'ok' ? t.copied : t.copyFailed}</span>
        </div>
      )}
    </div>
  )
}

export function Canvas(props: Props) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  )
}
