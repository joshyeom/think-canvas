import { useCallback, useRef, useState } from 'react'
import { Canvas } from './Canvas'
import { SessionList } from './SessionList'
import { createSession, loadSessions, saveSessions, type Session } from './store'

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(loadSessions)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [saveFailed, setSaveFailed] = useState(false)
  const sessionsRef = useRef(sessions)

  // 상태 갱신 + 동기 localStorage 저장 — pagehide flush 시점에도 유실 없음
  const apply = useCallback((fn: (ss: Session[]) => Session[]) => {
    const next = fn(sessionsRef.current)
    sessionsRef.current = next
    setSessions(next)
    setSaveFailed(!saveSessions(next))
  }, [])

  const patchCurrent = useCallback(
    (patch: Partial<Session>) => {
      apply((ss) =>
        ss.map((s) => (s.id === currentId ? { ...s, ...patch, updatedAt: Date.now() } : s)),
      )
    },
    [apply, currentId],
  )

  const current = sessions.find((s) => s.id === currentId)

  return (
    <>
      {saveFailed && (
        <div className="save-warn" role="alert">
          저장 실패 — 기기 저장공간을 확인하세요
        </div>
      )}
      {current ? (
        <Canvas
          key={current.id}
          session={current}
          onChange={patchCurrent}
          onBack={() => setCurrentId(null)}
        />
      ) : (
        <SessionList
          sessions={sessions}
          onOpen={setCurrentId}
          onCreate={() => {
            const s = createSession()
            apply((ss) => [s, ...ss])
            setCurrentId(s.id)
          }}
          onDelete={(id) => apply((ss) => ss.filter((s) => s.id !== id))}
        />
      )}
    </>
  )
}
