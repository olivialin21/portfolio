<template>
  <div class="flex gap-3">
    <div class="w-1.5 h-[1.625rem] mt-1.5 bg-brand-500 shrink-0"></div>
    <div>
      <h3 class="text-[1.5rem] font-bold text-secondary-700 mb-3">
        {{ props.title }}
      </h3>
      <ul class="flex flex-col gap-4">
        <li v-for="(content, contentIndex) in props.contents" :key="contentIndex">
          <h4 v-if="content.title" class="text-[1.25rem] font-bold mb-0.5">
            {{ content.title }}
          </h4>
          <p v-if="content.startDate && content.endDate" class="text-[0.875rem] text-secondary-700 mb-2">
            {{ content.startDate }} - {{ content.endDate }}
          </p>
          <p v-if="content.textArea" class="whitespace-pre-line">
            {{ content.textArea }}
          </p>
          <ul v-if="content.list" class="list-disc pl-5">
            <li v-for="(item, itemIndex) in content.list" :key="itemIndex">
              {{ item }}
            </li>
          </ul>
          <ul v-if="content.tags" class="flex flex-wrap gap-y-1 gap-x-2 mt-2.5">
            <li v-for="(tag, tagIndex) in content.tags" :key="tagIndex">
              <span class="inline-block text-[0.875rem] px-3 py-0.5 bg-secondary-400 text-secondary-700 rounded-full">
                {{ tag }}
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  contents: {
    title?: string;
    startDate?: string;
    endDate?: string;
    textArea?: string;
    list?: string[];
    tags?: string[];
  }[];
}>();
</script>

<style scoped></style>