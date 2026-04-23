import './About.css'

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container about-inner">
        <div className="about-copy reveal">
          <span className="eyebrow">Meet Dave</span>
          <h2 className="about-title">
            A garage studio in Coconut Creek,<br />
            <em>run by one guy with great taste.</em>
          </h2>
          <p>
            What started as making birthday shirts for friends turned into a
            full-on side hustle. Dave prints every tee himself — one color or
            five, one shirt or five hundred. No middlemen, no corporate
            drop-ship, no weird quality surprises.
          </p>
          <p>
            If you have an idea, he'll help you land it. If you have a finished
            design, he'll treat it like his own. Either way, you're talking to
            the person actually printing your shirt.
          </p>

          <div className="about-sig">
            <svg viewBox="0 0 160 48" width="140" height="42" aria-hidden="true">
              <path
                d="M4 30 C14 12, 34 12, 40 28 C44 38, 58 32, 60 22 C62 14, 72 10, 76 22 C80 34, 92 30, 96 20 C100 10, 114 10, 118 24 C122 38, 140 30, 156 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span>Dave Vargas, Owner</span>
          </div>
        </div>

        <aside className="about-cards">
          <div className="about-card reveal">
            <div className="about-card-num">01</div>
            <h3>Hand printed, one batch at a time</h3>
            <p>Every shirt is pressed and inspected by Dave. If it doesn't look great, it doesn't ship.</p>
          </div>
          <div className="about-card reveal">
            <div className="about-card-num">02</div>
            <h3>Bring your own art — or we'll help</h3>
            <p>Upload a finished file, a phone photo, or a napkin sketch. We'll clean it up and mock it up.</p>
          </div>
          <div className="about-card reveal">
            <div className="about-card-num">03</div>
            <h3>Local means local</h3>
            <p>South Florida pickups welcome. Shipping anywhere in the US usually lands in 3–5 days.</p>
          </div>
        </aside>
      </div>
    </section>
  )
}
