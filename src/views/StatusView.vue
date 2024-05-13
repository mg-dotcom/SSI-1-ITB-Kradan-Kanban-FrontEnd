<script setup>
import buttonSubmit from "../components/button/Button.vue";
import { useRouter, useRoute } from "vue-router";
import { useStatusStore } from "../stores/StatusStore.js";
import { useTaskStore } from "../stores/TaskStore.js";
import { onMounted } from "vue";
import StatusButton from "../components/button/StatusButton.vue";
import { RouterView } from "vue-router";
import DeleteStatus from "../components/confirmModal/DeleteStatus.vue";
import Transfer from "../components/confirmModal/Transfer.vue";
import { ref } from "vue";

const router = useRouter();
const statusStore = useStatusStore();
const taskStore = useTaskStore();

onMounted(async () => {
  await statusStore.loadStatuses();
  await taskStore.loadTasks();

  console.log("status", statusStore.getStatuses);
});

const numberOfTasks = ref(0);
const currentStatus = ref("");
const openDelete = ref(false);
const openTransfer = ref(false);

const openDeleteOrTransferModal = (id) => {
  currentStatus.value = statusStore.getStatusById(id);
  console.log(currentStatus.value.name);
  const haveTask = taskStore.getTasksByStatus(currentStatus.value.name);
  console.log(haveTask);
  numberOfTasks.value = haveTask.length;
  console.log(haveTask.length);
  if (haveTask.length > 0) {
    console.log("open transfer modal");
    openTransfer.value = true;
  } else {
    console.log("open delete modal");
    openDelete.value = true;
  }
};

const deleteStatus = (id) => {
  console.log(id);
  statusStore.removeStatus(id);
  openDelete.value = false;
  console.log("delete successful");
};
const transferStatus = async (currentStatus, currentStatusId, newStatusId) => {
  taskStore.transferTasksStatus(currentStatus, newStatusId);
  await statusStore.transferStatus(
    currentStatusId,
    newStatusId,
    numberOfTasks.value
  );
  openTransfer.value = false;
  router.push({ name: "status" });
};
</script>

<template>
  <Toast class="itbkk-message" />
  <RouterView />
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
          @click="router.push({ name: 'status-add' })"
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
                  class="itbkk-status-name text-sm text-gray-600 border-b border-r border-gray-300 break-all"
                >
                  <StatusButton
                    :statusColor="status.statusColor"
                    :statusName="status.name"
                    >{{ status.name }}</StatusButton
                  >
                </td>
                <td
                  class="itbkk-status-description text-sm border-b border-r border-gray-300 break-all"
                  :class="!status.description ? 'text-gray-400 italic' : ''"
                >
                  {{
                    !status.description
                      ? "No description is provided"
                      : status.description
                  }}
                </td>
                <td
                  class="itbkk-status text-sm text-gray-600 border-b border-gray-300 break-all"
                >
                  <buttonSubmit
                    class="itbkk-button-edit"
                    :buttonType="
                      status.name === 'No Status' ? 'cancel' : 'edit'
                    "
                    :disabled="status.name === 'No Status'"
                    :class="
                      status.name === 'No Status'
                        ? 'bg-gray-300 px-4 py-2 rounded-md cursor-not-allowed opacity-50 transition-colors disabled'
                        : ''
                    "
                    @click="
                      router.push({
                        name: 'status-edit',
                        params: { id: status.id },
                      })
                    "
                    >Edit</buttonSubmit
                  >
                  <buttonSubmit
                    class="itbkk-button-delete"
                    :buttonType="
                      status.name === 'No Status' ? 'cancel' : 'delete'
                    "
                    :disabled="status.name === 'No Status'"
                    :class="
                      status.name === 'No Status'
                        ? 'bg-gray-300 px-4 py-2 rounded-md cursor-not-allowed opacity-50 transition-colors disabled'
                        : ''
                    "
                    @click="openDeleteOrTransferModal(status.id)"
                  >
                    Delete
                  </buttonSubmit>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <DeleteStatus
      v-if="openDelete"
      :currentStatus="currentStatus"
      @closeDelete="openDelete = false"
      @deleteStatus="deleteStatus"
    ></DeleteStatus>
    <Transfer
      v-if="openTransfer"
      :currentStatus="currentStatus"
      :numberOfTasks="numberOfTasks"
      @closeDelete="openTransfer = false"
      @transferStatus="transferStatus"
    ></Transfer>
  </div>
</template>

<style scoped></style>
