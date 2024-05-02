<script setup>
import { defineProps } from "vue";
const props = defineProps({
  buttonType: {
    type: String,
    validator: (value) => {
      return ["Ok", "Cancel", "Add","Confirm"].includes(value);
    },
  },
});
</script>

<template>
  <button
    :class="{
      'fancy-btn': true,
      'bg-[#03CC0B] hover:bg-green-500 transition-colors': buttonType === 'Ok',
      'bg-gray-400 hover:bg-gray-500 transition-colors':
        buttonType === 'Cancel',
      'bg-[#03CC0B] hover:bg-green-500 transition-colors shadow-md scale-105 font-bold':
        buttonType === 'Add',
      'bg-red-600 hover:bg-red-700 transition-colors': buttonType === 'Confirm',
    }"
  >
    <slot class="">No Status</slot>
  </button>
</template>

<style>
.fancy-btn {
  color: #fff;
  border: none;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 8px; /* Adding border-radius */
}
</style>
