# ff68-scrollbarwidth-regression

A reproduction of bug in Firefox 68 that crashes FF with Marionette

## Installing

Note: I have ran this repository only under MacOS, though I'm pretty sure it will work with Linux.

```sh
npm ci
```

## Reproducing the bug

To run the reproduction, do

```sh
npm test
```

This will run a docker container with firefox headless, and then run a Selenium WebDriver
(`/src/ff68-scrollbarwidth-regression.hs`) test in NodeJS that will crash Firefox.

## How to make Firefox not crash

1. If you set the viewport width to 1000 (in line 18, instead of the given 1920),
   then the test won't crash.
1. If you choose another page to navigate to (you can uncomment line 25 and comment out line 24),
   then the test won't crash.
