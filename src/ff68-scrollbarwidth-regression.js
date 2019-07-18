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
    const rect = await driver
      .manage()
      .window()
      .setRect({x: 0, y: 0, width: 1920, height: 1080})

    console.log('final size', rect)
    await driver
      .navigate()
      .to(
        'http://snapshot-server-app/renderid/08ca43e3-0a68-402e-8ae9-82b5167ecec2?rg_auth-token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0SnlGZmMwaFRVX2pzZTVCNlFTX2lnfn4iLCJpYXQiOjE1NjM0Mzk5MDQsImV4cCI6MTU2MzQ2MTUwNCwiaXNzIjoiZXllc2FwaS5hcHBsaXRvb2xzLmNvbSJ9.RhxRrqKmDVCuE2ZjRxWc148LXUvxxwQVpN8mWwXXtk884SoFNrhBa0-ITCxyDYAJc3GU6Ka7gf7GV7V2pjkyV9z41Jpismz29cGxBK4uIwgeJfD0UWFuLghRuQ21Y53epZesxwyqfyjY9X5iSOuz9tfIr7Q-aw2tLk2NKWhu98g&rg_namespace-override=4JyFfc0hTU_jse5B6QS_ig%7E%7E&rg_urlmode=rewrite',
      )

    await driver.executeScript(() => {
      const htmlStyle = document.querySelector('html').style // eslint-disable-line

      // This is the line that crashes Firefox 68
      htmlStyle.scrollbarWidth = 'none'
    })

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
