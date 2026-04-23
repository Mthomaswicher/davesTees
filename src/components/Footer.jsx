import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 40 40" width="26" height="26">
                <path d="M13 10 L8 15 L13 20 L13 32 L27 32 L27 20 L32 15 L27 10 L23 10 C23 12 21.5 13 20 13 C18.5 13 17 12 17 10 Z" fill="currentColor" />
              </svg>
            </span>
            <span className="footer-word">Zakjahnai <em>Tees</em></span>
          </div>

          <nav className="footer-links">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#designer">Design Yours</a>
            <a href="#process">How it works</a>
            <a href="#policies">Returns</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="footer-social">
            <a href="#" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
              </svg>
            </a>
            <a href="#" aria-label="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 3v3.2c1.3 1.1 2.9 1.8 4.6 1.8V11a8.1 8.1 0 0 1-4.6-1.4v6a5.4 5.4 0 1 1-5.4-5.4v3a2.4 2.4 0 1 0 2.4 2.4V3h3z"/>
              </svg>
            </a>
            <a href="mailto:hello@zakjahnaitees.com" aria-label="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Zakjahnai Tees · Printed by hand in Coconut Creek, FL</p>
          <p>Made with salt air &amp; sunshine.</p>
        </div>
      </div>
    </footer>
  )
}
