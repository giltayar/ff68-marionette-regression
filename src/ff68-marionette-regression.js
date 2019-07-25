'use strict'
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

  console.log('viewport size:', rect)

  console.log('*** Navigating...')
  await driver.navigate().to('https://www.schiphol.nl/en/cookies/')
  // await driver.navigate().to('https://en.wikipedia.org/wiki/Trademark_symbol')

  console.log('*** Find h1...')
  const h1 = await driver.findElement(webdriver.By.css('h1'))
  console.log(await h1.getText())
}

main().catch(err => {
  console.error(err.stack || err.toString())

  process.exit(1)
})
