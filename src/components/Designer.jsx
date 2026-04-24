import { useRef, useState } from 'react'
import './Designer.css'
import TeeSvg from './TeeSvg.jsx'
import TryOnOverlay from './TryOnOverlay.jsx'
import { removeBackground } from '../lib/removeBackground.js'

const COLORS = [
  { name: 'Bone',    value: '#fbf8f3' },
  { name: 'Sand',    value: '#e8ddc9' },
  { name: 'Sunset',  value: '#ff5a3c' },
  { name: 'Coral',   value: '#ffb199' },
  { name: 'Teal',    value: '#0aa39a' },
  { name: 'Navy',    value: '#1b3b5f' },
  { name: 'Olive',   value: '#6b7a3b' },
  { name: 'Charcoal',value: '#2b2f38' },
  { name: 'Black',   value: '#0b0f17' },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL']

const PRICE_TIERS = [
  { min: 1, max: 4, each: 32 },
  { min: 5, max: 19, each: 26 },
  { min: 20, max: 49, each: 22 },
  { min: 50, max: 9999, each: 18 },
]

export default function Designer() {
  const [color, setColor] = useState(COLORS[8].value)
  const [size, setSize]   = useState('M')
  const [qty, setQty]     = useState(1)
  const [imageSrc, setImageSrc] = useState(null)     // what the preview renders
  const [originalSrc, setOriginalSrc] = useState(null) // pristine upload for restore
  const [imageName, setImageName] = useState('')
  const [imageScale, setImageScale] = useState(0.9)
  const [bgRemoved, setBgRemoved] = useState(false)
  const [bgBusy, setBgBusy] = useState(false)
  const [bgError, setBgError] = useState('')
  const [bgTolerance, setBgTolerance] = useState(1)
  const [viewMode, setViewMode] = useState('flat') // 'flat' | 'model' | 'me'
  const [selfieSrc, setSelfieSrc] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const tier = PRICE_TIERS.find((t) => qty >= t.min && qty <= t.max) || PRICE_TIERS[0]
  const total = tier.each * qty

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target.result
      setImageSrc(src)
      setOriginalSrc(src)
      setImageName(file.name)
      setImageScale(0.9)
      setBgRemoved(false)
      setBgError('')
      setBgTolerance(1)
    }
    reader.readAsDataURL(file)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const clearImage = () => {
    setImageSrc(null)
    setOriginalSrc(null)
    setImageName('')
    setBgRemoved(false)
    setBgError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const runBgRemoval = async (tolerance) => {
    if (!originalSrc || bgBusy) return
    setBgBusy(true)
    setBgError('')
    try {
      const cleaned = await removeBackground(originalSrc, { tolerance })
      setImageSrc(cleaned)
      setBgRemoved(true)
    } catch (err) {
      setBgError('Could not process that image — try a PNG or JPG.')
    } finally {
      setBgBusy(false)
    }
  }

  const handleRemoveBg = () => runBgRemoval(bgTolerance)

  const handleToleranceChange = (value) => {
    setBgTolerance(value)
    runBgRemoval(value)
  }

  const handleRestore = () => {
    setImageSrc(originalSrc)
    setBgRemoved(false)
    setBgError('')
    setBgTolerance(1)
  }

  const handleSelfieUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => setSelfieSrc(e.target.result)
    reader.readAsDataURL(file)
  }

  const matchedPreset = COLORS.find((c) => c.value.toLowerCase() === color.toLowerCase())
  const swatchLabel = matchedPreset ? matchedPreset.name : `Custom ${color.toUpperCase()}`
  const isCustom = !matchedPreset

  return (
    <section id="designer" className="designer">
      <div className="container">
        <div className="designer-head reveal">
          <span className="eyebrow">Design your shirt</span>
          <h2 className="designer-title">
            Upload your art.<br />
            <em>See it on you — before we print it.</em>
          </h2>
        </div>

        <div className="designer-layout">
          {/* ── Preview ─────────────────────────────────────── */}
          <div className="preview reveal">
            <div className="preview-toolbar">
              <div className="toggle">
                <button
                  className={viewMode === 'flat' ? 'on' : ''}
                  onClick={() => setViewMode('flat')}
                >
                  Flat
                </button>
                <button
                  className={viewMode === 'model' ? 'on' : ''}
                  onClick={() => setViewMode('model')}
                >
                  On a model
                </button>
                <button
                  className={viewMode === 'me' ? 'on' : ''}
                  onClick={() => setViewMode('me')}
                >
                  On me
                </button>
              </div>
              <span className="preview-chip">
                <span className="chip-swatch" style={{ background: color }} />
                {swatchLabel} · {size}
              </span>
            </div>

            {viewMode !== 'me' ? (
              <div
                className="preview-stage"
                onPointerMove={(e) => {
                  const stage = e.currentTarget
                  const rect = stage.getBoundingClientRect()
                  const x = (e.clientX - rect.left) / rect.width - 0.5
                  const y = (e.clientY - rect.top) / rect.height - 0.5
                  stage.style.setProperty('--rx', `${y * -6}deg`)
                  stage.style.setProperty('--ry', `${x * 8}deg`)
                }}
                onPointerLeave={(e) => {
                  e.currentTarget.style.setProperty('--rx', '0deg')
                  e.currentTarget.style.setProperty('--ry', '0deg')
                }}
              >
                <div className="preview-tilt" key={color}>
                  <TeeSvg
                    color={color}
                    imageSrc={imageSrc}
                    imageScale={imageScale}
                    showOnModel={viewMode === 'model'}
                    className="preview-tee"
                  />
                </div>
                {!imageSrc && (
                  <div className="preview-hint">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p>Upload a design and you'll see it here, centered on the chest.</p>
                  </div>
                )}
              </div>
            ) : (
              <TryOnOverlay
                selfieSrc={selfieSrc}
                onSelfieUpload={handleSelfieUpload}
                imageSrc={imageSrc}
                imageScale={imageScale}
              />
            )}

            {imageSrc && (
              <div className="scale-row">
                <div className="scale-label">
                  <span>Design size</span>
                  <em>{Math.round(imageScale * 100)}%</em>
                </div>
                <div className="scale-control">
                  <button
                    className="scale-step"
                    onClick={() => setImageScale((s) => Math.max(0.3, +(s - 0.05).toFixed(2)))}
                    aria-label="Smaller"
                  >−</button>
                  <input
                    type="range"
                    min="0.3"
                    max="1"
                    step="0.01"
                    value={imageScale}
                    onChange={(e) => setImageScale(Number(e.target.value))}
                    style={{ '--fill': `${((imageScale - 0.3) / 0.7) * 100}%` }}
                  />
                  <button
                    className="scale-step"
                    onClick={() => setImageScale((s) => Math.min(1, +(s + 0.05).toFixed(2)))}
                    aria-label="Larger"
                  >+</button>
                </div>
              </div>
            )}

            <div className="preview-footer">
              <div>
                <div className="price-big">${total.toFixed(0)}</div>
                <div className="price-sub">
                  ${tier.each}/shirt · {qty} shirt{qty > 1 ? 's' : ''} · {tier.min === 50 ? 'bulk' : `${tier.min}–${tier.max === 9999 ? '50+' : tier.max}`} pricing
                </div>
              </div>
              <a href="#contact" className="btn btn-accent">
                Send to Dave <span className="btn-arrow">→</span>
              </a>
            </div>
          </div>

          {/* ── Controls ────────────────────────────────────── */}
          <div className="controls reveal">
            {/* Upload */}
            <div className="control-block">
              <label className="control-label">
                <span>1 · Your artwork</span>
                {imageName && (
                  <button className="link-btn" onClick={clearImage}>
                    Remove
                  </button>
                )}
              </label>
              <div
                className={`dropzone ${dragging ? 'over' : ''} ${imageSrc ? 'has-file' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={(e) => {
                  // Don't re-open the file picker if the user clicked an inner action.
                  if (e.target.closest('.bg-actions')) return
                  inputRef.current?.click()
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {imageSrc ? (
                  <div className="dropzone-filled">
                    <div className={`thumb ${bgRemoved ? 'transparent' : ''}`}>
                      <img src={imageSrc} alt="Your design" />
                    </div>
                    <div className="thumb-meta">
                      <strong>{imageName}</strong>
                      <span>
                        {bgRemoved ? 'Background removed' : 'Click thumbnail area to replace'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="dropzone-empty">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v12" />
                      <polyline points="7 8 12 3 17 8" />
                      <path d="M5 21h14a2 2 0 0 0 2-2v-5H3v5a2 2 0 0 0 2 2z" />
                    </svg>
                    <p><strong>Drag & drop</strong> your design, or click to upload</p>
                    <span>PNG · JPG · SVG · up to 10MB</span>
                  </div>
                )}
              </div>

              {imageSrc && (
                <div className="bg-actions" onClick={(e) => e.stopPropagation()}>
                  {!bgRemoved ? (
                    <button
                      type="button"
                      className="bg-btn"
                      onClick={handleRemoveBg}
                      disabled={bgBusy}
                    >
                      {bgBusy ? (
                        <>
                          <span className="spinner" aria-hidden="true" />
                          Removing background…
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 3h4M3 7V3M21 3h-4M21 7V3M3 21h4M3 17v4M21 21h-4M21 17v4" />
                            <path d="M9 9h6v6H9z" opacity="0.5" />
                          </svg>
                          Remove background
                        </>
                      )}
                    </button>
                  ) : (
                    <button type="button" className="bg-btn undo" onClick={handleRestore}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 12a9 9 0 1 0 3-6.7" />
                        <path d="M3 4v5h5" />
                      </svg>
                      Restore original
                    </button>
                  )}

                  {bgRemoved && !bgBusy && (
                    <div className="tolerance-row">
                      <div className="tolerance-head">
                        <span>Still seeing bg?</span>
                        <em>Tolerance · {bgTolerance.toFixed(2)}×</em>
                      </div>
                      <div className="tolerance-control">
                        <span className="tolerance-end">strict</span>
                        <input
                          type="range"
                          min="0.6"
                          max="1.6"
                          step="0.05"
                          value={bgTolerance}
                          onChange={(e) => setBgTolerance(Number(e.target.value))}
                          onPointerUp={(e) => handleToleranceChange(Number(e.target.value))}
                          onKeyUp={(e) => handleToleranceChange(Number(e.target.value))}
                          style={{ '--fill': `${((bgTolerance - 0.6) / 1.0) * 100}%` }}
                        />
                        <span className="tolerance-end">aggressive</span>
                      </div>
                    </div>
                  )}

                  <p className="bg-hint">
                    {bgError
                      ? bgError
                      : bgRemoved
                      ? 'Pull the slider right if a light halo remains; left if it\'s eating your art.'
                      : 'Works best on logos and art with a solid background.'}
                  </p>
                </div>
              )}
            </div>

            {/* Color */}
            <div className="control-block">
              <label className="control-label">
                <span>2 · Shirt color</span>
                <em>{swatchLabel}</em>
              </label>
              <div className="swatches">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    className={`swatch ${!isCustom && color.toLowerCase() === c.value.toLowerCase() ? 'on' : ''}`}
                    style={{ background: c.value }}
                    aria-label={c.name}
                    title={c.name}
                  >
                    <span className="swatch-check" aria-hidden="true">
                      <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1,5 4,8 9,2" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>
                    </span>
                  </button>
                ))}
                <label
                  className={`swatch custom ${isCustom ? 'on' : ''}`}
                  style={isCustom ? { background: color } : undefined}
                  title="Pick any color"
                  aria-label="Pick a custom color"
                >
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                  <span className="swatch-custom-icon" aria-hidden="true">
                    {isCustom ? (
                      <svg width="10" height="10" viewBox="0 0 10 10">
                        <polyline points="1,5 4,8 9,2" fill="none" stroke="currentColor" strokeWidth="1.6"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12">
                        <path d="M6 1v10M1 6h10" stroke="#0b0f17" strokeWidth="1.6" strokeLinecap="round"/>
                      </svg>
                    )}
                  </span>
                </label>
              </div>
            </div>

            {/* Size */}
            <div className="control-block">
              <label className="control-label">
                <span>3 · Size</span>
                <em>{size}</em>
              </label>
              <div className="sizes">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`size ${size === s ? 'on' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="control-block">
              <label className="control-label">
                <span>4 · Quantity</span>
                <em>{qty} shirt{qty > 1 ? 's' : ''}</em>
              </label>
              <div className="qty">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
                />
                <button onClick={() => setQty(Math.min(999, qty + 1))} aria-label="Increase">+</button>
              </div>
              <div className="tier-bar" aria-hidden="true">
                {PRICE_TIERS.map((t, i) => (
                  <div
                    key={i}
                    className={`tier-slot ${tier === t ? 'on' : ''}`}
                    title={`${t.min}${t.max === 9999 ? '+' : `–${t.max}`} @ $${t.each}/ea`}
                  >
                    <span>${t.each}</span>
                    <em>{t.min}{t.max === 9999 ? '+' : `–${t.max}`}</em>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
