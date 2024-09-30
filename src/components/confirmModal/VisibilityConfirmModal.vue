<script setup>
import { computed } from "vue";
import submitButton from "../button/Button.vue";

const props = defineProps({
  visibilityType: {
    type: String,
    required: true,
    validator: (value) => {
      return ["Private", "Public"].includes(value);
    },
  },
});

const visibilityDescription = computed(() => {
  if (props.visibilityType === "Private") {
    return "Do you want to change board visibility to private?";
  } else {
    return "Do you want to change board visibility to public?";
  }
});
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div
      class="bg-white max-w p-6 rounded-lg shadow-lg md-vertical:m-auto mobile:m-8 itbkk-modal-alert"
    >
      <div class="font-bold mb-4">
        <slot name="title"> Change Board Visibility </slot>
      </div>
      <div
        class="title-line w-full h-px bg-gray-300 mb-4 md-vertical:text-base text-sm"
      ></div>
      <div class="itbkk-message mb-6 break-all md-vertical:text-base text-sm">
        <slot name="question"> {{ visibilityDescription }} </slot>
      </div>
      <div class="button-container flex justify-end">
        <slot name="button-left">
          <submitButton
            buttonType="cancel"
            class="itbkk-button-cancel"
            @click="$emit('closeBoardVisibility')"
            >Cancel</submitButton
          >
        </slot>

        <slot name="button-right">
          <submitButton
            buttonType="ok"
            class="itbkk-button-confirm"
            @click="$emit('changeBoardVisibilityMode')"
            >Confirm</submitButton
          >
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
