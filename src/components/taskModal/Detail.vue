<script setup>
import ModalDetail from "./ModalDetail.vue";
import buttonSubmit from "../button/Button.vue";
import StatusButton from "../button/StatusButton.vue";
import { useStatusStore } from "../../stores/StatusStore.js";

const statusStore = useStatusStore();

const emit = defineEmits(["closeDetail"]);

const props = defineProps({
  selectedTask: Object,
  localTimeZone: String,
});
</script>

<template>
  <ModalDetail :selectedTask="selectedTask">
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
    <template #assignees>
      <div class="itbkk-assignees">
        {{ !selectedTask.assignees ? "Unassigned" : selectedTask.assignees }}
      </div>
    </template>
    <template #status>
      <div class="itbkk-status">
        <StatusButton
          :statusName="selectedTask.status"
          :statusColor="statusStore.getStatusColor(selectedTask.status)"
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
      <buttonSubmit buttonType="cancel" @click="$emit('closeDetail')"
        >Cancel</buttonSubmit
      >
    </template>
    <template #button-right>
      <buttonSubmit buttonType="ok" @click="$emit('closeDetail')"
        >Ok</buttonSubmit
      >
    </template>
  </ModalDetail>
</template>

<style scoped></style>
