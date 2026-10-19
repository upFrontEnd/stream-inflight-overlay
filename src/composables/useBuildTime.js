/* global __BUILD_TIME__ */
const CURRENT_BUILD_TIME =
  typeof __BUILD_TIME__ !== "undefined" ? __BUILD_TIME__ : 0;

export function useBuildTime() {
  async function checkForNewDeploy() {
    try {
      const url = new URL("build-time.json", window.location.href);
      url.searchParams.set("_", String(Date.now()));
      const response = await fetch(url.toString());
      if (!response.ok) return;
      const { t } = await response.json();
      if (t > CURRENT_BUILD_TIME) {
        const freshUrl = new URL(window.location.href);
        freshUrl.searchParams.set("_v", String(t));
        window.location.replace(freshUrl.toString());
      }
    } catch {
      /* silent */
    }
  }

  function startBuildTimePolling() {
    setInterval(checkForNewDeploy, 60_000);
  }

  return { startBuildTimePolling };
}
