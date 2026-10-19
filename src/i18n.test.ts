// 실행: node --experimental-strip-types src/i18n.test.ts
import assert from 'node:assert'
import { getInitialLocale } from './i18n.ts'

const setup = (saved: string | null, language: string) => {
  Object.defineProperty(globalThis, 'localStorage', { value: { getItem: () => saved }, configurable: true })
  Object.defineProperty(globalThis, 'navigator', { value: { language }, configurable: true })
}

setup('en', 'ko-KR')
assert.equal(getInitialLocale(), 'en') // 저장값 우선

setup('ja', 'ko-KR')
assert.equal(getInitialLocale(), 'ko') // 비활성 언어 저장값 → navigator 기준
setup('ja', 'ja-JP')
assert.equal(getInitialLocale(), 'en') // ko 외는 모두 en

setup(null, 'ko')
assert.equal(getInitialLocale(), 'ko')
setup(null, 'en-US')
assert.equal(getInitialLocale(), 'en')

console.log('i18n.test.ts OK')
