<template>
  <div ref="container" class="relative w-full overflow-hidden">
    <!-- 每一行 -->
    <div
      v-for="(line, idx) in repeatedLines"
      :key="idx"
      class="text-line"
      :class="`line${idx + 1}`"
      :style="{ backgroundColor: bgColors[idx] }"
    >
      <span class="inline-flex items-center" :style="{ gap: idx === 2 ? iconGap : textGap }">
        <!-- 前兩行文字 -->
        <template v-if="idx < 2">
          <span
            v-for="(word, wIdx) in line"
            :key="`${word}-${wIdx}`"
            :class="getWordClass(wIdx, idx)"
          >
            {{ word }}
          </span>
        </template>

        <!-- 第三行 icon -->
        <template v-else>
          <font-awesome-icon
            v-for="(icon, iIdx) in line"
            :key="`${icon.iconName}-${iIdx}`"
            :icon="icon"
            class="text-4xl sm:text-5xl md:text-7xl text-neutral-0"
          />
        </template>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  faFigma,
  faCss3Alt,
  faHtml5,
  faJs,
  faReact,
  faVuejs,
  faGitAlt,
  faNpm,
  faBootstrap,
} from "@fortawesome/free-brands-svg-icons";

gsap.registerPlugin(ScrollTrigger);

const container = ref<HTMLElement | null>(null);

// 內容：兩行字 + 一行 icon
const lines = [
  ["作品介紹", "PROJECTS"],
  ["Vue", "React", "TailwindCSS", "JavaScript", "TypeScript"],
  [faFigma, faHtml5, faCss3Alt, faJs, faReact, faVuejs, faGitAlt, faNpm, faBootstrap],
];

// 底色
const bgColors = ["var(--color-brand-500)", "var(--color-secondary-700)", "var(--color-secondary-400)"];

// 間距
const textGap = "2rem";
const iconGap = "1rem";

// 監控視窗寬度
const windowWidth = ref(window.innerWidth);

// 防抖 resize
let resizeTimeout: number | undefined;
const updateWidth = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    windowWidth.value = window.innerWidth;
  }, 150);
};

// 交錯 class：filled / outlined
const getWordClass = (wIdx: number, lineIdx: number) =>
  wIdx % 2 === 0 ? `filled line${lineIdx + 1}` : `outlined line${lineIdx + 1}`;

// 用 computed 預先生成「重複後的行內容」
const repeatedLines = computed(() => {
  return lines.map((items, idx) => {
    if (idx === 2) {
      // 第三行 icon：僅生成可視範圍 icon
      if (!container.value) return [];
      const containerWidth = container.value.clientWidth;
      const iconSize = 64; // 假設每個 icon 寬度 64px
      const gapSize = parseInt(iconGap) || 0;
      const visibleCount = Math.ceil(containerWidth / (iconSize + gapSize)) * 2; // 乘 2 避免滾動時空白
      return Array.from({ length: visibleCount }, (_, i) => items[i % items.length]);
    } else {
      const minRepeat = 20;
      return Array.from({ length: minRepeat }, (_, i) => items[i % items.length]);
    }
  });
});

let gsapInitialized = false;

// 初始化 GSAP 動畫
const initGSAP = () => {
  if (!container.value || gsapInitialized) return;
  gsapInitialized = true;

  const els = container.value.querySelectorAll(".text-line");
  els.forEach((el, idx) => {
    gsap.to(el, {
      x: idx % 2 === 0 ? "-10vw" : "10vw",
      ease: "none",
      scrollTrigger: {
        trigger: container.value,
        scrub: true,
      },
    });
  });
};

onMounted(() => {
  window.addEventListener("resize", updateWidth);
  initGSAP();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
  ScrollTrigger.getAll().forEach((st) => st.kill());
});
</script>

<style scoped>
.text-line {
  font-size: 4rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  padding: 1rem 0;
  white-space: nowrap;
  overflow: hidden;
  width: 120vw;
  margin-left: -10vw;
}

/* 實體字 */
.filled {
  color: #fff;
}

/* 外框字 */
.outlined {
  color: transparent;
  text-shadow: 1px 1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff, -1px -1px 0 #fff;
}

/* 不同 line 可客製樣式 */
.outlined.line1 {
  color: var(--color-brand-500);
}

.outlined.line2 {
  color: var(--color-secondary-700);
}

/* 響應式字體 */
@media (max-width: 768px) {
  .text-line {
    font-size: 2.5rem;
  }
}

@media (max-width: 640px) {
  .text-line {
    font-size: 1.75rem;
    padding: 0.5rem 0;
  }
}
</style>
