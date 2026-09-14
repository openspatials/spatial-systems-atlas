import puppeteer from 'puppeteer-core'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:5199/MSF%20Map%20-%20redesign%20v3.dc.html'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args:['--no-sandbox'] })
const page = await browser.newPage()
const errs = []
page.on('console', m => { if (m.type()==='error') errs.push(m.text()) })
page.on('pageerror', e => errs.push(String(e)))
await page.setViewport({ width: 1600, height: 1000 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 4000))
await page.screenshot({ path: '/tmp/dc-v3-wide.png' })
const txt = await page.evaluate(() => document.body.innerText.slice(0, 2500))
console.log('--- visible text ---'); console.log(txt)
console.log('--- console errors:', errs.length); errs.slice(0,5).forEach(e=>console.log('   ', e.slice(0,200)))
await page.setViewport({ width: 900, height: 1000 })
await new Promise(r => setTimeout(r, 1500))
await page.screenshot({ path: '/tmp/dc-v3-narrow.png' })
await browser.close()
