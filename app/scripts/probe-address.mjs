// Proves the address IS the state, in both directions.
//
// The design prototype could not do this: its address strip composed a
// plausible link and copied it, but never read or wrote the real browser
// address, so a shared link restored nothing. Every case below loads a link
// cold, then reaches the same link warm from a different view, and requires
// both to agree and to differ from the default.
//
// Usage: node scripts/probe-address.mjs <base-url>

import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] ?? 'http://localhost:5202'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// `expect` is what the scope line must say. Without it, a cold load and a warm
// load can both be wrong in the same way and the comparison still passes — which
// is exactly how a dropped row filter slipped through once already.
const CASES = [
  { name: 'a different subject in focus', hash: '#view=subject&s=wow,gltf,usd&of=wow&rows=all&basis=prod', expect: /^3 of 57 subjects compared/ },
  { name: 'a row filter', hash: '#view=subject&s=all&of=gltf&rows=conflict&basis=prod', expect: /30 of 162 rows shown/ },
  { name: 'a use-case lane', hash: '#view=subject&s=all&of=gltf&rows=all&basis=prod&lane=U2', expect: /lane Avatar portability/ },
  { name: 'the percentage basis', hash: '#view=subject&s=all&of=gltf&rows=all&basis=all', expect: /counting 57 selected subjects/ },
  { name: 'a filter plus only-assessed rows', hash: '#view=subject&s=all&of=gltf&rows=interop+assessed&basis=prod', expect: /52 of 162 rows shown/ },
  { name: 'an open claim', hash: '#view=subject&s=gltf,usd&of=gltf&rows=all&basis=prod&open=scene.gltf:usd', expect: /^2 of 57 subjects compared/ },
]

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1600, height: 1000 })

const settle = () => new Promise((r) => setTimeout(r, 900))

// What the screen says, reduced to the facts a reader would check.
const view = () => page.evaluate(() => ({
  scope: [...document.querySelectorAll('.scope span')].map((e) => e.textContent.trim()).join(' | '),
  question: document.querySelector('h1')?.textContent?.trim() ?? '',
  claimOpen: !!document.querySelector('.claim-detail'),
}))

const load = async (hash) => {
  await page.goto('about:blank')
  await page.goto(`${BASE}/${hash}`, { waitUntil: 'networkidle0', timeout: 60000 })
  await settle()
  return view()
}

let failed = 0
const check = (name, pass, detail) => {
  if (!pass) failed++
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `\n      ${detail}` : ''}`)
}

const DEFAULT = await load('')
console.log(`default view: ${DEFAULT.scope}\n`)

for (const c of CASES) {
  const cold = await load(c.hash)

  // The real case: land somewhere else first, then follow the shared link.
  await load('#view=subject&s=all&of=gltf&rows=all&basis=prod')
  await page.evaluate((h) => { window.location.hash = h.slice(1) }, c.hash)
  await settle()
  const warm = await view()

  const same = cold.scope === warm.scope && cold.question === warm.question && cold.claimOpen === warm.claimOpen
  const distinct = cold.scope !== DEFAULT.scope || cold.claimOpen !== DEFAULT.claimOpen
  check(`${c.name} restores the same view cold and warm`, same,
    same ? cold.scope : `cold: ${cold.scope}\n      warm: ${warm.scope}`)
  check(`${c.name} is actually a different view from the default`, distinct)
  check(`${c.name} restores the view it encodes, not merely a consistent one`,
    c.expect.test(cold.scope), c.expect.test(cold.scope) ? '' : `expected ${c.expect}\n      got: ${cold.scope}`)
}

// The browser's own buttons must move through the views the reader visited.
await load('#view=subject&s=all&of=gltf&rows=all&basis=prod')
const first = await view()
await page.evaluate(() => { window.location.hash = 'view=subject&s=all&of=gltf&rows=conflict&basis=prod' })
await settle()
const second = await view()
await page.goBack(); await settle()
const back = await view()
check('the back button returns to the previous view', back.scope === first.scope,
  back.scope === first.scope ? '' : `expected: ${first.scope}\n      got:      ${back.scope}`)
await page.goForward(); await settle()
const forward = await view()
check('the forward button returns again', forward.scope === second.scope)

await browser.close()
console.log(failed ? `\n${failed} checks failed.` : '\nEvery address restores the view it encodes.')
process.exit(failed ? 1 : 0)
