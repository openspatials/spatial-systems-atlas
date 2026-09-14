// Proves the ported model in src/design-model.ts reproduces the accepted design
// candidate's numbers exactly. Nothing here is a hardcoded expectation: every
// number is read off the running candidate and compared against the port.
//
// Usage: node scripts/probe-model.mjs <candidate-url>

import { readFile } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
import { adapt, coverage, matchCount, matchingRows } from '../src/design-model.ts'

const CANDIDATE = process.argv[2] ?? 'http://localhost:5199/MSF%20Map%20-%20redesign%20v3.dc.html'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// The candidate's own opening state, from its constructor and componentDidMount.
const QUERY = {
  on: ['gltf', 'usd', 'x3d', 'gltf21', 'vrm'],
  filter: 'all',
  hasEntry: false,
  basis: 'prod',
  lane: null,
}
const FILTER_LABELS = [
  ['all', 'Every capability'],
  ['overlap', 'Two or more have it'],
  ['thin', 'Exactly one has it built in'],
  ['gap', 'Nobody has it built in or by extension'],
  ['conflict', 'A conflict is recorded'],
  ['connect', 'Agreed when systems connect'],
  ['interop', 'Must interoperate'],
]

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1600, height: 1000 })
await page.goto(CANDIDATE, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 4000))

const live = await page.evaluate((labels) => {
  const all = [...document.querySelectorAll('*')]
  const flat = (el) => el.textContent.replace(/\s+/g, ' ').trim()

  // The scope line: the chips that state what is being counted.
  const chips = all
    .map(flat)
    .filter((t) => /^\d+ of 57 subjects compared$/.test(t) || /^\d+ of 162 rows shown$/.test(t) ||
      /^\d+% built in · \d+% with extensions · \d+% with partial$/.test(t) ||
      /^counting \d+ (production|selected) subjects/.test(t))
  const uniq = [...new Set(chips)]

  // Hero: the four derived numbers for the subject in focus. They sit in one
  // container as number-then-label pairs, so read the container, not the labels;
  // several of those words also appear in the permanent legend.
  const hero = {}
  const heroNode = all
    .map(flat)
    .find((t) => /^\d+ ?rows reached ?\d+ ?built in ?\d+ ?not assessed ?\d+ ?conflicts$/.test(t))
  if (heroNode) {
    const nums = heroNode.match(/\d+/g).map(Number)
    hero['rows reached'] = nums[0]
    hero['built in'] = nums[1]
    hero['not assessed'] = nums[2]
    hero['conflicts'] = nums[3]
  }

  // Sidebar: the count the candidate shows beside each row filter.
  const filters = {}
  for (const [id, label] of labels) {
    const node = all.find((el) => el.children.length === 0 && flat(el) === label)
    if (node) {
      const rowText = flat(node.closest('button') ?? node.parentElement)
      const m = /(\d+)\s*$/.exec(rowText)
      if (m) filters[id] = Number(m[1])
    }
  }
  return { chips: uniq, hero, filters }
}, FILTER_LABELS)

await browser.close()

const raw = JSON.parse(await readFile(new URL('../public/territory.json', import.meta.url), 'utf8'))
const model = adapt(raw)
const cov = coverage(model, QUERY)
const rows = matchingRows(model, QUERY)
const gltf = model.bySubject.get('gltf')

const checks = []
const check = (what, mine, theirs) => {
  const pass = String(mine) === String(theirs)
  checks.push({ what, mine, theirs, pass })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${what}  port=${mine}  candidate=${theirs}`)
}

const chipFor = (re) => live.chips.find((c) => re.test(c)) ?? '(not found on screen)'

check('subjects compared', `${QUERY.on.length} of 57 subjects compared`, chipFor(/subjects compared/))
check('rows shown', `${rows.length} of 162 rows shown`, chipFor(/rows shown/))
check(
  'coverage percentages',
  `${cov.native}% built in · ${cov.extension}% with extensions · ${cov.partial}% with partial`,
  chipFor(/% built in/),
)
check('counted subjects', `counting ${cov.counted} production subjects`, chipFor(/^counting /))

check('glTF rows reached', gltf.reach, live.hero['rows reached'])
check('glTF built in', gltf.native, live.hero['built in'])
check('glTF not assessed', gltf.never, live.hero['not assessed'])
check('glTF conflicts', gltf.conflicts, live.hero['conflicts'])

for (const [id, label] of FILTER_LABELS) {
  check(`row filter "${label}"`, matchCount(model, QUERY, id), live.filters[id])
}

const failed = checks.filter((c) => !c.pass)
console.log(`\n${checks.length - failed.length}/${checks.length} numbers match the running candidate.`)
process.exit(failed.length ? 1 : 0)
