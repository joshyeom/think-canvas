import type { Session } from './store'

const pad = (n: number) => String(n).padStart(2, '0')
const time = (t: number) => {
  const d = new Date(t)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}
const date = (t: number) => {
  const d = new Date(t)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** 그래프를 AI가 바로 분석 가능한 md로 직렬화. seq(생성 순) + 연결이 사고 흐름 데이터. */
export function toMarkdown(s: Session): string {
  const nodes = [...s.nodes].sort((a, b) => a.data.seq - b.data.seq)
  const lines = [`# ${s.title} (${date(s.createdAt)})`, '', '## 노드 (생성 순)']

  if (nodes.length === 0) lines.push('(없음)')
  for (const n of nodes) {
    const text = n.data.text.trim() || '(빈 노드)'
    const [first, ...rest] = text.split('\n')
    lines.push(`${n.data.seq}. [${time(n.data.createdAt)}] ${first}`)
    for (const r of rest) lines.push(`   ${r}`)
  }

  lines.push('', '## 연결')
  const seqOf = new Map(s.nodes.map((n) => [n.id, n.data.seq]))
  const conns = s.edges
    .flatMap((e) => {
      const a = seqOf.get(e.source)
      const b = seqOf.get(e.target)
      return a != null && b != null ? [[a, b] as const] : []
    })
    .sort((x, y) => x[0] - y[0] || x[1] - y[1])
  if (conns.length === 0) lines.push('(없음)')
  for (const [a, b] of conns) lines.push(`${a} → ${b}`)

  return lines.join('\n')
}
