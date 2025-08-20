<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 h-screen flex flex-col items-center justify-center loading_container"
  >
    <div ref="box" class="w-8 h-8 lg:w-10 lg:h-10 bg-neutral-0 box"></div>
    <p
      ref="loadingText"
      class="absolute text-[1.125rem] lg:text-[1.5rem] mt-6 lg:mt-10 left-1/2 top-1/2 text-neutral-0 text-center font-bold loading_text transition-opacity duration-500"
      :class="{ 'opacity-0': !store.isLoading }"
    >
      Loading...
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useStateStore } from "@/stores";
import { gsap } from "gsap";

const store = useStateStore();
const box = ref<HTMLElement | null>(null);
const show = ref(true);

onMounted(() => {
  if (box.value) {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 }); // 無限循環

    tl.to(box.value, {
      y: -50,
      rotation: 180,
      duration: 0.5,
      ease: "power1.out",
    }).to(box.value, {
      y: 0,
      rotation: 360,
      duration: 0.5,
      ease: "power1.in",
    });
  }
});

watch(
  () => store.isLoading,
  (newVal) => {
    if (!newVal) {
      if (box.value) {
        gsap.to(box.value, {
          scale: 0,
          y: 0,
          rotation: 360,
          duration: 0.5,
          ease: "power1.in",
          onComplete: () => {
            show.value = false;
          },
        });
      }
    }
  }
);
</script>

<style lang="scss" scoped>
.box {
  transform-origin: center;
}

.loading {
  &_container {
    pointer-events: none;
  }

  &_text {
    transform: translateX(-50%);
  }
}
</style>
