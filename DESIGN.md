# Design

## Theme

Light 단일 테마. 장면: 밝은 책상·주간 이동 중 — 흰 종이 필드 노트.
색 전략: **Restrained** — 순백 배경, 앰버 프라이머리 하나만 절제 사용.

## Colors (OKLCH)

```css
:root {
  --bg: oklch(1 0 0);                    /* pure white */
  --surface: oklch(0.965 0.004 75);      /* 툴바·패널·세션 카드 */
  --ink: oklch(0.24 0.015 75);           /* 본문. vs bg ≥ 7:1 */
  --muted: oklch(0.49 0.012 75);         /* 보조 텍스트. vs bg ≥ 4.5:1 */
  --primary: oklch(0.62 0.13 70);        /* deep amber. 주요 액션·선택 상태. 위 텍스트는 흰색 */
  --primary-soft: oklch(0.93 0.045 75);  /* 선택 노드 배경 틴트 */
  --accent: oklch(0.45 0.09 230);        /* slate blue. 링크·엣지 하이라이트 */
  --border: oklch(0.88 0.008 75);
  --danger: oklch(0.55 0.19 25);         /* 삭제 */
}
```

- 앰버는 액션·선택에만. 장식 금지.
- 노드: 흰 배경 + `--border` 1px + 미세 그림자. 선택 시 `--primary` 2px ring + `--primary-soft` 배경.
- 엣지: `--muted` 계열 선, 화살표 마커.

## Typography

- 시스템 스택 단일 패밀리: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` + 한글 `"Apple SD Gothic Neo", "Noto Sans KR"`
- 고정 rem 스케일, ratio ~1.2: 13px(보조) / 15px(본문·노드) / 18px(세션 제목) / 22px(뷰 제목)
- 노드 텍스트 15px, line-height 1.5

## Layout

- 두 뷰: 세션 목록 ↔ 캔버스. 라우터 없음.
- 캔버스: 풀스크린. 상단 얇은 바(뒤로·제목·export), 하단 우측 FAB(노드 추가) — 엄지 존.
- 터치 타깃 최소 44px.

## Motion

- 150–200ms, ease-out. 상태 전달만: 노드 생성 스케일-인, 선택 링, 토스트.
- `prefers-reduced-motion: reduce` → transition 제거.

## Components

- 버튼: radius 10px, primary(앰버+흰 텍스트) / ghost(잉크 텍스트) 두 종류만.
- 토스트: export 복사 확인용, 하단 중앙.
- 빈 상태: 세션 없음·노드 없음 각각 한 줄 안내 + 액션.
