// The Relationships display: subjects on the left, capabilities on the right,
// one curve per recorded claim.
//
// Partial support is drawn here. The old tool counted partial everywhere else
// and left it off this diagram, so the picture quietly disagreed with the
// permanent legend beside it. Four line styles now match the legend exactly:
// solid for built in, dashed for an extension, dotted for partial, heavy for a
// conflict.

import type { Capability, Level, Model } from '../design-model.ts'
import { levelOf } from '../design-model.ts'
import type { Action, AppState } from './state.ts'

const MAX_SUBJECTS = 10
const MAX_ROWS = 14
const ROW_HEIGHT = 34
const GAP = 6

/** One style per level, matching the permanent legend. */
const WIRE: Record<string, { stroke: string; width: number; dash: string; word: string }> = {
  n: { stroke: 'var(--ac)', width: 1.4, dash: '0', word: 'built in' },
  x: { stroke: 'var(--ac)', width: 1.2, dash: '4 3', word: 'through an extension' },
  p: { stroke: 'var(--warn)', width: 1.2, dash: '1 3', word: 'partial' },
  c: { stroke: 'var(--bad)', width: 2.2, dash: '0', word: 'a recorded conflict' },
}
const DRAWN: Level[] = ['n', 'x', 'p', 'c']

export function RelationsView({ model, state, dispatch, rows }: {
  model: Model
  state: AppState
  dispatch: React.Dispatch<Action>
  rows: Capability[]
}) {
  const linkCount = (groupId: string) => {
    let n = 0
    for (const c of model.capabilities.filter((x) => x.g === groupId)) {
      for (const sid of state.on) {
        const level = levelOf(model.cov[sid]?.[c.id])
        if (level && DRAWN.includes(level)) n++
      }
    }
    return n
  }

  const richest = model.groups
    .map((g) => ({ id: g.id, name: g.name, n: linkCount(g.id) }))
    .sort((a, b) => b.n - a.n)[0]

  const groupId = state.relGroup || richest.id
  const group = model.groups.find((g) => g.id === groupId) ?? model.groups[0]
  const sparse = linkCount(groupId) < 3

  const capabilities = rows.filter((c) => c.g === groupId).slice(0, MAX_ROWS)
  const subjects = state.on.slice(0, MAX_SUBJECTS)
  const step = ROW_HEIGHT + GAP
  const height = Math.max(subjects.length, capabilities.length) * step
  const y = (i: number) => i * step + ROW_HEIGHT / 2

  const wires: Array<{ d: string; style: typeof WIRE[string]; title: string }> = []
  subjects.forEach((sid, i) => {
    capabilities.forEach((c, j) => {
      const level = levelOf(model.cov[sid]?.[c.id])
      if (!level || !DRAWN.includes(level)) return
      const style = WIRE[level]
      const y1 = y(i)
      const y2 = y(j)
      wires.push({
        d: `M 0 ${y1} C 38 ${y1}, 62 ${y2}, 100 ${y2}`,
        style,
        title: `${model.bySubject.get(sid)?.name} · ${c.name} · ${style.word}`,
      })
    })
  })

  return (
    <section style={s.panel}>
      <div style={s.head}>
        <span style={s.eyebrow}>Relationships</span>
        <span style={s.hint}>
          {group.name} · {wires.length} recorded {wires.length === 1 ? 'link' : 'links'} drawn
        </span>
      </div>

      <div style={s.picker}>
        {model.groups.map((g) => (
          <button key={g.id} type="button" style={s.pick(g.id === groupId)}
            onClick={() => dispatch({ type: 'rel-group', id: g.id })}>
            {g.name}
          </button>
        ))}
      </div>

      {sparse && (
        <p style={s.sparse}>
          This group is genuinely sparse for the subjects you have selected, so the
          picture is nearly empty rather than broken.{' '}
          {richest.id !== groupId && (
            <button type="button" style={s.inlineLink}
              onClick={() => dispatch({ type: 'rel-group', id: richest.id })}>
              Show {richest.name} instead — {richest.n} recorded links
            </button>
          )}
        </p>
      )}

      <div style={s.stage}>
        <ul style={s.column}>
          {subjects.map((sid, i) => (
            <li key={sid} style={{ ...s.node, top: y(i) - ROW_HEIGHT / 2 }}>
              <button type="button" style={s.nodeButton}
                title={`Put ${model.bySubject.get(sid)?.name} in focus`}
                onClick={() => dispatch({ type: 'focus', id: sid })}>
                {model.bySubject.get(sid)?.name ?? sid}
              </button>
            </li>
          ))}
        </ul>

        <svg style={{ flex: 1, minWidth: 120 }} height={height} viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none" role="img"
          aria-label={`${wires.length} recorded claims between ${subjects.length} subjects and ${capabilities.length} capabilities`}>
          {wires.map((w, i) => (
            <path key={i} d={w.d} fill="none" stroke={w.style.stroke}
              strokeWidth={w.style.width} strokeDasharray={w.style.dash} vectorEffect="non-scaling-stroke">
              <title>{w.title}</title>
            </path>
          ))}
        </svg>

        <ul style={s.column}>
          {capabilities.map((c, j) => (
            <li key={c.id} style={{ ...s.node, top: y(j) - ROW_HEIGHT / 2 }}>
              <button type="button" style={s.nodeButton}
                title="Open this whole row, across every compared subject"
                onClick={() => dispatch({ type: 'detail', detail: { cid: c.id, sid: null } })}>
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {capabilities.length === MAX_ROWS && (
        <p style={s.hint}>
          Showing the first {MAX_ROWS} rows of this group. Narrow the row filter to see the rest.
        </p>
      )}
    </section>
  )
}

const s = {
  panel: { border: '1px solid var(--rule)', background: 'var(--panel)', borderRadius: 'var(--r)', padding: '10px 14px 14px' } as const,
  head: { display: 'flex', alignItems: 'baseline', gap: 10, borderBottom: '1px solid var(--rule)', paddingBottom: 6, marginBottom: 8 } as const,
  eyebrow: { fontFamily: 'var(--fl)', fontWeight: 700, fontSize: 9.5, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--faint)' } as const,
  hint: { fontSize: 11.5, color: 'var(--faint)', fontStyle: 'italic', margin: '6px 0 0' } as const,
  picker: { display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 } as const,
  pick: (on: boolean) => ({ fontFamily: 'var(--fl)', fontWeight: 600, fontSize: 10.5, background: on ? 'var(--ink)' : 'transparent', color: on ? 'var(--bg)' : 'var(--soft)', border: `1px solid ${on ? 'var(--ink)' : 'var(--rule)'}`, borderRadius: 'var(--r)', padding: '2px 7px', cursor: 'pointer', whiteSpace: 'nowrap' } as const),
  sparse: { margin: '0 0 10px', fontSize: 12, color: 'var(--soft)' } as const,
  inlineLink: { background: 'transparent', border: 0, color: 'var(--ac)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', padding: 0 } as const,
  stage: { display: 'flex', gap: 10, alignItems: 'flex-start', overflowX: 'auto' } as const,
  column: { position: 'relative', flex: '0 0 clamp(120px,26vw,200px)', listStyle: 'none', margin: 0, padding: 0, minHeight: 40 } as const,
  node: { position: 'absolute', left: 0, right: 0, height: 34, display: 'flex', alignItems: 'center' } as const,
  nodeButton: { width: '100%', boxSizing: 'border-box', textAlign: 'left', border: '1px solid var(--rule)', background: 'var(--bg)', borderRadius: 'var(--r)', padding: '5px 8px', cursor: 'pointer', fontSize: 11.5, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const,
}
