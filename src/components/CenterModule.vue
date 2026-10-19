<template>
  <div class="center-module">
    <svg class="center-face" viewBox="0 0 276 110" aria-hidden="true">
      <defs>
        <linearGradient id="centerGradient" x1="0" y1="0" x2="0" y2="110">
          <stop offset="0" stop-color="#284663"></stop>
          <stop offset="1" stop-color="#0c2643"></stop>
        </linearGradient>
      </defs>
      <circle
        cx="138"
        cy="-32"
        r="136"
        fill="url(#centerGradient)"
        stroke="#dedfe0"
        stroke-width="3.5"
      ></circle>
    </svg>

    <svg class="progress" viewBox="0 0 276 110" aria-hidden="true">
      <path class="progress-track" d="M61 34 Q80 17 111 10"></path>
      <path class="progress-track" d="M165 10 Q196 17 215 34"></path>
      <path
        class="progress-value"
        pathLength="100"
        d="M61 34 Q80 17 111 10"
        :style="{ strokeDashoffset: leftDashOffset }"
      ></path>
      <path
        class="progress-value"
        pathLength="100"
        d="M165 10 Q196 17 215 34"
        :style="{ strokeDashoffset: rightDashOffset }"
      ></path>
      <circle class="progress-endpoint progress-endpoint--left" cx="61" cy="34" r="4"></circle>
      <circle class="progress-endpoint progress-endpoint--right" cx="215" cy="34" r="4"></circle>
    </svg>

    <div class="progress-percent">
      <strong>{{ progressDisplay }}</strong>
      <span>%</span>
    </div>
    <img class="center-logo" src="/img/logo.min.svg" alt="">
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useOverlay } from "../composables/useOverlay.js";

const { flightProgress } = useOverlay();

const leftDashOffset = computed(() => {
  const v = Math.min(100, Math.max(0, flightProgress.value));
  return 100 - Math.min(v / 50, 1) * 100;
});

const rightDashOffset = computed(() => {
  const v = Math.min(100, Math.max(0, flightProgress.value));
  return 100 - Math.max(0, (v - 50) / 50) * 100;
});

const progressDisplay = computed(() =>
  String(Math.round(Math.min(100, Math.max(0, flightProgress.value)))),
);
</script>
