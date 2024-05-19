<script setup>
import ConfirmModal from "./ConfirmModal.vue";
import submitButton from "../button/Button.vue";
import { onMounted, ref, watch } from "vue";
import { useStatusStore } from "../../stores/StatusStore.js";
import { useTaskStore } from "../../stores/TaskStore.js";
import { useToast } from "primevue/usetoast";
defineEmits(["closeDelete", "transferStatus"]);
const props = defineProps({
  currentStatus: {
    Type: Object,
  },
  numberOfTasks: {
    Type: Number,
  },
});

const statusStore = useStatusStore();
const taskStore = useTaskStore();
const toast = useToast();
const filteredStatuses = statusStore.getStatuses.filter(
  (status) => status.id !== props.currentStatus.id
);

const isLimit = ref(false);
const limitMaximumTask = ref(false);
const maximumTask = ref(10);
onMounted(async () => {
  const limitOfStatus = await statusStore.loadStatusSetting(1);
  console.log(limitOfStatus);
  limitMaximumTask.value = limitOfStatus.limitMaximumTask;
  maximumTask.value = limitOfStatus.maximumTask;
});

const transferTo = ref("");

watch(transferTo, (newValue) => {
  const status = statusStore.getStatusById(newValue);
  const tasks = taskStore.getTasksByStatus(status.name);
  if (limitMaximumTask.value) {
    //check only if user turn on limit
    if (status.name !== "No Status" && status.name !== "Done") {
      isLimit.value = tasks.length + props.numberOfTasks >= maximumTask.value;
    } else {
      isLimit.value = false;
    }

    if (isLimit.value) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: `Cannot transfer to "${status.name}" status
 since it will exceed the limit.  Please choose another status to transfer to.`,
        life: 3000,
      });
    }
  }
});
</script>

<template>
  <ConfirmModal>
    <template #title>
      <p>Transfer a Status</p>
    </template>
    <template #question>
      <p class="itbkk-message">
        There is <span class="font-bold">{{ numberOfTasks }}</span> task
        associated with the Doing status.
      </p>
      <div class="flex">
        <p class="content-center">Transfer to</p>
        <form class="px-3">
          <select
            class="itbkk-status bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            v-model="transferTo"
          >
            <option
              v-for="status in filteredStatuses"
              :value="status.id"
              :key="status.id"
            >
              {{ status.name }}
            </option>
          </select>
        </form>
      </div>
    </template>
    <template #button-left>
      <submitButton
        buttonType="cancel"
        class="itbkk-button-cancel"
        @click="$emit('closeDelete')"
        >Cancel</submitButton
      >
    </template>
    <template #button-right>
      <submitButton
        class="itbkk-button-confirm"
        :buttonType="
          transferTo === '' || isLimit ? 'transfer-off' : 'transfer-on'
        "
        @click="
          $emit(
            'transferStatus',
            props.currentStatus.name,
            props.currentStatus.id,
            transferTo
          )
        "
        :disabled="transferTo === '' || isLimit"
        :class="
          transferTo === '' || isLimit
            ? 'bg-gray-300 px-4 py-2 rounded-md cursor-not-allowed opacity-50 transition-colors disabled'
            : ''
        "
        >Transfer and Delete</submitButton
      >
    </template>
  </ConfirmModal>
</template>

<style scoped></style>
