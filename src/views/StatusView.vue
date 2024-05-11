<script setup>
<<<<<<< Updated upstream
import buttonSubmit from '../components/button/Button.vue'
import HomeText from '../components/HomeText.vue'
import { useRouter, useRoute } from 'vue-router'
import { useStatusStore } from '../stores/StatusStore.js'
import { onMounted, reactive, ref } from 'vue'
import AddEditStatus from '../components/statusModal/AddEditStatus.vue'
import { useToast } from 'primevue/usetoast'
import StatusButton from '../components/button/StatusButton.vue'
import DeleteStatus from '../components/confirmModal/DeleteStatus.vue'
import Transfer from '../components/confirmModal/Transfer.vue'
=======
import buttonSubmit from "../components/button/Button.vue";
import HomeText from "../components/HomeText.vue";
import { useRouter, useRoute } from "vue-router";
import { useStatusStore } from "../stores/StatusStore.js";
import { onMounted, reactive, ref } from "vue";
import AddEditStatus from "../components/statusModal/AddEditStatus.vue";
import { useToast } from "primevue/usetoast";
import StatusButton from "../components/button/StatusButton.vue";
import DeleteStatus from "../components/confirmModal/DeleteStatus.vue";
import Transfer from "../components/confirmModal/Transfer.vue";
>>>>>>> Stashed changes
import {
  fetchAllStatus,
  fetchStatusById,
  addStatus,
  deleteStatus,
  updateStatus,
} from "../libs/FetchStatus.js";
import { fetchAllTasks } from "../libs/FetchTask";
import { useTaskStore } from "../stores/TaskStore";
const STATUS_ENDPOINT = "v2/statuses";
const TASK_ENDPOINT = "v1/tasks";

const toast = useToast();
const route = useRoute();
const router = useRouter();
const statusStore = useStatusStore();
const taskStore = useTaskStore();

<<<<<<< Updated upstream
const toast = useToast()
const router = useRouter()
const route = useRoute()
const statusStore = useStatusStore()
const taskStore = useTaskStore()

const statusId = route.params.id

=======
>>>>>>> Stashed changes
onMounted(async () => {
  if (taskStore.getTasks.length === 0 && statusStore.getStatuses.length === 0) {
    const allTasks = await fetchAllTasks(
      `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`
    );
    taskStore.addAllTasks(allTasks);
    const allStatus = await fetchAllStatus(
      `${import.meta.env.VITE_BASE_URL}${STATUS_ENDPOINT}`
    );
    statusStore.addAllStatuses(allStatus);
  }
});

const selectedStatus = ref({
  id: "",
  name: "",
  description: "",
  color: "#CCCCCC",
  createdOn: "",
  updatedOn: "",
});

const clearValue = () => {
  selectedStatus.value.id = "";
  selectedStatus.value.name = "";
  selectedStatus.value.description = "";
  selectedStatus.value.color = "#CCCCCC";
  selectedStatus.value.createdOn = "";
  selectedStatus.value.updatedOn = "";
};

const localTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);

function formatDate(date) {
  const d = new Date(date);
  return d
    .toLocaleString("en-GB", { timeZone: localTimeZone.value })
    .split(",")
    .join(" ");
}

const popup = reactive({
  addEditStatus: false,
  deleteConfirm: false,
  transferConfirm: false,
});

const openAddNewStatus = () => {
<<<<<<< Updated upstream
  clearValue()
  popup.addEditStatus = true
  router.push({ name: 'status-add' })
}

=======
  
  popup.addEditStatus = true;
};
>>>>>>> Stashed changes
const addNewStatus = async (newStatus) => {
  const res = await addStatus(
    `${import.meta.env.VITE_BASE_URL}${STATUS_ENDPOINT}`,
    newStatus
  );
  const addedStatus = await res.json();
  const existStatus = statusStore.getStatuses.find(
    (statusData) => statusData.name === newStatus.name
  );

  if (res.status === 201) {
    statusStore.addStatus(addedStatus);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "The status added successfully.",
      life: 3000,
    });
    router.push({ name: "status" });
    popup.addEditStatus = false;
    clearValue();
  } else if (existStatus) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "The status already exists. Please try another name.",
      life: 3000,
    });

    router.push({ name: "status" });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `An error occurred adding the task "${newStatus.name}".`,
      life: 3000,
    });
    router.push({ name: "status" });
  }
};

const editStatus = async (status) => {
  const res = await updateStatus(
    `${import.meta.env.VITE_BASE_URL}${STATUS_ENDPOINT}`,
    selectedStatus.value.id,
    status
  );
  if (res.status === 200) {
    const editedStatus = await res.json();
    statusStore.editStatus(editedStatus.id, editedStatus);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: `The Status has been updated.`,
      life: 3000,
    });
    clearValue();
    router.push({ name: "status" });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `An error occurred, the status does not exist.`,
      life: 3000,
    });
    router.push({ name: "status" });
  }
  popup.addEditStatus = false;
};

const editStatusModal = (id) => {
  const toUpdateStatus = statusStore.getStatusById(id);
  selectedStatus.value = toUpdateStatus;
  selectedStatus.value.createdOn = formatDate(toUpdateStatus.createdOn);
  selectedStatus.value.updatedOn = formatDate(toUpdateStatus.updatedOn);
  popup.addEditStatus = true;
  router.push({ name: "status-edit", params: { id: id } });
};

<<<<<<< Updated upstream
// if (statusId) {
//   router.push({ name: 'status-edit', params: { id: statusId } })
//   editStatusModal(statusId)
// }

