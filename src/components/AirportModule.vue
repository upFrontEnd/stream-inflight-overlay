<template>
  <div :class="['airport', `airport--${type}`]" :data-airport="type">
    <div class="airport-face"></div>
    <div class="airport-content">
      <template v-if="type === 'departure'">
        <img
          id="departure-flag"
          v-show="flagVisible"
          :src="flagSrc"
          :alt="flagAlt"
          class="airport-flag"
          :data-country="country"
          @error="onFlagError"
          @load="onFlagLoad"
        >
        <div class="airport-text">
          <span class="airport-label">DEP</span>
          <span id="departure-code" class="airport-code" :data-icao="icao">{{ icao }}</span>
        </div>
      </template>
      <template v-else>
        <div class="airport-text">
          <span class="airport-label">ARR</span>
          <span id="arrival-code" class="airport-code" :data-icao="icao">{{ icao }}</span>
        </div>
        <img
          id="arrival-flag"
          v-show="flagVisible"
          :src="flagSrc"
          :alt="flagAlt"
          class="airport-flag"
          :data-country="country"
          @error="onFlagError"
          @load="onFlagLoad"
        >
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { getCountryName } from "../utils/airports.js";

const FLAG_BASE_URL = "https://flagcdn.com";

const props = defineProps({
  type: { type: String, required: true },
  icao: { type: String, default: "" },
  country: { type: String, default: "" },
});

const flagError = ref(false);

watch(
  () => props.country,
  () => { flagError.value = false; },
);

const flagSrc = computed(() =>
  props.country ? `${FLAG_BASE_URL}/${props.country.toLowerCase()}.svg` : "",
);

const flagAlt = computed(() =>
  props.country ? `Drapeau ${getCountryName(props.country)}` : "",
);

const flagVisible = computed(() => !!props.country && !flagError.value);

function onFlagError() { flagError.value = true; }
function onFlagLoad() { flagError.value = false; }
</script>
