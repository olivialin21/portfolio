import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStateStore = defineStore('state', () => {
  const isLoading = ref(true);
  const loadingFinished = ref(false);

  const setLoading = (value: boolean) => {
    isLoading.value = value;
  }

  const setLoadingFinished = (value: boolean) => {
    loadingFinished.value = value;
  }

  return {
    isLoading, setLoading,
    loadingFinished, setLoadingFinished
  };
});
