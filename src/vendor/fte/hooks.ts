import { useEffect } from "react";
import { useBoolean, useEventListener, useScript } from "usehooks-ts";
import { getGeneralAssets, getMapAssets } from "@/vendor/fte/assets";
import { getAssetUrl } from "@/vendor/qwcloudfront/assets/assets";
import { enableLogToEvents } from "./log";

declare global {
  interface Window {
    Module: {
      canvas: HTMLCanvasElement;
      arguments: string[];
      manifest: string;
      files: object;
    };
  }
}

enableLogToEvents();
let didInit = false;

export function useFteLoader({
  scriptPath,
  mapName,
}: {
  scriptPath: string;
  mapName: string;
}) {
  const assets = {
    [`qw/maps/${mapName}.bsp`]: `/maps/${mapName}.bsp`,
    "id1/config.cfg": "config.cfg",
    "qw/qwprogs.qvm": "20240909-210239_2b31159_qwprogs.qvm",
    ...getGeneralAssets(),
    ...getMapAssets(mapName),
  };
  useScript(scriptPath, { removeOnUnmount: true });
  const { value: isFteReady, setTrue: setIsFteReady } = useBoolean(false);
  const { value: isCameraReady, setTrue: setIsCameraReady } = useBoolean(false);

  useEffect(() => {
    if (didInit) {
      return;
    }

    didInit = true;

    const manifestUrl = getAssetUrl("fte/default.fmf");
    window.Module = {
      canvas: document.getElementById("fteCanvas") as HTMLCanvasElement,
      manifest: manifestUrl,
      arguments: ["-manifest", manifestUrl, "+map", mapName],
      files: assets,
    };
  }, []);

  // @ts-ignore: custom event
  useEventListener("fte.ready", setIsFteReady);

  // @ts-ignore: custom event
  useEventListener("camera.ready", setIsCameraReady);

  return { isFteReady, isCameraReady };
}
