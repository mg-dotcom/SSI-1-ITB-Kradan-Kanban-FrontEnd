<script setup>
import buttonSubmit from "../components/button/Button.vue";
import { useRouter, useRoute } from "vue-router";
import StatusSetting from "../components/confirmModal/StatusSetting.vue";
import { useStatusStore } from "../stores/StatusStore.js";
import { useTaskStore } from "../stores/TaskStore.js";
import { useBoardStore } from "../stores/BoardStore.js";
import { useUserStore } from "@/stores/UserStore";
import { onMounted, computed, ref, reactive } from "vue";
import StatusButton from "../components/button/StatusButton.vue";
import { useCollabStore } from "../stores/CollabStore";
import { RouterView } from "vue-router";
import DeleteStatus from "../components/confirmModal/DeleteStatus.vue";
import Transfer from "../components/confirmModal/Transfer.vue";
import NavigateTitle from "../components/navigateTitle.vue";
import Header from "../components/Header.vue";
import { checkTokenExpiration } from "@/stores/UserStore";

const route = useRoute();
const router = useRouter();
const statusStore = useStatusStore();
const collabStore = useCollabStore();
const taskStore = useTaskStore();
const boardStore = useBoardStore();
const userStore = useUserStore();

const boardId = route.params.id;

onMounted(async () => {
  await checkTokenExpiration(boardId);
  await taskStore.loadTasks(boardId);
  await statusStore.loadStatuses(boardId);
  const fetchedBoard = await boardStore.loadBoardById(boardId);
  boardStore.setCurrentBoard(fetchedBoard);
  boardVisibility.value = fetchedBoard.visibility === "PRIVATE" ? false : true;
});

const hasAccessRight = computed(() => {
  const collab = collabStore.getCollaborators?.find(
    (c) => c.oid === userStore.getUser?.oid
  );
  return collab?.accessRight === "WRITE";
});

const isOwner = computed(() => {
  const currentBoard = boardStore.getCurrentBoard;
  const currentUser = userStore.getUser;

  if (currentBoard?.owner && currentUser) {
    return currentBoard.owner.oid === currentUser.oid;
  }
  return false;
});

const boardVisibilityToString = () => {
  return boardVisibility.value === false ? "Public" : "Private";
};

const confirmVisibilityChange = async () => {
  await boardStore.changeBoardVisibility(
    boardStore.getCurrentBoard.id,
    boardVisibilityToString().toUpperCase()
  );
  boardVisibility.value = !boardVisibility.value;
  popup.boardVisibilityPopup = false;
};

const popup = reactive({
  boardVisibilityPopup: false,
});

const numberOfTasks = ref(0);
const currentStatus = ref("");
const openDelete = ref(false);
const openTransfer = ref(false);
const openLimit = ref(false);
const boardVisibility = ref(false); // Actual state 1.false = "Private" 2.true = "Public"

const openDeleteOrTransferModal = (id) => {
  currentStatus.value = statusStore.getStatusById(id);

  const haveTask = taskStore.tasks.filter(
    (task) => task.status.name === currentStatus.value.name
  );

  numberOfTasks.value = haveTask.length;
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
  router.push({ name: "board-status" });
};

const openLimitStatus = () => {
  openLimit.value = true;
};

const saveLimitStatus = async (id, limitMaximumTask, maximumTask) => {
  await statusStore.editStatusSetting(id, limitMaximumTask, maximumTask);
  openLimit.value = false;
  router.push({ name: "board-status" });
};
</script>

