<template>
  <div>
    <!-- Hamburger button (lg 以下顯示) -->
    <transition name="fade">
      <button v-if="showHamburger" @click="isOpen = !isOpen"
        class="lg:hidden fixed top-0 right-0 z-50 w-[3.125rem] h-[3.125rem] bg-brand-500 text-neutral-0">
        <font-awesome-icon :icon="isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" size="lg" />
      </button>
    </transition>

    <!-- 大螢幕 navbar -->
    <nav
      class="hidden lg:flex fixed top-[50vh] -translate-y-1/2 right-14 xl:right-16 z-30 pointer-events-auto text-[1.5rem] font-bold text-secondary-700">
      <ul ref="navList" class="space-y-2">
        <li v-for="(item, index) in navItems" :key="index">
          <a :href="item.href" class="block cursor-scale pl-4.5"
            :class="activeIndex === index ? 'opacity-100' : 'opacity-50'">
            {{ item.text }}
          </a>
        </li>
        <!-- 活動方塊 -->
        <span ref="activeIndicator" class="absolute left-0 w-2 h-7 bg-brand-500"></span>
      </ul>
    </nav>

    <nav ref="hamburgerMenu" class="lg:hidden fixed top-0 right-0 bg-brand-500 shadow-lg z-40 pt-[3.125rem] pb-6 ">
      <ul>
        <li v-for="(item, index) in navItems" :key="index">
          <a :href="item.href" @click="isOpen = false" class="block text-neutral-0 font-bold text-[1.125rem] px-6 py-2">
            {{ item.text }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { useStateStore } from '@/stores';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
gsap.registerPlugin(ScrollTrigger);

const store = useStateStore();
const navItems = [
  { text: '首　　頁', href: '#hero' },
  { text: '個人簡介', href: '#about' },
  { text: '作品介紹', href: '#works' },
];

const activeIndex = ref(0);
const isOpen = ref(false);
const showHamburger = ref(false);

const navList = ref<HTMLElement | null>(null);
const activeIndicator = ref<HTMLElement | null>(null);
const hamburgerMenu = ref<HTMLElement | null>(null);

watch(isOpen, (val) => {
  const el = hamburgerMenu.value;
  if (!el) return;

  if (val) {
    gsap.to(el, { x: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" });
  } else {
    gsap.to(el, { x: 100, autoAlpha: 0, duration: 0.3, ease: "power2.in" });
  }
});

const moveIndicator = (index: number) => {
  if (!navList.value || !activeIndicator.value) return;
  const li = navList.value.children[index] as HTMLElement;
  if (!li) return;
  const targetTop = li.offsetTop + li.clientHeight / 2 - activeIndicator.value.clientHeight / 2;

  gsap.to(activeIndicator.value, {
    top: targetTop,
    duration: 0.3,
    ease: 'power2.out',
  });
}

const updateNavColor = (isWorks: boolean) => {
  if (!navList.value || !activeIndicator.value) return;

  const textColor = isWorks ? '#ffffff' : '#854836';
  const indicatorColor = isWorks ? '#ffffff' : '#F17C67';

  Array.from(navList.value.children).forEach((li) => {
    const a = (li as HTMLElement).querySelector('a');
    if (a) a.style.color = textColor;
  });

  gsap.to(activeIndicator.value, {
    backgroundColor: indicatorColor,
    duration: 0.3,
  });
};


onMounted(() => {
  let initialized = false;

  if (hamburgerMenu.value) {
    gsap.set(hamburgerMenu.value, { x: 100, autoAlpha: 0 });
  }
  const unwatch = watch(
    () => store.isLoading,
    async (loading) => {
      if (!loading && !initialized) {
        initialized = true;

        // 延遲 1 秒才顯示漢堡按鈕
        setTimeout(() => {
          showHamburger.value = true;
        }, 1000);

        await nextTick();
        moveIndicator(activeIndex.value); // 初始方塊位置

        // ScrollTrigger 設定
        navItems.forEach((item, index) => {
          const section = document.querySelector(item.href) as HTMLElement;
          if (section) {
            ScrollTrigger.create({
              trigger: section,
              start: 'top center',
              end: 'bottom center',
              onEnter: () => {
                activeIndex.value = index;
                moveIndicator(index);
              },
              onEnterBack: () => {
                activeIndex.value = index;
                moveIndicator(index);
              }
            });
          }

          const worksSection = document.querySelector('#works') as HTMLElement;
          if (worksSection) {
            ScrollTrigger.create({
              trigger: worksSection,
              start: 'top center',
              end: 'bottom center',
              onEnter: () => updateNavColor(true),
              onEnterBack: () => updateNavColor(true),
              onLeave: () => updateNavColor(false),
              onLeaveBack: () => updateNavColor(false),
            });
          }
        });

        unwatch();
      }
    },
    { immediate: true }
  );
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform .3s ease;
}

.slide-leave-to {
  transform: translateY(0);
}

.slide-enter-from {
  transform: translateY(-100%);
}

ul {
  position: relative;
}

ul>span {
  top: 0;
  transition: none;
}
</style>
