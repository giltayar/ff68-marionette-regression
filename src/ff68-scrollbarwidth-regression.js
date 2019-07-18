'use strict'
const fs = require('fs')
const webdriver = require('selenium-webdriver')
const {By} = webdriver
const firefox = require('selenium-webdriver/firefox')
const retry = require('p-retry')

async function main() {
  const builder = new webdriver.Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(new firefox.Options().headless())
    .usingServer(`http://localhost:4444/wd/hub`)

  const driver = await retry(() => builder.build())

  try {
    await driver.navigate().to('https://www.wikipedia.org/')

    const screenshot = await driver.takeScreenshot()

    fs.writeFileSync('result.png', Buffer.from(screenshot, 'base64'))

    console.log('screenshot written to ./result.png')
  } finally {
    await driver.close()
  }
}

main().catch(err => {
  console.error(err.stack || err.toString())

  process.exit(1)
})
