// Proves all four displays render from real data, and that the keyboard works
// where the design says it must.
// Usage: node scripts/probe-displays.mjs <base-url>

import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] ?? 'http://localhost:5202'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const KNOWN_BENIGN = [/Failed to load resource.*404/]

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
let failed = 0
const check = (name, pass, detail) => {
  if (!pass) failed++
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `\n      ${detail}` : ''}`)
}

const DISPLAYS = [
  { view: 'subject', hash: '#view=subject&s=gltf,usd,x3d&of=gltf&rows=all&basis=prod', wants: /rows reached/i, shot: 'app-subject' },
  { view: 'compare', hash: '#view=compare&s=omb,rp1,teleportxr,wow,iwps,um&rows=all&basis=prod', wants: /capability/i, shot: 'app-compare' },
  { view: 'groups', hash: '#view=groups&s=all&rows=all&basis=prod', wants: /agreed on connect/i, shot: 'app-groups' },
  { view: 'relations', hash: '#view=relations&s=all&rows=all&basis=prod&group=net', wants: /recorded links drawn/i, shot: 'app-relations' },
]

for (const d of DISPLAYS) {
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.setViewport({ width: 1600, height: 1000 })
  await page.goto(`${BASE}/${d.hash}`, { waitUntil: 'networkidle0', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1800))

  const info = await page.evaluate(() => ({
    text: document.body.innerText.replace(/\s+/g, ' '),
    scope: [...document.querySelectorAll('.scope span')].map((e) => e.textContent.trim()),
  }))
  const bad = errors.filter((e) => !KNOWN_BENIGN.some((r) => r.test(e)))
  const rendered = d.wants.test(info.text)
  const hasScope = info.scope.some((s) => /subjects compared/.test(s))
  check(`the ${d.view} display renders from real data`, rendered && hasScope && bad.length === 0,
    `${info.scope[0] ?? 'no scope line'} · ${info.scope[1] ?? ''} · unexpected errors ${bad.length}`)
  if (bad.length) console.log(`      ${bad[0].slice(0, 180)}`)
  await page.screenshot({ path: `review/${d.shot}.png` })
  await context.close()
}

// The compare grid must be drivable from the keyboard alone.
{
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  await page.setViewport({ width: 1600, height: 1000 })
  await page.goto(`${BASE}/#view=compare&s=omb,rp1,teleportxr,wow,iwps,um&rows=conflict&basis=prod`, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 1500))
  await page.focus('[role="grid"]')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Enter')
  await new Promise((r) => setTimeout(r, 700))
  const opened = await page.$('.claim-detail')
  check('arrow keys and Enter open a row in the compare grid without the mouse', !!opened)

  await page.keyboard.press('Escape')
  await new Promise((r) => setTimeout(r, 500))
  const closed = !(await page.$('.claim-detail'))
  check('Escape closes the row panel', closed)
  await context.close()
}

await browser.close()
console.log(failed ? `\n${failed} checks failed.` : '\nAll four displays render and the grid is drivable from the keyboard.')
process.exit(failed ? 1 : 0)
