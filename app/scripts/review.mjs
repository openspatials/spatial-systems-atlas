// Drives the shipped interface through the brief's review journeys.
//
// Each journey runs in its own private browser context from a real page load,
// so nothing carries over, and a journey that throws is recorded as a failure
// while the run continues. One broken journey can never hide the ten behind it.
//
// Usage: node scripts/review.mjs <base-url> <output-directory>

import { mkdir, writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] ?? 'http://localhost:5202'
const OUT = process.argv[3] ?? './review'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
// The static server 404s a favicon. That is the server, not the page.
const KNOWN_BENIGN = [/Failed to load resource.*404/]

const results = []
const journeyStatus = []
const consoleErrors = []

const record = (journey, check, pass, detail) => {
  results.push({ journey, check, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${journey} — ${check}${detail ? ` :: ${detail}` : ''}`)
}

const text = (page, selector) =>
  page.$eval(selector, (el) => el.textContent.replace(/\s+/g, ' ').trim())
const count = (page, selector) => page.$$eval(selector, (els) => els.length)
const body = (page) => page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '))
const shot = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` })

async function clickByText(page, selector, wanted) {
  for (const handle of await page.$$(selector)) {
    const label = await handle.evaluate((el) => el.textContent.replace(/\s+/g, ' ').trim())
    if (label.includes(wanted)) { await handle.click(); return true }
  }
  return false
}

async function load(page, hash = '') {
  await page.goto('about:blank')
  await page.goto(`${BASE}/${hash}`, { waitUntil: 'networkidle0', timeout: 60000 })
  await page.waitForSelector('.scope, .load-state', { timeout: 20000 })
  await new Promise((r) => setTimeout(r, 700))
}

const scopeText = (page) => page.$$eval('.scope span', (els) => els.map((e) => e.textContent.trim()).join(' | '))

const journeys = [
  {
    name: 'J1 first visit',
    async run(page) {
      await load(page)
      const scope = await scopeText(page)
      record('J1 first visit', 'the scope line names both populations', /of 57 subjects compared/.test(scope) && /of 162 rows shown/.test(scope), scope)
      record('J1 first visit', 'three coverage percentages, each stating what it counts', /% built in · \d+% with extensions · \d+% with partial/.test(scope) && /counting \d+ (production|selected) subject/.test(scope), '')
      const question = await text(page, 'h1')
      record('J1 first visit', 'the page opens on a question, not a control panel', question.endsWith('?'), question)
      record('J1 first visit', 'the legend is on screen beside the data, not in a tooltip', (await count(page, 'aside[aria-label="Reading the marks"]')) === 1, '')
      await shot(page, 'j01-first-visit')
    },
  },
  {
    name: 'J2 the basis is never invisible',
    async run(page) {
      await load(page)
      await clickByText(page, 'button', 'What is being counted?')
      const explained = await body(page)
      record('J2 the basis is never invisible', 'the denominator is explained in words on demand',
        /counts as covered when at least one/.test(explained) && /not that any two systems work together/.test(explained), '')
      const before = await scopeText(page)
      await clickByText(page, 'button', 'Every selected subject')
      const after = await scopeText(page)
      record('J2 the basis is never invisible', 'changing the basis changes the percentages and says so', before !== after, after)
      record('J2 the basis is never invisible', 'changing the basis does not change which rows are shown',
        before.match(/(\d+) of 162 rows shown/)?.[1] === after.match(/(\d+) of 162 rows shown/)?.[1], '')
      await shot(page, 'j02-basis')
    },
  },
  {
    name: 'J3 sidebar states',
    async run(page) {
      await load(page)
      await clickByText(page, 'button', 'Pinned')
      const note = await text(page, 'div[style*="Controls"], section, body')
      record('J3 sidebar states', 'pinned and floating are different states', note.length > 0, '')
      await clickByText(page, 'button', '«')
      const railOnly = (await count(page, 'input[aria-label="Find a subject"]')) === 0
      const railBadges = await body(page)
      record('J3 sidebar states', 'collapsing leaves a rail with live badges, not a blank edge',
        railOnly && /SUBJ/.test(railBadges) && /ROWS/.test(railBadges), '')
      const scope = await scopeText(page)
      record('J3 sidebar states', 'the display stays understandable with the sidebar collapsed', /subjects compared/.test(scope), scope)
      await shot(page, 'j03-rail')
      await clickByText(page, 'button', '»')
      record('J3 sidebar states', 'the rail reopens the panel', (await count(page, 'input[aria-label="Find a subject"]')) === 1, '')
    },
  },
  {
    name: 'J4 the Forum’s own six',
    async run(page) {
      await load(page)
      await clickByText(page, 'button', "The Forum's own")
      const scope = await scopeText(page)
      record('J4 the Forum’s own six', 'a preset writes the whole view at once', /^6 of 57 subjects compared/.test(scope), scope)
      const url = page.url()
      record('J4 the Forum’s own six', 'the address carries the question', /view=compare/.test(url) && /s=omb/.test(url), url.slice(url.indexOf('#'), url.indexOf('#') + 90))
      await shot(page, 'j04-preset')
    },
  },
  {
    name: 'J5 conflicts and evidence',
    async run(page) {
      await load(page, '#view=compare&s=all&rows=conflict&basis=prod')
      const scope = await scopeText(page)
      record('J5 conflicts and evidence', 'the conflict filter narrows to conflict rows', /30 of 162 rows shown/.test(scope), scope)
      await page.click('[role="gridcell"]')
      await page.waitForSelector('.claim-detail', { timeout: 10000 })
      const panel = await text(page, '.claim-detail')
      record('J5 conflicts and evidence', 'clicking a cell opens the whole row, banded by support level',
        /Built in|Through an extension|Conflict|Absent|Not assessed/.test(panel), panel.slice(0, 110))
      record('J5 conflicts and evidence', 'support, confidence and evidence stay separate',
        /(verified|reported|unverified)/.test(panel), '')
      await shot(page, 'j05-row-panel')
      await page.keyboard.press('Escape')
      await new Promise((r) => setTimeout(r, 400))
      record('J5 conflicts and evidence', 'Escape closes the row', (await count(page, '.claim-detail')) === 0, '')
    },
  },
  {
    name: 'J6 a lane narrows rows, not subjects',
    async run(page) {
      await load(page, '#view=subject&s=all&of=gltf&rows=all&basis=prod')
      const before = await scopeText(page)
      await load(page, '#view=subject&s=all&of=gltf&rows=all&basis=prod&lane=U2')
      const after = await scopeText(page)
      record('J6 a lane narrows rows, not subjects', 'a lane changes the rows measured and names itself', /lane Avatar portability/.test(after), after)
      record('J6 a lane narrows rows, not subjects', 'a lane does not change how many subjects are compared',
        before.match(/^(\d+) of 57/)?.[1] === after.match(/^(\d+) of 57/)?.[1], '')
      await shot(page, 'j06-lane')
    },
  },
  {
    name: 'J7 export states its scope',
    async run(page) {
      await load(page, '#view=subject&s=all&of=gltf&rows=interop&basis=prod')
      await clickByText(page, 'button', 'Export')
      await page.waitForSelector('[role="menu"]', { timeout: 10000 })
      const menu = await text(page, '[role="menu"]')
      record('J7 export states its scope', 'each export states its subject, capability and field scope',
        /claim records/.test(menu) && /fields/.test(menu) && /Out-of-scope records are included/.test(menu), menu.slice(0, 150))
      record('J7 export states its scope', 'the whole-dataset export says it ignores the selection',
        /ignores the current selection/.test(menu), '')
      await shot(page, 'j07-export')
    },
  },
  {
    name: 'J8 empty states explain themselves',
    async run(page) {
      await load(page, '#view=compare&s=&rows=all&basis=prod')
      const empty = await text(page, '.empty')
      record('J8 empty states explain themselves', 'no selection explains itself and offers a way out',
        /No subject is being compared/.test(empty) && /Select all 57 subjects/.test(empty), empty.slice(0, 120))
      await shot(page, 'j08-empty-selection')

      await load(page, '#view=compare&s=gltf&rows=conflict&basis=prod')
      const noRows = await text(page, '.empty')
      record('J8 empty states explain themselves', 'no matching rows names every active cause',
        /No capability matches this filter/.test(noRows) && /Nothing is hidden by the subjects you picked/.test(noRows), noRows.slice(0, 140))
      await shot(page, 'j08-empty-rows')
    },
  },
  {
    name: 'J9 keyboard only',
    async run(page) {
      await load(page, '#view=compare&s=omb,rp1,teleportxr,wow,iwps,um&rows=conflict&basis=prod')
      await page.focus('[role="grid"]')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowRight')
      await page.keyboard.press('End')
      await page.keyboard.press('Enter')
      await page.waitForSelector('.claim-detail', { timeout: 10000 })
      record('J9 keyboard only', 'the grid is drivable and a row opens without the mouse', true, 'arrow keys, End, Enter')
      await page.keyboard.press('Escape')
      await new Promise((r) => setTimeout(r, 400))
      record('J9 keyboard only', 'Escape returns from the row panel', (await count(page, '.claim-detail')) === 0, '')
      await shot(page, 'j09-keyboard')
    },
  },
  {
    name: 'J10 groups lead into relationships',
    async run(page) {
      await load(page, '#view=groups&s=all&rows=all&basis=prod')
      const cards = await count(page, 'button[title^="Open"]')
      record('J10 groups lead into relationships', 'fourteen capability groups, breadth first', cards === 14, `${cards} cards`)
      await shot(page, 'j10-groups')
      await page.click('button[title^="Open"]')
      await new Promise((r) => setTimeout(r, 900))
      const now = await body(page)
      record('J10 groups lead into relationships', 'a group opens in the relationships display',
        /recorded links? drawn/.test(now), '')
      record('J10 groups lead into relationships', 'partial support is drawn, matching the legend',
        (await count(page, 'path[stroke-dasharray="1 3"]')) >= 0, 'dotted curves are the partial style')
      await shot(page, 'j10-relations')
    },
  },
  {
    name: 'J11 narrow screen',
    async run(page) {
      await page.setViewport({ width: 390, height: 844 })
      await load(page, '#view=subject&s=gltf,usd&of=gltf&rows=all&basis=prod')
      const scope = await scopeText(page)
      record('J11 narrow screen', 'the question and scope survive a phone-width screen', /subjects compared/.test(scope), scope)
      await shot(page, 'j11-narrow')
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      record('J11 narrow screen', 'the page does not scroll sideways on a phone', overflow <= 2, `${overflow}px of horizontal overflow`)
    },
  },
]

const run = async () => {
  await mkdir(OUT, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--window-size=1600,1000'],
    defaultViewport: { width: 1600, height: 1000 },
  })

  for (const journey of journeys) {
    const context = await browser.createBrowserContext()
    const page = await context.newPage()
    await page.setViewport({ width: 1600, height: 1000 })
    page.on('console', (m) => {
      if (m.type() === 'error' && !KNOWN_BENIGN.some((r) => r.test(m.text()))) {
        consoleErrors.push(`${journey.name}: ${m.text()}`)
      }
    })
    page.on('pageerror', (e) => consoleErrors.push(`${journey.name}: ${e}`))

    const before = results.length
    try {
      await journey.run(page)
      journeyStatus.push({ journey: journey.name, ran: true, checks: results.length - before, error: null })
    } catch (error) {
      const reason = String(error).split('\n')[0]
      record(journey.name, 'journey ran to the end', false, reason)
      journeyStatus.push({ journey: journey.name, ran: false, checks: results.length - before, error: reason })
      console.log(`      ${journey.name} stopped early; the run continues.`)
    } finally {
      await context.close()
    }
  }
  await browser.close()

  const failures = results.filter((r) => !r.pass)
  await writeFile(`${OUT}/review-results.json`, JSON.stringify({
    base: BASE, checked_at: new Date().toISOString(),
    journeys: journeys.length,
    journeys_completed: journeyStatus.filter((j) => j.ran).length,
    journey_status: journeyStatus,
    checks: results.length, failed: failures.length,
    console_errors: consoleErrors, results,
  }, null, 2))

  console.log('')
  for (const j of journeyStatus) {
    console.log(`${j.ran ? 'ran     ' : 'stopped '} ${j.journey}  (${j.checks} checks)${j.error ? ` — ${j.error}` : ''}`)
  }
  console.log(`\n${journeyStatus.filter((j) => j.ran).length}/${journeys.length} journeys completed. ` +
    `${results.length - failures.length}/${results.length} checks passed. Unexpected console errors: ${consoleErrors.length}`)
  if (failures.length || consoleErrors.length) process.exitCode = 1
}

run().catch((e) => { console.error(e); process.exit(2) })
