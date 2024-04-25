<script setup>
import { defineProps, ref, defineEmits, watch } from "vue";
import buttonSubmit from "../components/button/Button.vue";

const props = defineProps({
  task: {
    Object,
    required: true,
  },
});

const emit = defineEmits(["closeDetail"]);

const timeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);

const createdOn = props.task.createdOn;
const updatedOn = props.task.updatedOn;
const parsedUpdatedDate = new Date(updatedOn);
const parsedDate = new Date(createdOn);
const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false, // Ensure 24-hour format
});
const formattedDate = formatter.format(parsedDate).replace(",", "");
const formattedUpdatedDate = formatter
  .format(parsedUpdatedDate)
  .replace(",", "");

const isEmpty = (value) => {
  if (value === "") {
    return "No Descriptiasdasdn Provided";
  }
};
</script>

<template>
  <div
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75"
  >
    <div
      class="bg-[#F2F2F2] sm:w-[75%] sm:h-[89%] md:w-[45%] md:h-[89%] shadow-lg overflow-hidden border-gray-500 sm:rounded-lg py-16 relative"
    >
      <h1
        class="font-bold text-xl overflow-hidden whitespace-nowrap truncate w-full absolute top-5 px-3"
      >
        {{ props.task.title }}
      </h1>

      <div
        class="bg-white w-full h-full border-b border-t border-[#CACACA] py-6 px-8"
      >
        <div class="w-full h-full flex justify-between">
          <div class="flex flex-col">
            <p class="font-semibold">Description</p>
            <div
              :class="[
                props.task.assignees === null
                  ? 'italic text-gray-300 px-4 py-2'
                  : 'px-4 py-2',
                'itbkk-description italic lg:w-[350px] sm:w-[260px] h-full break-all',
              ]"
            >
              {{
                props.task.assignees !== null
                  ? props.task.description
                  : "No Description Provided"
              }}
            </div>
          </div>
          <div class="flex flex-col">
            <p class="font-semibold">Assignees</p>
            <div
              :class="[
                props.task.assignees === null
                  ? 'italic text-gray-300  px-4 py-2'
                  : 'px-4 py-2',
                'itbkk-assignees italic lg:w-[230px] sm:w-[200px] h-1/3 ',
              ]"
            >
              {{
                props.task.assignees !== null
                  ? props.task.assignees
                  : "Unassigned"
              }}
            </div>
            <p class="pt-5 font-semibold">Status</p>
            <form class="lg:w-[230px] sm:w-[200px]">
              <select
                id="countries"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected class="itbkk-status">
                  {{ props.task.status }}
                </option>
                <option>No Status</option>
                <option>To Do</option>
                <option>Doing</option>
                <option>Done</option>
              </select>
            </form>
            <div class="flex flex-col pt-28 lg:w-[230px] sm:w-[200px]">
              <div class="itbkk-timezone font-semibold">
                TimeZone : {{ timeZone }}
              </div>
              <div class="itbkk-created-on font-semibold">
                Created On : {{ formattedDate }}
              </div>
              <div class="itbkk-updated-on font-semibold">
                Updated On : {{ formattedUpdatedDate }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute right-6 bottom-3">
        <buttonSubmit buttonType="Ok" @click="$emit('closeDetail')"></buttonSubmit>
        <buttonSubmit
          buttonType="Cancel"
          @click="$emit('closeDetail')"
        ></buttonSubmit>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
