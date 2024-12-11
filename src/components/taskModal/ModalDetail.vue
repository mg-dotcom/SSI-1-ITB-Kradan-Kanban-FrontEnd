<script setup>
import buttonSubmit from "../button/Button.vue";
import { defineProps } from "vue";
import { MAX_FILES, MAX_FILE_SIZE, byteToMB } from "@/libs/libsUtil";

const props = defineProps({
  selectedTask: Object,
  mode: String,
  newFiles: Array,
  originalTaskData: Object,
});
</script>

<template>
  <div
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 itbkk-item z-50"
  >
    <div
      class="itbkk-modal-task bg-[#F2F2F2] w-[65%] sm:w-[80%] md:w-[65%] lg:w-[55%] xl:w-[55%] rounded-lg h-[85%] shadow-lg overflow-hidden border-gray-500 sm:rounded-lg xl:py-16 lg:py-12 py-12 relative"
    >
      <!-- Title Section -->
      <div
        class="font-bold lg:text-xl md-vertical:text-lg w-full absolute xl:top-5 lg:top-2.5 top-2.5 px-3 whitespace-nowrap truncate overflow-hidden"
      >
        <slot name="title"></slot>
      </div>

      <!-- Main Content Section -->
      <div
        class="bg-white w-full h-full border-b border-t border-[#CACACA] xl:overflow-y-auto xl:py-6 px-4 lg:overflow-y-auto lg:py-4 py-2 md-vertical:text-sm mobile:overflow-y-auto md-vertical:overflow-y-auto overflow-y-auto"
      >
        <slot></slot>

        <!-- Content Section -->
        <div
          class="w-full h-full flex flex-col md-vertical:flex-row md-vertical:justify-between mobile:flex-col"
        >
          <!-- Left Side: Description & Attachments -->
          <div class="flex flex-col ">
            <p class="font-semibold mb-3 text-black">Description</p>
            <div class="px-3"><slot name="desc"></slot></div>

            <p
              v-if="props.mode === 'edit' || props.mode === 'view'"
              class="font-semibold text-black flex items-center my-3"
            >
              Attachments
              <span class="text-[#0546a9] ">
                <slot name="addAttach"></slot>
              </span>
            </p>
            <div
              class="h-[100px] xl:w-[520px] lg:w-[290px] sm:w-[260px] px-3 break-all mobile:h-fit mobile:mb-5"
            >
              <slot name="attach"></slot>
            </div>
            <div
              v-if="
                props.mode === 'edit' && props.selectedTask.files.length > 0
              "
              class="text-xs mt-2 text-right flex justify-between items-center"
            ></div>
          </div>

          <!-- Right Side: Assignees & Status -->
          <div class="flex flex-col ">
            <p class="font-semibold mb-3 text-black">Assignees</p>
            <div
              class="xl:w-[230px] lg:w-[220px] md-vertical:w-[218px] sm:w-[200px] md-vertical:h-1/3 px-3 lg:mb-2 mb-2 break-all"
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
              <slot name="status"></slot>
            </div>

            <div
              class="flex flex-col lg:w-[230px] sm:w-[200px] xl:text-[13px] lg:text-[12px] text-[12px] md-vertical:m-0 mobile:m-3"
            >
              <slot name="time"></slot>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer: Buttons -->
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
