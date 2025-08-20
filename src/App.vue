<template>
  <div class="min-h-screen">
    <Loading />
    <Cursor />
    <Outline />
    <Navbar />
    <div class="container mx-auto px-10 lg:px-[3.125rem]">
      <div class="flex justify-center w-full h-full gap-16 xl:gap-20 2xl:gap-24">
        <div class="hidden lg:block shrink-0">
          <Polaroid :decorate="true" class="sticky top-[50vh] -translate-y-1/2 -rotate-3" />
        </div>
        <div class="w-full lg:w-[30vw] xl:w-[35vw]">
          <Hero />
          <About />
        </div>
      </div>
    </div>
    <Works />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useStateStore } from "./stores";
import Cursor from "@/components/Cursor.vue";
import Outline from "@/components/Outline.vue";
import Loading from "@/components/Loading.vue";
import Navbar from "@/components/Navbar.vue";
import Polaroid from "@/components/Polaroid.vue";
import Footer from "./components/Footer.vue";
import Hero from "@/sections/Hero.vue";
import About from "@/sections/About.vue";
import Works from "@/sections/Works.vue";

const store = useStateStore();

onMounted(() => {
  const images = Array.from(document.images);

  // 最少 loading 時間 1000ms
  const minLoading = new Promise((resolve) => setTimeout(resolve, 1000));

  if (images.length === 0) {
    // 沒有圖片就直接等待最少 loading 時間
    minLoading.then(() => store.setLoading(false));
  } else {
    // 包裝每張圖片的 load / error
    const imagePromises = images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.addEventListener("load", () => resolve());
            img.addEventListener("error", () => resolve());
          }
        })
    );

    // 等圖片與最少 loading 時間都完成
    Promise.all([minLoading, ...imagePromises]).then(() => {
      store.setLoading(false);
    });
  }
});

watch(
  () => store.isLoading,
  (loading) => {
    if (loading) {
      document.body.classList.add("no-scroll");
    } else {
      window.scrollTo(0, 0);
      setTimeout(() => {
        store.setLoadingFinished(true);
        document.body.classList.remove("no-scroll");
        document.documentElement.style.scrollBehavior = "smooth";
      }, 1500);
    }
  },
  { immediate: true }
);
</script>
