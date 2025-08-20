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

        // 滾動時即時設定 borderWidth
        const aboutEl = document.querySelector('#about') as HTMLElement;
        if (aboutEl) {
          scrollTriggerInstance = ScrollTrigger.create({
            trigger: aboutEl,
            start: 'center center',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
              const progress = 1 - self.progress;
              gsap.set(outline.value!, {
                borderWidth: borderTarget * progress,
              });
            },
          });
        }

        // resize 用 debounce
        const handleResize = debounce(() => {
          updateBorderTarget();
          if (!scrollTriggerInstance || scrollTriggerInstance.progress === 0) {
            gsap.to(outline.value!, {
              borderWidth: borderTarget,
              duration: 0.3,
              ease: 'power2.out',
            });
          }
        });

        window.addEventListener('resize', handleResize);

        (window as any).__outlineCleanup = () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    },
    { immediate: true }
  );
});

onUnmounted(() => {
  if (scrollTriggerInstance) scrollTriggerInstance.kill();
  if ((window as any).__outlineCleanup) {
    (window as any).__outlineCleanup();
    delete (window as any).__outlineCleanup;
  }
});

</script>

<style scoped>
.custom_outline {
  border-width: 50vh 50vw;
}
</style>