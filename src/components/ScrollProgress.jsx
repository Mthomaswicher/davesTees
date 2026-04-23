import { useEffect, useRef } from 'react'

/**
 * Thin sunset line at the top of the viewport that tracks scroll progress.
 * Uses requestAnimationFrame to coalesce scroll events so the width update
 * doesn't thrash style recalc on fast scroll.
 */
export default function ScrollProgress() {
  const ref = useRef(null)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = 0
      const doc = document.documentElement
      const total = doc.scrollHeight - doc.clientHeight
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0
      if (ref.current) {
        ref.current.style.transform = `scaleX(${pct / 100})`
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />
}
