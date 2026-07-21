import type { ReactNode } from 'react'

function Svg({ size = 18, children }: { size?: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const IconBack = ({ size }: { size?: number }) => (
  <Svg size={size}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </Svg>
)

export const IconPlus = ({ size }: { size?: number }) => (
  <Svg size={size}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Svg>
)

export const IconTrash = ({ size }: { size?: number }) => (
  <Svg size={size}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </Svg>
)

export const IconExport = ({ size }: { size?: number }) => (
  <Svg size={size}>
    <path d="M12 15V3" />
    <path d="m7 8 5-5 5 5" />
    <path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
  </Svg>
)

export const IconCheck = ({ size }: { size?: number }) => (
  <Svg size={size}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
)

export const IconX = ({ size }: { size?: number }) => (
  <Svg size={size}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Svg>
)

export const IconSquare = ({ size }: { size?: number }) => (
  <Svg size={size}>
    <rect width="18" height="18" x="3" y="3" rx="4" />
  </Svg>
)

export const IconDiamond = ({ size }: { size?: number }) => (
  <Svg size={size}>
    <path d="M12 2.5 21.5 12 12 21.5 2.5 12Z" />
  </Svg>
)

export const IconAlert = ({ size }: { size?: number }) => (
  <Svg size={size}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 20h16a2 2 0 0 0 1.73-2Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </Svg>
)

export const IconCopy = ({ size }: { size?: number }) => (
  <Svg size={size}>
    <rect width="14" height="14" x="8" y="8" rx="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </Svg>
)

export const IconCut = ({ size }: { size?: number }) => (
  <Svg size={size}>
    <circle cx="6" cy="6" r="3" />
    <path d="M8.12 8.12 12 12" />
    <path d="M20 4 8.12 15.88" />
    <circle cx="6" cy="18" r="3" />
    <path d="M14.8 14.8 20 20" />
  </Svg>
)
