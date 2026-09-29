import { useCallback, useEffect, useState } from 'react'
import Analytics from './components/Analytics.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import DecisionCore from './components/DecisionCore.jsx'
import Hardware from './components/Hardware.jsx'
import LiveJunction from './components/LiveJunction.jsx'
import Overview from './components/Overview.jsx'
import Plan from './components/Plan.jsx'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Icon from './components/Icon.jsx'
import { Section } from './components/ui.jsx'
import { SYSTEM } from './data/core.js'

export default function App() {
  const [active, setActive] = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const jump = useCallback((id) => {
    setActive(id)
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Highlight whichever section is currently in the viewport.
  useEffect(() => {
    const ids = ['overview', 'live', 'decision', 'analytics', 'hardware', 'plan']
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.6] },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  // Global shortcut: Cmd/Ctrl + K opens the command palette.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="shell">
      <Sidebar active={active} onNavigate={jump} open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="shell__main">
        <Topbar
          onMenu={() => setMenuOpen(true)}
          onJump={jump}
          onOpenPalette={() => setPaletteOpen(true)}
        />

        <main className="content">
          <Overview onJump={jump} />

          <Section
            id="live"
            eyebrow="Live junction"
            icon="track"
            title="Signals, blocks and the sensor stream"
            subtitle="Physical GPIO input becomes backend state, then an advisory signal the firmware mirrors on the LEDs."
            aside={<span className="section__tag mono">POST /sensor-event · GET /block-state</span>}
          >
            <LiveJunction />
          </Section>

          <Section
            id="decision"
            eyebrow="Decision core"
            icon="cpu"
            title="Conflict → CP-SAT → validation → recommendation"
            subtitle="One engine only: the optimizer builds a plan, an independent module validates it, the recommender explains it."
            aside={<span className="section__tag mono">/results</span>}
          >
            <DecisionCore />
          </Section>

          <Section
            id="analytics"
            eyebrow="Analytics"
            icon="chart"
            title="Measured value, not assumed value"
            subtitle="Baseline versus optimised comparison from identical sensor events, plus the deferred reporting layers."
          >
            <Analytics />
          </Section>

          <Section
            id="hardware"
            eyebrow="Hardware bridge"
            icon="board"
            title="The contract the firmware codes against"
            subtitle="Endpoints, payload schema and GPIO mapping are frozen before any Wokwi or physical ESP32 work begins."
          >
            <Hardware />
          </Section>

          <Section
            id="plan"
            eyebrow="Delivery plan"
            icon="flag"
            title="What still needs to be done"
            subtitle="Phases A–C close the physical loop. Phases D–F stay deferred until the live demo is repeatable."
          >
            <Plan />
          </Section>

          <footer className="footer">
            <div className="footer__brand">
              <Icon name="train" size={20} />
              <strong>{SYSTEM.name}</strong>
              <span>{SYSTEM.subtitle}</span>
            </div>
            <p className="footer__safety">
              <Icon name="shield" size={15} />
              {SYSTEM.safety} Advisory output for a human dispatcher.
            </p>
            <p className="footer__meta mono">
              React 19 · Vite · OR-Tools CP-SAT · FastAPI · ESP32 · PostgreSQL · Power BI · scikit-learn
            </p>
          </footer>
        </main>
      </div>

      <CommandPalette
        key={paletteOpen ? 'open' : 'closed'}
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={jump}
      />
    </div>
  )
}
