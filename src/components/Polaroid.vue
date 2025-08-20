<template>
  <div class="bg-neutral-0 p-5 lg:p-4 xl:p-5 custom_shadow inline-block"
    :class="{ 'polaroid_decorate': props.decorate }">
    <img
      class="block w-full h-auto sm:w-[400px] sm:h-[400px] lg:w-[250px] lg:h-[250px] xl:w-[300px] xl:h-[300px] 2xl:w-[400px] 2xl:h-[400px] mb-4 object-cover object-center"
      :src="polaroidDate.photo" alt="photo" />
    <ul class="grow">
      <li v-for="(item, itemIndex) in polaroidDate.content" :key="itemIndex"
        class="flex items-center gap-2 text-[1.125rem] xl:text-[1.25rem]">
        <span class="inline-flex items-center justify-center w-[1.875rem] h-[1.875rem]">
          <font-awesome-icon :icon="item.icon" size="lg" />
        </span>
        <a v-if="'link' in item && item.link" :href="item.link" target="_blank" class="cursor-scale">{{ item.text }}</a>
        <span v-else>{{ item.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import polaroidDate from "@/data/polaroid.json";
const props = defineProps<{
  decorate?: boolean;
}>();
</script>

<style scoped>
.custom_shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.polaroid_decorate::before {
  content: '';
  position: absolute;
  top: 13%;
  left: -9%;
  width: 39%;
  height: 8%;
  transform: rotate(-43deg);
  transform-origin: left top;
  background-color: var(--color-brand-500);
  opacity: 0.8;
}

.polaroid_decorate::after {
  content: '';
  position: absolute;
  bottom: 10%;
  right: -10%;
  width: 40%;
  height: 7%;
  transform: rotate(-35deg);
  transform-origin: right bottom;
  background-color: var(--color-secondary-400);
  opacity: 0.8;
}
</style>