<template>
  <div ref="container" class="relative w-full overflow-hidden">
    <!-- 每一行 -->
    <div
      v-for="(line, idx) in repeatedLines"
      :key="idx"
      class="text-line"
      :class="`${bgColors[idx]} line${idx + 1}`"
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
            :key="`${icon}-${iIdx}`"
            :icon="icon"
            class="text-4xl sm:text-5xl md:text-7xl text-neutral-0 icon-item"
          />
        </template>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
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
  ["Vue", "React", "TailwindCSS", "SCSS", "JavaScript", "TypeScript", "Bootstrap"],
  [faFigma, faHtml5, faCss3Alt, faJs, faReact, faVuejs, faGitAlt, faNpm, faBootstrap],
];

// 底色
const bgColors = ["bg-brand-500", "bg-secondary-700", "bg-secondary-400"];

// 間距
const textGap = "2rem";
const iconGap = "1rem";

// 防抖函式
const debounce = (fn: Function, delay = 150) => {
  let timer: number | null = null;
  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
};

// 交錯 class：filled / outlined
const getWordClass = (wIdx: number, lineIdx: number) =>
  wIdx % 2 === 0 ? `filled line${lineIdx + 1}` : `outlined line${lineIdx + 1}`;

// 重複行內容
const repeatedLines = ref<Array<any>>([]);

const updateRepeatedLines = () => {
  if (!container.value) return;

  repeatedLines.value = lines.map((items, idx) => {
    if (idx === 2) {
      // 第三行 icon
      const containerWidth = container.value!.clientWidth;

      // 嘗試抓第一個 icon 的寬度
      const sampleIcon = container.value
        ? container.value.querySelector(".text-line:nth-child(3) .icon-item") as HTMLElement
        : null;
      const iconSize = sampleIcon ? sampleIcon.getBoundingClientRect().width : 64;

      const gapSize = parseInt(iconGap) || 0;
      const visibleCount = Math.ceil(containerWidth / (iconSize + gapSize)) * 2;

      return Array.from({ length: visibleCount }, (_, i) => items[i % items.length]);
    } else {
      const minRepeat = 20;
      return Array.from({ length: minRepeat }, (_, i) => items[i % items.length]);
    }
  });
};

let gsapInitialized = false;

// 初始化 GSAP 動畫
const initGSAP = () => {
  if (!container.value) return;

  const els = container.value.querySelectorAll(".text-line");
  els.forEach((el, idx) => {
    gsap.to(el, {
      x: idx % 2 === 0 ? "-10vw" : "10vw",
      ease: "none",
      scrollTrigger: {
        trigger: container.value,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
  gsapInitialized = true;
};

// resize 事件
const handleResize = debounce(async () => {
  updateRepeatedLines();
  await nextTick(); // 確保 DOM 完全更新
  ScrollTrigger.getAll().forEach((st) => st.kill());
  initGSAP();
});

onMounted(async () => {
  updateRepeatedLines();
  await nextTick(); // 等 DOM 渲染完成再初始化動畫
  initGSAP();

  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
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
