import { ref, onMounted, onUnmounted } from "vue";

const BASE_WIDTH = 1920;
const HEADER_HEIGHT = 160;

export function useScale() {
  const viewportRef = ref(null);
  const scale = ref(1);
  let pendingFrame = 0;
  let resizeObserver = null;

  function fitOverlay() {
    const el = viewportRef.value;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w <= 0 || h <= 0) return;
    scale.value = Math.min(1, w / BASE_WIDTH, h / HEADER_HEIGHT);
  }

  function scheduleResize() {
    if (pendingFrame) cancelAnimationFrame(pendingFrame);
    pendingFrame = requestAnimationFrame(() => {
      pendingFrame = 0;
      fitOverlay();
    });
  }

  onMounted(() => {
    fitOverlay();
    window.addEventListener("resize", scheduleResize, { passive: true });
    if (typeof ResizeObserver !== "undefined" && viewportRef.value) {
      resizeObserver = new ResizeObserver(scheduleResize);
      resizeObserver.observe(viewportRef.value);
    }
  });

  onUnmounted(() => {
    window.removeEventListener("resize", scheduleResize);
    if (pendingFrame) cancelAnimationFrame(pendingFrame);
    if (resizeObserver) resizeObserver.disconnect();
  });

  return { viewportRef, scale };
}
