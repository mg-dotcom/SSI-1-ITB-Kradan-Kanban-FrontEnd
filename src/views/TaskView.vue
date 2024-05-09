<script setup>
import { onMounted, reactive, ref } from "vue";
import { initFlowbite, initDropdowns } from "flowbite";
import Detail from "../components/taskModal/Detail.vue";
import AddEditModal from "../components/taskModal/AddEditModal.vue";
import StatusButton from "../components/button/StatusButton.vue";
import {
  fetchAllTasks,
  fetchTaskDetails,
  addTask,
  deleteTask,
  updatedTask,
} from "../libs/FetchTask.js";
import DeleteModal from "../components/confirmModal/DeleteTask.vue";
import { useRouter, useRoute } from "vue-router";
import buttonSubmit from "../components/button/Button.vue";
import { useToast } from "primevue/usetoast";
import { useTaskStore } from "../stores/TaskStore.js";
import { useStatusStore } from "../stores/StatusStore";
import Toast from "primevue/toast";
import HomeText from "../components/HomeText.vue";
import { fetchAllStatus } from "../libs/FetchStatus";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const selectedTask = ref({
  id: "",
  title: "",
  description: "",
  assignees: "",
  status: "NO_STATUS",
  createdOn: "",
  updatedOn: "",
});

const taskStore = useTaskStore();

const statusStore = useStatusStore();

const taskId = route.params.id;

onMounted(async () => {
  initFlowbite();
  initDropdowns();

  if (taskStore.getTasks.length === 0) {
    const allTasks = await fetchAllTasks(
      `${import.meta.env.VITE_BASE_URL}/tasks`
    );
    taskStore.addAllTasks(allTasks);
  }

  if (statusStore.getStatuses.length === 0) {
    const allStatus = await fetchAllStatus(
      `${import.meta.env.VITE_BASE_URL}/statuses`
    );
    statusStore.addAllStatuses(allStatus);
  }
});

const page = reactive({
  task: true,
});

const popup = reactive({
  addEdit: false,
  detail: false,
  optionEditDelete: false,
  delete: false,
});

const clearValue = () => {
  selectedTask.value = {
    id: "",
    title: "",
    description: "",
    assignees: "",
    status: "NO_STATUS",
    createdOn: "",
    updatedOn: "",
  };
};

const localTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);

function formatDate(date) {
  const d = new Date(date);
  return d
    .toLocaleString("en-GB", { timeZone: localTimeZone.value })
    .split(",")
    .join(" ");
}

const openDetail = async (id) => {
  const taskDetails = await fetchTaskDetails(
    `${import.meta.env.VITE_BASE_URL}/tasks`,
    id
  );
  if (taskDetails === undefined) {
    return;
  }

  selectedTask.value = taskDetails;
  selectedTask.value.status = taskDetails.status.name;
  selectedTask.value.createdOn = formatDate(taskDetails.createdOn);
  selectedTask.value.updatedOn = formatDate(taskDetails.updatedOn);
  popup.detail = true;
  popup.optionEditDelete = false;
  router.push({ name: "task-detail", params: { id: id } });
};

if (taskId) {
  openDetail(taskId);
}

const closeDetail = () => {
  popup.detail = false;
  popup.addEdit = false;
  clearValue();
  router.push({ name: "task" });
};

const openAdd = () => {
  clearValue();
  popup.addEdit = true;
  popup.optionEditDelete = false;
  router.push({ name: "task-add" });
};

const addNewTask = async (task) => {
  const res = await addTask(`${import.meta.env.VITE_BASE_URL}/tasks`, task);
  const addedTask = await res.json();
  taskStore.addTask(addedTask);
  // tasks.value.addTask(addedTask);
  if (res.status === 201) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: `The task "${addedTask.title}" is added successfully.`,
      life: 3000,
    });
    router.back();
    clearValue();
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `An error occurred adding the task "${addedTask.title}"`,
      life: 3000,
    });
    router.back();
    clearValue();
  }
  popup.addEdit = false;
  popup.addEdit = false;
  popup.optionEditDelete = false;
};

