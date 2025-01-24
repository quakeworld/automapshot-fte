import { expect, test } from "@playwright/test";

import mapsConfig from "./config.maps";
import userConfig from "./config";
import { existsSync } from "node:fs";

const sysConfig = {
  testTimeout: 30_000,
  mapTimeout: 15_000,
};

for (const [name, posAngle] of Object.entries(mapsConfig)) {
  if (["", "todo"].includes(posAngle.toLowerCase())) {
    continue;
  }

  test(`#${name}#`, async ({ page }) => {
    const destPath = `./dist/${name}.jpg`;
    test.skip(
      userConfig.skipExisting && existsSync(destPath),
      "Screenshot already exists",
    );

    test.setTimeout(sysConfig.testTimeout);

    await test.step("load FTE", async () => {
      await page.setViewportSize({
        width: userConfig.width,
        height: userConfig.height,
      });
      await page.goto(`http://localhost:5173?map=${name}&posangle=${posAngle}`);
      await expect(page.locator("#fteEngineIsReady")).toBeAttached();
    });

    const fte = page.locator("#fteCanvas");

    await test.step("set pos/angle", async () => {
      await expect(page.locator("#fteShotIsReady")).toBeAttached({
        timeout: sysConfig.mapTimeout,
      });
    });

    await test.step("save screenshot", async () => {
      await fte.screenshot({
        animations: "disabled",
        path: destPath,
        quality: userConfig.jpegQuality,
        type: "jpeg",
      });
    });
  });
}
