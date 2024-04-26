<script setup>
import {
  defineProps,
  ref,
  defineEmits,
  computed,
  reactive,
  onMounted,
} from "vue";
import { fetchTaskDetails } from "../libs/FetchTask.js";
import buttonSubmit from "../components/button/Button.vue";
import { useRouter, useRoute } from "vue-router";
import { TaskModal } from "@/libs/TaskModal";

const emit = defineEmits(["closeDetail"]);

const props = defineProps({
  selectedTask: Object,
});

const localTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);

// const parseAndFormatDate = (dateString) => {
//   const date = new Date(dateString);
//   const formattedDate = date
//     .toLocaleDateString("en-GB", {
//       timeZone: localTimeZone,
//     })
//     .split(",")
//     .join(""); // Remove the comma
//   return formattedDate;
// };

// const formattedCreatedOn = computed(() => {
//   return parseAndFormatDate(props.editingDetail.createdOn);
// });

// const formattedUpdatedOn = computed(() => {
//   return parseAndFormatDate(props.editingDetail.updatedOn);
// });
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
        :title="props.selectedTask.title"
      >
        {{ props.selectedTask.title }}
      </h1>

      <div
        class="bg-white w-full h-full border-b border-t border-[#CACACA] py-6 px-8"
      >
        <div class="w-full h-full flex justify-between">
          <div class="flex flex-col">
            <p class="font-semibold">Description</p>
            <div
              class="itbkk-description"
              :class="[
                props.selectedTask.description === null &&
                props.selectedTask.description === '' &&
                props.selectedTask.description === undefined
                  ? 'italic text-gray-300 px-4 py-2'
                  : 'px-2 py-2',
                'itbkk-description italic lg:w-[350px] sm:w-[260px] h-full break-all',
              ]"
            >
              {{
                props.selectedTask.description !== null &&
                props.selectedTask.description !== "" &&
                props.selectedTask.description !== undefined
                  ? props.selectedTask.description
                  : "No Description Provided"
              }}
            </div>
          </div>
          <div class="flex flex-col">
            <p class="font-semibold">Assignees</p>
            <div
              class="itbkk-assignees"
              :class="[
                props.selectedTask.assignees === null &&
                props.selectedTask.assignees === '' &&
                props.selectedTask.assignees === undefined
                  ? 'italic text-gray-300  px-4 py-2'
                  : 'pl-2 py-2',
                'itbkk-assignees italic lg:w-[230px] sm:w-[200px] h-1/3 break-all',
              ]"
            >
              {{
                props.selectedTask.assignees !== null &&
                props.selectedTask.assignees !== "" &&
                props.selectedTask.assignees !== undefined
                  ? props.selectedTask.assignees
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
                  {{ props.selectedTask.status }}
                </option>
                <option>No Status</option>
                <option>To Do</option>
                <option>Doing</option>
                <option>Done</option>
              </select>
            </form>
            <div class="flex flex-col pt-28 lg:w-[230px] sm:w-[200px] text-sm">
              <div class="itbkk-timezone font-semibold">
                TimeZone : {{ localTimeZone }}
              </div>
              <div class="font-semibold">
                Created On :
                <span class="itbkk-created-on">{{ formattedCreatedOn }}</span>
              </div>
              <div class="font-semibold">
                <span class="itbkk-updated-on"
                  >Updated On : {{ formattedUpdatedOn }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute right-6 bottom-3">
        <buttonSubmit
          buttonType="Ok"
          @click="$emit('closeDetail')"
        ></buttonSubmit>
        <buttonSubmit
          buttonType="Cancel"
          @click="$emit('closeDetail')"
        ></buttonSubmit>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
