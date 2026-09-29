import { EVENTS, REPLAYS } from '../data/live.js'
import Corridor from './Corridor.jsx'
import Icon from './Icon.jsx'
import { Badge, Card, PanelTitle, StatusDot } from './ui.jsx'

const STATE_TONE = { ACTIVE: 'danger', CLEAR: 'success' }

function EventRow({ ev }) {
  return (
    <li className="evrow">
      <span className="evrow__seq mono">#{ev.seq}</span>
      <Badge tone={STATE_TONE[ev.state] ?? 'muted'} dot>
        {ev.state}
      </Badge>
      <span className="evrow__block">
        <b>{ev.block}</b>
        <small className="mono">GPIO · {ev.approach}</small>
      </span>
      <span className="evrow__result">{ev.result}</span>
      <span className="evrow__ms mono">{ev.ms} ms</span>
      <span className="evrow__src mono">{ev.source}</span>
    </li>
  )
}

export default function LiveJunction() {
  const conflictCount = EVENTS.filter((e) => e.result.includes('Conflict')).length

  return (
    <div className="livegrid">
      <Card className="livegrid__map">
        <PanelTitle icon="track" title="Junction topology" meta="A / B · live" tone="teal" />
        <Corridor />
      </Card>

      <Card className="livegrid__events">
        <PanelTitle icon="pulse" title="Sensor event stream" meta={`${EVENTS.length} recent · ${conflictCount} conflicts`} tone="indigo" />
        <ul className="evlist">
          {EVENTS.map((ev) => (
            <EventRow key={ev.seq} ev={ev} />
          ))}
        </ul>
        <p className="evlist__foot">
          <Icon name="info" size={14} />
          Sequence numbers are monotonic per source — duplicates and stale events are rejected before any
          decision is taken.
        </p>
      </Card>

      <Card className="livegrid__replays">
        <PanelTitle icon="check" title="Software replay sequences" meta="5 / 5 pass" tone="violet" />
        <ul className="replaylist">
          {REPLAYS.map((r) => (
            <li key={r.id} className="replay">
              <span className="replay__id mono">{r.id}</span>
              <div className="replay__body">
                <strong>{r.name}</strong>
                <code>{r.steps}</code>
                <small>{r.expect}</small>
              </div>
              <StatusDot tone="success" />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