<template>
  <RouterView />
  <div class="h-screen w-full bg-bgLightBlue">
    <Header />

    <div
      class="table-auto xl:px-24 lg:px-10 sm:px-10 px-6 py-6 z-10 md-vertical:px-9 mobile:px-5"
    >
      <div
        class="font-bold flex items-center justify-center text-black text-center xl:text-2xl lg:text-3xl md:text-2xl sm:text-lg md-vertical:px-3 mobile:px-0 py-5"
      >
        {{ boardStore.getCurrentBoard.name }}
      </div>
      <div
        class="flex justify-between mobile:px-0 py-6 md-vertical:flex-row mobile:flex-col gap-3"
      >
        <NavigateTitle :boardId="boardId" />

        <div class="flex">
          <div class="my-3 mr-2">
            <label
              class="inline-flex items-center cursor-pointer"
              :class="{ 'tooltip tooltip-bottom font-bold': !isOwner }"
              data-tip="You need to be board owner to perform this action."
            >
              <input
                v-model="boardVisibility"
                type="checkbox"
                class="itbkk-board-visibility toggle toggle-success"
                @click.prevent="popup.boardVisibilityPopup = true"
                :disabled="!isOwner"
              />
              <span
                class="ms-3 text-gray-900 dark:text-gray-300 md-vertical:text-base text-sm font-medium"
                >{{ boardVisibility ? "Public" : "Private" }}</span
              >
            </label>
          </div>
          <div
            :class="{ tooltip: isPublic }"
            data-tip="You need to be the board owner to perform this action."
          >
            <buttonSubmit
              class="itbkk-button-add"
              data-tip="You need to be board owner or has write access to perform this action."
              button-type="add"
              :class="{
                'disabled cursor-not-allowed bg-gray-300 px-4 py-2 rounded-md   text-white hover:bg-gray-400 transition-colors active:scale-[93%] active:transition-transform ':
                  !isOwner && !hasAccessRight,
                'tooltip tooltip-bottom hover:cursor-not-allowed':
                  !isOwner && !hasAccessRight,
              }"
              @click.prevent="
                isOwner || hasAccessRight
                  ? router.push({ name: 'status-add' })
                  : null
              "
              :disabled="!isOwner && !hasAccessRight"
              >+ Add Status</buttonSubmit
            >
          </div>

          <buttonSubmit
            @click.prevent="
              isOwner || hasAccessRight ? (openLimit = true) : null
            "
            :disabled="!isOwner && !hasAccessRight"
            data-tip="You dont have permission"
            button-type="add"
            class="itbkk-status-setting"
            :class="{
              'disabled cursor-not-allowed bg-gray-300 px-4 py-2 rounded-md   text-white hover:bg-gray-400 transition-colors active:scale-[93%] active:transition-transform ':
                !isOwner && !hasAccessRight,
              'tooltip tooltip-bottom hover:cursor-not-allowed':
                !isOwner && !hasAccessRight,
            }"
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
      <div class="table-tooltip relative">
        <table class="table">
          <thead class="bg-lightgray">
            <tr>
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
                class="itbkk-status-description text-sm border-b border-r border-gray-300 break-all text-gray-800"
                :class="!status.description ? 'text-gray-400 italic' : ''"
              >
                {{
                  !status.description
                    ? "No description is provided"
                    : status.description
                }}
              </td>
              <td
                class="itbkk-status text-sm text-gray-600 border-b border-gray-300 break-all md-vertical:px-6 mobile:p-2 font-bold text-center"
              >
                <div
                  :class="{
                    'tooltip tooltip-bottom disabled':
                      !isOwner && !hasAccessRight,
                  }"
                  data-tip="You need to be board owner or has write access to perform this action."
                >
                  <buttonSubmit
                    class="itbkk-button-edit"
                    @click.prevent="
                      isOwner || hasAccessRight
                        ? router.push({
                            name: 'status-edit',
                            params: { statusId: status.id },
                          })
                        : null
                    "
                    :button-type="
                      status.name === 'No Status' ||
                      status.name === 'Done' ||
                      (!isOwner && !hasAccessRight)
                        ? 'disabled'
                        : 'edit'
                    "
                    :disabled="
                      status.name === 'No Status' ||
                      status.name === 'Done' ||
                      (!isOwner && !hasAccessRight)
                    "
                    >Edit
                  </buttonSubmit>
                </div>
                <div
                  :class="{
                    'tooltip tooltip-bottom disabled':
                      !isOwner && !hasAccessRight,
                  }"
                  data-tip="You need to be board owner or has write access to perform this action."
                >
                  <buttonSubmit
                    class="itbkk-button-delete"
                    :class="{
                      'pointer-events-none disabled': isPublic,
                    }"
                    :button-type="
                      status.name === 'No Status' ||
                      status.name === 'Done' ||
                      (!isOwner && !hasAccessRight)
                        ? 'disabled'
                        : 'delete'
                    "
                    :disabled="
                      status.name === 'No Status' ||
                      status.name === 'Done' ||
                      (!isOwner && !hasAccessRight)
                    "
                    @click.prevent="
                      isOwner || hasAccessRight
                        ? openDeleteOrTransferModal(status.id)
                        : null
                    "
                  >
                    Delete
                  </buttonSubmit>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <VisibilityConfirmModal
        v-if="popup.boardVisibilityPopup"
        :visibility-type="boardVisibility ? 'Private' : 'Public'"
        @closeBoardVisibility="popup.boardVisibilityPopup = false"
        @changeBoardVisibilityMode="confirmVisibilityChange"
      ></VisibilityConfirmModal>

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
  </div>
</template>

<style scoped></style>
