<script setup>
import ConfirmModal from './ConfirmModal.vue'
import submitButton from '../button/Button.vue'
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
          >
            <option value="No Status">No Status</option>
            <option value="To Do">To Do</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
          </select>
        </form>
      </div>
    </template>
    <template #button-left>
      <submitButton buttonType="cancel">Cancel</submitButton>
    </template>
    <template #button-right>
      <submitButton buttonType="ok">Confirm</submitButton>
    </template>
  </ConfirmModal>
</template>

<style scoped></style>
