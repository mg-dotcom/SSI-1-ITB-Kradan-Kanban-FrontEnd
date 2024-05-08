<script setup>
import submitButton from '../button/Button.vue'
</script>

<template>
  <div
    class="delete-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white max-w-md p-6 rounded-lg shadow-lg">
      <div class="font-bold mb-4">
        <slot name="title">
        </slot>
      </div>
      <div class="title-line w-full h-px bg-gray-300 mb-4"></div>
      <div class="itbkk-message mb-6 break-all">
        <slot name="question">
        </slot>
      </div>
      <div class="button-container flex justify-end">
        <slot name="button-left">
          <submitButton buttonType="cancel">Cancel</submitButton>
        </slot>

        <slot name="button-right">
          <submitButton buttonType="ok">Confirm</submitButton>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
