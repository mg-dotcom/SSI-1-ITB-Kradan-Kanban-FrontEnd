<script setup>
import { onMounted, reactive, ref } from "vue";
import Detail from "./Detail.vue";
import StatusButton from "../components/button/StatusButton.vue";
import { fetchAllTasks, fetchTaskDetails } from "../libs/FetchTask.js";
import { TaskModal } from "../libs/TaskModal.js";
const tasks = ref(new TaskModal());
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  const allTasks = await fetchAllTasks(import.meta.env.VITE_BASE_URL);
  tasks.value.addAllTasks(allTasks);
});

const page = reactive({
  task: true,
});

const popup = reactive({
  isEdit: false,
});

const openDetail = (id) => {
  popup.isEdit = true;
  router.push({ name: "task-detail", params: { id: id } });
};

const closeDetail = () => {
  popup.isEdit = false;
  router.push({ name: "task" });
};

console.log(popup.isEdit);
</script>

<template>
  <div class="h-screen w-full">
    <div class="header w-full h-[90px] bg-gradient-to-r from-blue to-lightblue">
      <img class="absolute right-0" src="/glass-overlay.png" alt="" />
      <div class="h-[90px] flex flex-col justify-center p-10">
        <h1 class="text-header text-white font-bold">
          IT-Bangmod Kradan kanban
        </h1>
      </div>
    </div>

    <div
      class="table lg:px-24 sm:px-10 py-14 overflow-hidden"
      v-show="page.task"
    >
      <div class="-my-2 overflow-hidden sm:-mx">
        <div class="py-2 align-middle inline-block sm:px-6 lg:px-8">
          <div
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <table class="table-fixed w-full h-full">
              <thead class="bg-lightgray">
                <tr class="">
                  <th
                    class="w-[6%] px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-xs font-medium text-gray-800 uppercase tracking-wider"
                  ></th>
                  <th
                    class="w-1/2 px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    class="w-1/5 px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Assignees
                  </th>
                  <th
                    class="w-1/5 px-6 py-3 bg-lightgray border-b border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <!-- <th scope="col" class="relative px-6 py-3 bg-gray-200">
                    <span class="sr-only">Edit</span>
                  </th> -->
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-if="tasks.getTasks().length <= 0">
                  <td class="border text-center" colspan="4">No Task</td>
                </tr>
                <tr
                  class="itbkk-item hover:bg-gray-50"
                  v-for="(task, index) in tasks.getTasks()"
                  :key="index"
                >
                  <td
                    class="text-center py-4 text-sm text-gray-500 border-b border-r border-gray-300 break-all"
                  >
                    {{ task.id }}
                  </td>
                  <td
                    class="itbkk-title px-6 py-4 text-sm text-gray-500 border-b border-r border-gray-300 break-all hover:underline cursor-pointer transition duration-300 ease-in-out hover:text-blue"
                    @click="openDetail(task.id)"
                  >
                    {{ task.title }}
                  </td>
                  <td
                    class="itbkk-assignees italic px-6 py-4 text-sm text-gray-500 border-b border-r border-gray-300 break-all"
                  >
                    {{ task.assignees }}
                  </td>
                  <td
                    class="itbkk-status px-6 py-4 text-sm text-gray-500 border-b border-gray-300 break-all"
                  >
                    <StatusButton
                      :statusName="
                        task.status
                          .toLowerCase()
                          .split('')
                          .filter((char) => char !== ' ')
                          .join('')
                      "
                    >
                      {{ task.status }}
                    </StatusButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <Detail v-if="popup.isEdit" @closeDetail="closeDetail"></Detail>
  </div>
</template>

<style scoped></style>
