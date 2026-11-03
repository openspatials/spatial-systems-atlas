// The subject display's figure filters, against the published index.

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import type { SubjectOnly } from './design-model.ts'
import { adapt, levelOf, NO_SUBJECT_ONLY, subjectRows } from './design-model.ts'
import { decode, encode, initialState, PRESETS, reducer } from './app/state.ts'

const model = adapt(JSON.parse(readFileSync(new URL('../public/territory-index.json', import.meta.url), 'utf8')))
const total = model.subjects.length
const rows = model.capabilities
const only = (o: Partial<SubjectOnly>): SubjectOnly => ({ ...NO_SUBJECT_ONLY, ...o })
const count = (id: string, o: Partial<SubjectOnly>) => subjectRows(model, id, only(o), rows).length
const subjectState = (id: string) => reducer(initialState(model), { type: 'focus', id })

// A subject with something under every figure, so no filter is tested against an empty set.
const busy = model.subjects.find((s) => s.conflicts > 0 && s.never > 0 && s.native > 0)!

test('with no filter on, every row passes', () => {
  assert.equal(count(busy.id, {}), rows.length)
})

test('each filter gives the number its figure shows', () => {
  for (const s of model.subjects) {
    assert.equal(count(s.id, { reach: true }), s.reach, `${s.id} reach`)
    assert.equal(count(s.id, { native: true }), s.native, `${s.id} built in`)
    assert.equal(count(s.id, { assessed: 'assessed' }), rows.length - s.never, `${s.id} assessed`)
    assert.equal(count(s.id, { assessed: 'unassessed' }), s.never, `${s.id} not assessed`)
    assert.equal(count(s.id, { conflicts: true }), s.conflicts, `${s.id} conflicts`)
  }
})

test('the test subject has rows under every figure', () => {
  assert.ok(busy, 'a subject with conflicts, unassessed rows and built-in rows exists')
  assert.ok(busy.reach > busy.native)
})

test('filters combine: a row must pass every active one', () => {
  const both = subjectRows(model, busy.id, only({ reach: true, assessed: 'assessed' }), rows)
  assert.equal(both.length, busy.reach)
  const none = subjectRows(model, busy.id, only({ native: true, conflicts: true }), rows)
  assert.equal(none.length, 0)
  const unassessedReach = subjectRows(model, busy.id, only({ reach: true, assessed: 'unassessed' }), rows)
  assert.equal(unassessedReach.length, 0)
  const lane = rows.filter((c) => c.interop === 'must')
  const mustNative = subjectRows(model, busy.id, only({ native: true }), lane)
  assert.ok(mustNative.every((c) => c.interop === 'must' && levelOf(model.cov[busy.id]?.[c.id]) === 'n'))
})

test('Assessed turns three ways and back', () => {
  let s = subjectState(busy.id)
  const seen = [s.only.assessed]
  for (let i = 0; i < 3; i++) {
    s = reducer(s, { type: 'subject-only', key: 'assessed' })
    seen.push(s.only.assessed)
  }
  assert.deepEqual(seen, ['all', 'assessed', 'unassessed', 'all'])
})

test('reach, built in and conflicts switch on and off', () => {
  for (const key of ['reach', 'native', 'conflicts'] as const) {
    const on = reducer(subjectState(busy.id), { type: 'subject-only', key })
    assert.equal(on.only[key], true)
    assert.equal(reducer(on, { type: 'subject-only', key }).only[key], false)
  }
})

test('the filters clear when the focus changes, a preset is chosen or the display is left', () => {
  const other = model.subjects.find((x) => x.id !== busy.id)!.id
  const on = reducer(subjectState(busy.id), { type: 'subject-only', key: 'reach' })
  assert.deepEqual(reducer(on, { type: 'focus', id: busy.id }).only, on.only)
  assert.deepEqual(reducer(on, { type: 'focus', id: other }).only, NO_SUBJECT_ONLY)
  assert.deepEqual(reducer(on, { type: 'preset', state: { view: 'groups' }, name: PRESETS[0].name }).only, NO_SUBJECT_ONLY)
  assert.deepEqual(reducer(on, { type: 'view', view: 'compare' }).only, NO_SUBJECT_ONLY)
  assert.deepEqual(reducer(on, { type: 'toggle-subject', id: busy.id }).only, NO_SUBJECT_ONLY)
  assert.deepEqual(reducer(on, { type: 'subject-only-clear' }).only, NO_SUBJECT_ONLY)
})

test('the address carries the filters and reads them back', () => {
  let s = subjectState(busy.id)
  s = reducer(s, { type: 'subject-only', key: 'reach' })
  s = reducer(s, { type: 'subject-only', key: 'assessed' })
  s = reducer(s, { type: 'subject-only', key: 'assessed' })
  s = reducer(s, { type: 'subject-only', key: 'conflicts' })
  const address = encode(s, total)
  assert.match(address, /(^|&)only=reach,unassessed,conflicts$/)
  const back = decode('#' + address, model, initialState(model))
  assert.deepEqual(back.only, s.only)
  assert.equal(encode(back, total), address)
})

test('no filter writes no key, and other displays ignore it', () => {
  assert.doesNotMatch(encode(subjectState(busy.id), total), /only=/)
  const groups = decode(`#view=groups&s=all&rows=all&basis=prod&only=reach`, model, initialState(model))
  assert.deepEqual(groups.only, NO_SUBJECT_ONLY)
  const junk = decode(`#view=subject&s=all&of=${busy.id}&rows=all&basis=prod&only=bogus,native`, model, initialState(model))
  assert.deepEqual(junk.only, only({ native: true }))
})

test('an address with a figure filter is not a preset', () => {
  const unity = decode('#view=subject&s=all&of=unity&rows=all&basis=prod&only=native', model, initialState(model))
  assert.equal(unity.presetName, '')
})
