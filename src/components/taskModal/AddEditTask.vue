<script setup>
import ModalDetail from "./ModalDetail.vue";
import buttonSubmit from "../button/Button.vue";
import { useRouter, useRoute } from "vue-router";
import { defineEmits, ref, onMounted, watch, computed } from "vue";
import { useStatusStore } from "../../stores/StatusStore.js";
import { useSortStore } from "../../stores/SortStore.js";
import { useBoardStore } from "../../stores/BoardStore.js";
import { useTaskStore } from "../../stores/TaskStore.js";
import { localTimeZone, formatDate } from "../../libs/libsUtil.js";
import { checkTokenExpiration } from "@/stores/UserStore";
const emit = defineEmits(["addNewTask", "editNewTask"]);
const statusStore = useStatusStore();
const taskStore = useTaskStore();
const sortStore = useSortStore();
const boardStore = useBoardStore();
const router = useRouter();
const route = useRoute();

const isChanged = ref(false);
const mode = route.name === "task-add" ? "add" : "edit";
const limitMaximumTask = ref(false);
const maximumTask = ref(10);

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
});

const originalTaskData = ref({});
const boardId = route.params.id;
const taskId = route.params.taskId;

onMounted(async () => {
  await checkTokenExpiration();
  await statusStore.loadStatuses(boardId);
  const board = await boardStore.loadBoardById(boardId);

  limitMaximumTask.value = board.limitMaximumTask;
  maximumTask.value = board.maximumTask;

  if (mode == "edit") {
    const taskDetail = await taskStore.loadTaskDetails(taskId, boardId);
    selectedTask.value = taskDetail;
    selectedTask.value.statusId = taskDetail.status.id;
    selectedTask.value.createdOn = formatDate(taskDetail.createdOn);
    selectedTask.value.updatedOn = formatDate(taskDetail.updatedOn);
    originalTaskData.value = { ...selectedTask.value };
  } else if (mode == "add") {
    selectedTask.value.statusId = statusStore.getStatuses[0].id;
  }
});
const limitExceed = ref(false);
watch(
  selectedTask,
  (newValue) => {
    limitExceed.value =
      newValue.title.length > 100 ||
      newValue.description?.length > 500 ||
      newValue.assignees?.length > 30;

    if (mode === "edit") {
      isChanged.value = !(
        newValue.title === originalTaskData.value.title &&
        newValue.description === originalTaskData.value.description &&
        newValue.assignees === originalTaskData.value.assignees &&
        newValue.statusId === originalTaskData.value.statusId
      );
    }
  },
  { deep: true }
);

// Computed properties
const isButtonDisabled = computed(() => {
  return (
    !selectedTask.value.title ||
    (mode === "edit" && !isChanged.value) ||
    limitExceed.value
  );
});

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
    const statusCode = await taskStore.editTask(
      taskId,
      outputTask.value,
      statusDetail
    );

    if (statusCode.status === 200) {
      router.push({ name: "board-task", params: { id: boardId } });
      taskStore.loadTasks(boardId);
      taskStore.filterStatuses.length = 0;
    } else {
      return;
    }
  } else {
    outputTask.value = {
      title: selectedTask.value.title,
      description: selectedTask.value.description,
      assignees: selectedTask.value.assignees,
      statusId: selectedTask.value.statusId,
    };

    const res = await taskStore.addTask(outputTask.value);
    console.log(res);

    if (res.status === 201) {
      await taskStore.loadSortTasks(sortStore.getSortType);
      taskStore.filterStatuses.length = 0;
      router.push({ name: "board-task", params: { id: boardId } });
    } else {
      return;
    }
  }
};
</script>

<template>
  <ModalDetail :selectedTask="selectedTask" class="itbkk-modal-task">
    <template #title>
      <div class="flex justify-between">
        <div>{{ mode == "add" ? "Add Task" : "Edit Task" }}</div>
        <div>
          <span
            :class="{
              'bg-red-200 text-red-800 dark:text-red-400 border border-red-400':
                limitMaximumTask === false,
              'bg-green-200 text-green-800 dark:text-green-400 border border-green-400':
                limitMaximumTask === true,
            }"
            class="text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700"
            >Limit {{ limitMaximumTask ? "On" : "Off" }}</span
          >
        </div>
      </div>
    </template>
    <div class="xl:mb-4 lg:mb-2 mb-2">
      <label
        for="default-input"
        class="block mb-2 text-base lg:text-base font-semibold text-gray-900 dark:text-white md-vertical:text-sm"
        >Title</label
      >
      <div class="px-3">
        <input
          type="text"
          id="default-input"
          class="itbkk-title bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model.trim="selectedTask.title"
        />
      </div>
    </div>
    <template #desc>
      <textarea
        class="itbkk-description block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full md-vertical:h-3/4 mobile:h-64"
        v-model.trim="selectedTask.description"
      ></textarea>
    </template>
    <template #assignees>
      <textarea
        class="itbkk-assignees block p-2.5 min-h-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full mobile:h-28 md-vertical:h-3/4"
        v-model.trim="selectedTask.assignees"
      ></textarea>
    </template>
    <template #status>
      <form class="px-3 pr-5 itbkk-status-wrapper">
        <select
          class="itbkk-status bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model="selectedTask.statusId"
        >
          <option
            class="list-status"
            :value="status.id"
            v-for="status in statusStore.getStatuses"
          >
            {{ status.name }}
          </option>
        </select>
      </form>
    </template>

    <template #time>
      <div
        class="xl:pt-2 lg:pt-3 pt-2"
        :class="mode == 'add' ? 'hidden' : 'visible'"
      >
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
        :buttonType="isButtonDisabled ? 'disabled' : 'ok'"
        :disabled="isButtonDisabled"
        @click="save"
        >Save</buttonSubmit
      >
    </template>
  </ModalDetail>
</template>

<style scoped></style>
