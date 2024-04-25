<script setup>
import buttonSubmit from "./icons/Button.vue";
</script>

<template>
  <div
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50"
  >
    <div
      class="bg-[#F2F2F2] sm:w-[75%] sm:h-[89%] md:w-[45%] md:h-[89%] shadow-lg overflow-hidden border-gray-500 sm:rounded-lg py-16 relative"
    >
      <h1 class="absolute top-5 left-5 font-bold text-xl">
        Design UI for PBI 1,2
      </h1>

      <div
        class="bg-white w-full h-full border-b border-t border-[#CACACA] py-6 px-8"
      >
        <div class="w-full h-full flex justify-between">
          <div class="flex flex-col">
            <p class="font-semibold">Description</p>
            <textarea
              class="lg:w-[350px] sm:w-[260px] h-full border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              type="text"
              name=""
              id=""
            />
          </div>
          <div class="flex flex-col">
            <p class="font-semibold">Assignees</p>
            <textarea
              class="lg:w-[230px] sm:w-[200px] h-1/3 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              type="text"
              name=""
              id=""
            />
            <p class="pt-5 font-semibold">Status</p>
            <form class="max-w-sm">
              <select
                id="countries"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected>Choose status</option>
                <option>No Status</option>
                <option>To Do</option>
                <option>Doing</option>
                <option>Done</option>
              </select>
            </form>
            <div class="flex flex-col pt-28">
              <div class="font-semibold">TimeZone :</div>
              <div class="font-semibold">Created At :</div>
              <div class="font-semibold">Updated On :</div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute right-6 bottom-3">
        <buttonSubmit buttonType="Ok"></buttonSubmit>
        <buttonSubmit buttonType="Cancel"></buttonSubmit>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
