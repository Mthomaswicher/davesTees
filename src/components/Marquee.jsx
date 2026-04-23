import './Marquee.css'

const ITEMS = [
  'Hand-printed',
  'Small batch',
  'Custom art welcome',
  'Teams & shops',
  'Local to South Florida',
  '1-of-1 originals',
  'Fast turnaround',
  'Eco-friendly inks',
]

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...ITEMS, ...ITEMS].map((t, i) => (
          <span key={i} className="marquee-item">
            <svg width="14" height="14" viewBox="0 0 14 14" className="marquee-star">
              <path d="M7 0 L8.3 4.6 L13 6 L8.3 7.4 L7 14 L5.7 7.4 L1 6 L5.7 4.6 Z" fill="currentColor" />
            </svg>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
