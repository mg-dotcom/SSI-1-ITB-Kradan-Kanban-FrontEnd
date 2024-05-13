<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { initFlowbite, initDropdowns } from 'flowbite'
import StatusButton from '../components/button/StatusButton.vue'
import DeleteModal from '../components/confirmModal/DeleteTask.vue'
import { useRouter, useRoute, RouterView } from 'vue-router'
import buttonSubmit from '../components/button/Button.vue'
import { useTaskStore } from '../stores/TaskStore.js'
import { useStatusStore } from '../stores/StatusStore.js'
import Toast from 'primevue/toast'

const router = useRouter()
const selectedId = ref('')
const selectedIndex = ref(0)
const taskStore = useTaskStore()

const statusStore = useStatusStore()

onMounted(async () => {
  initFlowbite()
  initDropdowns()
  await taskStore.loadTasks()
  await statusStore.loadStatuses()
})

const page = reactive({
  task: true
})

const popup = reactive({
  addEdit: false,
  optionEditDelete: false,
  delete: false
})

const showOptionEditDelete = (taskId) => {
  selectedId.value = taskId
  popup.optionEditDelete = !popup.optionEditDelete
}

const openDetail = (id) => {
  popup.optionEditDelete = false
  router.push({ name: 'task-detail', params: { id: id } })
}

const openDelete = (id, index) => {
  selectedId.value = id
  selectedIndex.value = index
  popup.delete = true
}
</script>

<template>
  <Toast class="itbkk-message" />
  <div class="h-screen w-full">
    <RouterView />
    <div class="table lg:px-24 sm:px-10 overflow-hidden" v-if="page.task">
      <div class="flex justify-between py-6 px-5">
        <div
          class="text-xl font-bold flex items-center text-blue"
          @click="router.push({ name: 'task' })"
        >
          <a
            class="relative after:bg-blue after:absolute after:h-[3px] after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
            @click="router.push({ name: 'task' })"
          >
            Home&nbsp;</a
          >
        </div>
        <div class="flex">
          <buttonSubmit
            class="itbkk-button-add"
            buttonType="add"
            @click="router.push({ name: 'task-add' })"
            >+ Add Task</buttonSubmit
          >
          <buttonSubmit
            buttonType="manage-status"
            class="itbkk-manage-status flex gap-x-2"
            @click="router.push({ name: 'status' })"
          >
            <img src="../assets/status-list.svg" alt="" class="w-5" /> Manage
            Status</buttonSubmit
          >
        </div>
      </div>
      <div class="-my-2 mb-8 sm:-mx">
        <div class="py-2 align-middle inline-block sm:px-6 lg:px-8">
          <div
            class="shadow overflow-y-auto border-b border-gray-200 sm:rounded-lg"
          >
            <table class="table-fixed w-full h-full">
              <thead class="bg-lightgray">
                <tr class="">
                  <th
                    class="w-[5%] px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-xs font-medium text-gray-800 uppercase tracking-wider"
                  ></th>
                  <th
                    class="w-1/2 px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    class="w-2/6 px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Assignees
                  </th>
                  <th
                    class="w-[18%] px-6 py-3 bg-lightgray border-b border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-if="taskStore.getTasks.length <= 0">
                  <td class="border text-center" colspan="4">No Task</td>
                </tr>
                <tr
                  class="itbkk-item"
                  v-for="(task, index) in taskStore.getTasks"
                  :key="index"
                >
                  <td
                    class="text-center py-4 text-sm text-gray-600 border-b border-r border-gray-300 break-all"
                  >
                    {{ index + 1 }}
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
                    <div class="flex justify-between items-center text-center">
                      <StatusButton
                        :statusColor="
                          statusStore.getStatusColor(task.statusName)
                        "
                        :statusName="task.statusName"
                      >
                        {{ task.statusName }}
                      </StatusButton>
                      <div>
                        <div
                          class="itbkk-button-action inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                          type="button"
                          @click="showOptionEditDelete(task.id)"
                        >
                          <svg
                            class="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 4 15"
                          >
                            <path
                              d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                            />
                          </svg>

                          <div
                            class="bg-white divide-y divide-gray-100 rounded-lg shadow w-32 dark:bg-gray-700 dark:divide-gray-600 absolute right-[20px]"
                            v-show="
                              popup.optionEditDelete && selectedId === task.id
                            "
                          >
                            <ul
                              class="py-2 text-sm text-gray-700 dark:text-gray-200 z-50"
                            >
                              <li
                                @click="
                                  router.push({
                                    name: 'task-edit',
                                    params: { id: task.id }
                                  })
                                "
                              >
                                <p
                                  class="itbkk-button-edit block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Edit
                                </p>
                              </li>

                              <li @click="openDelete(task.id, index)">
                                <p
                                  class="itbkk-button-delete block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-red-500"
                                >
                                  Delete
                                </p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <DeleteModal
      v-if="popup.delete"
      :selectedId="selectedId"
      :selectedIndex="selectedIndex"
      @closeDelete="popup.delete = false"
      @confirmDeleteTask="popup.delete = false"
    ></DeleteModal>
  </div>
</template>

<style scoped>
.link-underline {
  border-bottom-width: 0;
  background-image: linear-gradient(transparent, transparent),
    linear-gradient(#fff, #fff);
  background-size: 0 3px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.5s ease-in-out;
}

.link-underline-black {
  background-image: linear-gradient(transparent, transparent),
    linear-gradient(#f2c, #f2c);
}

.link-underline:hover {
  background-size: 100% 3px;
  background-position: 0 100%;
}
</style>
