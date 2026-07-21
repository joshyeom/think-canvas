import { createContext } from 'react'

/** 변이 직전 스냅샷 푸시 — ThoughtNode(편집 시작)에서도 호출할 수 있게 컨텍스트로 노출 */
export const SnapshotContext = createContext<() => void>(() => {})
