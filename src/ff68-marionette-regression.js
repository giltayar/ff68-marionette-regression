'use strict'
const fs = require('fs')
const webdriver = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')
const retry = require('p-retry')

async function main() {
  const builder = new webdriver.Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(new firefox.Options().headless())
    .usingServer(`http://localhost:4444/wd/hub`)

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
