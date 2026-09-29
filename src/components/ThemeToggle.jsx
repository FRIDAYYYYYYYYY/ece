import { useCallback, useEffect, useState } from 'react'
import Icon from './Icon.jsx'

/** Light / dark switch. Persisted to localStorage; falls back to the OS preference. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem('rg-theme', next)
      } catch {
        /* private mode - the in-memory switch still works */
      }
      return next
    })
  }, [])

  // Enable the global theme cross-fade only after the first paint.
  useEffect(() => {
    const id = requestAnimationFrame(() => document.documentElement.classList.add('theme-ready'))
    return () => cancelAnimationFrame(id)
  }, [])

  // Follow the OS if the user has never chosen explicitly.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => {
      if (localStorage.getItem('rg-theme')) return
      const next = e.matches ? 'dark' : 'light'
      document.documentElement.dataset.theme = next
      setTheme(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="themetoggle"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light appearance' : 'Switch to dark appearance'}
      title={isDark ? 'Light appearance' : 'Dark appearance'}
    >
      <span className="themetoggle__thumb">
        <Icon name={isDark ? 'moon' : 'sun'} size={14} stroke={1.9} />
      </span>
      <span className="themetoggle__icons" aria-hidden="true">
        <Icon name="sun" size={13} className="themetoggle__sun" />
        <Icon name="moon" size={13} className="themetoggle__moon" />
      </span>
    </button>
  )
}