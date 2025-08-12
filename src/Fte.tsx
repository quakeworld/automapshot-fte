import { useEffect } from "react";
import { useFteLoader } from "@/vendor/fte/hooks";

declare global {
  interface Window {
    FTEC: {
      cbufadd: (command: string) => void;
    };
  }
}

const params = new URLSearchParams(window.location.search);
const posAngle = params.get("posAngle") || "";
const mapName = params.get("map") || "";

export function FteMapViewer() {
  const { isFteReady, isCameraReady } = useFteLoader({
    scriptPath: "/ftewebgl.js",
    mapName,
  });

  useEffect(() => {
    if (isFteReady) {
      fte_command(
        "alias f_spawn",
        `"setpos ${posAngle}; wait; wait; wait; echo camera.ready"`,
      );
    }
  }, [isFteReady]);

  return (
    <div>
      {isCameraReady && <div id="fteCameraIsReady" />}
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
