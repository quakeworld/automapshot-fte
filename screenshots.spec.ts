import { createWriteStream, existsSync } from "node:fs";
import { Readable } from "node:stream";
import { expect, test } from "@playwright/test";
import userConfig from "./config";
import mapsConfig from "./config.maps";

const sysConfig = {
  testTimeout: 30_000,
  mapTimeout: 15_000,
};

for (const [mapName, posAngle] of Object.entries(mapsConfig)) {
  if (["", "todo"].includes(posAngle.toLowerCase())) {
    continue;
  }

  test(`#${mapName}#`, async ({ page }) => {
    const screenshotDestPath = `./dist/${mapName}.jpg`;
    test.skip(
      userConfig.skipExisting && existsSync(screenshotDestPath),
      "Screenshot already exists",
    );
    test.setTimeout(sysConfig.testTimeout);

    await test.step("download map", async () => {
      const destPath = `public/maps/${mapName}.bsp`;

      if (!existsSync(destPath)) {
        await downloadMap(mapName, destPath);
      }
    });

    await test.step("load FTE", async () => {
      await page.setViewportSize({
        width: userConfig.width,
        height: userConfig.height,
      });
      await page.goto(
        `http://localhost:5173?map=${mapName}&posAngle=${posAngle}`,
      );
      await expect(page.locator("#fteCameraIsReady")).toBeAttached({
        timeout: sysConfig.mapTimeout,
      });
    });

    await test.step("save screenshot", async () => {
      const fte = page.locator("#fteCanvas");
      await fte.screenshot({
        animations: "disabled",
        path: screenshotDestPath,
        quality: userConfig.jpegQuality,
        type: "jpeg",
      });
    });
  });
}

async function downloadMap(mapName: string, destPath: string): Promise<void> {
  const response = await fetch(`https://a.quake.world/maps/${mapName}.bsp`);
  if (!response.ok) {
    throw new Error(
      `Download failed: ${response.status} ${response.statusText}`,
    );
  }

  const nodeStream = Readable.fromWeb(response.body as any);
  const fileStream = createWriteStream(destPath);

  await new Promise<void>((resolve, reject) => {
    nodeStream.pipe(fileStream);
    nodeStream.on("error", reject);
    fileStream.on("finish", resolve);
    fileStream.on("error", reject);
  });
}
