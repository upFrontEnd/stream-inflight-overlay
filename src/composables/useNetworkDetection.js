import { useOverlay } from "./useOverlay.js";

const VATSIM_API = "https://data.vatsim.net/v3/vatsim-data.json";
const IVAO_API = "https://api.ivao.aero/v2/tracker/whazzup";
const NETWORK_POLL_INTERVAL = 30_000;

let prevNetworkAltitude = null;

function haversineNM(lat1, lon1, lat2, lon2) {
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLon = (lon2 - lon1) * toRad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLon / 2) ** 2;
  return 3440.065 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function inferFlightPhase(altitude, groundspeed) {
  const prev = prevNetworkAltitude;
  const trend = prev !== null ? altitude - prev : 0;
  prevNetworkAltitude = altitude;

  if (groundspeed < 5) return "PREFLIGHT";
  if (groundspeed < 50 && Math.abs(trend) < 100) return "TAXI";
  if (trend > 200) return "CLIMB";
  if (trend < -200) return groundspeed < 160 ? "APPROACH" : "DESCENT";
  if (groundspeed > 200) return "CRUISE";
  if (trend >= 0 && groundspeed >= 50) return "TAKEOFF";
  if (trend <= 0 && groundspeed < 160) return "LANDING";
  return "CRUISE";
}

export function useNetworkDetection() {
  const {
    currentCallsign,
    depCoords,
    arrCoords,
    setNetwork,
    setFlightPhase,
    setFlightProgress,
  } = useOverlay();

  function applyPilotData(pilot, networkName) {
    setNetwork(networkName);

    const alt = Number(pilot.altitude ?? 0);
    const gs = Number(pilot.groundspeed ?? 0);
    setFlightPhase(inferFlightPhase(alt, gs));

    const lat = Number(pilot.latitude);
    const lon = Number(pilot.longitude);

    if (
      depCoords.value &&
      arrCoords.value &&
      Number.isFinite(lat) &&
      Number.isFinite(lon)
    ) {
      const total = haversineNM(
        depCoords.value.lat,
        depCoords.value.lon,
        arrCoords.value.lat,
        arrCoords.value.lon,
      );
      if (total > 1) {
        const flown = haversineNM(
          depCoords.value.lat,
          depCoords.value.lon,
          lat,
          lon,
        );
        setFlightProgress(Math.min(100, Math.max(0, (flown / total) * 100)));
      }
    }
  }

  async function findOnVATSIM(cs) {
    try {
      const res = await fetch(VATSIM_API);
      if (!res.ok) return null;
      const data = await res.json();
      const pilot = data?.pilots?.find((p) => p.callsign === cs);
      if (!pilot) return null;
      return {
        latitude: pilot.latitude,
        longitude: pilot.longitude,
        altitude: pilot.altitude,
        groundspeed: pilot.groundspeed,
      };
    } catch {
      return null;
    }
  }

  async function findOnIVAO(cs) {
    try {
      const res = await fetch(IVAO_API);
      if (!res.ok) return null;
      const data = await res.json();
      const pilot = data?.clients?.pilots?.find((p) => p.callsign === cs);
      if (!pilot?.lastTrack) return null;
      return {
        latitude: pilot.lastTrack.latitude,
        longitude: pilot.lastTrack.longitude,
        altitude: pilot.lastTrack.altitude,
        groundspeed: pilot.lastTrack.groundSpeed,
      };
    } catch {
      return null;
    }
  }

  async function syncNetwork() {
    if (!currentCallsign.value) return;
    const [vatsim, ivao] = await Promise.all([
      findOnVATSIM(currentCallsign.value),
      findOnIVAO(currentCallsign.value),
    ]);
    if (vatsim) {
      applyPilotData(vatsim, "VATSIM");
      return;
    }
    if (ivao) {
      applyPilotData(ivao, "IVAO");
      return;
    }
    setNetwork("OFFLINE");
  }

  function startNetworkPolling() {
    setTimeout(() => {
      syncNetwork();
      setInterval(syncNetwork, NETWORK_POLL_INTERVAL);
    }, 5_000);
  }

  return { startNetworkPolling };
}
