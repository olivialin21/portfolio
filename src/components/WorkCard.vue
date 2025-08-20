<template>
  <a :href="props.link" target="_blank" rel="noopener noreferrer"
    class="bg-neutral-0 p-5 custom_shadow flex flex-col gap-6 hover:scale-102 transition-transform duration-300 cursor-scale">
    <img class="block h-[250px] object-cover object-center" :src="props.cover" :alt="props.title" />
    <div class="flex gap-3 grow">
      <div class="w-1.5 h-[1.625rem] mt-1.5 bg-brand-500 shrink-0"></div>
      <div class="flex flex-col">
        <h3 class="text-[1.5rem] font-bold mb-3">
          {{ props.title }}
        </h3>
        <div class="flex flex-col gap-2.5 grow">
          <ul class="list-disc pl-5 grow">
            <li v-for="(item, itemIndex) in props.content.list" :key="itemIndex">
              {{ item }}
            </li>
          </ul>
          <ul class="flex flex-wrap gap-y-1 gap-x-2">
            <li v-for="(tag, tagIndex) in props.content.tags" :key="tagIndex">
              <span class="inline-block text-[0.875rem] px-3 py-0.5 bg-secondary-400 text-secondary-700 rounded-full">
                {{ tag }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
const props = defineProps<{
  cover: string;
  title: string;
  link: string;
  content: {
    list: string[];
    tags: string[];
  };
}>();
</script>

<style scoped>
.custom_shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}
</style>