// Regenerates the data slice the two earlier design prototypes read.
//
// `MSF Map - today.dc.html` (the recreation of the current Atlas) reads
// `data/slice.json`; `MSF Map - redesign.dc.html` (the frozen version 2) reads
// `data/map.json`. Both want the same thing: the published export run through
// the presentation adapter — compact tuples in, named fields out.
//
// The design project's own copies could not be retrieved: the transfer caps at
// 256 KiB and both files exceed it, so they arrived truncated and unparseable.
// Regenerating them from `territory.json` is better than a frozen blob anyway:
// there is one source of truth, and the adapter is the one already proven
// against the running version 3 candidate by scripts/probe-model.mjs.
//
// Usage: node scripts/build-design-slice.mjs

import { readFile, writeFile } from 'node:fs/promises'
import { adapt } from '../src/design-model.ts'

const root = new URL('../design-candidate/', import.meta.url)
const raw = JSON.parse(await readFile(new URL('data/territory.json', root), 'utf8'))
const model = adapt(raw)

// The prototypes read the adapter's own field names, including snake_case
// `display_groups`. Emit exactly that shape; do not rename for tidiness.
const slice = {
  groups: model.groups,
  capabilities: model.capabilities,
  subjects: model.subjects,
  display_groups: model.displayGroups,
  counts: model.counts,
  cov: model.cov,
  det: model.det,
  agg: model.agg,
  health: model.health,
  lanes: model.lanes,
}

const json = JSON.stringify(slice)
for (const name of ['data/slice.json', 'data/map.json']) {
  await writeFile(new URL(name, root), json)
  console.log(`${name.padEnd(18)} ${json.length} bytes`)
}
console.log(`subjects ${slice.subjects.length} · capabilities ${slice.capabilities.length} · groups ${slice.groups.length}`)
