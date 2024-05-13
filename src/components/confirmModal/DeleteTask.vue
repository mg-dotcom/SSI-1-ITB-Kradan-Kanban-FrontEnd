<script setup>
import submitButton from "../button/Button.vue";
import { ref, defineProps } from "vue";
import { useRouter } from "vue-router";
import { useTaskStore } from "../../stores/TaskStore.js";

const props = defineProps({
  selectedId: Number,
  selectedIndex: Number,
});

const emit = defineEmits(["confirmDeleteTask"]);

const taskStore = useTaskStore();
const selectedTask = taskStore.getTaskById(props.selectedId);

const deleteTask = async () => {
  await taskStore.deleteTask(props.selectedId);
  emit("confirmDeleteTask");
};
</script>

<template>
  <div
    class="delete-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white max-w-md p-6 rounded-lg shadow-lg">
      <div class="font-bold mb-4">
        <p>Delete a Task!</p>
      </div>
      <div class="title-line w-full h-px bg-gray-300 mb-4"></div>
      <div class="itbkk-message mb-6 break-all">
        <p>
          Do you want to delete the task number {{ selectedIndex + 1 }} -
          {{ selectedTask.title }} ?
        </p>
      </div>
      <div class="button-container flex justify-end">
        <div class="itbkk-button-cancel">
          <submitButton buttonType="cancel" @click="$emit('closeDelete')"
            >Cancel</submitButton
          >
        </div>
        <div class="itbkk-button-confirm">
          <submitButton buttonType="ok" @click="deleteTask"
            >Confirm</submitButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>