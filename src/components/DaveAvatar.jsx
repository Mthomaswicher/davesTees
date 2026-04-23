import { useEffect, useRef } from 'react'
import './DaveAvatar.css'

/**
 * 3D-cartoon avatar of Dave — an illustrated vector portrait built from
 * gradient-shaded shapes so it reads with that "rendered character" depth
 * (highlights on the scalp, shadow on the jaw, glossy eye catchlights)
 * without needing a bitmap.
 *
 * Microinteractions:
 *   • Idle: gentle float + periodic blink every 4–6 seconds.
 *   • Hover: head parallaxes toward the cursor; eyes track the pointer
 *     within a small range so he feels present rather than frozen.
 *   • Click: a quick nod (smile-to-camera animation).
 */
export default function DaveAvatar() {
  const wrapRef = useRef(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const onMove = (e) => {
      // Track pointer anywhere in the viewport, not just over the avatar,
      // so he looks around as the user browses.
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / 220  // normalize by a reasonable radius
      const dy = (e.clientY - cy) / 220
      const clamp = (v) => Math.max(-1, Math.min(1, v))
      el.style.setProperty('--look-x', clamp(dx).toFixed(3))
      el.style.setProperty('--look-y', clamp(dy).toFixed(3))
    }

    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const onClick = () => {
    const el = wrapRef.current
    if (!el) return
    el.classList.remove('nod')
    void el.offsetWidth  // restart animation
    el.classList.add('nod')
  }

  return (
    <div
      ref={wrapRef}
      className="dave-avatar"
      onClick={onClick}
      role="img"
      aria-label="3D cartoon illustration of Dave, owner of Zakjahnai Tees"
    >
      <svg viewBox="0 0 240 260" className="dave-avatar-svg">
        <defs>
          {/* Backdrop — warm sunset disc */}
          <radialGradient id="dv-bg" cx="35%" cy="28%" r="85%">
            <stop offset="0%"  stopColor="#ffd66b" />
            <stop offset="55%" stopColor="#ff5a3c" />
            <stop offset="100%" stopColor="#cc2a10" />
          </radialGradient>

          {/* Skin — warm weathered brown with a bit more saturation in the
              midtones than the younger-looking version had. */}
          <radialGradient id="dv-skin" cx="32%" cy="22%" r="88%">
            <stop offset="0%"  stopColor="#dba275" />
            <stop offset="55%" stopColor="#b07444" />
            <stop offset="100%" stopColor="#6d3e1e" />
          </radialGradient>

          {/* Hair — salt-and-pepper gray, matching Dave's short clipped sides */}
          <linearGradient id="dv-hair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#8b8680" />
            <stop offset="100%" stopColor="#4a453f" />
          </linearGradient>

          {/* Shirt — soft sunset tee so he reads as an ad for the brand */}
          <radialGradient id="dv-shirt" cx="35%" cy="20%" r="90%">
            <stop offset="0%"  stopColor="#ff8066" />
            <stop offset="60%" stopColor="#ff5a3c" />
            <stop offset="100%" stopColor="#b13320" />
          </radialGradient>

          {/* Scalp gloss — bright highlight */}
          <radialGradient id="dv-gloss" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* Drop shadow filter for soft character-grounding */}
          <filter id="dv-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* ── Backdrop disc ──────────────────────────────────────── */}
        <circle cx="120" cy="120" r="118" fill="url(#dv-bg)" />
        {/* Backdrop rim light */}
        <circle
          cx="120" cy="120" r="116"
          fill="none"
          stroke="#ffe9bf"
          strokeWidth="1.2"
          opacity="0.5"
        />

        {/* Ground shadow puddle */}
        <ellipse cx="120" cy="252" rx="72" ry="8" fill="#000" opacity="0.18" filter="url(#dv-shadow)" />

        {/* ── Body group (tilts with head slightly) ─────────────── */}
        <g className="dv-body">
          {/* Shoulders / tee */}
          <path
            d="
              M40 268
              C40 220, 58 192, 88 182
              L152 182
              C182 192, 200 220, 200 268
              Z
            "
            fill="url(#dv-shirt)"
          />
          {/* Collar opening (v-neck) */}
          <path
            d="M103 182 L120 205 L137 182 Z"
            fill="#a9794d"
            opacity="0.85"
          />
          {/* Tee shoulder highlight */}
          <path
            d="M60 230 C70 210, 80 200, 95 195 L95 210 C82 216, 72 226, 66 238 Z"
            fill="#fff"
            opacity="0.14"
          />

          {/* Palm tree printed on the chest — brand tie-in */}
          <g transform="translate(120 236)" stroke="#fbf8f3" fill="#fbf8f3" strokeLinecap="round">
            {/* trunk */}
            <path d="M-1 18 Q0 6 2 -4" strokeWidth="2" fill="none" />
            {/* fronds */}
            <g strokeWidth="1.8" fill="none">
              <path d="M2 -4 Q-5 -7 -12 -8" />
              <path d="M2 -4 Q8 -7 14 -10" />
              <path d="M2 -4 Q-2 -10 -5 -16" />
              <path d="M2 -4 Q6 -10 9 -16" />
              <path d="M2 -4 Q0 -12 0 -17" />
            </g>
            {/* coconuts */}
            <circle cx="0" cy="-3" r="1.1" stroke="none" />
            <circle cx="3" cy="-2.5" r="1.1" stroke="none" />
          </g>
        </g>

        {/* ── Head + face group (parallaxes with cursor) ────────── */}
        <g className="dv-head">
          {/* Neck */}
          <path d="M105 176 Q105 190 120 190 Q135 190 135 176 L135 156 L105 156 Z" fill="url(#dv-skin)" />
          {/* Neck shadow where it meets the head */}
          <path d="M103 158 Q120 168 137 158 L137 164 Q120 174 103 164 Z" fill="#000" opacity="0.18" />

          {/* Ears */}
          <ellipse cx="70" cy="112" rx="7" ry="12" fill="url(#dv-skin)" />
          <ellipse cx="70" cy="113" rx="3" ry="6" fill="#5a3418" opacity="0.5" />
          <ellipse cx="170" cy="112" rx="7" ry="12" fill="url(#dv-skin)" />
          <ellipse cx="170" cy="113" rx="3" ry="6" fill="#5a3418" opacity="0.5" />

          {/* Head shape — slightly tall egg */}
          <ellipse cx="120" cy="108" rx="52" ry="58" fill="url(#dv-skin)" />

          {/* Clipped silver-gray hair on the sides and back — Dave isn't
              fully bald, he keeps it buzzed short on the sides. */}
          <path
            d="
              M68 98
              Q66 120 72 134
              Q66 130 62 118
              Q62 102 68 98 Z
            "
            fill="url(#dv-hair)"
          />
          <path
            d="
              M172 98
              Q174 120 168 134
              Q174 130 178 118
              Q178 102 172 98 Z
            "
            fill="url(#dv-hair)"
          />
          {/* A thin band of hair across the back of the head (horseshoe) */}
          <path
            d="M78 118 Q120 148 162 118 Q160 138 120 150 Q80 138 78 118 Z"
            fill="url(#dv-hair)"
            opacity="0.55"
          />

          {/* Scalp gloss (crown highlight) */}
          <ellipse cx="100" cy="70" rx="24" ry="16" fill="url(#dv-gloss)" />
          <ellipse cx="140" cy="80" rx="10" ry="5" fill="#fff" opacity="0.12" />

          {/* Shadow across jaw — gives the face structure */}
          <path
            d="M75 130 Q120 170 165 130 Q160 160 120 170 Q80 160 75 130 Z"
            fill="#000"
            opacity="0.1"
          />

          {/* Age details — subtle forehead line, eye crinkles, laugh lines */}
          <g stroke="#6d3e1e" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.35">
            {/* Forehead */}
            <path d="M96 80 Q120 77 144 80" />
            {/* Crow's feet (outer eye corners) */}
            <path d="M83 108 L88 110" />
            <path d="M82 114 L88 114" />
            <path d="M157 108 L152 110" />
            <path d="M158 114 L152 114" />
            {/* Nasolabial lines (nose-to-mouth smile creases) */}
            <path d="M107 135 Q102 142 100 148" />
            <path d="M133 135 Q138 142 140 148" />
          </g>

          {/* Eyebrows — slightly graying at the ends to match the hair */}
          <g strokeLinecap="round" fill="none">
            <path d="M90 94 Q100 88 112 92" stroke="#2a1a0c" strokeWidth="3.8" />
            <path d="M128 92 Q140 88 150 94" stroke="#2a1a0c" strokeWidth="3.8" />
            {/* gray highlights over the brows */}
            <path d="M93 92 Q99 89 106 91" stroke="#7a7670" strokeWidth="1.2" opacity="0.55" />
            <path d="M134 91 Q140 89 147 92" stroke="#7a7670" strokeWidth="1.2" opacity="0.55" />
          </g>

          {/* ── Eyes ─────────────────────────────────────────────
              The `dv-eye` group stays put; the inner `dv-pupil` is
              translated by a CSS var that JS updates on pointermove,
              so Dave's gaze follows the cursor. */}
          <g className="dv-eye">
            {/* Eye whites */}
            <ellipse cx="100" cy="112" rx="11" ry="9" fill="#fbf8f3" />
            <ellipse cx="140" cy="112" rx="11" ry="9" fill="#fbf8f3" />
          </g>
          <g className="dv-pupils">
            <g transform="translate(100 112)">
              <circle r="5.5" fill="#2a1a0c" />
              <circle cx="-1.6" cy="-1.6" r="1.6" fill="#fff" />
            </g>
            <g transform="translate(140 112)">
              <circle r="5.5" fill="#2a1a0c" />
              <circle cx="-1.6" cy="-1.6" r="1.6" fill="#fff" />
            </g>
          </g>
          {/* Blink lids — flat paper color, animate to cover eyes */}
          <g className="dv-lids">
            <rect x="88" y="103" width="24" height="0" fill="url(#dv-skin)" />
            <rect x="128" y="103" width="24" height="0" fill="url(#dv-skin)" />
          </g>

          {/* Nose */}
          <path
            d="M118 120 Q114 135 118 142 Q120 144 122 142 Q126 135 122 120 Z"
            fill="#a26c3f"
            opacity="0.55"
          />
          <ellipse cx="120" cy="142" rx="4" ry="1.5" fill="#000" opacity="0.15" />

          {/* Mouth — single open smile, shifted up so it sits between the
              nose (ends ~y=142) and chin (~y=166) instead of hanging below
              the face. */}
          <g className="dv-mouth">
            <path
              d="
                M100 149
                Q120 158 140 149
                Q136 162 120 162
                Q104 162 100 149 Z
              "
              fill="#fbf8f3"
              stroke="#2a1a0c"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Thin lower-lip line inside the mouth for a touch of depth */}
            <path
              d="M106 159 Q120 161.5 134 159"
              stroke="#2a1a0c"
              strokeWidth="0.9"
              fill="none"
              strokeLinecap="round"
              opacity="0.55"
            />
            {/* Faint gridlines between teeth — kept very subtle */}
            <g stroke="#c9c3b4" strokeWidth="0.5" opacity="0.5">
              <line x1="113" y1="152" x2="113" y2="159" />
              <line x1="120" y1="153" x2="120" y2="160" />
              <line x1="127" y1="152" x2="127" y2="159" />
            </g>
          </g>
        </g>

        {/* ── Waving hand — appears on hover ─────────────────── */}
        <g className="dv-wave" transform="translate(178 184)">
          <g className="dv-wave-hand">
            {/* Arm */}
            <path
              d="M0 30 Q-4 10 4 -4"
              stroke="url(#dv-shirt)"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            {/* Hand */}
            <circle cx="6" cy="-8" r="10" fill="url(#dv-skin)" />
            {/* Thumb */}
            <ellipse cx="-1" cy="-10" rx="3" ry="4" fill="url(#dv-skin)" transform="rotate(-20 -1 -10)" />
          </g>
        </g>
      </svg>
    </div>
  )
}
