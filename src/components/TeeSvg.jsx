import { useId } from 'react'

/**
 * TeeSvg — the shared t-shirt mockup used in the Hero and the Designer.
 * Accepts a fill color, an optional uploaded image, and an optional SVG
 * design group rendered in the chest print area.
 *
 * Coordinate system: viewBox 400×460, shirt body spans x≈112–288.
 * The print area is centered on the chest, sized ≈57% of shirt body width —
 * matching a realistic 10–11" screen print on an 18" shirt — and positioned
 * about 30 SVG units below the collar opening so artwork doesn't crowd the neckline.
 */
const PRINT = { x: 150, y: 184, w: 100, h: 116 }

export default function TeeSvg({
  color = '#fbf8f3',
  imageSrc = null,
  design = null,
  className = '',
  showOnModel = false,
  imageScale = 1,
}) {
  const id = useId().replace(/:/g, '')

  // Scale the image around the print-area center so users can size art down
  // without moving its anchor point.
  const s = Math.max(0.3, Math.min(1, imageScale))
  const imgW = PRINT.w * s
  const imgH = PRINT.h * s
  const imgX = PRINT.x + (PRINT.w - imgW) / 2
  const imgY = PRINT.y + (PRINT.h - imgH) / 2

  return (
    <svg
      viewBox="0 0 400 460"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="T-shirt preview"
    >
      <defs>
        <linearGradient id={`shade-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
        <radialGradient id={`vlight-${id}`} cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`print-${id}`}>
          <rect x={PRINT.x} y={PRINT.y} width={PRINT.w} height={PRINT.h} rx="2" />
        </clipPath>
      </defs>

      {showOnModel && (
        <g>
          <circle cx="200" cy="210" r="180" fill="#f2ece0" />
          <ellipse cx="200" cy="90" rx="38" ry="42" fill="#e6b89c" />
          <path
            d="M160 78 Q160 46 200 46 Q240 46 240 80 Q236 66 220 60 Q210 72 190 72 Q176 72 166 66 Q162 72 160 78 Z"
            fill="#1a1f2b"
          />
          <rect x="186" y="122" width="28" height="24" fill="#d8a78a" />
          <path d="M80 210 Q70 260 78 330 L104 330 Q110 270 118 220 Z" fill="#e6b89c" />
          <path d="M320 210 Q330 260 322 330 L296 330 Q290 270 282 220 Z" fill="#e6b89c" />
          <rect x="160" y="400" width="30" height="60" fill="#0b0f17" />
          <rect x="210" y="400" width="30" height="60" fill="#0b0f17" />
        </g>
      )}

      {/* ── Shirt body ───────────────────────────────────────────── */}
      <g>
        <path
          d="
            M150 136
            C150 150 180 156 200 156
            C220 156 250 150 250 136
            L280 128
            L332 170
            L316 224
            L288 214
            L288 424
            L112 424
            L112 214
            L84 224
            L68 170
            L120 128 Z
          "
          fill={color}
          stroke="rgba(11,15,23,0.18)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        <path
          d="M150 136 C150 150 180 156 200 156 C220 156 250 150 250 136 L245 130 C238 144 220 148 200 148 C180 148 162 144 155 130 Z"
          fill="rgba(0,0,0,0.14)"
        />

        <rect x="112" y="360" width="176" height="64" fill={`url(#shade-${id})`} />
        <path d="M84 224 L68 170 L90 158 L100 214 Z" fill="rgba(0,0,0,0.08)" />
        <path d="M316 224 L332 170 L310 158 L300 214 Z" fill="rgba(0,0,0,0.08)" />
        <path d="M112 214 L118 230 L118 410 L112 410 Z" fill="rgba(0,0,0,0.05)" />
        <path d="M288 214 L282 230 L282 410 L288 410 Z" fill="rgba(0,0,0,0.05)" />
        <rect x="112" y="130" width="176" height="294" fill={`url(#vlight-${id})`} opacity="0.9" />

        <line x1="120" y1="416" x2="280" y2="416" stroke="rgba(11,15,23,0.18)" strokeWidth="0.7" strokeDasharray="2 3" />
        <line x1="120" y1="160" x2="90" y2="156" stroke="rgba(11,15,23,0.18)" strokeWidth="0.6" strokeDasharray="2 3" />
        <line x1="280" y1="160" x2="310" y2="156" stroke="rgba(11,15,23,0.18)" strokeWidth="0.6" strokeDasharray="2 3" />
      </g>

      {/* ── Print area ───────────────────────────────────────────── */}
      <g clipPath={`url(#print-${id})`}>
        {imageSrc && (
          <image
            href={imageSrc}
            x={imgX}
            y={imgY}
            width={imgW}
            height={imgH}
            preserveAspectRatio="xMidYMid meet"
          />
        )}
        {design && (
          <g transform={`translate(${PRINT.x + PRINT.w / 2} ${PRINT.y + PRINT.h / 2})`}>
            {design}
          </g>
        )}
      </g>
    </svg>
  )
}
