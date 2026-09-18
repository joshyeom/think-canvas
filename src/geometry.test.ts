import assert from 'node:assert/strict'
import { anchor, center, dropRect, facingSides, origins, overlaps } from './geometry.ts'

const parent = { x: 100, y: 100, width: 140, height: 44 }
for (const [point, expected] of [
  [{ x: 500, y: 122 }, 'l'],
  [{ x: -200, y: 122 }, 'r'],
  [{ x: 170, y: -200 }, 'b'],
  [{ x: 170, y: 500 }, 't'],
  [{ x: 400, y: 200 }, 'l'],
] as const) {
  const sides = facingSides(center(parent), point)
  assert.equal(sides.target, expected)
  assert.deepEqual(anchor(dropRect(point, sides.target), sides.target), point)
  // The drop coordinate is the receiving face, not a guessed top-left offset.
  // Both editing and display sizes must retain that anchor.
  for (const [width, height] of [[140, 44], [240, 180], [186, 45]]) {
    const origin = origins[sides.target]
    const child = { x: point.x - width * origin[0], y: point.y - height * origin[1], width, height }
    assert.deepEqual(anchor(child, sides.target), point)
    assert.deepEqual(facingSides(center(parent), center(child)), sides)
  }
}
// Moving a child across its parent must reverse the attachment faces.
assert.deepEqual(facingSides({ x: 0, y: 0 }, { x: -300, y: 20 }), { source: 'l', target: 'r' })
assert.deepEqual(facingSides({ x: 0, y: 0 }, { x: 20, y: 300 }), { source: 'b', target: 't' })
assert.equal(overlaps(parent, { x: 239, y: 120, width: 140, height: 44 }), true)
assert.equal(overlaps(parent, { x: 240, y: 120, width: 140, height: 44 }), false)
assert.equal(overlaps(parent, { x: 120, y: 144, width: 140, height: 44 }), false)
assert.equal(overlaps(parent, { x: 120, y: 110, width: 10, height: 10 }), true)
console.log('geometry.test.ts OK')
