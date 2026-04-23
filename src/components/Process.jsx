import './Process.css'

const STEPS = [
  {
    n: '01',
    title: 'Share your idea',
    body: 'Upload a design above or message Dave with whatever you have — a file, a sketch, or just a concept. He\'ll quote it same-day.',
  },
  {
    n: '02',
    title: 'Approve the mock',
    body: 'You get a digital proof showing exactly what the shirt will look like. Tweak colors, sizing, placement — no printing until you\'re happy.',
  },
  {
    n: '03',
    title: 'Dave prints by hand',
    body: 'Each shirt is screen-printed in the Coconut Creek studio. One-offs in days, larger runs in about a week.',
  },
  {
    n: '04',
    title: 'Pick up or ship',
    body: 'Local pickup for South Florida. Shipping anywhere in the U.S. in 3–5 days. Bulk orders can be delivered.',
  },
]

export default function Process() {
  return (
    <section id="process" className="process">
      <div className="container">
        <div className="process-head reveal">
          <span className="eyebrow">How it works</span>
          <h2 className="process-title">
            From idea to wearable<br />
            <em>in a week or less.</em>
          </h2>
        </div>

        <ol className="process-steps">
          {STEPS.map((s, i) => (
            <li key={i} className="process-step reveal">
              <div className="process-n">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              {i < STEPS.length - 1 && (
                <svg className="process-arrow" width="24" height="14" viewBox="0 0 24 14" fill="none" aria-hidden="true">
                  <path d="M1 7H22M22 7L16 1M22 7L16 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