const editTask = async (task) => {
  task.status = task.status.toUpperCase().replace(/ /g, "_");
  const res = await updatedTask(
    `${import.meta.env.VITE_BASE_URL}/tasks`,
    task,
    selectedTask.value.id
  );
  if (res.status === 200) {
    const editedTask = await res.json();
    taskStore.editTask(editedTask.id, editedTask);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: `The task has been updated`,
      life: 3000,
    });
    router.push({ name: "task" });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `The update was unsuccessful"`,

      life: 3000,
    });
    router.push({ name: "task" });
  }
  popup.addEdit = false;
  popup.optionEditDelete = false;
};

const editTaskModal = async (id) => {
  const taskDetails = await fetchTaskDetails(
    `${import.meta.env.VITE_BASE_URL}/tasks`,
    id
  );
  if (taskDetails === undefined) {
    return;
  }
  selectedTask.value = taskDetails;
  selectedTask.value.status = taskDetails.status.name;
  selectedTask.value.createdOn = formatDate(taskDetails.createdOn);
  selectedTask.value.updatedOn = formatDate(taskDetails.updatedOn);
  popup.addEdit = true;
  popup.optionEditDelete = false;
  router.push({ name: "task-edit", params: { id: id } });
};

const showOptionEditDelete = (taskId) => {
  selectedTask.value.id = taskId;
  popup.detail = false;
  popup.optionEditDelete = !popup.optionEditDelete;
};

const closeDelete = () => {
  popup.delete = false;
  popup.optionEditDelete = false;
  clearValue();
};

const selectedIndex = ref(0);

const openDelete = (id, index) => {
  popup.delete = true;
  console.log(id, index);
  const task = taskStore.getTasksById(id);
  console.log(task);
  selectedIndex.value = index;
  selectedTask.value = task;
};

const deleteData = async (id) => {
  const statusCode = await deleteTask(
    `${import.meta.env.VITE_BASE_URL}/tasks`,
    id
  );
  const taskValue = taskStore.getTasksById(id);
  const index = taskStore.getTasks.findIndex((task) => task.id === id);
  if (statusCode === 200) {
    taskStore.removeTask(index);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: `The task has been deleted`,
      life: 3000,
    });
    clearValue();
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `An error occurred deleting the task "${taskValue.title}"`,
      life: 3000,
    });
  }
  closeDelete();
};
</script>

<template>
  <Toast class="itbkk-message" />
  <div class="h-screen w-full">
    <div class="table lg:px-24 sm:px-10 overflow-hidden" v-if="page.task">
      <div class="flex justify-between py-6 px-5">
        <div
          class="text-xl font-bold flex items-center text-blue"
          @click="router.push({ name: 'task' })"
        >
          <HomeText />
        </div>
        <div class="flex">
          <buttonSubmit
            class="itbkk-button-add"
            buttonType="add"
            @closeDetail="closeDetail"
            v-on:click="openAdd"
            >+ Add Task</buttonSubmit
          >

          <buttonSubmit
            buttonType="manage-status"
            class="flex gap-x-2"
            @click="router.push({ name: 'status-manage' })"
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
                    class="w-1/6 px-6 py-3 bg-lightgray border-b border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
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
                    {{ task.assignees || "Unassigned" }}
                  </td>
                  <td
                    class="itbkk-status px-6 py-4 text-sm text-gray-600 border-b border-gray-300 break-all"
                  >
                    <div class="flex gap-x-8 items-center text-center">
                      <StatusButton>
                        {{ task.status }}
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
                              popup.optionEditDelete &&
                              selectedTask.id === task.id
                            "
                          >
                            <ul
                              class="py-2 text-sm text-gray-700 dark:text-gray-200 z-50"
                            >
                              <li @click="editTaskModal(task.id)">
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
      @closeDelete="closeDelete"
      :selectedTask="selectedTask"
      :selectedIndex="selectedIndex"
      @deleteData="deleteData"
    ></DeleteModal>

    <Detail
      v-if="popup.detail"
      @closeDetail="closeDetail"
      :selectedTask="selectedTask"
      :localTimeZone="localTimeZone"
    ></Detail>

    <AddEditModal
      v-if="popup.addEdit"
      class="z-50"
      @closeDetail="closeDetail"
      @addNewTask="addNewTask"
      @editNewTask="editTask"
      :selectedTask="selectedTask"
      :localTimeZone="localTimeZone"
    ></AddEditModal>
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
