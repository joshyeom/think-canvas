import { useEffect, useState } from 'react'
import { IconCheck, IconPlus, IconTrash } from './icons'
import type { Session } from './store'

function relTime(t: number): string {
  const diff = Date.now() - t
  const min = Math.floor(diff / 60000)
  if (min < 1) return '방금'
  if (min < 60) return `${min}분 전`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}시간 전`
  const d = new Date(t)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export function SessionList({
  sessions,
  onOpen,
  onCreate,
  onDelete,
}: {
  sessions: Session[]
  onOpen: (id: string) => void
  onCreate: () => void
  onDelete: (id: string) => void
}) {
  // 삭제는 두 번 탭으로 확인 (모달 금지)
  const [armedId, setArmedId] = useState<string | null>(null)

  useEffect(() => {
    if (!armedId) return
    const t = setTimeout(() => setArmedId(null), 3000)
    return () => clearTimeout(t)
  }, [armedId])

  return (
    <div className="list-view">
      <header className="list-header">
        <h1>생각 캔버스</h1>
        <button type="button" className="icon-btn primary" aria-label="새 세션" onClick={onCreate}>
          <IconPlus />
        </button>
      </header>

      {sessions.length === 0 ? (
        <div className="empty">
          <p>사고 과정을 노드로 기록하고,</p>
          <p>md로 내보내 AI에게 피드백 받으세요.</p>
          <button type="button" className="icon-btn primary" aria-label="첫 세션 만들기" onClick={onCreate}>
            <IconPlus />
          </button>
        </div>
      ) : (
        <ul className="session-list">
          {sessions.map((s) => (
            <li key={s.id}>
              <button type="button" className="session-card" onClick={() => onOpen(s.id)}>
                <span className="session-title">{s.title}</span>
                <span className="session-meta">
                  노드 {s.nodes.length} · {relTime(s.updatedAt)}
                </span>
              </button>
              <button
                type="button"
                className={`btn-del ${armedId === s.id ? 'armed' : ''}`}
                aria-label={armedId === s.id ? '삭제 확인' : `${s.title} 삭제`}
                onClick={() => {
                  if (armedId === s.id) {
                    onDelete(s.id)
                    setArmedId(null)
                  } else {
                    setArmedId(s.id)
                  }
                }}
              >
                {armedId === s.id ? <IconCheck size={16} /> : <IconTrash size={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
