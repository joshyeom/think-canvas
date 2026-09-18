type Point = { x: number; y: number }
export type Side = 't' | 'r' | 'b' | 'l'
export type Rect = Point & { width: number; height: number }

export const newNodeSize = { width: 186, height: 45 }

export function dropRect(point: Point, side: Side): Rect {
  const [x, y] = origins[side]
  return { x: point.x - newNodeSize.width * x, y: point.y - newNodeSize.height * y, ...newNodeSize }
}

export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
    a.y < b.y + b.height && a.y + a.height > b.y
}

export const origins: Record<Side, [number, number]> = {
  t: [0.5, 0], r: [1, 0.5], b: [0.5, 1], l: [0, 0.5],
}
const opposite: Record<Side, Side> = { t: 'b', b: 't', l: 'r', r: 'l' }

export function facingSides(source: Point, target: Point) {
  const dx = target.x - source.x
  const dy = target.y - source.y
  const from: Side = Math.abs(dx) > Math.abs(dy)
    ? (dx >= 0 ? 'r' : 'l')
    : (dy >= 0 ? 'b' : 't')
  return { source: from, target: opposite[from] }
}

export function center(rect: Rect): Point {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
}

export function anchor(rect: Rect, side: Side): Point {
  const [x, y] = origins[side]
  return { x: rect.x + rect.width * x, y: rect.y + rect.height * y }
}
