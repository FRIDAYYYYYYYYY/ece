import { COMPLETION, PHASES, RUNBOOK, TEST_MATRIX } from '../data/plan.js'
import { STACK } from '../data/core.js'
import Icon from './Icon.jsx'
import { Badge, Card, PanelTitle } from './ui.jsx'

const PHASE_TONE = { done: 'success', active: 'teal', planned: 'muted' }
const PHASE_LABEL = { done: 'Complete', active: 'In progress', planned: 'Planned' }
const TEST_TONE = { pass: 'success', active: 'warn', todo: 'muted' }
const STEP_TONE = { done: 'success', active: 'warn', todo: 'muted' }

function PhaseCard({ phase }) {
  return (
    <article className={`phase is-${phase.status}`}>
      <header className="phase__head">
        <span className="phase__letter">{phase.id}</span>
        <div className="phase__headtext">
          <h4>{phase.title}</h4>
          <span className="phase__priority mono">{phase.priority}</span>
        </div>
        <Badge tone={PHASE_TONE[phase.status]} dot pulse={phase.status === 'active'}>
          {PHASE_LABEL[phase.status]}
        </Badge>
      </header>
      <p className="phase__summary">{phase.summary}</p>
      <ul className="phase__items">
        {phase.items.map((item) => (
          <li key={item}>
            <Icon name="check" size={14} />
            {item}
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function Plan() {
  return (
    <div className="plan">
      <Card className="plan__phases">
        <PanelTitle icon="flag" title="Remaining work — phases A to F" meta="6 phases" tone="teal" />
        <p className="card__note">
          Critical path order is fixed: close the physical hardware loop first. Database, BI and ML stay
          deferred until the live ESP32 demo is repeatable.
        </p>
        <div className="phasegrid">
          {PHASES.map((p) => (
            <PhaseCard key={p.id} phase={p} />
          ))}
        </div>
      </Card>

      <Card className="plan__tests">
        <PanelTitle icon="check" title="Test matrix" meta="9 pass · 2 active · 3 queued" tone="emerald" />
        <div className="testtable">
          <div className="testtable__head">
            <span>Group</span>
            <span>Pass condition</span>
            <span>Phase</span>
            <span>State</span>
          </div>
          {TEST_MATRIX.map((t) => (
            <div key={t.group} className="testtable__row">
              <strong>{t.group}</strong>
              <span>{t.pass}</span>
              <code className="mono">{t.phase}</code>
              <Badge tone={TEST_TONE[t.state]} dot pulse={t.state === 'active'}>
                {t.state === 'pass' ? 'PASS' : t.state === 'active' ? 'RUNNING' : 'QUEUED'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="plan__runbook">
        <PanelTitle icon="bolt" title="Demo runbook" meta="7 of 12 rehearsed" tone="indigo" />
        <ol className="runbook">
          {RUNBOOK.map((r, i) => (
            <li key={r.step} className={`rbstep is-${r.state}`}>
              <span className="rbstep__num mono">{String(i + 1).padStart(2, '0')}</span>
              <div className="rbstep__body">
                <strong>{r.step}</strong>
                <code>{r.cmd}</code>
              </div>
              <Badge tone={STEP_TONE[r.state]} dot pulse={r.state === 'active'}>
                {r.state === 'done' ? 'DONE' : r.state === 'active' ? 'NEXT' : 'TODO'}
              </Badge>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="plan__checklist">
        <PanelTitle icon="shield" title="Completion checklist" meta="remaining work only" tone="violet" />
        <div className="checkgrid">
          {COMPLETION.map((g) => (
            <div key={g.group} className="checkgroup">
              <span className="checkgroup__head">{g.group}</span>
              <ul>
                {g.items.map((it) => (
                  <li key={it}>
                    <Icon name="check" size={14} />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card className="plan__stack">
        <PanelTitle icon="grid" title="Technology stack" meta="locked reference" tone="cyan" />
        <div className="stackgrid">
          {STACK.map((g) => (
            <div key={g.group} className="stackcol">
              <span className="stackcol__head">{g.group}</span>
              <dl>
                {g.rows.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd className="mono">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
