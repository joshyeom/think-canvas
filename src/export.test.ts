// 실행: node src/export.test.ts  (Node 23.6+ 네이티브 TS)
import assert from 'node:assert'
import { toMarkdown } from './export.ts'
import type { Session } from './store.ts'

const t = new Date('2026-07-21T10:30:00').getTime()
const node = (id: string, seq: number, text: string, offsetMin = 0, kind?: 'branch' | 'exception') =>
  ({
    id,
    type: 'thought' as const,
    position: { x: 0, y: 0 },
    data: { text, seq, createdAt: t + offsetMin * 60000, kind },
  })

const base: Session = {
  id: 's1',
  title: '디버깅',
  createdAt: t,
  updatedAt: t,
  nextSeq: 4,
  nodes: [node('b', 2, '멀티\n라인', 1, 'branch'), node('a', 1, '느림')],
  edges: [
    { id: 'e1', source: 'a', target: 'b' },
    { id: 'e2', source: 'a', target: 'ghost' }, // 삭제된 노드 참조 — 제외돼야 함
  ],
}

assert.strictEqual(
  toMarkdown(base),
  [
    '# 디버깅 (2026-07-21)',
    '',
    '## 노드 (생성 순)',
    '1. [10:30] 느림',
    '2. [10:31] [분기] 멀티',
    '   라인',
    '',
    '## 연결',
    '1 → 2',
  ].join('\n'),
)

assert.strictEqual(
  toMarkdown({ ...base, nodes: [], edges: [] }),
  ['# 디버깅 (2026-07-21)', '', '## 노드 (생성 순)', '(없음)', '', '## 연결', '(없음)'].join('\n'),
)

console.log('export.test.ts OK')
