<script setup>
import ModalDetail from "./ModalDetail.vue";
import buttonSubmit from "../button/Button.vue";
import StatusButton from "../button/StatusButton.vue";
import { useStatusStore } from "../../stores/StatusStore.js";
import { useTaskStore } from "../../stores/TaskStore.js";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { localTimeZone, formatDate } from "../../libs/libsUtil.js";

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();
const statusStore = useStatusStore();
const taskId = route.params.taskId;
const boardId = route.params.id;
const selectedTask = ref({
  title: "",
  description: "",
  assignees: "",
  status: "",
  createdOn: "",
  updatedOn: "",
  files: [],
});
const mode = route.name === "task-detail" ? "view" : "";

onMounted(async () => {
  const taskDetail = await taskStore.loadTaskDetails(taskId, boardId);
  selectedTask.value = taskDetail;
  selectedTask.value.status = taskDetail.status.name;
  selectedTask.value.createdOn = formatDate(taskDetail.createdOn);
  selectedTask.value.updatedOn = formatDate(taskDetail.updatedOn);
  selectedTask.value.files = taskDetail.files;
});
</script>

<template>
  <ModalDetail
    :mode="mode"
    :selectedTask="selectedTask"
    class="itbkk-modal-task"
  >
    <template #title>
      <div :title="selectedTask.title" class="itbkk-title truncate">
        {{ selectedTask.title }}
      </div>
    </template>
    <template #desc>
      <div class="itbkk-description">
        {{
          !selectedTask.description
            ? "No Description Provided"
            : selectedTask.description
        }}
      </div>
    </template>
    <template #attach>
      <div class="mt-2 text-black grid grid-cols-2 gap-3 relative">
        <div
          v-for="file in selectedTask.files"
          :title="file.fileName"
          class="bg-[#f3f3f3] tooltip grid grid-cols-[auto,1fr,auto] p-2 rounded-md hover:bg-[#e2e2e2] transition-all duration-200 ease-in-out cursor-pointer justify-start items-center"
        >
          <div class="flex items-center">
            <img
              src="/public/attachments/pdf.png"
              alt=""
              class="w-8 object-contain"
            />
          </div>
          <p class="px-2 text-xs truncate text-left">
            {{ file.fileName }}
          </p>
        </div>
      </div>
    </template>
    <template #assignees>
      <div class="itbkk-assignees">
        {{ !selectedTask.assignees ? "Unassigned" : selectedTask.assignees }}
      </div>
    </template>
    <template #status>
      <div class="itbkk-status mobile:h-0">
        <StatusButton
          :statusName="selectedTask.status"
          :statusColor="statusStore.getStatusColor(selectedTask.status)"
          class="mobile:w-[100px] mobile:scale-[110%] mobile:mt-2"
        >
          {{ selectedTask.status }}
        </StatusButton>
      </div>
    </template>
    <template #time>
      <div class="pt-28">
        <div class="itbkk-timezone">
          <span class="font-semibold">TimeZone</span> : {{ localTimeZone }}
        </div>
        <div class="itbkk-created-on">
          <span class="font-semibold">Created On</span> :
          {{ selectedTask.createdOn }}
        </div>
        <div class="itbkk-updated-on">
          <span class="font-semibold">Updated On</span> :
          {{ selectedTask.updatedOn }}
        </div>
      </div>
    </template>

    <template #button-left>
      <buttonSubmit
        buttonType="cancel"
        @click="router.push({ name: 'board-task' })"
        >Cancel</buttonSubmit
      >
    </template>
    <template #button-right>
      <buttonSubmit buttonType="ok" @click="router.push({ name: 'board-task' })"
        >Ok</buttonSubmit
      >
    </template>
  </ModalDetail>
</template>

<style scoped></style>
