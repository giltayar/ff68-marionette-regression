'use strict'
const fs = require('fs')
const webdriver = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')
const logging = require('selenium-webdriver/lib/logging')
const retry = require('p-retry')

async function main() {
  const loggingPrefs = new logging.Preferences()
  loggingPrefs.setLevel(logging.Type.DRIVER, 'TRACE')
  loggingPrefs.setLevel(logging.Type.SERVER, 'TRACE')
  loggingPrefs.setLevel(logging.Type.BROWSER, 'TRACe')

  const builder = new webdriver.Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(new firefox.Options().headless())
    .setLoggingPrefs(loggingPrefs)
    .usingServer(`http://localhost:4444/wd/hub`)
    .withCapabilities({browserName: 'firefox', 'moz:firefoxOptions': {log: {level: 'trace'}}})

  const driver = await retry(() => builder.build())

  console.log('*** Setting viewport size...')
  const rect = await driver
    .manage()
    .window()
    .setRect({x: 0, y: 0, width: 1920, height: 1080})

  console.log('final size', rect)
  await driver
    .navigate()
    .to(
      'http://snapshot-server-app/renderid/08ca43e3-0a68-402e-8ae9-82b5167ecec2?rg_auth-token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0SnlGZmMwaFRVX2pzZTVCNlFTX2lnfn4iLCJpYXQiOjE1NjQyOTE4NTAsImV4cCI6MTU2NDMxMzQ1MCwiaXNzIjoiZXllc2FwaS5hcHBsaXRvb2xzLmNvbSJ9.l0YTjfV2Cae0Apkhq7jha-ANtB0BEHVVpzYdzxck_X0TS-UtB3zVtrO7rgXY8auUQrhsiBDKC-JA9t9VaZdR8hdLabC4U_jtuwL527qBqKANgDZ5MrIuArja5JaszgUekt0zV7LEvPR4VZtNOWuSAsk5QGFxvrKK0VC1xdCdl8s&rg_namespace-override=4JyFfc0hTU_jse5B6QS_ig%7E%7E&rg_urlmode=rewrite',
    )
  // await driver.navigate().to('https://www.schiphol.nl/en/cookies/')

  await driver.executeScript(() => {
  const htmlStyle = document.querySelector('html').style // eslint-disable-line

    // This is the line that crashes Firefox 68
    htmlStyle.scrollbarWidth = 'none'
  })

  const screenshot = await driver.takeScreenshot()

  fs.writeFileSync('result.png', Buffer.from(screenshot, 'base64'))

  console.log('screenshot written to ./result.png')
}

main().catch(err => {
  console.error(err.stack || err.toString())

  process.exit(1)
})
