import { useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', type: 'custom', qty: '', details: ''
  })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    // Build a prefilled mailto so this works without a backend
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Order type: ${form.type}`,
      `Quantity: ${form.qty}`,
      '',
      'Details:',
      form.details,
    ].join('\n')
    window.location.href = `mailto:hello@zakjahnaitees.com?subject=${encodeURIComponent('New order inquiry')}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section id="contact" className="contact">
      <div className="container contact-inner">
        <div className="contact-copy reveal">
          <span className="eyebrow">Get in touch</span>
          <h2 className="contact-title">
            Tell Dave about<br />
            <em>your shirt idea.</em>
          </h2>
          <p className="contact-lede">
            Custom job, team order, one-off gift — if you can describe it, Dave
            can probably print it. Most quotes come back the same day.
          </p>

          <ul className="contact-meta">
            <li>
              <span className="contact-meta-label">Studio</span>
              <span>Coconut Creek, FL 33073</span>
            </li>
            <li>
              <span className="contact-meta-label">Email</span>
              <a href="mailto:hello@zakjahnaitees.com">hello@zakjahnaitees.com</a>
            </li>
            <li>
              <span className="contact-meta-label">Phone / Text</span>
              <a href="tel:+19545550123">(954) 555-0123</a>
            </li>
            <li>
              <span className="contact-meta-label">Hours</span>
              <span>By appointment · Mon–Sat</span>
            </li>
          </ul>
        </div>

        <form className="contact-form reveal" onSubmit={onSubmit}>
          {sent && (
            <div className="contact-sent">
              ✓ Opening your email app — Dave will reply same day.
            </div>
          )}

          <div className="field-row">
            <label className="field">
              <span>Name</span>
              <input type="text" required value={form.name} onChange={set('name')} placeholder="Your full name" />
            </label>
            <label className="field">
              <span>Email</span>
              <input type="email" required value={form.email} onChange={set('email')} placeholder="you@email.com" />
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Phone <em>(optional)</em></span>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="(954) 555-0123" />
            </label>
            <label className="field">
              <span>Quantity</span>
              <input type="text" value={form.qty} onChange={set('qty')} placeholder="e.g., 25 shirts" />
            </label>
          </div>

          <div className="field">
            <span>What kind of order?</span>
            <div className="chips">
              {[
                { k: 'custom', label: 'Custom design' },
                { k: 'team',   label: 'Team / group' },
                { k: 'event',  label: 'Event / one-off' },
                { k: 'reprint',label: 'Reprint a past order' },
              ].map((c) => (
                <button
                  key={c.k}
                  type="button"
                  className={`chip ${form.type === c.k ? 'on' : ''}`}
                  onClick={() => setForm({ ...form, type: c.k })}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <label className="field">
            <span>Details</span>
            <textarea
              required
              rows={5}
              value={form.details}
              onChange={set('details')}
              placeholder="Tell Dave what you have in mind — sizes, colors, deadline, any design notes. Attach files after you send this."
            />
          </label>

          <button type="submit" className="btn btn-accent contact-submit">
            Send inquiry <span className="btn-arrow">→</span>
          </button>
          <p className="contact-fine">
            Dave reads every message. No bots, no upsells — just the guy who'll
            be printing your shirt.
          </p>
        </form>
      </div>
    </section>
  )
}
