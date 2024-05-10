<script setup>
import buttonSubmit from "../components/button/Button.vue";
import HomeText from "../components/HomeText.vue";
import { useRouter } from "vue-router";
import { useStatusStore } from "../stores/StatusStore.js";
import { onMounted, reactive, ref } from "vue";
import { fetchAllStatus, addStatus, updateStatus } from "../libs/FetchStatus.js";
import AddEditStatus from "../components/statusModal/AddEditStatus.vue";
import { useToast } from "primevue/usetoast";
import StatusButton from "../components/button/StatusButton.vue";

const router = useRouter();
const statusStore = useStatusStore();
const toast = useToast();

onMounted(async () => {
  if (statusStore.getStatuses.length === 0) {
    const allStatus = await fetchAllStatus(
      `${import.meta.env.VITE_BASE_URL}/statuses`
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

const popup = reactive({
  addEditStatus: false,
});

const openAddNewStatus = () => {
  popup.addEditStatus = true;
  router.push({ name: "status-add" });
};
const addNewStatus = async (newStatus) => {
  const res = await addStatus(
    `${import.meta.env.VITE_BASE_URL}/statuses`,
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
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `An error occurred adding the task "${newStatus.name}".`,
      life: 3000,
    });
  }
};


const editStatus = async (status) => {
  const res = await updateStatus(
    `${import.meta.env.VITE_BASE_URL}/statuses`,
    selectedStatus.value.id,
    status
  );
  console.log(status);
  if (res.status === 200) {
    const editedStatus = await res.json();
    statusStore.editStatus(editedStatus.id,editedStatus);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: `The Status has been updated.`,
      life: 3000,
    });
    router.push({ name: "status" });
  }else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `The update was unsuccessful.`,
      life: 3000,
    });
    router.push({ name: "status" });
  }
  popup.addEditStatus = false;

}

const editStatusModal = (id) => {
 const toUpdateStatus = statusStore.getStatusById(id);
 selectedStatus.value = toUpdateStatus;
 popup.addEditStatus = true
 router.push({ name: "status-edit", params: { id: id } });
}

const closeAddEdit = () => {
  popup.addEditStatus = false;
  router.push({ name: "status" });
};



</script>

<template>
  <Toast class="itbkk-message" />
  <div class="table lg:px-24 sm:px-10 overflow-hidden">
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
                  class="w-[20%] px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
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
                    <buttonSubmit class="itbkk-button-edit" buttonType="edit" @click="editStatusModal(status.id)"
                      >Edit</buttonSubmit
                    >
                    <buttonSubmit
                      class="itbkk-button-delete"
                      buttonType="delete"
                      >Delete</buttonSubmit
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <AddEditStatus
    v-if="popup.addEditStatus"
    :selectedStatus="selectedStatus"
    :localTimeZone="localTimeZone"
    @closeAddEdit="closeAddEdit"
    @addNewStatus="addNewStatus"
    @editStatus="editStatus"
  ></AddEditStatus>

</template>

<style scoped></style>
