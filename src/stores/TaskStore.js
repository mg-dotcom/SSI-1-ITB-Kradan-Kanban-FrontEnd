import { ref } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";

export const useTaskStore = defineStore("TaskStore", () => ({
  state: () => ({}),
  actions: {
    testTask() {
      console.log("Test Task called");
    },
  },
}));

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot));
}
