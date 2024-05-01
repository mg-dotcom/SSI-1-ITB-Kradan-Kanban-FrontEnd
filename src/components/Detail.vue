<script setup>
import buttonSubmit from "../components/button/Button.vue";
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
    <template #Timezone> TimeZone : {{ localTimeZone }} </template>
    <template #createdOn>
      Created On : {{ props.selectedTask.createdOn }}
    </template>
    <template #updatedOn>
      Updated On : {{ props.selectedTask.updatedOn }}</template
    >
    <template #button-left>
      <buttonSubmit buttonType="Ok" @click="$emit('closeDetail')"
        >Ok</buttonSubmit
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
