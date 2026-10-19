import { ref } from "vue";
import {
  normalizeICAO,
  normalizeCountryCode,
  getAirportCountry,
} from "../utils/airports.js";

const VALID_FLIGHT_PHASES = new Set([
  "PREFLIGHT",
  "TAXI",
  "TAKEOFF",
  "CLIMB",
  "CRUISE",
  "DESCENT",
  "APPROACH",
  "LANDING",
]);

/* ── Singleton state ─────────────────────────────── */

const callsign = ref("");
const aircraft = ref("");
const network = ref("");
const flightPhase = ref("");
const flightProgress = ref(0);
const latestFollower = ref("");
const latestSub = ref("");
const departureIcao = ref("");
const departureCountry = ref("");
const arrivalIcao = ref("");
const arrivalCountry = ref("");
const depCoords = ref(null);
const arrCoords = ref(null);
const currentCallsign = ref("");

/* ── Setters ─────────────────────────────────────── */

export function setCallsign(value) {
  const next = String(value ?? "").trim();
  if (next) callsign.value = next;
}

export function setAircraft(value) {
  const next = String(value ?? "").trim();
  if (next) aircraft.value = next;
}

export function setNetwork(value) {
  const next = String(value ?? "").trim();
  if (next) network.value = next;
}

export function setFlightProgress(percentage) {
  const num = Number(percentage);
  if (Number.isFinite(num)) {
    flightProgress.value = Math.min(100, Math.max(0, num));
  }
}

export function setFlightPhase(phase) {
  const value = String(phase ?? "").trim().toUpperCase();
  if (!value) return;
  flightPhase.value = value;
  return VALID_FLIGHT_PHASES.has(value);
}

function updateAirport(icaoRef, countryRef, icao, country) {
  const norm = normalizeICAO(icao);
  if (!norm) return;
  icaoRef.value = norm;
  const resolved = normalizeCountryCode(country) || getAirportCountry(norm);
  countryRef.value = resolved;
}

export function setDepartureAirport(icao, country) {
  updateAirport(departureIcao, departureCountry, icao, country);
}

export function setArrivalAirport(icao, country) {
  updateAirport(arrivalIcao, arrivalCountry, icao, country);
}

export function setAirports({ departure, arrival } = {}) {
  if (departure) {
    if (typeof departure === "string") setDepartureAirport(departure);
    else setDepartureAirport(departure.icao, departure.country);
  }
  if (arrival) {
    if (typeof arrival === "string") setArrivalAirport(arrival);
    else setArrivalAirport(arrival.icao, arrival.country);
  }
}

export function refreshAirportFlags() {
  departureCountry.value = getAirportCountry(departureIcao.value);
  arrivalCountry.value = getAirportCountry(arrivalIcao.value);
}

export function setLatestFollower(username) {
  const next = String(username ?? "").trim();
  if (next) latestFollower.value = next;
}

export function setLatestSub(username) {
  const next = String(username ?? "").trim();
  if (next) latestSub.value = next;
}

export function setCurrentCallsign(value) {
  currentCallsign.value = String(value ?? "").trim();
}

/* ── Composable ──────────────────────────────────── */

export function useOverlay() {
  return {
    callsign,
    aircraft,
    network,
    flightPhase,
    flightProgress,
    latestFollower,
    latestSub,
    departureIcao,
    departureCountry,
    arrivalIcao,
    arrivalCountry,
    depCoords,
    arrCoords,
    currentCallsign,
    setCallsign,
    setAircraft,
    setNetwork,
    setFlightProgress,
    setFlightPhase,
    setDepartureAirport,
    setArrivalAirport,
    setAirports,
    refreshAirportFlags,
    setLatestFollower,
    setLatestSub,
    setCurrentCallsign,
  };
}
