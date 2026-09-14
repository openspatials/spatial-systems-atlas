// First paint reads a small index; the full claim notes and sources arrive
// after. That split is only safe if every counted figure is identical from the
// index alone — otherwise a reader sees a percentage that later changes under
// them without being told.
//
// Run: npm test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { adapt, coverage, matchCount, matchingRows } from './design-model.ts'
import type { Query, RowFilter } from './design-model.ts'

const read = async (p: string) => adapt(JSON.parse(await readFile(new URL(p, import.meta.url), 'utf8')))
const full = await read('../public/territory.json')
const index = await read('../public/territory-index.json')

const all = full.subjects.map((s) => s.id)
const q = (over: Partial<Query> = {}): Query =>
  ({ on: all, filter: 'all', hasEntry: false, basis: 'prod', lane: null, ...over })

const CASES: Array<[string, Query]> = [
  ['the landing selection', q({ on: ['gltf', 'usd', 'x3d', 'gltf21', 'vrm'] })],
  ['every subject', q()],
  ['the conflict rows', q({ filter: 'conflict' })],
  ['an active lane', q({ basis: 'all', lane: 'U2' })],
  ['the must-agree basis', q({ basis: 'must' })],
]

for (const [name, query] of CASES) {
  test(`coverage is identical from the index alone — ${name}`, () => {
    assert.deepEqual(coverage(index, query), coverage(full, query))
  })
  test(`the same rows are shown from the index alone — ${name}`, () => {
    assert.equal(matchingRows(index, query).length, matchingRows(full, query).length)
  })
}

test('every row filter counts the same from the index alone', () => {
  const filters: RowFilter[] = ['all', 'overlap', 'thin', 'gap', 'conflict', 'connect', 'interop']
  for (const f of filters) {
    assert.equal(matchCount(index, q(), f), matchCount(full, q(), f), `row filter "${f}" disagrees`)
  }
})

test('the subject figures on the hero are identical from the index alone', () => {
  for (const s of full.subjects) {
    const other = index.bySubject.get(s.id)!
    assert.deepEqual(
      [other.reach, other.native, other.never, other.conflicts],
      [s.reach, s.native, s.never, s.conflicts],
      `${s.name} reads differently from the index`,
    )
  }
})

test('the index is genuinely smaller, or it is not worth having', async () => {
  const size = async (p: string) => (await readFile(new URL(p, import.meta.url))).byteLength
  const small = await size('../public/territory-index.json')
  const big = await size('../public/territory.json')
  assert.ok(small < big * 0.5, `the index is ${Math.round((small / big) * 100)}% of the full export`)
})

test('the index carries no claim notes or sources, which is what makes it small', () => {
  const notes = Object.values(index.det).reduce(
    (n, row) => n + Object.values(row).filter((d) => d[0] || (d[1] ?? []).length).length, 0)
  assert.equal(notes, 0, 'the index is carrying evidence it does not need for first paint')
})
