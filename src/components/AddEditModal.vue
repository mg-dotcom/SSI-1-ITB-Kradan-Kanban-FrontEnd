<script setup>
import ModalDetail from "./ModalDetail.vue";
import buttonSubmit from "./button/Button.vue";

import { defineProps, defineEmits, computed, ref, watch } from "vue";

const props = defineProps({
  selectedTask: Object,
  localTimeZone: String,
});
const task = ref({
  title: props.selectedTask.title.trim(),
  description: props.selectedTask.description.trim(),
  assignees: props.selectedTask.assignees.trim(),
  status: props.selectedTask.status.trim(),
});

watch(
  () => props.selectedTask,
  () => {
    task.value.title = props.selectedTask.title;
    task.value.description = props.selectedTask.description;
    task.value.assignees = props.selectedTask.assignees;
    task.value.status = props.selectedTask.status;
  }
);

// if (props.selectedTask.id == 0) {
//   (task.value.title = ""), (task.value.description = "");
// }

defineEmits(["closeDetail", "addNewTask"]);
</script>

<template>
  <ModalDetail :selectedTask="selectedTask">
    <template #title>
      {{ selectedTask.id === "" ? "New Task" : "Edit Task" }}</template
    >
    <div class="mb-4">
      <label
        for="default-input"
        class="block mb-2 text-base font-semibold text-gray-900 dark:text-white"
        >Title</label
      >
      <div class="px-3">
        <input
          maxlength="100"
          type="text"
          id="default-input"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model="task.title"
          required
        />
      </div>
    </div>
    <template #desc>
      <textarea
        maxlength="500"
        class="block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full h-3/4"
        v-model="task.description"
      ></textarea>
    </template>
    <template #assignees>
      <textarea
        maxlength="30"
        class="block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full h-3/4"
        v-model="task.assignees"
      ></textarea>
    </template>
    <template #status>
      <form class="px-3">
        <select
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model="task.status"
        >
          <option selected class="itbkk-status">
            {{ selectedTask.status }}
          </option>
          <option>To Do</option>
          <option>Doing</option>
          <option>Done</option>
        </select>
      </form>
    </template>

    <template #Timezone>
      {{ selectedTask.id == "" ? "" : "TimeZone : " + props.localTimeZone }}
    </template>
    <template #createdOn>
      {{ selectedTask.id == "" ? "" : "Created On : " + task.createdOn }}
    </template>
    <template #updatedOn>
      {{
        selectedTask.id == "" ? "" : "Updated On :" + task.updatedOn
      }}</template
    >

    <template #button-left>
      <buttonSubmit buttonType="Ok" @click="$emit('addNewTask', task)"
        >Save</buttonSubmit
      >
    </template>
    <template #button-right>
      <buttonSubmit buttonType="Cancel" @click="$emit('closeDetail')"
        >Cancel</buttonSubmit
      >
    </template>
  </ModalDetail>
</template>

<style scoped></style>
