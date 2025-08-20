<template>
  <div ref="cursor" class="cursor"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useStateStore } from "@/stores";
import { debounce } from "@/utils/debounce"; // <- 引入 utils

const state = useStateStore();
const cursor = ref<HTMLElement | null>(null);

let isSmallScreen = window.innerWidth <= 1024;
let moveHandler: ((e: MouseEvent) => void) | null = null;
let overHandler: ((e: MouseEvent) => void) | null = null;
let outHandler: ((e: MouseEvent) => void) | null = null;

const updateCursorVisibility = () => {
  if (!cursor.value) return;
  if (isSmallScreen) {
    cursor.value.style.display = "none";
    document.body.style.cursor = "auto"; // 恢復系統游標
  } else {
    cursor.value.style.display = "block";
    document.body.style.cursor = "none"; // 隱藏系統游標
  }
};

// 防抖 resize
const handleResize = debounce(() => {
  isSmallScreen = window.innerWidth <= 1024;

  // 更新游標顯示
  updateCursorVisibility();

  // 移除 hover 效果
  if (cursor.value) {
    cursor.value.classList.remove("grow", "grow-big");
  }
});

window.addEventListener("resize", handleResize);
onUnmounted(() => window.removeEventListener("resize", handleResize));

watch(
  () => state.isLoading,
  (newVal) => {
    if (!newVal) {
      setTimeout(updateCursorVisibility, 500);
    }
  }
);

onMounted(() => {
  const cursorEl = cursor.value;
  if (!cursorEl) return;

  updateCursorVisibility();

  // 滑鼠移動
  moveHandler = (e: MouseEvent) => {
    if (isSmallScreen) return; // 平板以下不跟隨
    cursorEl.style.left = e.clientX + "px";
    cursorEl.style.top = e.clientY + "px";
  };
  window.addEventListener("mousemove", moveHandler);

  // hover 事件（桌機才啟用）
  overHandler = (e: MouseEvent) => {
    if (isSmallScreen) return;
    const target = e.target as HTMLElement;
    if (target.closest(".cursor-scale")) cursorEl.classList.add("grow");
    if (target.closest(".cursor-invert")) cursorEl.classList.add("grow-big");
  };
  outHandler = (e: MouseEvent) => {
    if (isSmallScreen) return;
    const target = e.target as HTMLElement;
    if (target.closest(".cursor-scale")) cursorEl.classList.remove("grow");
    if (target.closest(".cursor-invert")) cursorEl.classList.remove("grow-big");
  };
  document.addEventListener("mouseover", overHandler);
  document.addEventListener("mouseout", outHandler);
});

onUnmounted(() => {
  if (moveHandler) window.removeEventListener("mousemove", moveHandler);
  if (overHandler) document.removeEventListener("mouseover", overHandler);
  if (outHandler) document.removeEventListener("mouseout", outHandler);

  document.body.style.cursor = "auto";
});
</script>

<style scoped>
.cursor {
  display: none; /* 初始隱藏，桌機 JS 顯示 */
  position: fixed;
  width: 3rem;
  height: 3rem;
  margin-left: -1.5rem;
  margin-top: -1.5rem;
  border-radius: 50%;
  border: 0.1875rem solid var(--color-brand-500);
  mix-blend-mode: multiply;
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
