import Icon from './Icon.jsx'
import { KPIS, SYSTEM } from '../data/core.js'
import { CONFLICT } from '../data/decision.js'
import { useCountUp, useReveal } from '../hooks.js'
import { Badge, Button, Sparkline, StatusDot } from './ui.jsx'

function KpiCard({ kpi, index }) {
  const [ref, visible] = useReveal()
  const shown = useCountUp(kpi.value, { decimals: kpi.decimals, start: visible })

  return (
    <article
      ref={ref}
      className={`kpi tone-${kpi.tone} ${visible ? 'is-visible' : ''}`}
      style={{ '--i': index }}
    >
      <div className="kpi__top">
        <span className="kpi__label">{kpi.label}</span>
        <span className={`kpi__delta ${kpi.trend >= 0 ? 'is-up' : 'is-down'}`}>
          <Icon name={kpi.trend >= 0 ? 'arrow' : 'arrow'} size={12} />
          {Math.abs(kpi.trend)}%
        </span>
      </div>

      <div className="kpi__value">
        {shown}
        {kpi.suffix && <span className="kpi__suffix">{kpi.suffix}</span>}
      </div>

      <div className="kpi__spark">
        <Sparkline points={kpi.spark} tone={kpi.tone} />
      </div>

      <p className="kpi__caption">{kpi.caption}</p>
    </article>
  )
}

export default function Overview({ onJump }) {
  return (
    <div className="overview">
      <section className="hero" id="overview">
        <div className="hero__copy">
          <span className="hero__eyebrow">
            <Icon name="pulse" size={15} />
            Live decision support · {SYSTEM.build}
          </span>

          <h1 className="hero__title">
            Precise train traffic control,
            <span className="hero__grad"> proven by measurement.</span>
          </h1>

          <p className="hero__lead">
            Sensor event → backend state → conflict detection → CP-SAT optimisation →
            independent validation → explainable recommendation → physical signal.
            Every decision is auditable before it reaches the hardware.
          </p>

          <div className="hero__actions">
            <Button icon="bolt" variant="primary" onClick={() => onJump('live')}>
              Open live junction
            </Button>
            <Button icon="chart" variant="outline" onClick={() => onJump('analytics')}>
              See measured gain
            </Button>
            <Button icon="flag" variant="ghost" onClick={() => onJump('plan')}>
              Remaining work
            </Button>
          </div>

          <div className="hero__chips">
            <Badge tone="teal" dot pulse>
              CP-SAT solved in {CONFLICT.cpsat.solveMs} ms
            </Badge>
            <Badge tone="success">Weighted delay {CONFLICT.legacy.weighted} → {CONFLICT.cpsat.weighted}</Badge>
            <Badge tone="indigo">{CONFLICT.cpsat.improvement}% better than legacy</Badge>
            <Badge tone="violet">Validator 6 / 6 PASS</Badge>
          </div>
        </div>

        <div className="hero__panel">
          <div className="hero__panelhead">
            <StatusDot tone="success" label="Signal advisory" />
            <span className="mono hero__panelid">{CONFLICT.id}</span>
          </div>
          <div className="hero__decision">
            <span className="hero__decisionlabel">Recommendation</span>
            <strong className="hero__decisiontext">PROCEED Train A</strong>
            <span className="hero__decisionsub">HOLD Train B · 2.1 min delay</span>
          </div>
          <div className="hero__bars">
            <div className="hero__bar">
              <span>Legacy weighted delay</span>
              <div className="track"><i className="fill is-legacy" style={{ width: '100%' }} /></div>
              <b>9.2</b>
            </div>
            <div className="hero__bar">
              <span>CP-SAT weighted delay</span>
              <div className="track"><i className="fill is-cpsat" style={{ width: '50%' }} /></div>
              <b>4.6</b>
            </div>
          </div>
          <p className="hero__foot">
            <Icon name="info" size={14} />
            Advisory output for a human dispatcher — the model never actuates signals alone.
          </p>
        </div>
      </section>

      <div className="kpigrid">
        {KPIS.map((kpi, i) => (
          <KpiCard key={kpi.id} kpi={kpi} index={i} />
        ))}
      </div>
    </div>
  )
}
