<template>
  <div id="works">
    <WorkTitle />
    <div class="custom_gradient">
      <div class="container mx-auto">
        <div
          class="px-5 sm:px-[3.125rem] py-12 sm:py-20 md:py-30 w-full lg:w-3/4 mx-auto grid gap-x-10 gap-y-6 md:gap-y-16 grid-cols-1 lg:grid-cols-2">
          <WorkCard v-for="(work, index) in worksData" :key="index" :cover="work.cover" :title="work.title"
            :content="work.content" :link="work.link" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WorkTitle from "@/components/WorkTitle.vue";
import WorkCard from "@/components/WorkCard.vue";
import worksData from "@/data/works.json";
</script>

<style scoped>
.custom_gradient {
  background: linear-gradient(to bottom, var(--color-secondary-400) 5%, var(--color-brand-500) 95%);
}
</style>