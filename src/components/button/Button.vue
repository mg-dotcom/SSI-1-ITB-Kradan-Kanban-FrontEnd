<script setup>
import { defineProps } from "vue";

// Define props for the component
const props = defineProps({
  buttonType: {
    type: String,
    validator: (value) => {
      return ["ok", "cancel", "add"].includes(value.toLowerCase());
    },
  },
});
</script>

<template>
  <!-- Button element with dynamic class bindings based on buttonType prop -->
  <button
    :class="{
      'fancy-btn': true, // Always add 'fancy-btn' class

      // Conditional class bindings based on buttonType prop
      'bg-[#03CC0B] hover:bg-green-500 transition-colors': buttonType === 'ok',
      'bg-gray-400 hover:bg-gray-500 transition-colors':
        buttonType === 'cancel',
      'bg-[#03CC0B] hover:bg-green-500 transition-colors shadow-md scale-105 font-bold':
        buttonType === 'add',
    }"
  >
    <!-- Default content if slot is not provided -->
    <slot>No Status</slot>
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
