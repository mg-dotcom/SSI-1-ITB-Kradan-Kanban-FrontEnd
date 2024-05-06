<script setup>
import ModalDetail from "./ModalDetail.vue";
import buttonSubmit from "./button/Button.vue";
import { useRouter } from "vue-router";
import { defineProps, defineEmits, ref, computed } from "vue";

const router = useRouter();

const props = defineProps({
  selectedTask: Object,
  localTimeZone: String,
});

const task = ref({
  title: props.selectedTask.title,
  description: props.selectedTask.description,
  assignees: props.selectedTask.assignees,
  status: props.selectedTask.status,
});

const oldtask = {
  title: props.selectedTask.title,
  description: props.selectedTask.description,
  assignees: props.selectedTask.assignees,
  status: props.selectedTask.status,
};

const isTaskEdited = computed(() => {
  return (
    task.value.title !== oldtask.title ||
    task.value.description !== oldtask.description ||
    task.value.assignees !== oldtask.assignees ||
    task.value.status !== oldtask.status
  );
});

const passNewTask = () => {
  if (props.selectedTask.id !== "" && isTaskEdited.value === true) {
    emit("editNewTask", task.value);
    router.push({ name: "task" });
  } else if (props.selectedTask.id === "") {
    emit("addNewTask", task.value);
  }
};

const emit = defineEmits(["closeDetail", "addNewTask", "editNewTask"]);
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
          v-model.trim="task.title"
          required
        />
      </div>
    </div>
    <template #desc>
      <textarea
        maxlength="500"
        class="block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full h-3/4"
        v-model.trim="task.description"
      ></textarea>
    </template>
    <template #assignees>
      <textarea
        maxlength="30"
        class="block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full h-3/4"
        v-model.trim="task.assignees"
      ></textarea>
    </template>
    <template #status>
      <form class="px-3">
        <select
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model.trim="task.status"
        >
          <option selected class="itbkk-status hidden">
            {{ selectedTask.status }}
          </option>
          <option disabled value="">Choose Status</option>
          <option>No Status</option>
          <option>To Do</option>
          <option>Doing</option>
          <option>Done</option>
        </select>
      </form>
    </template>

    <template #Time>
      <div class="pt-7" :class="selectedTask.id == '' ? 'hidden' : 'visible'">
        <span class="itbkk-timezone font-semibold">TimeZone</span> :
        {{ localTimeZone }} <br />
        <span class="itbkk-created-on font-semibold">Created On</span> :
        {{ props.selectedTask.createdOn }} <br />
        <span class="itbkk-updated-on font-semibold">Updated On</span> :
        {{ props.selectedTask.updatedOn }} <br />
      </div>
    </template>

    <template #button-left>
      <!-- <div v-if> -->
      <buttonSubmit
        buttonType="cancel"
        class="itbkk-button-cancel"
        @click="$emit('closeDetail')"
        >Cancel</buttonSubmit
      >
      <!-- </div> -->
    </template>
    <template #button-right>
      <buttonSubmit
        class="itbkk-button-confirm w-20"
        :buttonType="
          task.title === '' || isTaskEdited === false ? 'cancel' : 'ok'
        "
        :disabled="task.title === '' || isTaskEdited === false"
        @click="passNewTask"
        :class="
          task.title === '' || isTaskEdited === false
            ? 'bg-gray-300 px-4 py-2 rounded-md cursor-not-allowed opacity-50 transition-colors'
            : ''
        "
        :title="task.title"
        >Save</buttonSubmit
      >
    </template>
  </ModalDetail>
</template>

<style scoped></style>
