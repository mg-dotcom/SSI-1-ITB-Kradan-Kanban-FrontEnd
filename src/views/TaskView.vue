<script setup>
import { onMounted, reactive, ref } from 'vue'
import Detail from './Detail.vue'
import StatusButton from '../components/button/StatusButton.vue'
import { fetchAllTasks, fetchTaskDetails } from '../libs/FetchTask.js'
import { TaskModal } from '../libs/TaskModal.js'
const tasks = ref(new TaskModal())
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const selectedTask = ref({
  id: '0',
  title: '',
  description: '',
  assignees: '',
  status: '',
  createdOn: '',
  updatedOn: ''
})

const taskId = route.params.id

onMounted(async () => {
  const allTasks = await fetchAllTasks(import.meta.env.VITE_BASE_URL)
  tasks.value.addAllTasks(allTasks)
})

const page = reactive({
  task: true
})

const popup = reactive({
  isEdit: false
})

const localTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)

function formatDate(date) {
  const d = new Date(date)
  return d
    .toLocaleString('en-GB', { timeZone: localTimeZone.value })
    .split(',')
    .join(' ')
}

const openDetail = async (id) => {
  const taskDetails = await fetchTaskDetails(import.meta.env.VITE_BASE_URL, id)
  if (taskDetails === undefined) {
    return
  }
  selectedTask.value = taskDetails
  selectedTask.value.status = formatStauts(taskDetails.status)
  selectedTask.value.createdOn = formatDate(taskDetails.createdOn)
  selectedTask.value.updatedOn = formatDate(taskDetails.updatedOn)
  popup.isEdit = true
  router.push({ name: 'task-detail', params: { id: id } })
}

if (taskId) {
  openDetail(taskId)
}

const closeDetail = () => {
  popup.isEdit = false
  router.push({ name: 'task' })
}

const formatStauts = (status) => {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const addtask=()=>{
  popup.isEdit = true
  
}
</script>

<template>
  <div class="h-screen w-full">
    <div class="header w-full h-[90px] bg-gradient-to-r from-blue to-lightblue">
      <img
        class="object-cover absolute right-0 max-w-max h-[90px]"
        src="/glass-overlay.png"
        alt=""
      />
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
      <div class="">
        <button class="bg-green-500 text-black" @click="addtask">Add</button>
      </div>
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
                    class="text-center py-4 text-sm text-gray-600 border-b border-r border-gray-300 break-all"
                  >
                    {{ task.id }}
                  </td>
                  <td
                    class="itbkk-title px-6 py-4 text-sm text-gray-600 border-b border-r border-gray-300 break-all hover:underline cursor-pointer transition duration-300 ease-in-out hover:text-blue"
                    @click="openDetail(task.id)"
                  >
                    {{ task.title }}
                  </td>
                  <td
                    class="itbkk-assignees px-6 py-4 text-sm border-b border-r border-gray-300 break-all"
                    :class="!task.assignees ? 'italic text-gray-400' : ''"
                  >
                    {{ task.assignees || 'Unassigned' }}
                  </td>
                  <td
                    class="itbkk-status px-6 py-4 text-sm text-gray-600 border-b border-gray-300 break-all"
                  >
                    <StatusButton
                      :statusName="
                        task.status
                          .replace(/_/g, ' ')
                          .toLowerCase()
                          .split(' ')
                          .join('')
                      "
                    >
                      {{ formatStauts(task.status) }}
                    </StatusButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <Detail
      v-if="popup.isEdit"
      @closeDetail="closeDetail"
      :selectedTask="selectedTask"
      :localTimeZone="localTimeZone"
    ></Detail>
  </div>
</template>

<style scoped></style>