const closeAddEdit = () => {
  popup.addEditStatus = false
  router.push({ name: 'status' })
  // selectedStatus.value.id = "";
  // clearValue();
}
=======
const closeAddOrEdit = () => {
  popup.addEditStatus = false;

  router.push({ name: "status" });
};
>>>>>>> Stashed changes

const openConfirmDelete = async (id) => {
  selectedStatus.value = await fetchStatusById(
    `${import.meta.env.VITE_BASE_URL}${STATUS_ENDPOINT}`,
    id
<<<<<<< Updated upstream
  )
  console.log(selectedStatus.value)
=======
  );
  console.log(selectedStatus.value);
>>>>>>> Stashed changes
  if (selectedStatus.value.status === 404) {
    //no status found
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `An error occurred, the status does not exist.`,
      life: 3000,
    });
    return;
  }
  const statuses = taskStore.getTasks.map((item) => item.status.toLowerCase());
  const transferOrdelete = ref(
    statuses.includes(selectedStatus.value.name.toLowerCase())
  );
  if (transferOrdelete.value) {
    popup.transferConfirm = true;
  } else {
    popup.deleteConfirm = true;
  }
};

const removeStatus = async (id) => {
  const statusCode = await deleteStatus(
    `${import.meta.env.VITE_BASE_URL}${STATUS_ENDPOINT}`,
    id
  );
  popup.deleteConfirm = false;
  console.log("successful");
  console.log(statusCode);
  if (statusCode === 200) {
    statusStore.removeStatus(id);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: `The Status has been deleted.`,
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `An error occurred, the status does not exist.`,
      life: 3000,
    });
  }
  clearValue();
  statusStore.removeStatus(id);
};

const transferStatus = async (id) => {
  const newStatus = statusStore.getStatusById(id);
  taskStore.transferTasksStatus(selectedStatus.value.name, newStatus.name);
  const statusCode = await deleteStatus(
    `${import.meta.env.VITE_BASE_URL}${STATUS_ENDPOINT}/${
      selectedStatus.value.id
    }`,
    id
  );
  if (statusCode === 200) {
    statusStore.removeStatus(selectedStatus.value.id);
    console.log("successful");
    toast.add({
      severity: "success",
      summary: "Success",
      detail: `The task have been transferred and the status has been deleted.`,
      life: 3000,
    });
    clearValue();
    popup.transferConfirm = false;
  } else {
    console.log("Can not transfer");
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `An error occurred, the status does not exist.`,
      life: 3000,
    });
  }
};

const closeConfirmDelete = () => {
  popup.deleteConfirm = false;
  popup.transferConfirm = false;
  clearValue();
};
</script>

<template>
  <Toast class="itbkk-message" />
  <div class="table lg:px-24 sm:px-10 overflow-hidden">
    <div class="flex justify-between py-6 px-5">
      <div
        class="itbkk-button-home text-xl font-bold flex items-center text-blue"
      >
        <a
          class="relative after:bg-blue after:absolute after:h-[3px] after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
          @click="router.push({ name: 'task' })"
          >
          Home&nbsp;</a
        >
        <p class="">></p>
        <a
          class="relative after:bg-blue after:absolute after:h-[3px] after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
        >
          &nbsp;Task Status
        </a>
      </div>
      <div class="flex">
        <buttonSubmit
          class="itbkk-button-add"
          buttonType="add"
          @click="openAddNewStatus"
          >+ Add Status</buttonSubmit
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
                  class="w-1/6 px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  class="w-1/2 px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  class="w-1/6 px-6 py-3 bg-lightgray border-b border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-if="statusStore.getStatuses.length <= 0">
                <td class="border text-center" colspan="4">No Status</td>
              </tr>
              <tr
                class="itbkk-item"
                v-if="statusStore.getStatuses.length > 0"
                v-for="(status, index) in statusStore.getStatuses"
                :key="index"
              >
                <td
                  class="text-center p-5 text-sm text-gray-600 border-b border-r border-gray-300 break-all"
                >
                  {{ index + 1 }}
                </td>
                <td
                  class="itbkk-title text-sm text-gray-600 border-b border-r border-gray-300 break-all"
                >
                  <StatusButton
                    :statusColor="status.color"
                    :statusName="status.name"
                    >{{ status.name }}</StatusButton
                  >
                </td>
                <td
                  class="itbkk-assignees text-sm border-b border-r border-gray-300 break-all"
                >
                  {{ status.description }}
                </td>
                <td
                  class="itbkk-status text-sm text-gray-600 border-b border-gray-300 break-all"
                >
                  <div v-if="status.name !== 'No Status'">
                    <buttonSubmit
                      class="itbkk-button-edit"
                      buttonType="edit"
                      @click="editStatusModal(status.id)"
                      >Edit</buttonSubmit
                    >
                    <buttonSubmit
                      class="itbkk-button-delete"
                      buttonType="delete"
                      @click="openConfirmDelete(status.id)"
                    >
                      Delete
                    </buttonSubmit>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <DeleteStatus
      v-if="popup.deleteConfirm"
      :selectedStatus="selectedStatus"
      @deleteStatus="removeStatus"
      @closeDelete="closeConfirmDelete"
    ></DeleteStatus>
    <Transfer
      v-if="popup.transferConfirm"
      :selectedStatus="selectedStatus"
      @transferStatus="transferStatus"
      @closeDelete="closeConfirmDelete"
    >
    </Transfer>
  </div>
  <AddEditStatus
    v-if="popup.addEditStatus"
    :selectedStatus="selectedStatus"
    :localTimeZone="localTimeZone"
    :popup="popup"
    @closeAddOrEdit="closeAddOrEdit"
    @addNewStatus="addNewStatus"
    @editStatus="editStatus"
  ></AddEditStatus>
</template>

<style scoped></style>
