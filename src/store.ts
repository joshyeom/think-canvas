import type { Edge, Node } from '@xyflow/react'

export type ThoughtData = { text: string; seq: number; createdAt: number; editing?: boolean }
export type ThoughtNode = Node<ThoughtData, 'thought'>

export type Session = {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  nextSeq: number
  nodes: ThoughtNode[]
  edges: Edge[]
}

// ponytail: 전체 세션을 localStorage 키 하나에 저장. 텍스트 그래프라 수백 세션까지 문제없음.
// 용량 한계 오면 IndexedDB + 세션별 키로 이전.
const KEY = 'think-canvas:sessions'

export function loadSessions(): Session[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    // 과거 저장분에 남은 일시 상태(선택·편집) 제거
    return parsed.map((s: Session) => ({
      ...s,
      nodes: s.nodes.map(({ selected: _s, dragging: _d, ...n }) => ({
        ...n,
        data: { ...n.data, editing: undefined },
      })),
      // 핸들 4방향 도입 전 데이터: 기존 엣지는 아래(b)→위(t) 앵커 유지
      edges: s.edges.map(({ selected: _s, ...e }) => ({
        ...e,
        sourceHandle: e.sourceHandle ?? 'b',
        targetHandle: e.targetHandle ?? 't',
      })),
    }))
  } catch {
    return []
  }
}

/** 성공 여부 반환 — quota 초과(사파리 프라이빗, 저장공간 부족) 시 false */
export function saveSessions(sessions: Session[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(sessions))
    return true
  } catch {
    return false
  }
}

export function createSession(): Session {
  const now = Date.now()
  const d = new Date(now)
  return {
    id: crypto.randomUUID(),
    title: `${d.getMonth() + 1}/${d.getDate()} 생각`,
    createdAt: now,
    updatedAt: now,
    nextSeq: 1,
    nodes: [],
    edges: [],
  }
}
