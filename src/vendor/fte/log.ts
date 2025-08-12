export function enableLogToEvents() {
  const log = console.log;

  function customLog(...args: any[]) {
    inspectMessage(args[0]);
    log.apply(console, args);
  }

  console.log = customLog;
}

function inspectMessage(message: any) {
  if (typeof message !== "string") {
    return false;
  }

  const event = eventByMessage(message);

  if (event) {
    window.dispatchEvent(event);
  }
}

function eventByMessage(message: string): Event | null {
  switch (message) {
    case "------- Quake Initialized -------":
      return new Event("fte.ready");
    case "camera.ready":
      return new Event("camera.ready");
    default:
      return null;
  }
}
