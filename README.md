# RailGuard AI — Train Traffic Control

Decision-support dashboard for the AI-powered precise train traffic control
prototype. Dark-themed operations console that walks the full decision path:

`sensor event → backend state → conflict detection → CP-SAT optimisation →
independent validation → explainable recommendation → physical signal → dashboard`

> Decision-support prototype for a human dispatcher. **Not** safety-certified
> railway infrastructure, and the model never actuates signals on its own.

## Layers implemented

| Layer | What it shows |
| --- | --- |
| Overview | Hero with the measured CP-SAT gain + six animated KPI cards (count-up, sparklines) |
| Live junction | Animated SVG corridor (moving trains, blinking signals, flowing track), signal states, sensor event stream, five replay sequences |
| Decision core | Active conflict, legacy vs CP-SAT comparison bars, decision pipeline, CP-SAT constraints, independent validation, explainable recommendation |
| Analytics | Legacy vs CP-SAT bar chart, delay trend line, conflict-mix donut, deferred Power BI / ML layers |
| Hardware bridge | ESP32 device card, locked API contract, `POST /sensor-event` schema, GPIO mapping table |
| Delivery plan | Phases A–F, test matrix, demo runbook, completion checklist, technology stack |

## Design system

A plain, professional application surface: **white background, near-black text,
neutral grey structure**. Structure is carried by crisp 1px borders rather than
shadows, gradients or decoration. Colour appears only where it means something —
the primary action and status states.

| Role | Light | Dark |
| --- | --- | --- |
| Background | `#ffffff` | `#16181c` |
| Card surface | `#ffffff` | `#1c1f24` |
| Text | `#1f2328` / `#4a5159` / `#6e7681` | `#e6e8eb` / `#b3b9c2` / `#8b929c` |
| Border | `#e3e5e9` | `#2e3238` |
| Primary (actions only) | `#1a56db` | `#6b9bff` |
| Success / warn / danger | `#157347` / `#8a5200` / `#b42318` | `#55c08a` / `#e0a458` / `#f08a80` |

- **Type** — the native system font stack (SF Pro / Segoe UI / Roboto), which is
  what normal desktop and web applications actually use. Mono for telemetry.
- **Shape** — small 4–12px radii and 1px borders.
- **Depth** — real **black** box-shadows, layered at two levels so cards and
  overlays read clearly against the white surface.
- **Theming** — light and dark are both first-class. Applied before first paint
  (no flash), persisted to `localStorage`, follows the OS until you pick.
- **Motion** — short and functional: scroll reveals, count-up numbers, growing
  bars, drawn chart lines. Respects `prefers-reduced-motion`.

### Kept deliberately simple

Decorations that added motion without meaning were removed: glow/halo rings on
status dots, gradient and blur treatments on the corridor diagram, the KPI
accent stripe, and the reading-progress hairline. The back-to-top button was
dropped in favour of normal scrolling. Every remaining animation maps to real
data changing.

### Extra UI

| Feature | Detail |
| --- | --- |
| Command palette | `Cmd/Ctrl + K` — section search with arrow/Enter/Esc support |
| Theme toggle | Animated sun ⇄ moon switch in the topbar |
| Spotlight search | Topbar button that opens the palette |

### File map

```
src/styles/
  tokens.css      design tokens, light + dark themes
  base.css        reset, global type, keyframes
  layout.css      shell, sidebar, topbar, section, palette, FAB
  components.css  card, badge, button, meter, sparkline, stat
  hero.css        overview hero + KPI grid
  live.css        corridor diagram, event stream, replays
  decision.css    conflict, comparison, pipeline, validation
  analytics.css   bar / line / donut charts
  hardware.css    device, API contract, GPIO table
  plan.css        phases, test matrix, runbook, checklist
  footer.css      footer
  responsive.css  breakpoints
```

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle
npm run preview  # serve the build
npm run lint     # oxlint
```

## Stack

React 19 · Vite · hand-built SVG charts (no chart dependency) · CSS custom
properties. The backend side of the project is FastAPI + Pydantic v2 +
OR-Tools CP-SAT with an ESP32 hardware bridge; this repository contains the
frontend dashboard.
