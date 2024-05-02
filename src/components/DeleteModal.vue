<script setup>
import submitButton from "./button/Button.vue";
import { defineEmits } from "vue";
defineEmits (['closeDelete']);
</script>

<template>
    <div class="delete-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white max-w-md p-6 rounded-lg shadow-lg">
      <div class="font-bold mb-4">
        <p>Delete a Task!</p>
      </div>
      <div class="title-line w-full h-px bg-gray-300 mb-4"></div>
      <div class="message mb-6">
        <p>Are you sure you want to delete this task?</p>
      </div>
      <div class="button-container flex justify-end">
        <div class="mr-2"><submitButton buttonType="Cancel" @click="$emit('closeDelete')">Cancel</submitButton></div>
        <div><submitButton buttonType="Ok">Confirm</submitButton></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
