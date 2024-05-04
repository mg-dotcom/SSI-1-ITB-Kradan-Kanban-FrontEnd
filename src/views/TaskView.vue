<script setup>
import { onMounted, reactive, ref } from "vue";
import { initFlowbite, initDropdowns } from "flowbite";
import Detail from "../components/Detail.vue";
import AddEditModal from "../components/AddEditModal.vue";
import StatusButton from "../components/button/StatusButton.vue";
import {
  fetchAllTasks,
  fetchTaskDetails,
  addTask,
  deleteTask,
  updatedTask,
} from "../libs/FetchTask.js";
import { TaskModal } from "../libs/TaskModal.js";
import DeleteModal from "../components/DeleteModal.vue";
import { useRouter, useRoute } from "vue-router";
import buttonSubmit from "../components/button/Button.vue";
const router = useRouter();
const route = useRoute();
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
const toast = useToast();

const selectedTask = ref({
  id: "",
  title: "",
  description: "",
  assignees: "",
  status: "No Status",
  createdOn: "",
  updatedOn: "",
});

const tasks = ref(new TaskModal());

const taskId = route.params.id;

onMounted(async () => {
  initFlowbite();
  initDropdowns();

  const allTasks = await fetchAllTasks(import.meta.env.VITE_BASE_URL);
  tasks.value.addAllTasks(allTasks);
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

const localTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);

function formatDate(date) {
  const d = new Date(date);
  return d
    .toLocaleString("en-GB", { timeZone: localTimeZone.value })
    .split(",")
    .join(" ");
}

const openDetail = async (id) => {
  const taskDetails = await fetchTaskDetails(import.meta.env.VITE_BASE_URL, id);
  if (taskDetails === undefined) {
    return;
  }
  selectedTask.value = taskDetails;
  selectedTask.value.status = formatStatus(taskDetails.status);
  selectedTask.value.createdOn = formatDate(taskDetails.createdOn);
  selectedTask.value.updatedOn = formatDate(taskDetails.updatedOn);
  popup.detail = true;
  router.push({ name: "task-detail", params: { id: id } });
};

if (taskId) {
  openDetail(taskId);
}

const closeDetail = () => {
  popup.detail = false;
  popup.addEdit = false;
  selectedTask.value = {
    id: "",
    title: "",
    description: "",
    assignees: "",
    status: "No Status",
    createdOn: "",
    updatedOn: "",
  };
  router.push({ name: "task" });
};

const formatStatus = (status) => {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const openAdd = () => {
  popup.addEdit = true;
  router.push({ name: "task-add" });
};

const addNewTask = async (task) => {
  task.status = task.status.toUpperCase().replace(/ /g, "_");
  const res = await addTask(import.meta.env.VITE_BASE_URL, task);
  const addedTask = await res.json();
  tasks.value.addTask(addedTask);
  if (res.status === 200) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: `The task "${addedTask.title}" is added successfully.`,
      life: 3000,
    });
    router.push({ name: "task" });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `An error occurred deleting the task "${addedTask.title}".`,
      life: 3000,
    });
  }
  popup.addEdit = false;
  popup.optionEditDelete = false;
};

const editTask = async (task) => {
  task.status = task.status.toUpperCase().replace(/ /g, "_");
  const editedRes = await updatedTask(
    import.meta.env.VITE_BASE_URL,
    task,
    selectedTask.value.id
  );

  if (editedRes.status === 200) {
    const editedTask = await editedRes.json();
    tasks.value.editTask(editedTask.id, editedTask);
    selectedTask.value = {
      id: "",
      title: "",
      description: "",
      assignees: "",
      status: "No Status",
      createdOn: "",
      updatedOn: "",
    };

    toast.add({
      severity: "success",
      summary: "Edit Successful",
      detail: `The task "${editedTask.title}" has been edited. `,
      life: 3000,
    });
    router.push({ name: "task" });
  }
  else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `An error occurred editing the task "${addedTask.title}".`,
      life: 3000,
    });
  }

  popup.addEdit = false;
  popup.optionEditDelete = false;
};

