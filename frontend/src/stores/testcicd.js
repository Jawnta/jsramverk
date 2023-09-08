import { ref } from 'vue';
import { defineStore } from 'pinia';

export const asd = defineStore('train', () => {
  // Try to get the train from localStorage or default to null
  const asd = ref(JSON.parse(localStorage.getItem('train')) || null);

  const setTrain = (train) => {
    localStorage.setItem('train', JSON.stringify(train));
    currentTrain.value = train;
  }

  return { currentTrain, setTrain };
});
