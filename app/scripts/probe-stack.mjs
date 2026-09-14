import puppeteer from 'puppeteer-core'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args:['--no-sandbox'] })
const page = await browser.newPage()
const reqs = []
page.on('request', r => reqs.push(r.url()))
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:5199/MSF%20Map%20-%20redesign%20v3.dc.html', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 4000))
const external = reqs.filter(u => !u.startsWith('http://localhost'))
const local = reqs.filter(u => u.startsWith('http://localhost'))
console.log('--- external requests (network needed to run) ---')
;[...new Set(external)].forEach(u => console.log('  ', u))
console.log('--- local requests ---')
;[...new Set(local)].forEach(u => console.log('  ', u))
const libs = await page.evaluate(() => ({
  react: window.React?.version ?? null,
  reactDom: window.ReactDOM?.version ?? null,
  babel: typeof window.Babel !== 'undefined' ? (window.Babel.version ?? 'present') : null,
}))
console.log('--- runtime libraries ---'); console.log(JSON.stringify(libs, null, 2))
await browser.close()
