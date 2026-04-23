import { useState } from 'react'
import './Gallery.css'
import TeeSvg from './TeeSvg.jsx'

const WORKS = [
  // ── Real client designs, shown as-is in a framed card ──────────
  {
    kind: 'image',
    title: 'On Site Detailing',
    tag: 'Auto detailing startup · 24 tees',
    imageSrc: '/designs/on-site-detailing.jpg',
    bg: '#ffffff',
    accent: '#4ea4d9',
  },
  {
    kind: 'image',
    title: '4|6 All The Whey Up',
    tag: 'Fitness brand launch · 80 tees',
    imageSrc: '/designs/all-the-whey-up.jpg',
    bg: '#0a1410',
    accent: '#85d633',
    fit: 'cover',
  },
  {
    kind: 'image',
    title: 'Pancakes & Pavement',
    tag: 'Run club · 42 tees',
    imageSrc: '/designs/pancakes-pavement.jpg',
    bg: '#ffffff',
    accent: '#0b0f17',
  },

  // ── Other work, mocked as prints on shirts ─────────────────────
  {
    kind: 'tee',
    title: 'Reel Deal Fishing Co.',
    tag: 'Local shop · 48 shirts',
    color: '#1b3b5f',
    accent: '#1b3b5f',
    design: (
      <g>
        <text x="0" y="-26" textAnchor="middle" fontFamily="Archivo" fontWeight="900" fontSize="14" fill="#fbf8f3" letterSpacing="1">
          REEL DEAL
        </text>
        <path
          d="M-40 10 Q-20 -10 0 10 Q20 30 40 10 L44 4 L44 16 Z"
          fill="#fbf8f3"
        />
        <circle cx="-26" cy="8" r="2" fill="#1b3b5f" />
        <text x="0" y="34" textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="12" fill="#ffd66b">
          Pompano Beach, FL
        </text>
      </g>
    ),
  },
  {
    kind: 'tee',
    title: 'The Big 60',
    tag: 'Custom birthday run · 12',
    color: '#fbf8f3',
    accent: '#ff5a3c',
    design: (
      <g>
        <text x="0" y="10" textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="72" fill="#ff5a3c">
          60
        </text>
        <text x="0" y="36" textAnchor="middle" fontFamily="Archivo" fontWeight="700" fontSize="9" fill="#0b0f17" letterSpacing="3">
          MARIA'S 60TH · 2026
        </text>
      </g>
    ),
  },
  {
    kind: 'tee',
    title: 'Studio Wordmark',
    tag: 'Zakjahnai Tees house tee',
    color: '#6b7a3b',
    accent: '#6b7a3b',
    design: (
      <g>
        <text x="0" y="-2" textAnchor="middle" fontFamily="Archivo" fontWeight="900" fontSize="16" fill="#fbf8f3" letterSpacing="0.5">
          ZAKJAHNAI
        </text>
        <text x="0" y="26" textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="24" fill="#ffd66b">
          tees
        </text>
      </g>
    ),
  },
]

export default function Gallery() {
  const [active, setActive] = useState(null)

  return (
    <section id="work" className="gallery">
      <div className="container">
        <div className="gallery-head reveal">
          <div>
            <span className="eyebrow">Recent work</span>
            <h2 className="gallery-title">
              Shirts we've made<br/>
              <em>— for people we like.</em>
            </h2>
          </div>
          <p className="gallery-lede">
            A slice of recent orders — from birthday party one-offs to 100+ shirt
            team runs. Tap any piece to see the details.
          </p>
        </div>

        <div className="gallery-grid">
          {WORKS.map((w, i) => (
            <button
              key={i}
              className={`work ${w.kind === 'image' ? 'work-featured' : ''} ${active === i ? 'active' : ''}`}
              onClick={() => setActive(active === i ? null : i)}
              style={{ '--accent': w.accent ?? w.color }}
            >
              <div className="work-frame" style={w.kind === 'image' ? { background: w.bg } : undefined}>
                {w.kind === 'image' ? (
                  <img
                    src={w.imageSrc}
                    alt={`${w.title} — design by Dave`}
                    className="work-image"
                    style={{ objectFit: w.fit ?? 'contain' }}
                    loading="lazy"
                  />
                ) : (
                  <TeeSvg color={w.color} design={w.design} className="work-tee" />
                )}
                {w.kind === 'image' && (
                  <span className="work-badge">Client work</span>
                )}
              </div>
              <div className="work-meta">
                <h3>{w.title}</h3>
                <span>{w.tag}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
