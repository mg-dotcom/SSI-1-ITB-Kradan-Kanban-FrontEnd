<script setup>
import submitButton from "../button/Button.vue";

const props = defineProps({
  visibility: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div
      class="bg-white max-w p-6 rounded-lg shadow-lg md-vertical:m-auto mobile:m-8"
    >
      <div class="font-bold mb-4">
        <slot name="title"> Change Board Visibility </slot>
      </div>
      <div
        class="title-line w-full h-px bg-gray-300 mb-4 md-vertical:text-base text-sm"
      ></div>
      <div class="itbkk-message mb-6 break-all md-vertical:text-base text-sm">
        <slot name="question"> In private, only board owner can access/control board. Do you want to change the visibility to Private? </slot>
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

<style lang="scss" scoped></style>
