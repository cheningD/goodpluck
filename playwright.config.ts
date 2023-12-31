import { defineConfig, devices } from "@playwright/test";

import { max_length_cloudflare_base_url } from "src/lib/constants";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Fail the build early on CI if you break too many tests. */
  maxFailures: process.env.CI ? 15 : undefined,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run preview",
        url: "http://127.0.0.1:8788/",
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
      },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.CI
      ? (() => {
          if (process.env.GITHUB_REF_NAME === "main") {
            return "https://goodpluck.pages.dev";
          }
          const basePart = "https://";
          const domainPart = ".goodpluck.pages.dev";
          const maxRefNameLength =
            max_length_cloudflare_base_url -
            (basePart.length + domainPart.length);
          const safeRefName = process.env.GITHUB_REF_NAME?.replace(
            /[^a-zA-Z0-9]/g,
            "-",
          )
            .substring(0, maxRefNameLength)
            .replace(/-+$/, "");
          return `${basePart}${safeRefName}${domainPart}`;
        })()
      : "http://localhost:8788",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
