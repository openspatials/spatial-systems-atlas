// Loads all three design prototypes and proves each renders from the repository.
// Usage: node scripts/probe-prototypes.mjs <base-url>

import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] ?? 'http://localhost:5201'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// Two messages are expected and harmless, so the probe names them rather than
// tolerating "some errors". The browser parses the raw template before the
// runtime replaces it, so the placeholder text in the Relationships SVG fails
// SVG attribute parsing once, at parse time; React then builds that SVG with
// real values. The favicon 404 is the static server, not the page.
const KNOWN_BENIGN = [
  /<svg> attribute viewBox: Expected number/,
  /<path> attribute d: Expected moveto path command/,
  /Failed to load resource.*404/,
]
const unexpected = (messages) =>
  messages.filter((m) => !KNOWN_BENIGN.some((rule) => rule.test(m)))

const FILES = [
  ['MSF Map - today.dc.html', 'Territory atlas', 'baseline recreation of the current Atlas'],
  ['MSF Map - redesign.dc.html', 'MSF Map', 'frozen version 2'],
  ['MSF Map - redesign v3.dc.html', 'MSF Map', 'the accepted candidate'],
]

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
let failed = 0

for (const [file, expect, what] of FILES) {
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.setViewport({ width: 1600, height: 1000 })
  try {
    await page.goto(`${BASE}/${encodeURIComponent(file)}`, { waitUntil: 'networkidle0', timeout: 60000 })
    await new Promise((r) => setTimeout(r, 4500))
    const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim())
    // innerText returns rendered text, so CSS text-transform applies and the
    // header reads "MSF MAP". Compare without case.
    const rendered = text.length > 400 && text.toLowerCase().includes(expect.toLowerCase())
    // Every prototype must show real counts, not placeholders.
    const hasData = /\b57\b/.test(text) && /\b162\b/.test(text)
    const bad = unexpected(errors)
    const ok = rendered && hasData && bad.length === 0
    if (!ok) failed++
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${file}`)
    console.log(`      ${what}; ${text.length} chars on screen; real counts on screen=${hasData}; unexpected console errors=${bad.length} (${errors.length - bad.length} known benign)`)
    if (bad.length) console.log(`      first unexpected error: ${bad[0].slice(0, 160)}`)
    await page.screenshot({ path: `review/proto-${file.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png` })
  } catch (e) {
    failed++
    console.log(`FAIL  ${file}\n      ${String(e).split('\n')[0]}`)
  }
  await context.close()
}

await browser.close()
console.log(`\n${FILES.length - failed}/${FILES.length} prototypes render from the repository.`)
process.exit(failed ? 1 : 0)
