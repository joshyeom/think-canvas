import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from './Canvas'
import { I18nProvider, MULTILINGUAL_ENABLED, getInitialLocale, persistLocale, useI18n, type Locale } from './i18n'
import { SessionList } from './SessionList'
import { createSession, loadSessions, saveSessions, type Session } from './store'

export default function App() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    if (MULTILINGUAL_ENABLED) persistLocale(locale)
    document.documentElement.lang = locale
    document.title = locale === 'ko' ? '생각 캔버스' : 'Think Canvas'
  }, [locale])

  return (
    <I18nProvider locale={locale} setLocale={setLocale}>
      <AppContent />
    </I18nProvider>
  )
}

function AppContent() {
  const [sessions, setSessions] = useState<Session[]>(loadSessions)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [saveFailed, setSaveFailed] = useState(false)
  const sessionsRef = useRef(sessions)
  const { locale, t } = useI18n()

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
          {t.saveFailed}
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
            const s = createSession(locale)
            apply((ss) => [s, ...ss])
            setCurrentId(s.id)
          }}
          onDelete={(id) => apply((ss) => ss.filter((s) => s.id !== id))}
        />
      )}
    </>
  )
}
