<script setup>
import buttonSubmit from "../button/Button.vue";
import { defineProps } from "vue";

const props = defineProps({
  selectedTask: Object,
});
</script>

<template>
  <div
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 itbkk-item z-50"
  >
    <div
      class="itbkk-modal-task bg-[#F2F2F2] xl:w-[55%] rounded-lg lg:w-[55%] h-[85%] w-[65%] mobile:w-[80%] md-vertical:w-[65%] shadow-lg overflow-hidden border-gray-500 sm:rounded-lg xl:py-16 lg:py-12 py-12 relative"
    >
      <div
        class="font-bold lg:text-xl md-vertical:text-lg overflow-hidden whitespace-nowrap truncate w-full absolute xl:top-5 lg:top-2.5 px-3 top-2.5"
      >
        <slot name="title"></slot>
      </div>

      <div
        class="bg-white w-full h-full border-b border-t border-[#CACACA] xl:py-6 px-5 lg:py-4 py-2 md-vertical:text-sm mobile:overflow-auto md-vertical:overflow-hidden overflow-hidden"
      >
        <slot></slot>

        <div
          class="w-full h-full flex md-vertical:overflow-hidden md-vertical:flex-row md-vertical:justify-between mobile:flex-col"
        >
          <div class="flex flex-col">
            <p class="font-semibold mb-2 text-black">Description</p>
            <div
              class="xl:w-[550px] lg:w-[290px] sm:w-[260px] h-60 px-3 break-all "
              :class="
                !props.selectedTask.description ? 'italic text-gray-400' : ''
              "
            >
              <slot name="desc"></slot>
            </div>

            <p class="font-semibold text-black">Attachments</p>
            <div
              class="xl:w-[550px] lg:w-[290px] sm:w-[260px] h-full px-3 break-all overflow-auto mb-5"
              :class="
                !props.selectedTask.description ? 'italic text-gray-400' : ''
              "
            >
              <slot name="attach"></slot>
            </div>
          </div>
          
          <div class="flex flex-col">
            <p class="font-semibold mb-2 text-black">Assignees</p>
            <div
              class="xl:w-[230px] lg:w-[220px] md-vertical:mb-2 md-vertical:w-[218px] sm:w-[200px] md-vertical:h-1/3 px-3 lg:mb-2 mb-2 break-all"
              :class="
                !props.selectedTask.assignees ? 'italic text-gray-400' : ''
              "
            >
              <slot name="assignees">Unassigned</slot>
            </div>

            <div
              class="lg:w-[236px] sm:w-[200px] w-[200px] md-vertical:w-[225px]"
            >
              <p class="font-semibold mb-2 text-black">Status</p>
              <slot name="status"> </slot>
            </div>
            <div
              class="flex flex-col lg:w-[230px] sm:w-[200px] xl:text-[13px] lg:text-[12px] text-[12px] md-vertical:m-0 mobile:m-3"
            >
              <slot name="time"></slot>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute right-6 xl:bottom-3 lg:bottom-1.5 bottom-1">
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
