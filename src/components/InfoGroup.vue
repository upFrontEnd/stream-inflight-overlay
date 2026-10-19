<template>
  <div
    :class="['info-group', `info-group--${type}`]"
    :data-flight-phase="type === 'phase' ? flightPhase : undefined"
  >
    <template v-if="!reversed">
      <div :class="['info-tag', `info-tag--${type}`]">
        <slot name="icon" />
        <span class="info-label">{{ label }}</span>
      </div>
      <div class="info-data">
        <span :id="valueId" class="info-value">{{ value }}</span>
      </div>
    </template>
    <template v-else>
      <div class="info-data info-data--right">
        <span :id="valueId" class="info-value">{{ value }}</span>
      </div>
      <div :class="['info-tag', `info-tag--${type}`]">
        <slot name="icon" />
        <span class="info-label">{{ label }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, required: true },
  value: { type: String, default: "" },
  label: { type: String, default: "" },
  reversed: { type: Boolean, default: false },
  flightPhase: { type: String, default: "" },
  valueId: { type: String, default: undefined },
});
</script>
