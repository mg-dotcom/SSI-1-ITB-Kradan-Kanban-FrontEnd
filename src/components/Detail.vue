<script setup>
import buttonSubmit from "./button/Button.vue";
import StatusButton from "../components/button/StatusButton.vue";
import ModalDetail from "./ModalDetail.vue";

const emit = defineEmits(["closeDetail"]);

const props = defineProps({
  selectedTask: Object,
  localTimeZone: String,
});
</script>

<template>
  <ModalDetail :selectedTask="selectedTask">
    <template #title>
      <div :title="props.selectedTask.title">
        {{ props.selectedTask.title }}
      </div>
    </template>
    <template #desc>
      <div class="itbkk-description">
        {{
          !props.selectedTask.description
            ? "No Description Provided"
            : props.selectedTask.description
        }}
      </div>
    </template>
    <template #assignees>
      <div class="itbkk-assignees">
        {{
          !props.selectedTask.assignees
            ? "Unassigned"
            : props.selectedTask.assignees
        }}
      </div>
    </template>
    <template #status>
      <div class="itbkk-status">
        <StatusButton
          :statusName="
            props.selectedTask.status
              .replace(/_/g, ' ')
              .toLowerCase()
              .split(' ')
              .join('')
          "
        >
          {{ props.selectedTask.status }}
        </StatusButton>
      </div>
    </template>
    <template #Time>
      <div class="pt-28">
        <div class="itbkk-timezone">
          <span class="font-semibold">TimeZone</span> : {{ localTimeZone }}
        </div>
        <div class="itbkk-created-on">
          <span class="font-semibold">Created On</span> :
          {{ props.selectedTask.createdOn }}
        </div>
        <div class="itbkk-updated-on">
          <span class="font-semibold">Updated On</span> :
          {{ props.selectedTask.updatedOn }}
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
