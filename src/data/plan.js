// Remaining-work phases A–F, test matrix, demo runbook and completion checklist.

export const PHASES = [
  {
    id: 'A',
    title: 'Hardware API Bridge',
    status: 'done',
    priority: 'Immediate',
    summary: 'POST /sensor-event and GET /block-state with sequence idempotency and a real CP-SAT invocation.',
    items: ['SensorEvent Pydantic schema', 'Per-source sequence tracking', 'Hardware block-state store', 'Conflict → existing optimizer', 'Validate + recommend'],
  },
  {
    id: 'B',
    title: 'Hardware Verification & Live ESP32',
    status: 'active',
    priority: 'Immediate',
    summary: 'Five software replay sequences pass, then the Wokwi / physical ESP32 loop is closed.',
    items: ['Replay A1/A2, B1/B2', 'Forward + reverse conflict', 'Duplicate sequence ignored', 'LEDs match /block-state', 'Fallback recorded'],
  },
  {
    id: 'C',
    title: 'Legacy vs CP-SAT Demo',
    status: 'active',
    priority: 'Immediate',
    summary: 'At least one scenario must differ from the first-arrival rule with measured numbers.',
    items: ['Freight-first trigger', 'Conflict evidence in UI/logs', 'Validator result shown', 'Three full rehearsals', 'One clean fallback'],
  },
  {
    id: 'D',
    title: 'PostgreSQL Persistence',
    status: 'planned',
    priority: 'Deferred',
    summary: 'History and analytics only — never on the millisecond decision path.',
    items: ['8 tables + initial schema', 'hardware_events audit', 'Runs / results / conflicts', 'KPI snapshots'],
  },
  {
    id: 'E',
    title: 'Power BI & Chart.js Analytics',
    status: 'planned',
    priority: 'Deferred',
    summary: 'Historical reports and selected in-app charts built on stored data.',
    items: ['Power Query model', 'Power BI report pages', 'Chart.js in dashboard', 'Baseline vs optimized'],
  },
  {
    id: 'F',
    title: 'ML Advisory Layer',
    status: 'planned',
    priority: 'Optional',
    summary: 'Advisory insights only — never decides PROCEED/HOLD on its own.',
    items: ['Feature extraction', 'Delay & cascade models', 'Isolation Forest anomaly', 'Versioned artefacts', 'Feature flag to disable'],
  },
]

export const TEST_MATRIX = [
  { group: 'Pydantic / sensor', pass: 'Bad payloads rejected safely (422)', phase: 'A', state: 'pass' },
  { group: 'A-only', pass: 'A PROCEED; state clears after A2', phase: 'A', state: 'pass' },
  { group: 'B-only', pass: 'B PROCEED; state clears after B2', phase: 'A', state: 'pass' },
  { group: 'Conflict', pass: 'Both active → CP-SAT → valid advisory', phase: 'A', state: 'pass' },
  { group: 'Duplicate', pass: 'Repeated seq ignored; no re-trigger', phase: 'A', state: 'pass' },
  { group: 'Reverse conflict', pass: 'Opposite arrival order works', phase: 'A', state: 'pass' },
  { group: 'Validator', pass: 'Optimizer output passes independent checks', phase: 'A', state: 'pass' },
  { group: 'Existing suite', pass: 'Pre-existing 10/10 API tests still pass', phase: 'B', state: 'pass' },
  { group: 'Legacy comparison', pass: 'One real scenario differs, measured', phase: 'C', state: 'pass' },
  { group: 'Hardware', pass: 'Physical LED state matches /block-state', phase: 'B', state: 'active' },
  { group: 'Fallback', pass: 'Recorded fallback tested before demo', phase: 'C', state: 'active' },
  { group: 'Persistence', pass: 'Events / runs / results survive restart', phase: 'D', state: 'todo' },
  { group: 'Analytics', pass: 'Chart values match stored data', phase: 'E', state: 'todo' },
  { group: 'ML advisory', pass: 'Versioned, non-blocking, never decisive', phase: 'F', state: 'todo' },
]

export const RUNBOOK = [
  { step: 'Start backend', cmd: 'python backend/main.py', state: 'done' },
  { step: 'Confirm /health', cmd: 'GET /health', state: 'done' },
  { step: 'Start frontend', cmd: 'npm run dev', state: 'done' },
  { step: 'Open guided dashboard', cmd: 'localhost:5173', state: 'done' },
  { step: 'Start Wokwi / ESP32', cmd: 'wokwi-esp32-v3', state: 'done' },
  { step: 'Sensor events in logs', cmd: 'POST /sensor-event', state: 'done' },
  { step: 'A-only and B-only cases', cmd: 'replay R1 · R2', state: 'done' },
  { step: 'Trigger two-train conflict', cmd: 'A1 + B1 active', state: 'active' },
  { step: 'CP-SAT + validator evidence', cmd: 'GET /results', state: 'todo' },
  { step: 'Physical signal output', cmd: 'LED matches state', state: 'todo' },
  { step: 'Legacy vs CP-SAT numbers', cmd: '9.2 → 4.6', state: 'todo' },
  { step: 'Restart + fallback known', cmd: 'fallback.md', state: 'todo' },
]

export const COMPLETION = [
  { group: 'Phase A — Hardware API', items: ['Contract locked (events, GPIO, signals)', 'POST /sensor-event implemented', 'GET /block-state implemented', 'Sequence idempotency + stale handling', 'Conflict invokes real CP-SAT', 'Reuses optimizer/validator/recommender'] },
  { group: 'Phase B — Live hardware', items: ['All five replay sequences pass', 'Wokwi / firmware verified', 'Live event reaches backend', 'Signal state reaches LEDs', 'Existing 10/10 suite still passes'] },
  { group: 'Phase C — Demo', items: ['Measured legacy difference', 'Three rehearsals succeed', 'Fallback recorded and tested'] },
  { group: 'Phase D — Database', items: ['Schema + connection added', 'Events / runs / results / KPIs persist'] },
  { group: 'Phase E — Analytics', items: ['Power BI reports added', 'Chart.js charts in dashboard'] },
  { group: 'Phase F — ML', items: ['Models trained and versioned', 'ml_insights in /results', 'ML never decides alone', 'Disable flag works'] },
]
