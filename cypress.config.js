const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
    baseUrl: 'https://arthtattva-fe.dev.perimattic.dev',
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    video: true,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    apiUrl: 'https://arthtattva-be.dev.perimattic.dev',
  },
});
