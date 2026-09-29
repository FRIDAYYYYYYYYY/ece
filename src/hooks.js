import { useEffect, useRef, useState } from 'react'

/** Animated number that eases from 0 to `value`. */
export function useCountUp(value, { duration = 1100, decimals = 0, start = true } = {}) {
  const [display, setDisplay] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    if (!start) return
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(value * eased)
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [value, duration, start])

  return display.toFixed(decimals)
}

/** Adds `is-visible` once the element scrolls into view (drives reveal animations). */
export function useReveal(threshold = 0.14) {
  const ref = useRef(null)
  // Without IntersectionObserver (e.g. SSR / very old browsers) reveal immediately.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, visible]
}

/** Ticking clock string, e.g. 10:42:18 */
export function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now.toLocaleTimeString('en-GB', { hour12: false })
}
