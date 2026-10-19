<template>
  <div :class="['social-strip', `social-strip--${side}`]">
    <template v-if="side === 'left'">
      <div class="social-tag social-tag--follower">
        <svg
          class="social-icon social-icon--follower"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle class="follower-ring" cx="12" cy="12" r="9"></circle>
          <g class="follower-plus">
            <path d="M12 7v10"></path>
            <path d="M7 12h10"></path>
          </g>
        </svg>
        <span class="social-label">LAST FOLLOW</span>
      </div>
      <div class="social-data social-data--left">
        <span
          id="latest-follower"
          :class="['social-value', { 'is-social-update': isAnimating }]"
        >{{ value }}</span>
      </div>
    </template>
    <template v-else>
      <div class="social-data social-data--right">
        <span
          id="latest-sub"
          :class="['social-value', { 'is-social-update': isAnimating }]"
        >{{ value }}</span>
      </div>
      <div class="social-tag social-tag--subscriber">
        <span class="social-label">LATEST SUB</span>
        <svg
          class="social-icon social-icon--subscriber"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle class="subscriber-ring" cx="12" cy="12" r="9"></circle>
          <path class="subscriber-check" d="M7.5 12 L10.5 15 L16.5 8"></path>
        </svg>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from "vue";

const props = defineProps({
  side: { type: String, required: true },
  value: { type: String, default: "" },
});

const isAnimating = ref(false);
let animTimer = null;

watch(
  () => props.value,
  async (newVal, oldVal) => {
    if (!newVal || newVal === oldVal) return;
    if (animTimer) clearTimeout(animTimer);
    isAnimating.value = false;
    await nextTick();
    isAnimating.value = true;
    animTimer = setTimeout(() => {
      isAnimating.value = false;
    }, 1100);
  },
);

onUnmounted(() => {
  if (animTimer) clearTimeout(animTimer);
});
</script>
