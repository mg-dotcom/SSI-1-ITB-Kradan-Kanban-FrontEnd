<script setup>
import buttonSubmit from "../button/Button.vue";
import AddEditStatus from "./AddEditStatus.vue";
</script>

<template>
  <div
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 itbkk-item z-50"
  >
    <div
      class="bg-[#F2F2F2] sm:w-[70%] sm:h-[70%] md:w-[35%] md:h-[70%] shadow-lg overflow-hidden border-gray-500 sm:rounded-lg py-16 relative"
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
          <div class="flex">
            <div>
              <p class="font-semibold mb-2">Name</p>
              <div class="lg:w-[350px] sm:w-[260px] h-full px-3 break-all">
                <slot name="name"
                  ><input
                    maxlength="100"
                    type="text"
                    id="default-input"
                    class="itbkk-title bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                /></slot>
              </div>
            </div>
            <div>
              <div>
                <p class="font-semibold mb-2">Color</p>
                <input type="color" name="" id="" />
              </div>
            </div>
          </div>
          <div class="flex flex-col flex-grow mt-5">
            <p class="font-semibold mb-2">Description</p>
            <div class="px-3">
              <slot name="desc">
                <textarea
                  maxlength="200"
                  class="itbkk-description block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 h-40 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                ></textarea>
              </slot>
            </div>
          </div>
          <div class="font-semibold text-xs mt-4">
            <slot name="timezone"></slot>
            <slot name="createdon"></slot>
            <slot name="updatedon"></slot>
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
