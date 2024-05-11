<script setup>
import ConfirmModal from './ConfirmModal.vue'
import submitButton from '../button/Button.vue'
import { useStatusStore } from '../../stores/StatusStore.js'
import { ref } from 'vue';
defineEmits(["closeDelete", "transferStatus"]);
const props=defineProps({
  selectedStatus:{
    Type:Object,
  }
})

const statusStore = useStatusStore()

const filteredStatuses = statusStore.getStatuses.filter(status => status.id !== props.selectedStatus.id);

const transferTo=ref('')
console.log(transferTo.value);

</script>

<template>
  <ConfirmModal>
    <template #title>
      <p>Transfer a Status</p>
    </template>
    <template #question>
      <p>There is some task associated with the Doing status.</p>
      <div class="flex">
        <p class="content-center">Transfer to</p>
        <form class="px-3">
          <select
            class="itbkk-status bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            v-model="transferTo"
            >
            <option 
            v-for="status  in filteredStatuses"
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
      <submitButton buttonType="cancel" @click="$emit('closeDelete')">Cancel</submitButton>
    </template>
    <template #button-right>
      <submitButton 
      buttonType="ok" @click="$emit('transferStatus',transferTo)"
      :disabled="transferTo === ''"
      :class="
          transferTo === ''
            ? 'bg-gray-300 px-4 py-2 rounded-md cursor-not-allowed opacity-50 transition-colors disabled'
            : ''
        "
      >Transfer</submitButton>
    </template>
  </ConfirmModal>
</template>

<style scoped></style>
