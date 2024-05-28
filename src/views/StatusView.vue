<script setup>
import buttonSubmit from "../components/button/Button.vue";
import { useRouter } from "vue-router";
import StatusSetting from "../components/confirmModal/StatusSetting.vue";
import { useStatusStore } from "../stores/StatusStore.js";
import { useTaskStore } from "../stores/TaskStore.js";
import { onMounted } from "vue";
import StatusButton from "../components/button/StatusButton.vue";
import { RouterView } from "vue-router";
import DeleteStatus from "../components/confirmModal/DeleteStatus.vue";
import Transfer from "../components/confirmModal/Transfer.vue";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
const router = useRouter();
const statusStore = useStatusStore();
const taskStore = useTaskStore();
const toast = useToast();
onMounted(async () => {
  await statusStore.loadStatuses();
  await taskStore.loadTasks();
});

const numberOfTasks = ref(0);
const currentStatus = ref("");
const openDelete = ref(false);
const openTransfer = ref(false);
const openLimit = ref(false);

const openDeleteOrTransferModal = (id) => {
  currentStatus.value = statusStore.getStatusById(id);
  const haveTask = taskStore.getTasksByStatus(currentStatus.value.name);
  numberOfTasks.value = haveTask.length;
  console.log(haveTask.length);
  if (haveTask.length > 0) {
    openTransfer.value = true;
  } else {
    openDelete.value = true;
  }
};

const deleteStatus = (id) => {
  statusStore.removeStatus(id);
  openDelete.value = false;
};
const transferStatus = async (currentStatusId, newStatusId) => {
  await statusStore.transferStatus(
    currentStatusId,
    newStatusId,
    numberOfTasks.value
  );

  openTransfer.value = false;
  router.push({ name: "status" });
};

const openLimitStatus = () => {
  openLimit.value = true;
};

const saveLimitStatus = async (id, limitMaximumTask, maximumTask) => {
  await statusStore.editStatusSetting(id, limitMaximumTask, maximumTask);
  openLimit.value = false;
  router.push({ name: "status" });
};
</script>

<template>
  <RouterView />
  <div
    class="table-auto xl:px-24 lg:px-10 sm:px-10 px-6 z-10 md-vertical:px-4 mobile:px-5 overflow-hidden"
  >
    <div
      class="flex justify-between py-6 md-vertical:px-6 mobile:px-0 md-vertical:flex-row mobile:flex-col gap-3"
    >
      <div
        class="itbkk-button-home text-xl font-bold flex items-center text-blue"
      >
        <a
          class="relative opacity-65 after:bg-blue after:absolute after:h-[3px] after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
          @click="router.push({ name: 'task' })"
        >
          Home&nbsp;</a
        >
        <p class="opacity-65">></p>
        <a class="text-blue"> &nbsp;Task Status </a>
      </div>
      <div class="flex">
        <buttonSubmit
          class="itbkk-button-add"
          buttonType="add"
          @click="router.push({ name: 'status-add' })"
          >+ Add Status</buttonSubmit
        >
        <buttonSubmit
          class="itbkk-status-setting"
          button-type="add"
          @click="openLimitStatus"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 34 32"
            fill="none"
          >
            <path
              d="M28.52 26.8947H33M3.98667 16L1 16.0733M3.98667 16C3.98667 18.2092 5.89691 20 8.25333 20C10.6097 20 12.52 18.2092 12.52 16C12.52 13.7908 10.6097 12 8.25333 12C5.89691 12 3.98667 13.7908 3.98667 16ZM13.7449 16.0735H33M18.424 5.25207H1M33 5.25207H28.52M1 26.8947H18.424M27.4533 27C27.4533 29.2092 25.5431 31 23.1867 31C20.8302 31 18.92 29.2092 18.92 27C18.92 24.7908 20.8302 23 23.1867 23C25.5431 23 27.4533 24.7908 27.4533 27ZM27.4533 5C27.4533 7.20913 25.5431 9 23.1867 9C20.8302 9 18.92 7.20913 18.92 5C18.92 2.79087 20.8302 1 23.1867 1C25.5431 1 27.4533 2.79087 27.4533 5Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </buttonSubmit>
      </div>
    </div>
    <div class="-my-2 mb-8 sm:-mx">
      <div
        class="py-2 align-middle inline-block sm:px-6 lg:px-8 md-vertical:px-4 mobile:px-0 w-full"
      >
        <div
          class="shadow overflow-y-auto border-b border-gray-200 sm:rounded-lg"
        >
          <table class="w-full h-full md-vertical:table-fixed mobile:table">
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
                class="itbkk-item py-4"
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
                  class="itbkk-status-name md-vertical:px-3 mobile:p-0 text-sm text-gray-600 border-b border-r border-gray-300 break-all"
                >
                  <StatusButton
                    class=""
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
                  class="itbkk-status text-sm text-gray-600 border-b border-gray-300 break-all md-vertical:px-6 mobile:p-2"
                >
                  <buttonSubmit
                    class="itbkk-button-edit"
                    @click="
                      router.push({
                        name: 'status-edit',
                        params: { id: status.id },
                      })
                    "
                    :buttonType="
                      status.name === 'No Status' || status.name === 'Done'
                        ? 'cancel'
                        : 'edit'
                    "
                    :disabled="
                      status.name === 'No Status' || status.name === 'Done'
                    "
                    :class="
                      status.name === 'No Status' || status.name === 'Done'
                        ? 'bg-gray-300 px-4 py-2 rounded-md cursor-not-allowed opacity-50 transition-colors disabled'
                        : ''
                    "
                    >Edit</buttonSubmit
                  >
                  <buttonSubmit
                    class="itbkk-button-delete"
                    :buttonType="
                      status.name === 'No Status' || status.name === 'Done'
                        ? 'cancel'
                        : 'delete'
                    "
                    :disabled="
                      status.name === 'No Status' || status.name === 'Done'
                    "
                    :class="
                      status.name === 'No Status' || status.name === 'Done'
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
    <StatusSetting
      v-if="openLimit"
      @closeLimitStatus="openLimit = false"
      @saveLimitStatus="saveLimitStatus"
    ></StatusSetting>
  </div>
</template>

<style scoped></style>
