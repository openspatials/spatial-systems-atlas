import puppeteer from 'puppeteer-core'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = process.argv[2] ?? 'http://localhost:5202'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
const errs = []
page.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
page.on('pageerror', e => errs.push(String(e)))
await page.setViewport({ width: 1600, height: 1000 })
await page.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 2500))
await page.screenshot({ path: 'review/app-subject.png' })
const info = await page.evaluate(() => ({
  scope: [...document.querySelectorAll('.scope span')].map(e => e.textContent.trim()),
  hash: location.hash,
  text: document.body.innerText.replace(/\s+/g,' ').slice(0, 300),
}))
console.log('address :', info.hash)
info.scope.forEach(s => console.log('scope   :', s))
console.log('screen  :', info.text)
console.log('errors  :', errs.length); errs.slice(0,4).forEach(e => console.log('   ', e.slice(0,180)))
await browser.close()
