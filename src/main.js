import { createApp } from "vue";
import App from "./App.vue";
import "../scss/style.scss";
import {
  setCallsign,
  setAircraft,
  setNetwork,
  setFlightProgress,
  setDepartureAirport,
  setArrivalAirport,
  setAirports,
  refreshAirportFlags,
  setFlightPhase,
  setLatestFollower,
  setLatestSub,
} from "./composables/useOverlay.js";

createApp(App).mount("#app");

window.setCallsign = setCallsign;
window.setAircraft = setAircraft;
window.setNetwork = setNetwork;
window.setFlightProgress = setFlightProgress;
window.setDepartureAirport = setDepartureAirport;
window.setArrivalAirport = setArrivalAirport;
window.setAirports = setAirports;
window.refreshAirportFlags = refreshAirportFlags;
window.setFlightPhase = setFlightPhase;
window.setLatestFollower = setLatestFollower;
window.setLatestSub = setLatestSub;
