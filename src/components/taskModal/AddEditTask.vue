<script setup>
import ModalDetail from "./ModalDetail.vue";
import buttonSubmit from "../button/Button.vue";
import { useRouter, useRoute } from "vue-router";
import { defineEmits, ref, onMounted, watch } from "vue";
import { useStatusStore } from "../../stores/StatusStore.js";
import { useSortStore } from "../../stores/SortStore.js";
import { useTaskStore } from "../../stores/TaskStore.js";
import { localTimeZone, formatDate } from "../../libs/libsUtil.js";
import { useToast } from "primevue/usetoast";

const statusStore = useStatusStore();
const taskStore = useTaskStore();
const sortStore = useSortStore();
const router = useRouter();
const route = useRoute();
const taskId = Number(route.params.id);
const isChanged = ref(false);
const mode = route.name === "task-add" ? "add" : "edit";
const limitMaximumTask = ref(false);
const maximumTask = ref(0);
const toast = useToast();

const selectedTask = ref({
  title: "",
  description: "",
  assignees: "",
  statusId: 1,
  createdOn: "",
  updatedOn: "",
});

const outputTask = ref({
  title: "",
  description: "",
  assignees: "",
  statusId: 1,
  createdOn: "",
  updatedOn: "",
});

const input = ref({});

onMounted(async () => {
  await statusStore.loadStatuses();
  const settingDetail = await statusStore.loadStatusSetting();
  limitMaximumTask.value = settingDetail.limitMaximumTask;
  maximumTask.value = settingDetail.maximumTask;

  if (mode == "edit") {
    const taskDetail = await taskStore.loadTaskDetails(taskId);
    selectedTask.value = taskDetail;
    selectedTask.value.statusId = taskDetail.status.id;
    selectedTask.value.createdOn = formatDate(taskDetail.createdOn);
    selectedTask.value.updatedOn = formatDate(taskDetail.updatedOn);
    input.value = { ...selectedTask.value };
  } else if (mode == "add") {
    selectedTask.value.statusId = statusStore.getStatuses[0].id;
  }
});

const isLimit = ref(false);
watch(
  () => selectedTask.value.statusId,
  (newValue) => {
    const status = statusStore.getStatusById(newValue);
    const tasks = taskStore.getTasksByStatus(status.name);
    if (limitMaximumTask.value) {
      isLimit.value = tasks.length >= maximumTask.value;
    }
  }
);

watch(
  selectedTask,
  (newValue) => {
    if (mode === "add") {
      if (!newValue.title) {
        isChanged.value = false;
      } else {
        isChanged.value = true;
        return;
      }
    }
    if (mode === "edit") {
      if (
        newValue.title !== input.value.title ||
        newValue.description !== input.value.description ||
        newValue.assignees !== input.value.assignees ||
        newValue.statusId !== input.value.statusId
      ) {
        isChanged.value = true;
      } else {
        isChanged.value = false;
      }
    }
  },
  { deep: true }
);

const save = async () => {
  if (mode === "edit" && taskId !== undefined) {
    outputTask.value = {
      title: selectedTask.value.title,
      description: selectedTask.value.description,
      assignees: selectedTask.value.assignees,
      statusId: selectedTask.value.statusId,
    };
    const statusDetail = statusStore.getStatuses.find(
      (status) => status.id === selectedTask.value.statusId
    );
    const statusCode=await taskStore.editTask(taskId, outputTask.value, statusDetail);
    if(statusCode===200){
      router.go(-1);
    }else{
      return;
    }
      
  } else {
    outputTask.value = {
      title: selectedTask.value.title,
      description: selectedTask.value.description,
      assignees: selectedTask.value.assignees,
      statusId: selectedTask.value.statusId,
    };
    const statusCode= await taskStore.addTask(outputTask.value);
    if(statusCode===200){
      await taskStore.loadSortTasks(sortStore.getSortType);
      router.go(-1);
    }else{
      return;
    }
      
  }
};

const emit = defineEmits(["addNewTask", "editNewTask"]);
</script>

<template>
  <ModalDetail :selectedTask="selectedTask" class="itbkk-modal-task">
    <template #title>
      <div class="flex justify-between">
        <div>{{ mode == "add" ? "Add Task" : "Edit Task" }}</div>
        <div>
          <span
            :class="{
              'bg-red-200 text-red-800 dark:text-red-400 border border-red-400': limitMaximumTask === false,
              'bg-green-200 text-green-800 dark:text-green-400 border border-green-400': limitMaximumTask === true,
            }"
            class="text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 "
            >Limit  {{ limitMaximumTask ? "On" : "Off" }}</span
            </span
          >
        </div>
      </div>
    </template>
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
          class="itbkk-title bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model.trim="selectedTask.title"
        />
      </div>
    </div>
    <template #desc>
      <textarea
        maxlength="500"
        class="itbkk-description block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full h-3/4"
        v-model.trim="selectedTask.description"
      ></textarea>
    </template>
    <template #assignees>
      <textarea
        maxlength="30"
        class="itbkk-assignees block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full h-3/4"
        v-model.trim="selectedTask.assignees"
      ></textarea>
    </template>
    <template #status>
      <form class="px-3">
        <select
          class="itbkk-status bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model="selectedTask.statusId"
        >
          <option :value="status.id" v-for="status in statusStore.getStatuses">
            {{ status.name }}
          </option>
        </select>
      </form>
    </template>

    <template #time>
      <div class="pt-7" :class="mode == 'add' ? 'hidden' : 'visible'">
        <span class="itbkk-timezone font-semibold">TimeZone</span> :
        {{ localTimeZone }} <br />
        <span class="itbkk-created-on font-semibold">Created On</span> :
        {{ selectedTask.createdOn }} <br />
        <span class="itbkk-updated-on font-semibold">Updated On</span> :
        {{ selectedTask.updatedOn }} <br />
      </div>
    </template>

    <template #button-left>
      <buttonSubmit
        buttonType="cancel"
        class="itbkk-button-cancel"
        @click="router.go(-1)"
        >Cancel</buttonSubmit
      >
    </template>

    <template #button-right>
      <buttonSubmit
        class="itbkk-button-confirm w-20"
        :buttonType="!isChanged || !selectedTask.title ? 'cancel' : 'ok'"
        :disabled="!isChanged || !selectedTask.title"
        @click="save"
        :class="
          !isChanged || !selectedTask.title
            ? 'bg-gray-300 px-4 py-2 rounded-md cursor-not-allowed opacity-50 transition-colors disabled'
            : ''
        "
        >Save</buttonSubmit
      >
    </template>
  </ModalDetail>
</template>

<style scoped></style>
