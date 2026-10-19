import { useOverlay } from "./useOverlay.js";

const SIMBRIEF_API = "https://www.simbrief.com/api/xml.fetcher.php";
const SIMBRIEF_POLL_INTERVAL = 30_000;

let lastSimBriefReleaseId = null;

function getSimBriefUsername() {
  return (
    new URLSearchParams(window.location.search).get("simbrief") ||
    import.meta.env.VITE_SIMBRIEF_USERNAME ||
    ""
  );
}

export function useSimbrief() {
  const {
    setCallsign,
    setAircraft,
    setAirports,
    setCurrentCallsign,
    depCoords,
    arrCoords,
  } = useOverlay();

  async function syncSimBrief() {
    const username = getSimBriefUsername();
    if (!username) return;

    try {
      const url = `${SIMBRIEF_API}?username=${encodeURIComponent(username)}&json=1`;
      const response = await fetch(url);
      if (!response.ok) return;

      const data = await response.json();
      if (data?.fetch?.status !== "Success") return;

      const planTimestamp = data?.params?.time_generated;
      if (planTimestamp === lastSimBriefReleaseId) return;
      lastSimBriefReleaseId = planTimestamp;

      setAirports({
        departure: data?.origin?.icao_code,
        arrival: data?.destination?.icao_code,
      });

      const airline = String(data?.general?.icao_airline ?? "").trim();
      const flightNum = String(data?.general?.flight_number ?? "").trim();
      if (airline && flightNum) {
        setCallsign(airline + flightNum);
        setCurrentCallsign(airline + flightNum);
      }

      const acIcao = String(data?.aircraft?.icao_code ?? "").trim();
      if (acIcao) setAircraft(acIcao);

      const dLat = parseFloat(data?.origin?.pos_lat);
      const dLon = parseFloat(data?.origin?.pos_long);
      if (Number.isFinite(dLat) && Number.isFinite(dLon)) {
        depCoords.value = { lat: dLat, lon: dLon };
      }

      const aLat = parseFloat(data?.destination?.pos_lat);
      const aLon = parseFloat(data?.destination?.pos_long);
      if (Number.isFinite(aLat) && Number.isFinite(aLon)) {
        arrCoords.value = { lat: aLat, lon: aLon };
      }
    } catch {
      /* silent */
    }
  }

  function startSimBriefPolling() {
    if (!getSimBriefUsername()) return;
    syncSimBrief();
    setInterval(syncSimBrief, SIMBRIEF_POLL_INTERVAL);
  }

  return { startSimBriefPolling };
}
