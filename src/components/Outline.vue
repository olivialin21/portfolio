<template>
  <div ref="outline" class="fixed inset-0 z-40 border border-brand-500 pointer-events-none custom_outline"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useStateStore } from '@/stores';
import { gsap } from 'gsap';
import { debounce } from '@/utils/debounce';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const store = useStateStore();
const outline = ref<HTMLElement | null>(null);

let initialized = false;
let scrollTriggerInstance: ScrollTrigger | null = null;
let borderTarget = 30;

const updateBorderTarget = () => {
  borderTarget = window.innerWidth >= 1280 ? 30 : 20;
};

const initScrollTrigger = () => {
  // 清除現有的 ScrollTrigger
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    scrollTriggerInstance = null;
  }

  const aboutEl = document.querySelector('#about') as HTMLElement;
  if (aboutEl && outline.value) {
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: aboutEl,
      start: 'center center',
      end: 'bottom bottom',
      scrub: true,
      refreshPriority: -1,
      onUpdate: (self) => {
        const progress = 1 - self.progress;
        gsap.set(outline.value!, {
          borderWidth: borderTarget * progress,
        });
      },
    });
  }
};

const getCurrentBorderWidth = () => {
  const aboutEl = document.querySelector('#about') as HTMLElement;
  if (!aboutEl) return borderTarget;

  const aboutRect = aboutEl.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const centerY = viewportHeight / 2;

  // 計算 about section 相對於 center center 的位置
  const aboutCenter = aboutRect.top + aboutRect.height / 2;
  
  if (aboutCenter > centerY) {
    // about section 還沒到 center center，border 應該是完整的
    return borderTarget;
  } else if (aboutRect.bottom < 0) {
    // about section 已經完全滾動過去，border 應該是 0
    return 0;
  } else {
    // 在觸發範圍內，計算進度
    const triggerStart = centerY;
    const triggerEnd = viewportHeight; // bottom bottom 相當於視窗底部
    const currentPos = Math.max(0, triggerStart - aboutCenter);
    const totalDistance = aboutRect.height / 2; // 從 center 到 bottom 的距離
    const progress = Math.min(1, currentPos / totalDistance);
    return borderTarget * (1 - progress);
  }
};

let handleResize: (() => void) | null = null;

onMounted(() => {
  watch(
    () => store.isLoading,
    (loading) => {
      if (!loading && outline.value && !initialized) {
        initialized = true;

        updateBorderTarget();

        // 初始縮小動畫
        setTimeout(() => {
          gsap.to(outline.value!, {
            borderWidth: borderTarget,
            duration: 1,
            ease: 'power2.out',
          });
        }, 500);

        // 初始化 ScrollTrigger
        setTimeout(() => {
          initScrollTrigger();
        }, 1500); // 等初始動畫完成後再初始化

        // resize 用 debounce
        handleResize = debounce(() => {
          updateBorderTarget();
          
          // 重新初始化 ScrollTrigger
          initScrollTrigger();
          
          // 立即設置正確的 border width
          const currentBorderWidth = getCurrentBorderWidth();
          gsap.set(outline.value!, {
            borderWidth: currentBorderWidth,
          });
        });

        window.addEventListener('resize', handleResize);
      }
    },
    { immediate: true }
  );
});

onUnmounted(() => {
  if (scrollTriggerInstance) scrollTriggerInstance.kill();
  if (handleResize) {
    window.removeEventListener('resize', handleResize);
  }
});

</script>

<style scoped>
.custom_outline {
  border-width: 50vh 50vw;
}
</style>