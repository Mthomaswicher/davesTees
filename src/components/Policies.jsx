import './Policies.css'

const ITEMS = [
  {
    title: 'Returns on custom prints',
    body: 'Since every shirt is printed to order, we can\'t resell returns. Once you approve the mockup, the order is final. Please double-check sizes and art before you sign off.',
  },
  {
    title: 'If we mess up — we fix it',
    body: 'Misprint, damage in shipping, or quality issue on our end? Send a photo within 10 days of delivery and Dave will reprint or refund, no charge.',
  },
  {
    title: 'Sizing swaps',
    body: 'For bulk orders (20+), we\'ll swap unworn, unwashed shirts for a different size within 14 days — you cover return shipping. Applies to blank sizes only, not printed quantity changes.',
  },
  {
    title: 'Cancellations & changes',
    body: 'You can cancel or tweak your order any time before you approve the mockup. After approval, printing starts — changes become a new order.',
  },
]

export default function Policies() {
  return (
    <section id="policies" className="policies">
      <div className="container">
        <div className="policies-head reveal">
          <span className="eyebrow">The fine print</span>
          <h2 className="policies-title">
            Simple policies,<br />
            <em>no small-type surprises.</em>
          </h2>
          <p className="policies-lede">
            Custom-printed shirts work a little differently than off-the-shelf.
            Here's how Dave handles returns, damaged items, and last-minute changes.
          </p>
        </div>

        <div className="policies-grid">
          {ITEMS.map((item, i) => (
            <div key={i} className="policy reveal">
              <div className="policy-n">{String(i + 1).padStart(2, '0')}</div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>

        <div className="policies-foot reveal">
          <p>
            Question we didn't answer?{' '}
            <a href="#contact">Shoot Dave a message</a> — usually replies same day.
          </p>
        </div>
      </div>
    </section>
  )
}
