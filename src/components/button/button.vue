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
        "transfer-on",
        "transfer-off",
      ].includes(value.toLowerCase().trim());
    },
  },
});
</script>

<template>
  <button
    :class="{
      'fancy-btn': true,
      'bg-[#03CC0B] hover:bg-[#20ae27] transition-colors  w-20    active:scale-[93%] active:transition-transform text-white':
        buttonType === 'ok',
      'bg-gray-400 hover:bg-gray-500 transition-colors w-20  active:scale-[93%] active:transition-transform text-white':
        buttonType === 'cancel',
      ' group bg-[#03CC0B]  hover:shadow-md   font-bold duration-300 cursor-pointer active:scale-[93%] active:transition-transform text-white ':
        buttonType === 'add',
      'bg-white text-green-500 border border-green-500 font-bold hover:shadow-md duration-300 cursor-pointer active:scale-[93%] active:transition-transform ':
        buttonType === 'manage-status',
      'bg-blue hover:bg-[#4054ec] transition-colors w-20 font-bold active:scale-[93%] active:transition-transform text-white ':
        buttonType === 'edit',
      'bg-red-500 hover:bg-red-600 transition-colors w-20 font-bold active:scale-[93%] active:transition-transform text-white':
        buttonType === 'delete',
      'bg-[#03bd09] hover:bg-[#20ae27] transition-colors active:scale-[93%]  active:transition-transform text-white w-40':
        buttonType === 'transfer-on',
      'bg-gray-500 hover:bg-gray-600 transition-colors w-40 active:scale-[93%] active:transition-transform text-white':
        buttonType === 'transfer-off',
    }"
  >
    <slot>No Status</slot>
  </button>
</template>

<style>
.fancy-btn {
  padding: 5px 10px;
  margin: 5px;
  border-radius: 8px;
  height: 35px;
  text-align: center;
  font-weight: bold;
}

@media (min-width: 1440px) {
  .fancy-btn {
    padding: 5px 10px;
    margin: 5px;
    border-radius: 8px;
    height: 35px;
    text-align: center;
  }
}

@media (min-width: 1024px) {
  /* Adjust the min-width as per your "lg" screen size */
  .fancy-btn {
    padding: 4px 10px;
    margin: 3px;
    border-radius: 8px;
    font-size: 15px;
  }
}

@media (min-width: 820px) {
  /* Adjust the min-width as per your "lg" screen size */
  .fancy-btn {
    padding: 4px 10px;
    margin: 3px;
    border-radius: 8px;
    font-size: 15px;
  }
}

@media (min-width: 410px) {
  /* Adjust the min-width as per your "lg" screen size */
  .fancy-btn {
    font-size: medium;
    padding: 5px 10px;
    margin: 3px;
    border-radius: 8px;
    font-size: 13px;
  }
}
</style>
