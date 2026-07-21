import { createContext } from 'react'

/** 캔버스 오퍼레이션을 노드 컴포넌트에 노출 — 스냅샷(undo 지점)·복사·잘라내기 */
export type CanvasOps = {
  snapshot: () => void
  copyNode: (id: string) => void
  cutNode: (id: string) => void
}

export const CanvasOpsContext = createContext<CanvasOps>({
  snapshot: () => {},
  copyNode: () => {},
  cutNode: () => {},
})
