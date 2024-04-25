<script setup>
import { onMounted, ref } from "vue";
import StatusButton from "./components/button/StatusButton.vue";
import { getTasks } from "./libs/FetchTask.js";
import { TaskModal } from "./libs/TaskModal.js";
const tasks = ref(new TaskModal());

onMounted(async () => {
  const tasksData = await getTasks(import.meta.env.VITE_BASE_URL);
  tasks.value.addAllTasks(tasksData);
});
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

    <div class="table px-10 py-14 overflow-hidden">
      <div class="-my-2 overflow-hidden sm:-mx">
        <div class="py-2 align-middle inline-block sm:px-6 lg:px-8">
          <div
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <table class="table-fixed w-full h-full">
              <thead class="bg-lightgray">
                <tr class="">
                  <th
                    class="w-[6%] px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
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
                <tr v-if="tasks.tasks.length <= 0">
                  <td class="">No Task</td>
                </tr>
                <tr class="itbkk-item" v-for="task in tasks.tasks">
                  <td
                    class="text-center px-6 py-4 text-sm text-gray-500 border-b border-r border-gray-300 break-all"
                  >
                    {{ task.id }}
                  </td>
                  <td
                    class="itbkk-title px-6 py-4 text-sm text-gray-500 border-b border-r border-gray-300 break-all"
                  >
                    {{ task.title }}
                  </td>
                  <td
                    class="itbkk-assignees px-6 py-4 text-sm text-gray-500 border-b border-r border-gray-300 break-all"
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
  </div>
</template>

<style scoped></style>
