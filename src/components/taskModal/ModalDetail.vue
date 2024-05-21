<script setup>
import buttonSubmit from '../button/Button.vue'
import { defineProps } from 'vue'

const props = defineProps({
  selectedTask: Object
})
</script>

<template>
  <div
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 itbkk-item z-50"
  >
    <div
      class="bg-[#F2F2F2] sm:w-[75%] sm:h-[89%] md:w-[45%] md:h-[89%] shadow-lg overflow-hidden border-gray-500 sm:rounded-lg py-16 relative"
    >
      <div
        class="font-bold text-xl overflow-hidden whitespace-nowrap truncate w-full absolute top-5 px-3"
      >
        <slot name="title"></slot>
      </div>

      <div
        class="bg-white w-full h-full border-b border-t border-[#CACACA] py-6 px-8"
      >
      <slot></slot>

        <div class="w-full h-full flex justify-between">
          <div class="flex flex-col">
            <p class="font-semibold mb-2">Description</p>
            <div
              class="lg:w-[350px] sm:w-[260px] h-full px-3 break-all"
              :class="
                !props.selectedTask.description ? 'italic text-gray-400' : ''
              "
            >
              <slot name="desc"></slot>
            </div>
          </div>
          <div class="flex flex-col">
            <p class="font-semibold mb-2">Assignees</p>
            <div
              class="lg:w-[230px] sm:w-[200px] h-1/3 px-3 break-all"
              :class="
                !props.selectedTask.assignees ? 'italic text-gray-400' : ''
              "
            >
              <slot name="assignees">Unassigned</slot>
            </div>
            <p class="font-semibold mb-2">Status</p>
            <div class="lg:w-[230px] sm:w-[200px]">
              <slot name="status"> </slot>
            </div>
            <div class="flex flex-col lg:w-[230px] sm:w-[200px] text-[13px]">
              <slot name="time"></slot>
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
