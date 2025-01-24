import { useFteLoader } from "@/vendor/fte/hooks";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    FTEC: {
      cbufadd: (command: string) => void;
    };
  }
}

const params = new URLSearchParams(window.location.search);

export function FteMapViewer() {
  const { engineIsReady, mapIsReady } = useFteLoader({
    scriptPath: "/ftewebgl.js",
    mapName: params.get("map") || "start",
  });
  const [shotReady, setShotReady] = useState(false);

  useEffect(() => {
    if (mapIsReady) {
      fte_command("setpos", params.get("posangle") || "");

      // wait for new pos to render
      window.setTimeout(() => {
        fte_command("cl_maxfps", 1);
        setShotReady(true);
      }, 250);
    }
  }, [mapIsReady]);

  return (
    <div>
      {engineIsReady && <div id="fteEngineIsReady" />}
      {shotReady && <div id="fteShotIsReady" />}
      <canvas id="fteCanvas" />
    </div>
  );
}

function fte_command(command: string, value?: undefined | string | number) {
  try {
    const commandStr = value !== undefined ? `${command} ${value}` : command;
    window.FTEC.cbufadd(`${commandStr}\n`);
  } catch (e) {
    console.log(`fte command error: ${e}`);
  }
}
