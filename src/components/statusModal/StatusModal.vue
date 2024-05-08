<script setup>
import buttonSubmit from '../button/Button.vue'
</script>

<template>
  <div
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 itbkk-item"
  >
    <div
      class="bg-[#F2F2F2] sm:w-[75%] sm:h-[89%] md:w-[45%] md:h-[89%] shadow-lg overflow-hidden border-gray-500 sm:rounded-lg py-16 relative"
    >
      <div
        class="font-bold text-xl overflow-hidden whitespace-nowrap truncate w-full absolute top-5 px-3"
      >
        <slot name="title">Add Status</slot>
      </div>

      <div
        class="bg-white w-full h-full border-b border-t border-[#CACACA] py-6 px-8"
      >
        <div class="w-full h-full">
          <div class="flex flex-col">
            <p class="font-semibold mb-2">Name</p>
            <div class="lg:w-[350px] sm:w-[260px] h-full px-3 break-all">
              <slot name="desc"><input type="text" /></slot>
            </div>
            <div>
                <p class="font-semibold mb-2">Color</p>
                
            </div>
          </div>
          <div class="flex flex-col">
            <p class="font-semibold mb-2">Description</p>
            <div class="lg:w-[230px] sm:w-[200px] h-1/3 px-3 break-all">
              <slot name="assignees"><input type="text" /></slot>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute right-6 bottom-3">
        <slot name="button-left">
          <buttonSubmit></buttonSubmit>
        </slot>

        <slot name="button-right">
          <buttonSubmit></buttonSubmit>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
