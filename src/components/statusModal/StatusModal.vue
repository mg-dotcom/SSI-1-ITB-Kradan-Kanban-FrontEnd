<script setup>
import buttonSubmit from "../button/Button.vue";
import AddEditStatus from "./AddEditStatus.vue";
</script>

<template>
  <div
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 itbkk-item z-50"
  >
    <div
      class="bg-[#F2F2F2] sm:w-[75%] sm:h-[89%] md:w-[45%] md:h-[85%] shadow-lg overflow-hidden border-gray-500 sm:rounded-lg py-16 relative"
    >
      <div
        class="font-bold text-xl overflow-hidden whitespace-nowrap truncate w-full absolute top-5 px-3"
      >
        <slot name="title">No Title</slot>
      </div>

      <div
        class="bg-white w-full h-full border-b border-t border-[#CACACA] py-6 px-8"
      >
        <div class="w-full h-full">
          <div class="flex">
            <div class="w-1/2">
              <p class="font-semibold mb-2">Name</p>
              <div class="px-3"><slot name="name"></slot></div>
            </div>
            <div class="w-1/2">
              <p class="font-semibold mb-2">Color</p>
              <slot name="color"></slot>
            </div>
          </div>
          <div class="flex flex-col flex-grow mt-5">
            <p class="font-semibold mb-2">Description</p>
            <div class="px-3">
              <slot name="desc"> </slot>
            </div>
          </div>
          <div class="font-semibold text-sm">
            <slot name="time"></slot>
          </div>
        </div>
      </div>
      <div class="absolute right-6 bottom-3">
        <slot name="button-left">
          <buttonSubmit buttonType="cancel">Cancel</buttonSubmit>
        </slot>

        <slot name="button-right">
          <buttonSubmit buttonType="ok">Save</buttonSubmit>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
