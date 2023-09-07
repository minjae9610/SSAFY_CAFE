import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCommonStore = defineStore("common", () => {
  const title = ref("SSAFY-CAFE");

  function getTitle() {
    return title.value;
  }

  function setTitle(newTitle) {
    title.value = newTitle;
  }

  return { getTitle, setTitle };
});
