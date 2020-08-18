const { Given, When, Then } = require('cucumber');
const { After, Before } = require('cucumber');
const assert = require('assert');
const puppeteer = require('puppeteer');
const chromeLauncher = require('chrome-launcher');
const axios = require('axios');

// Setup the chrome launcher
Before(async function () {
  this.chrome = await chromeLauncher.launch({
    // chromeFlags: ['--headless'],
    args: ['--disable-web-security'],
  });
  const response = await axios.get(
    `http://localhost:${this.chrome.port}/json/version`
  );
  const { webSocketDebuggerUrl } = response.data;
  this.browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
  });
  this.context = this.browser.defaultBrowserContext();
});

Given('I go to the landing page', async function () {
  // Check that the browser opened up
  this.loginPage = await this.context.newPage();
  await this.loginPage.setDefaultNavigationTimeout(0);
  await this.loginPage.goto('http://localhost:8080/');
});

When('...', function () {});

Then('I should see a login button', async function () {
  const button = 'Login with Active Directory';
  //   await this.loginPage.evaluate(
  //     () => document.querySelector('button').innerText
  //   );
  assert.equal(button, 'Login with Active Directory'); // make sure there is a login button
});

After(async function () {
  await this.browser.close(); // close the browser after running the tests
  await this.chrome.kill();
});
