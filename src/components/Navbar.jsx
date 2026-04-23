import { useEffect, useState } from 'react'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="container nav-row">
        <a href="#top" className="brand" aria-label="Zakjahnai Tees — home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" width="28" height="28">
              <path
                d="M13 10 L8 15 L13 20 L13 32 L27 32 L27 20 L32 15 L27 10 L23 10 C23 12 21.5 13 20 13 C18.5 13 17 12 17 10 Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="brand-word">
            Zakjahnai <em>Tees</em>
          </span>
        </a>

        <nav className={`nav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#designer">Design Yours</a>
          <a href="#process">How it works</a>
          <a href="#policies">Returns</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-cta">
          <a href="#designer" className="btn btn-accent btn-sm">
            Start a design <span className="btn-arrow">→</span>
          </a>
        </div>

        <button
          className={`nav-burger ${open ? 'open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
