<script setup>
import submitButton from "../button/Button.vue";
import { useRoute } from "vue-router";
import { useBoardStore } from "../../stores/BoardStore.js";
import { ref, onMounted } from "vue";

const limitMaximumTask = ref(false);
const maximumTask = ref(10);
const boardStore = useBoardStore();

const route = useRoute();

const boardId = route.params.id;

onMounted(async () => {
  await boardStore.loadBoards();
  const board = boardStore.getBoardById(boardId);
  limitMaximumTask.value = board.limitMaximumTask;
  maximumTask.value = board.maximumTask;
});

const toggleLimitStatus = () => {
  limitMaximumTask.value = !limitMaximumTask.value;
};

defineEmits(["closeLimitStatus", "saveLimitStatus"]);
</script>

<template>
  <div
    class="itbkk-modal-setting fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div
      class="bg-white p-6 rounded-lg shadow-lg xl:w-[40%] lg:w-[54%] md-vertical:w-[75%] md-vertical:m-auto mobile:m-8"
    >
      <div class="font-bold mb-4 md-vertical:text-base text-sm">
        <p>Status Settings</p>
      </div>
      <div class="title-line w-full h-px bg-gray-300 mb-4"></div>
      <div class="itbkk-message mb-6 break-all">
        <p class="itbkk-massage md-vertical:text-base text-sm">
          Users can limit the number of task in a status by setting the Maximum
          tasks in each status (except "No Status" and "Done" status).
        </p>
        <div class="my-3">
          <label class="inline-flex items-center cursor-pointer">
            <input
              v-model="limitMaximumTask"
              type="checkbox"
              @click="toggleLimitStatus"
              class="itbkk-limit-task toggle toggle-success"
              checked
            />
            <span
              class="ms-3 text-gray-900 dark:text-gray-300 md-vertical:text-base text-sm"
              >Limit tasks in this status</span
            >
          </label>
        </div>

        <div class="flex">
          <p
            class="pr-5 content-center text-green-status font-bold md-vertical:text-base text-sm md-vertical:pr-5 mobile:pr-4"
          >
            Maximum tasks
          </p>
          <input
            type="text"
            v-model="maximumTask"
            disabled="disabled"
            class="itbkk-max-task bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>
      <div class="button-container flex justify-end">
        <submitButton
          buttonType="cancel"
          class="itbkk-button-cancel"
          @click="$emit('closeLimitStatus')"
          >Cancel</submitButton
        >
        <submitButton
          buttonType="ok"
          class="itbkk-button-confirm"
          @click="$emit('saveLimitStatus', limitMaximumTask, maximumTask)"
          >Save</submitButton
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