const editTaskModal = async (id) => {
  const taskDetails = await fetchTaskDetails(import.meta.env.VITE_BASE_URL, id);
  if (taskDetails === undefined) {
    return;
  }
  selectedTask.value = taskDetails;
  selectedTask.value.status = formatStatus(taskDetails.status);
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
  selectedTask.value = {
    id: "",
    title: "",
    description: "",
    assignees: "",
    status: "No Status",
    createdOn: "",
    updatedOn: "",
  };
  router.push({ name: "task" });
};

const openDelete = (id) => {
  popup.delete = true;
  const task = tasks.value.getTasksById(id);
  selectedTask.value = task;
  console.log(task);
};

const deleteData = async (id) => {
  const statusCode = await deleteTask(import.meta.env.VITE_BASE_URL, id);
  const taskValue = tasks.value.getTasksById(id);
  const index = tasks.value.getTasks().findIndex((task) => task.id === id);
  if (statusCode === 200) {
    tasks.value.removeTask(index);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: `The task "${taskValue.title}" has been deleted`,
      life: 3000,
    });
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
  <Toast />
  {{}}
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

    <div class="table lg:px-24 sm:px-10 overflow-hidden" v-show="page.task">
      <div class="itbkk-button-add flex justify-between py-6 px-5">
        <div class="text-xl font-bold flex items-center text-blue">
          Task Lists&nbsp;
          <span v-if="selectedTask.title.length !== 0" class="break-all">
            > {{ selectedTask.title }}
          </span>
        </div>
        <buttonSubmit
          buttonType="add"
          @closeDetail="closeDetail"
          @click="openAdd"
          >+ Add Task</buttonSubmit
        >
      </div>
      <div class="-my-2 sm:-mx">
        <div class="py-2 align-middle inline-block sm:px-6 lg:px-8">
          <div
            class="shadow overflow-y-auto border-b border-gray-200 sm:rounded-lg"
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
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-if="tasks.getTasks().length <= 0">
                  <td class="border text-center" colspan="4">No Task</td>
                </tr>
                <tr
                  class="itbkk-item"
                  v-for="(task, index) in tasks.getTasks()"
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
                      <StatusButton
                        :statusName="
                          task.status
                            .replace(/_/g, ' ')
                            .toLowerCase()
                            .split(' ')
                            .join('')
                        "
                      >
                        {{ formatStatus(task.status) }}
                      </StatusButton>
                      <button
                        class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
                      </button>

                      <!-- Dropdown menu -->
                      <div
                        class="bg-white divide-y divide-gray-100 rounded-lg shadow w-32 dark:bg-gray-700 dark:divide-gray-600 absolute right-[87px]"
                        v-show="
                          popup.optionEditDelete && selectedTask.id === task.id
                        "
                      >
                        <ul
                          class="py-2 text-sm text-gray-700 dark:text-gray-200 z-50"
                        >
                          <li class="" @click="editTaskModal(task.id)">
                            <p
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Edit
                            </p>
                          </li>
                          <li class="" @click="openDelete(task.id)">
                            <p
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-red-500"
                            >
                              Delete
                            </p>
                          </li>
                        </ul>
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
    <DeleteModal
      v-if="popup.delete"
      @closeDelete="closeDelete"
      :selectedTask="selectedTask"
      @deleteData="deleteData"
    ></DeleteModal>
    <!-- <BasicAlert
      alertType="deletesuccess"
      v-if="popup.deletedAlertMassage"
      class="alert-toast"
      >Delete Success</BasicAlert
    >
    <BasicAlert
      alertType="error"
      v-if="popup.errorAlertMassage"
      class="alert-toast"
      >Error</BasicAlert
    >
    <BasicAlert
      alertType="savedsuccess"
      v-if="popup.addAlertMassage"
      class="alert-toast"
      >Add Success</BasicAlert
    > -->
  </div>
</template>

<style scoped></style>
