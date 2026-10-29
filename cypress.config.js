const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    video: true,
    videoCompression: 32,
    videosFolder: "cypress/videos",
    screenshotsFolder: "cypress/screenshots",
    viewportWidth: 440,
    viewportHeight: 900,
    defaultCommandTimeout: 8000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
