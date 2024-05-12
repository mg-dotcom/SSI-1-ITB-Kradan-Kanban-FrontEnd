<script setup>
import buttonSubmit from '../button/Button.vue'
import { ref } from 'vue'

const mode = ref('ADD')
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
        {{ mode === 'ADD' ? 'New Status' : 'Edit Status' }}
      </div>

      <div
        class="bg-white w-full h-full border-b border-t border-[#CACACA] py-6 px-8"
      >
        <div class="w-full h-full">
          <div class="flex">
            <div class="w-1/2">
              <p class="font-semibold mb-2">Name</p>
              <div class="px-3">
                <input
                  v-model.trim="status.name"
                  maxlength="50"
                  type="text"
                  id="default-input"
                  class="itbkk-title bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <div class="w-1/2">
              <p class="font-semibold mb-2">Color</p>
              <input
                type="color"
                v-model="status.color"
                id="color"
                class="itbkk-color w-10 h-10 rounded-lg"
              />
            </div>
          </div>
          <div class="flex flex-col flex-grow mt-5">
            <p class="font-semibold mb-2">Description</p>
            <div class="px-3">
              <textarea
                maxlength="200"
                v-model.trim="status.description"
                :class="selectedStatus.id == '' ? 'h-[241px]' : 'h-52'"
                class="itbkk-description block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
              ></textarea>
            </div>
          </div>
          <div class="text-sm">
            <div
              class="pt-5"
              :class="selectedStatus.id == '' ? 'hidden' : 'visible'"
            >
              <span class="itbkk-timezone font-semibold">TimeZone</span> :
              Asia/Bangkok <br />
              <span class="itbkk-created-on font-semibold">Created On</span> :
              5/12/2024 6:00:00 <br />
              <span class="itbkk-updated-on font-semibold">Updated On</span> :
              5/12/2024 6:00:00 <br />
            </div>
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
