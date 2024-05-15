<script setup>
import ConfirmModal from './ConfirmModal.vue'
import submitButton from '../button/Button.vue'
</script>

<template>
  <ConfirmModal>
    <template #title>
      <p>Status Settings</p>
    </template>
    <template #question>
      <div class="">
        <p class="itbkk-massage">
          Users can limit the number of task in a status by setting the Maximum
          tasks in each status (except "No Status" and "Done" status).
        </p>
        <div class="my-3">
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer" />
            <div
              class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
            <span
              class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >Limit tasks in this status</span
            >
          </label>
        </div>

        <div class="flex">
          <p class="pr-5 content-center">Maximum tasks</p>
          <input
            type="text"
            class="itbkk-status-name bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
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
        buttonType="ok"
        class="itbkk-button-confirm"
        @click="$emit('deleteStatus')"
        >Save</submitButton
      >
    </template>
  </ConfirmModal>
</template>

<style scoped></style>
