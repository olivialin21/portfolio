<template>
  <div ref="cursor" class="cursor"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useStateStore } from "@/stores";

const state = useStateStore();
const cursor = ref<HTMLElement | null>(null);

watch(
  () => state.isLoading,
  (newVal) => {
    if (!newVal) {
      setTimeout(() => {
        if (cursor.value) {
          cursor.value.style.display = "block";
        }
      }, 500);
    }
  }
);

onMounted(() => {
  const cursorEl = cursor.value;
  if (!cursorEl) return;

  // 滑鼠移動即時更新座標
  window.addEventListener("mousemove", (e) => {
    cursorEl.style.left = e.clientX + "px";
    cursorEl.style.top = e.clientY + "px";
  });

  // hover 判斷
  document.addEventListener("mouseover", (e) => {
    const target = e.target as HTMLElement;

    if (target.closest(".cursor-scale")) {
      cursorEl.classList.add("grow");
    }

    if (target.closest(".cursor-invert")) {
      cursorEl.classList.add("grow-big");
    }
  });

  document.addEventListener("mouseout", (e) => {
    const target = e.target as HTMLElement;
    if (target.closest(".cursor-scale")) {
      cursorEl.classList.remove("grow");
    }
    if (target.closest(".cursor-invert")) {
      cursorEl.classList.remove("grow-big");
    }
  });
});
</script>

<style scoped>
.cursor {
  display: none;
  position: fixed;
  width: 3rem;
  height: 3rem;
  margin-left: -1.5rem;
  margin-top: -1.5rem;
  border-radius: 50%;
  border: 0.1875rem solid var(--color-brand-500);
  mix-blend-mode: multiply;
  /* 3px */
  transition: transform 0.3s ease, background 0.3s ease;
  transform-origin: center center;
  pointer-events: none;
  z-index: 1000;
}

.cursor::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.375rem;
  height: 0.375rem;
  background-color: var(--color-brand-500);
  mix-blend-mode: multiply;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.grow,
.grow-big {
  background-color: rgba(241, 124, 103, 0.3);
  border: none;
}

.grow {
  transform: scale(2);
}

.grow-big {
  transform: scale(4);
}

:global(body) {
  cursor: none;
}
</style>
