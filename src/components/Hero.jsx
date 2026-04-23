import { useEffect, useRef, useState } from 'react'
import './Hero.css'
import TeeSvg from './TeeSvg.jsx'
import DaveAvatar from './DaveAvatar.jsx'

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-sun" />
        <div className="hero-grid" />
      </div>

      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">Coconut Creek, FL · Small Batch</span>
          <h1 className="hero-title">
            <span className="word"><span>Wear</span></span>{' '}
            <span className="word"><span>something</span></span>{' '}
            <span className="word"><span><em>nobody else</em></span></span>{' '}
            <span className="word"><span>has.</span></span>
          </h1>
          <p className="hero-sub">
            Dave prints tees by hand from a studio in South Florida — one-offs,
            small batches, and custom orders for teams, shops, and friends.
            Upload your art, pick a color, and see it on the shirt before you buy.
          </p>

          <div className="hero-ctas">
            <MagneticButton href="#designer" className="btn btn-accent">
              Design your shirt <span className="btn-arrow">→</span>
            </MagneticButton>
            <a href="#work" className="btn btn-ghost">See the work</a>
          </div>

          <ul className="hero-stats">
            <li>
              <CountUp end={500} suffix="+" />
              <span>shirts printed</span>
            </li>
            <li>
              <CountUp end={5} prefix="3–" suffix=" day" />
              <span>local turnaround</span>
            </li>
            <li>
              <CountUp end={500} prefix="1–" />
              <span>any quantity</span>
            </li>
          </ul>
        </div>

        <div className="hero-visual">
          <DaveAvatar />

          <div className="hero-shirt-wrap">
            <TeeSvg
              color="#ff5a3c"
              design={<HeroArt />}
              className="hero-shirt"
            />
          </div>

          <div className="hero-card hero-card-a">
            <span className="dot dot-teal" /> Upload any design
          </div>
          <div className="hero-card hero-card-b">
            <span className="dot dot-sun" /> Preview on the shirt
          </div>
        </div>
      </div>

      <a href="#about" className="hero-scroll" aria-label="Scroll to next section">
        <span>Scroll</span>
        <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
          <rect x="0.5" y="0.5" width="13" height="21" rx="6.5" stroke="currentColor" />
          <circle cx="7" cy="7" r="2" fill="currentColor">
            <animate attributeName="cy" values="7;13;7" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </a>
    </section>
  )
}

function HeroArt() {
  return (
    <g>
      {/* Top wordmark — bold condensed caps */}
      <text
        x="0" y="-14"
        textAnchor="middle"
        fontFamily="Archivo, sans-serif"
        fontWeight="900"
        fontSize="11.5"
        fill="#fbf8f3"
        letterSpacing="0.5"
      >
        ZAKJAHNAI
      </text>

      {/* Divider — two rules with a center dot */}
      <g stroke="#fbf8f3" strokeWidth="0.8" strokeLinecap="round" opacity="0.8">
        <line x1="-22" y1="-6" x2="-8" y2="-6" />
        <line x1="8"   y1="-6" x2="22" y2="-6" />
      </g>
      <circle cx="0" cy="-6" r="1.3" fill="#fbf8f3" />

      {/* Italic serif "Tees" — the branded counterpoint */}
      <text
        x="0" y="18"
        textAnchor="middle"
        fontFamily="Instrument Serif, serif"
        fontStyle="italic"
        fontSize="28"
        fill="#ffd66b"
      >
        Tees
      </text>

      {/* Small origin tag */}
      <text
        x="0" y="36"
        textAnchor="middle"
        fontFamily="Archivo, sans-serif"
        fontWeight="700"
        fontSize="7"
        fill="#fbf8f3"
        letterSpacing="2.4"
        opacity="0.78"
      >
        EST. 2022
      </text>
    </g>
  )
}

/**
 * Counts an integer from 0 to `end` once the element scrolls into view.
 * Uses ease-out cubic for a confident landing, tabular-nums CSS so digits
 * don't jitter, and only runs once per mount.
 */
function CountUp({ end, prefix = '', suffix = '', duration = 1400 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return
        startedRef.current = true
        const start = performance.now()
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          setVal(Math.round(end * eased))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [end, duration])

  return (
    <strong ref={ref} className="count">
      {prefix}{val}{suffix}
    </strong>
  )
}

/**
 * Button that gently pulls toward the cursor within a small radius, then
 * eases back to rest. Max displacement ~8px — enough to feel alive, not
 * so much it looks glitchy. Disabled on touch devices and reduced motion.
 */
function MagneticButton({ href, className, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = window.matchMedia('(hover: none)').matches
    if (prefersReduced || isTouch) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      el.style.transform = `translate(${dx * 6}px, ${dy * 5}px)`
    }
    const onLeave = () => {
      el.style.transform = ''
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <a ref={ref} href={href} className={`${className} magnetic`}>
      {children}
    </a>
  )
}
