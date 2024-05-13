<script setup>
import { defineProps } from "vue";

const props = defineProps({
  buttonType: {
    type: String,
    validator: (value) => {
      return [
        "ok",
        "cancel",
        "add",
        "manage-status",
        "edit",
        "delete",
      ].includes(value.toLowerCase().trim());
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
      'bg-[#03CC0B] hover:bg-[#20ae27] transition-colors w-20 active:scale-[93%] active:transition-transform text-white':
        buttonType === 'ok',
      'bg-gray-400 hover:bg-gray-500 transition-colors w-20 active:scale-[93%] active:transition-transform text-white':
        buttonType === 'cancel',
      ' group bg-[#03CC0B]  hover:shadow-md   font-bold duration-300 cursor-pointer active:scale-[93%] active:transition-transform text-white ':
        buttonType === 'add',
      'bg-white text-green-500 border border-green-500 font-bold hover:shadow-md duration-300 cursor-pointer active:scale-[93%] active:transition-transform ':
        buttonType === 'manage-status',
      'bg-blue hover:bg-[#4054ec] transition-colors w-20 font-bold active:scale-[93%] active:transition-transform text-white':
        buttonType === 'edit',
      'bg-red-500 hover:bg-red-600 transition-colors w-20 font-bold active:scale-[93%] active:transition-transform text-white':
        buttonType === 'delete',
    }"
  >
    <!-- Default content if slot is not provided -->
    <slot>No Status</slot>
  </button>
</template>

<style>
.fancy-btn {
  padding: 5px 10px;
  margin: 5px;
  border-radius: 8px; /* Adding border-radius */
}
</style>
