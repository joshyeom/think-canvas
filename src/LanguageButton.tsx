import { useEffect, useRef, useState } from 'react'
import { languageNames, useI18n, type Locale } from './i18n'
import { IconCheck, IconGlobe, IconX } from './icons'

const locales = Object.entries(languageNames) as [Locale, string][]

export function LanguageButton() {
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const hadOpenState = useRef(false)

  useEffect(() => {
    if (open) {
      closeRef.current?.focus()
      hadOpenState.current = true
      return
    }
    if (hadOpenState.current) triggerRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="icon-btn"
        aria-label={t.language}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <IconGlobe />
      </button>

      {open && (
        <div className="language-modal-backdrop" onPointerDown={() => setOpen(false)}>
          <section
            className="language-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="language-modal-title"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className="language-modal-header">
              <div>
                <h2 id="language-modal-title">{t.languageTitle}</h2>
                <p>{t.languageDescription}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="icon-btn"
                aria-label={t.close}
                onClick={() => setOpen(false)}
              >
                <IconX size={18} />
              </button>
            </div>
            <div className="language-options" role="listbox" aria-label={t.language}>
              {locales.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`language-option ${locale === value ? 'is-selected' : ''}`}
                  role="option"
                  aria-selected={locale === value}
                  onClick={() => {
                    setLocale(value)
                    setOpen(false)
                  }}
                >
                  <span>{label}</span>
                  {locale === value && <IconCheck size={18} />}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  )
}
