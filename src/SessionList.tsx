import { useEffect, useState } from 'react'
import { formatRelativeTime, useI18n } from './i18n'
import { IconCheck, IconPlus, IconTrash } from './icons'
import { LanguageButton } from './LanguageButton'
import type { Session } from './store'

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
  const { locale, t } = useI18n()

  useEffect(() => {
    if (!armedId) return
    const t = setTimeout(() => setArmedId(null), 3000)
    return () => clearTimeout(t)
  }, [armedId])

  return (
    <div className="list-view">
      <header className="list-header">
        <h1>{t.appTitle}</h1>
        <div className="list-actions">
          <LanguageButton />
          <button type="button" className="icon-btn primary" aria-label={t.newSession} onClick={onCreate}>
            <IconPlus />
          </button>
        </div>
      </header>

      {sessions.length === 0 ? (
        <div className="empty">
          <p>{t.emptyLineOne}</p>
          <p>{t.emptyLineTwo}</p>
          <button type="button" className="icon-btn primary" aria-label={t.createFirstSession} onClick={onCreate}>
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
                  {t.nodeCount(s.nodes.length)} · {formatRelativeTime(s.updatedAt, locale)}
                </span>
              </button>
              <button
                type="button"
                className={`btn-del ${armedId === s.id ? 'armed' : ''}`}
                aria-label={armedId === s.id ? t.confirmDelete : t.deleteSession(s.title)}
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
