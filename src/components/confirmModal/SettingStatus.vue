<script setup>
import submitButton from "../button/Button.vue";
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-2/5">
      <div class="font-bold mb-4">
        <p>Status Settings</p>
      </div>
      <div class="title-line w-full h-px bg-gray-300 mb-4"></div>
      <div class="itbkk-message mb-6 break-all">
        <p class="itbkk-massage">
          Users can limit the number of task in a status by setting the Maximum
          <br />
          tasks in each status (except "No Status" and "Done" status).
        </p>
        <div class="my-3">
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" class="toggle toggle-success" checked />
            <span
              class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >Limit tasks in this status</span
            >
          </label>
        </div>

        <div class="flex">
          <p class="pr-5 content-center text-green-status font-bold">
            Maximum tasks
          </p>
          <input
            type="text"
            class="itbkk-status-name bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>
      <div class="button-container flex justify-end">
        <submitButton
          buttonType="cancel"
          class="itbkk-button-cancel"
          @click="$emit('closeDelete')"
          >Cancel</submitButton
        >
        <submitButton
          buttonType="ok"
          class="itbkk-button-confirm"
          @click="$emit('deleteStatus')"
          >Save</submitButton
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
