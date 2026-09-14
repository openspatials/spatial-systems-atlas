// The figures the published explanations quote must equal the figures the
// interface computes. If they ever disagree, a visitor reads one number in the
// prose and a different one in the scope line.
//
// This reads the real published export and pulls the numbers out of the real
// tooltip prose — not a parallel machine-readable copy — so it checks what a
// visitor actually reads.
//
// Run: npm test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { adapt } from './design-model.ts'

// public/territory.json is a symlink to the repository's published export, so
// this reads exactly the bytes the application serves.
const raw = JSON.parse(
  await readFile(new URL('../public/territory.json', import.meta.url), 'utf8'),
)
const model = adapt(raw)
const tips = raw.tooltips as Record<string, string>

/** Pull every number out of a tooltip, as written. */
const numbersIn = (key: string): number[] => {
  const text = tips[key]
  assert.ok(text, `the published export has no explanation for "${key}"`)
  return [...text.matchAll(/\b(\d[\d,]*)\b/g)].map((m) => Number(m[1].replace(/,/g, '')))
}

const claims = Object.values(model.cov).reduce((n, row) => n + Object.keys(row).length, 0)
const byConfidence = (c: string) =>
  Object.values(model.cov).reduce((n, row) => n + Object.values(row).filter((x) => x[1] === c).length, 0)
const byLevel = (l: string) =>
  Object.values(model.cov).reduce((n, row) => n + Object.values(row).filter((x) => x[0] === l).length, 0)

test('the claims explanation quotes the claim total the model derives', () => {
  assert.ok(numbersIn('count.claims').includes(claims),
    `prose numbers ${numbersIn('count.claims')} do not contain the derived total ${claims}`)
})

test('the claims explanation quotes the out-of-scope and visible split correctly', () => {
  const outOfScope = byLevel('o')
  const numbers = numbersIn('count.claims')
  assert.ok(numbers.includes(outOfScope), `out-of-scope ${outOfScope} missing from the prose`)
  assert.ok(numbers.includes(claims - outOfScope), `visible ${claims - outOfScope} missing from the prose`)
})

test('the sources explanation quotes the source total the export holds', () => {
  const sources = (raw.counts as Record<string, number>).sources
  assert.ok(numbersIn('count.sources').includes(sources),
    `source total ${sources} missing from the prose`)
})

test('the unverified explanation quotes the real unverified count, not zero', () => {
  const unverified = byConfidence('u')
  const numbers = numbersIn('confidence.unverified')
  assert.ok(numbers.includes(unverified), `unverified ${unverified} missing from the prose`)
  // This explanation once told visitors the database held none of them.
  assert.ok(unverified === 0 || !/holds none/i.test(tips['confidence.unverified']),
    'the prose says the database holds none while the data holds some')
})

test('the verified explanation quotes the verified count and the total together', () => {
  const numbers = numbersIn('confidence.verified')
  assert.ok(numbers.includes(byConfidence('v')), 'verified count missing from the prose')
  assert.ok(numbers.includes(claims), 'claim total missing from the prose')
})

test('the must-interoperate explanation quotes the real boundary split', () => {
  const counts = raw.counts as Record<string, number>
  const numbers = numbersIn('interop.must')
  for (const [what, value] of [['must', counts.must], ['should', counts.should], ['none', counts.no_interop]] as const) {
    assert.ok(numbers.includes(value), `${what} count ${value} missing from the prose`)
  }
  assert.ok(numbers.includes(model.capabilities.length), 'capability total missing from the prose')
})

test('no published explanation still carries a figure from before the map grew', () => {
  const stale = [/\b1,749\b/, /\b1,057\b/, /\b2,669\b/, /117 capabilities/, /89 capabilities/]
  const offenders: string[] = []
  for (const [key, text] of Object.entries(tips)) {
    if (stale.some((rule) => rule.test(text))) offenders.push(key)
  }
  assert.deepEqual(offenders, [], `these explanations still quote pre-expansion figures: ${offenders.join(', ')}`)
})

test('no published explanation leaked an unsubstituted build token', () => {
  const leaked = Object.entries(tips).filter(([, text]) => /\{\{[a-z0-9_-]+\}\}/.test(text)).map(([k]) => k)
  assert.deepEqual(leaked, [], `these explanations still contain a raw token: ${leaked.join(', ')}`)
})
