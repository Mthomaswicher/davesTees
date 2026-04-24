import { useRef, useState, useEffect } from 'react'
import './TryOnOverlay.css'

export default function TryOnOverlay({ selfieSrc, onSelfieUpload, imageSrc, imageScale }) {
  const fileRef = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [showHint, setShowHint] = useState(true)
  const dragging = useRef(false)
  const startRef = useRef(null)

  useEffect(() => {
    setPos({ x: 0, y: 0 })
    setShowHint(true)
  }, [selfieSrc])

  const onPointerDown = (e) => {
    e.preventDefault()
    dragging.current = true
    startRef.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }
    setShowHint(false)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragging.current || !startRef.current) return
    setPos({
      x: startRef.current.px + e.clientX - startRef.current.mx,
      y: startRef.current.py + e.clientY - startRef.current.my,
    })
  }

  const onPointerUp = () => {
    dragging.current = false
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) onSelfieUpload(file)
    e.target.value = ''
  }

  return (
    <div className="tryon-wrap">
      {!selfieSrc ? (
        <div
          className="tryon-empty"
          role="button"
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <p>Upload a photo of yourself</p>
          <span>See what the design looks like on you</span>
        </div>
      ) : (
        <div className="tryon-stage">
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
          <img src={selfieSrc} className="tryon-photo" alt="" />
          {imageSrc && (
            <img
              src={imageSrc}
              className="tryon-design"
              alt="Design preview"
              draggable={false}
              style={{
                width: `calc(${imageScale} * 34%)`,
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            />
          )}
          {!imageSrc && (
            <div className="tryon-overlay-msg">
              <p>Upload a shirt design to see it on your photo</p>
            </div>
          )}
          {showHint && imageSrc && (
            <div className="tryon-drag-hint">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
              </svg>
              Drag the design to position it
            </div>
          )}
          <button className="tryon-change-btn" onClick={() => fileRef.current?.click()}>
            Change photo
          </button>
        </div>
      )}
    </div>
  )
}
