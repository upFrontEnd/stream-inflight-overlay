<template>
  <div class="viewport" ref="viewportRef">
    <main class="overlay" :style="{ '--overlay-scale': scale.toFixed(6) }">
      <!-- Background -->
      <div class="top-rail"></div>
      <div class="cyan-line"></div>
      <div class="lower-rail"></div>

      <!-- Callsign -->
      <InfoGroup
        type="callsign"
        :value="callsign"
        label="CALLSIGN"
        value-id="callsign"
      >
        <template #icon>
          <svg
            class="item-icon item-icon--callsign"
            viewBox="0 0 32 28"
            aria-hidden="true"
          >
            <g class="headset-icon">
              <path d="M7 16v-3a9 9 0 0 1 18 0v3"></path>
              <path d="M7 15 H5.5 A2.5 2.5 0 0 0 3 17.5 V20 A2.5 2.5 0 0 0 5.5 22.5 H8 V15 Z"></path>
              <path d="M25 15 H26.5 A2.5 2.5 0 0 1 29 17.5 V20 A2.5 2.5 0 0 1 26.5 22.5 H24 V15 Z"></path>
            </g>
            <path class="headset-spark headset-spark--left" d="M2 7 L5 8 L3.5 11"></path>
            <path class="headset-spark headset-spark--right" d="M30 7 L27 8 L28.5 11"></path>
            <path class="headset-spark headset-spark--top" d="M16 1 L17 4 L15 5"></path>
          </svg>
        </template>
      </InfoGroup>

      <!-- Network -->
      <InfoGroup
        type="network"
        :value="network"
        label="NETWORK"
        value-id="network"
      >
        <template #icon>
          <svg
            class="item-icon item-icon--network"
            viewBox="0 0 28 28"
            aria-hidden="true"
          >
            <path class="wifi-wave wifi-wave--3" d="M3 10.5 Q14 1 25 10.5"></path>
            <path class="wifi-wave wifi-wave--2" d="M7 15 Q14 9 21 15"></path>
            <path class="wifi-wave wifi-wave--1" d="M11 19 Q14 16.5 17 19"></path>
            <circle class="wifi-dot" cx="14" cy="23" r="1.8"></circle>
          </svg>
        </template>
        <template #value>
          <img v-if="network === 'VATSIM'" :src="vatsimLogo" alt="VATSIM" class="network-logo">
          <img v-else-if="network === 'IVAO'" :src="ivaoLogo" alt="IVAO" class="network-logo">
          <span v-else id="network" class="info-value">{{ network }}</span>
        </template>
      </InfoGroup>

      <!-- Phase -->
      <InfoGroup
        type="phase"
        :value="flightPhase"
        label="PHASE"
        value-id="flight-phase"
        :reversed="true"
        :flight-phase="flightPhase"
      >
        <template #icon>
          <svg
            class="item-icon item-icon--phase"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <circle class="phase-dial" cx="16" cy="16" r="12.5"></circle>
            <g class="phase-horizon-group">
              <path class="phase-horizon-line" d="M6.5 16 H25.5"></path>
              <path class="phase-horizon-mark phase-horizon-mark--left" d="M8.5 12.5 H12"></path>
              <path class="phase-horizon-mark phase-horizon-mark--right" d="M20 12.5 H23.5"></path>
              <path class="phase-horizon-mark phase-horizon-mark--left" d="M10 20 H13"></path>
              <path class="phase-horizon-mark phase-horizon-mark--right" d="M19 20 H22"></path>
            </g>
            <g class="phase-aircraft-reference">
              <path d="M7.5 16 H12.5 L14.2 18 H17.8 L19.5 16 H24.5"></path>
              <path d="M16 18 V20.5"></path>
            </g>
            <circle class="phase-center-dot" cx="16" cy="16" r="1.25"></circle>
          </svg>
        </template>
      </InfoGroup>

      <!-- Aircraft -->
      <InfoGroup
        type="aircraft"
        :value="aircraft"
        label="AIRCRAFT"
        value-id="aircraft"
        :reversed="true"
      >
        <template #icon>
          <svg
            class="item-icon item-icon--aircraft"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              class="aircraft-animation-shape"
              d="
                M12 2
                C11 2 10.5 4.2 10.5 7.2
                V9.3
                L3 13.8
                V16
                L10.5 13.7
                V18.7
                L8 21
                V22
                L12 21
                L16 22
                V21
                L13.5 18.7
                V13.7
                L21 16
                V13.8
                L13.5 9.3
                V7.2
                C13.5 4.2 13 2 12 2
                Z
              "
            ></path>
          </svg>
        </template>
      </InfoGroup>

      <!-- Last follower -->
      <SocialStrip side="left" :value="latestFollower" />

      <!-- Latest sub -->
      <SocialStrip side="right" :value="latestSub" />

      <!-- Departure -->
      <AirportModule
        type="departure"
        :icao="departureIcao"
        :country="departureCountry"
      />

      <!-- Arrival -->
      <AirportModule
        type="arrival"
        :icao="arrivalIcao"
        :country="arrivalCountry"
      />

      <!-- Center module -->
      <CenterModule />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import vatsimLogo from "../img/vatsim.png";
import ivaoLogo from "../img/ivao.png";
import { useOverlay } from "./composables/useOverlay.js";
import { useScale } from "./composables/useScale.js";
import { useSimbrief } from "./composables/useSimbrief.js";
import { useNetworkDetection } from "./composables/useNetworkDetection.js";
import { useBuildTime } from "./composables/useBuildTime.js";
import { useTwitch } from "./composables/useTwitch.js";
import InfoGroup from "./components/InfoGroup.vue";
import AirportModule from "./components/AirportModule.vue";
import SocialStrip from "./components/SocialStrip.vue";
import CenterModule from "./components/CenterModule.vue";

const {
  callsign,
  aircraft,
  network,
  flightPhase,
  latestFollower,
  latestSub,
  departureIcao,
  departureCountry,
  arrivalIcao,
  arrivalCountry,
} = useOverlay();

const { viewportRef, scale } = useScale();
const { startSimBriefPolling } = useSimbrief();
const { startNetworkPolling } = useNetworkDetection();
const { startBuildTimePolling } = useBuildTime();
const { startTwitchPolling } = useTwitch();

onMounted(() => {
  startSimBriefPolling();
  startNetworkPolling();
  startBuildTimePolling();
  startTwitchPolling();
});
</script>
