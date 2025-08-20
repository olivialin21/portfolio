<template>
  <div id="about" class="lg:py-16">
    <div class="text-center lg:text-left">
      <h2
        class="inline-block py-1 px-5 mb-6 bg-brand-500 text-neutral-0 text-[1.5rem] sm:text-[2.25rem] font-bold text-nowrap">
        林渝珊 Olivia Lin
      </h2>
    </div>
    <div class="block lg:hidden mb-6 text-center">
      <Polaroid />
    </div>
    <main class="flex flex-col gap-10">
      <AboutCard v-for="(item, index) in aboutData" :key="index" :title="item.title" :contents="item.contents" />
    </main>
  </div>
</template>

<script setup lang="ts">
import AboutCard from "@/components/AboutCard.vue";
import Polaroid from "@/components/Polaroid.vue";
import aboutData from "@/data/about.json";
</script>

<style scoped></style>