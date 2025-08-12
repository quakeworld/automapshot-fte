import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
} from "@playwright/test";

// https://playwright.dev/docs/test-configuration
export default defineConfig({
  fullyParallel: false,
  workers: 1,
  webServer: {
    command: "pnpm dev",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
}) satisfies PlaywrightTestConfig;
