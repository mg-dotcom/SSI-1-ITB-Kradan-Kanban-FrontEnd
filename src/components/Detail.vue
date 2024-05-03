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
      {{ props.selectedTask.title }}
    </template>
    <template #desc>
      {{
        !props.selectedTask.description
          ? "No Description Provided"
          : props.selectedTask.description
      }}
    </template>
    <template #assignees>
      {{
        !props.selectedTask.assignees
          ? "Unassigned"
          : props.selectedTask.assignees
      }}
    </template>
    <template #status>
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
    </template>
    <template #Time>
      <div class="pt-28">
        <span class="font-semibold">TimeZone</span> : {{ localTimeZone }} <br />
        <span class="font-semibold">Created On</span> :
        {{ props.selectedTask.createdOn }} <br />
        <span class="font-semibold">Updated On</span> :
        {{ props.selectedTask.updatedOn }} <br />
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
