import { useState, useEffect } from 'react'
import './Contact.css'
import { sendOrder, EMAILJS_PUBLIC_KEY } from '../lib/emailOrder.js'
import emailjs from '@emailjs/browser'

export default function Contact() {
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'
  const [design, setDesign] = useState(null)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', type: 'custom', qty: '', details: ''
  })

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY)
    try {
      const saved = localStorage.getItem('daves-order')
      if (saved) setDesign(JSON.parse(saved))
    } catch {
      // ignore
    }
  }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendOrder({ form, design: design ?? {} })
      setStatus('sent')
      localStorage.removeItem('daves-order')
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
    }
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
              <a href="mailto:dvvr2@aol.com">dvvr2@aol.com</a>
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
          {status === 'sent' && (
            <div className="contact-sent">
              ✓ Order sent to Dave — he'll reply same day.
            </div>
          )}
          {status === 'error' && (
            <div className="contact-error">
              Something went wrong. Please email Dave directly at{' '}
              <a href="mailto:dvvr2@aol.com">dvvr2@aol.com</a>.
            </div>
          )}

          {design && (
            <div className="order-summary">
              <div className="order-summary-label">Your order</div>
              <div className="order-summary-row">
                <span className="order-swatch" style={{ background: design.color }} />
                <span>{design.size} · {design.qty} shirt{design.qty !== 1 ? 's' : ''} · <strong>${design.total}</strong></span>
                {design.imageSrc && (
                  <img src={design.imageSrc} className="order-thumb" alt="Your design" />
                )}
              </div>
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
              placeholder="Tell Dave what you have in mind — sizes, colors, deadline, any design notes."
            />
          </label>

          <button
            type="submit"
            className="btn btn-accent contact-submit"
            disabled={status === 'sending' || status === 'sent'}
          >
            {status === 'sending' ? (
              <>Sending… <span className="btn-spinner" aria-hidden="true" /></>
            ) : (
              <>Send to Dave <span className="btn-arrow">→</span></>
            )}
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
