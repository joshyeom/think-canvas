import type { Session } from './store'
import { getReviewPrompt, type Locale } from './i18n.ts'

const pad = (n: number) => String(n).padStart(2, '0')
const time = (t: number) => {
  const d = new Date(t)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}
const date = (t: number) => {
  const d = new Date(t)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** 그래프를 AI가 바로 분석 가능한 프롬프트와 md로 직렬화. */
export function toMarkdown(s: Session, locale: Locale = 'ko'): string {
  const nodes = [...s.nodes].sort((a, b) => a.data.seq - b.data.seq)
  const prompt = getReviewPrompt(s.title, locale)
  const lines = [...prompt, `# ${s.title} (${date(s.createdAt)})`, '', locale === 'ko' ? '## 노드 (생성 순)' : '## Nodes (creation order)']

  if (nodes.length === 0) lines.push(locale === 'ko' ? '(없음)' : '(none)')
  const kindTag = locale === 'ko'
    ? { branch: '[분기] ', exception: '[예외] ' }
    : { branch: '[branch] ', exception: '[exception] ' }
  for (const n of nodes) {
    const text = n.data.text.trim() || (locale === 'ko' ? '(빈 노드)' : '(empty node)')
    const [first, ...rest] = text.split('\n')
    const tag = n.data.kind && n.data.kind !== 'note' ? kindTag[n.data.kind] : ''
    lines.push(`${n.data.seq}. [${time(n.data.createdAt)}] ${tag}${first}`)
    for (const r of rest) lines.push(`   ${r}`)
  }

  lines.push('', locale === 'ko' ? '## 연결' : '## Connections')
  const seqOf = new Map(s.nodes.map((n) => [n.id, n.data.seq]))
  const conns = s.edges
    .flatMap((e) => {
      const a = seqOf.get(e.source)
      const b = seqOf.get(e.target)
      return a != null && b != null ? [[a, b] as const] : []
    })
    .sort((x, y) => x[0] - y[0] || x[1] - y[1])
  if (conns.length === 0) lines.push(locale === 'ko' ? '(없음)' : '(none)')
  for (const [a, b] of conns) lines.push(`${a} → ${b}`)

  return lines.join('\n')
}
