<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { initFlowbite, initDropdowns } from "flowbite";
import StatusButton from "../components/button/StatusButton.vue";
import DeleteModal from "../components/confirmModal/DeleteTask.vue";
import StatusSetting from "../components/confirmModal/StatusSetting.vue";
import NavigateTitle from "@/components/navigateTitle.vue";
import { useRouter, RouterView, useRoute } from "vue-router";
import buttonSubmit from "../components/button/Button.vue";
import { useTaskStore } from "../stores/TaskStore.js";
import { useStatusStore } from "../stores/StatusStore.js";
import { useSortStore } from "../stores/SortStore.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Header from "../components/Header.vue";
const router = useRouter();
const route = useRoute();
const selectedId = ref("");
const selectedIndex = ref(0);
const taskStore = useTaskStore();
const statusStore = useStatusStore();
const sortStore = useSortStore();
const sortTypes = ["default", "ascending", "descending"];
const sortType = ref("default");
const openLimit = ref(false);
const boardVisibility = ref(false);  // Actual state 1.true = "Private" 2.false = "Public"
const boardStore = useBoardStore();
const boardId = route.params.id;

onMounted(async () => {
  initFlowbite();
  initDropdowns();
  await taskStore.loadTasks(boardId);
  await statusStore.loadStatuses(boardId);
  const fetchedBoard = await boardStore.loadBoardById(boardId);
  boardStore.setCurrentBoard(fetchedBoard);
});

const boardVisibilityToString = () => {
  return boardVisibility.value === false ? "Public" : "Private";
}

const confirmVisibilityChange = async() => {
  console.log(boardVisibilityToString().toUpperCase());

  await boardStore.changeBoardVisibility(boardStore.getCurrentBoard.id, boardVisibilityToString().toUpperCase());
  boardVisibility.value = !boardVisibility.value;
  popup.boardVisibilityPopup = false; 
}

const popup = reactive({
  addEdit: false,
  optionEditDelete: false,
  delete: false,
  limitStatus: false,
  boardVisibilityPopup: false,
});

const showOptionEditDelete = (taskId) => {
  selectedId.value = taskId;
  popup.optionEditDelete = !popup.optionEditDelete;
};

const openDetail = (id) => {
  popup.optionEditDelete = false;
  router.push({ name: "task-detail", params: { taskId: id } });
};

const openDelete = (id, index) => {
  selectedId.value = id;
  selectedIndex.value = index;
  popup.delete = true;
};

const cycleSortType = () => {
  const currentIndex = sortTypes.indexOf(sortType.value);
  sortType.value = sortTypes[(currentIndex + 1) % sortTypes.length];
  taskStore.loadSortTasks(sortType.value);
  sortStore.setSortType(sortType.value);
};

const showSelectFilter = () => {
  showList.value = true;
};

const showList = ref(false);

watch(taskStore.filterStatuses, async () => {
  await taskStore.loadFilterTasks(taskStore.filterStatuses, sortType.value);
});

const toggleItem = (id) => {
  const listItems = document.querySelectorAll(".item");
  const index = statusStore.getStatuses.findIndex((status) => status.id === id);
  const selectedStatus = statusStore.getStatuses[index];
  const listItem = listItems[index];

  if (taskStore.filterStatuses.includes(selectedStatus.name)) {
    taskStore.filterStatuses.splice(
      taskStore.filterStatuses.indexOf(selectedStatus.name),
      1
    );
  } else {
    taskStore.filterStatuses.push(selectedStatus.name);
    listItem.classList.add("checked");
  }
};

const clearEachStatus = (statusName) => {
  taskStore.filterStatuses.splice(
    taskStore.filterStatuses.indexOf(statusName),
    1
  );
  showList.value = false;
};

const clearFilter = () => {
  taskStore.filterStatuses.length = 0;
  showList.value = false;
};

const openLimitStatus = () => {
  openLimit.value = true;
};

const saveLimitStatus = async (id, limitMaximumTask, maximumTask) => {
  await statusStore.editStatusSetting(id, limitMaximumTask, maximumTask);
  openLimit.value = false;
  router.push({ name: "task" });
};

import { onClickOutside } from "@vueuse/core";
import { useBoardStore } from "@/stores/BoardStore";
import VisibilityConfirmModal from "@/components/confirmModal/VisibilityConfirmModal.vue";

const optionEditDelete = ref(null);
const currentPage = route.name;

onClickOutside(optionEditDelete, () => {
  popup.optionEditDelete = false;
});

const handleEditTask = () => {
  popup.optionEditDelete = false;
  router.push({ name: "task-edit", params: { taskId: selectedId.value } });
};
</script>

<template>
  <RouterView />

  <div
    class="h-screen w-full bg-bgLightBlue"
    @click="
      () => {
        showList = false;
      }
    "
  >
    <Header />

    <div
      class="table-auto xl:px-24 lg:px-10 py-6 sm:px-10 px-6 z-10 md-vertical:px-9 mobile:px-5 overflow-hidden"
    >
      <div
        class="font-bold flex items-center justify-center text-black text-center xl:text-2xl lg:text-3xl md:text-2xl sm:text-lg md-vertical:px-3 mobile:px-0 py-5"
      >
        {{ boardStore.getCurrentBoard.name }}
      </div>

      <NavigateTitle :currentPage="currentPage">
        <template #navigate-home>Home</template>
      </NavigateTitle>

      <div
        class="flex justify-between py-6 md-vertical:px-6 mobile:px-0 md-vertical:flex-row mobile:flex-col gap-3"
        @click.self="popup.optionEditDelete = false"
      >
        <div class="container z-30 md-vertical:scale-95 mobile:scale-[87%]">
          <div
            class="itbkk-status-filter select-btn"
            :class="[
              showList ? 'open' : '',
              taskStore.filterStatuses.length >= 2 ? 'h-auto' : 'h-[40px]',
            ]"
            @click.stop="showSelectFilter"
          >
            <StatusButton
              v-for="status in taskStore.filterStatuses"
              :key="status"
              :statusName="status"
              :statusColor="statusStore.getStatusColor(status)"
              class="itbkk-filter-item"
              :filterStatuses="taskStore.filterStatuses"
              @clear-status="clearEachStatus"
            >
              <p>{{ status }}</p>
            </StatusButton>

            <span
              class="text-gray-400"
              v-if="taskStore.filterStatuses.length === 0"
            >
              Filter by
              {{ statusStore.getStatuses.length > 1 ? "Statuses" : "Status" }}
            </span>
          </div>
          <span class="close-icon z-40" @click="clearFilter">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </span>
          <ul class="list-items" v-if="showList">
            <li
              v-for="status in statusStore.getStatuses"
              class="item itbkk-status-choice"
              :key="status.id"
              @click.stop="toggleItem(status.id)"
            >
              <input
                type="checkbox"
                class="checkbox"
                v-model="taskStore.filterStatuses"
                :value="status.name"
              />
              <span class="item-text">{{ status.name }}</span>
            </li>
          </ul>
        </div>
        <div class="flex px-4">
          <div class="my-3">
            <label class="inline-flex items-center cursor-pointer">
              <input
                v-model="boardVisibility"
                type="checkbox"
                class="toggle toggle-success"
                @click.prevent="popup.boardVisibilityPopup =true"
              />
              <span
                class="ms-3 text-gray-900 dark:text-gray-300 md-vertical:text-base text-sm"
                >{{ boardVisibility ? "Public" : "Private" }}</span
              >
            </label>
          </div>
          <buttonSubmit
            buttonType="manage-status"
            class="itbkk-manage-status flex gap-x-2 justify-center items-center"
            @click="router.push({ name: 'board-status' })"
          >
            <img src="../assets/status-list.svg" alt="" class="w-5" />
            Manage Status</buttonSubmit
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

      <!-- <div
        class="table xl:px-24 lg:px-10 sm:px-10 px-6 z-10 md-vertical:px-4 mobile:px-5"
        v-if="page.task"
        @click="closeList"
      > -->
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
                    class="xl:w-[5%] lg:w-[7%] md-vertical:w-[8%] bg-lightgray border-b border-r border-gray-300 w-[7%]"
                  >
                    <div class="flex justify-center item-center">
                      <img
                        src="../assets/addTaskIcon.svg"
                        alt="add-task-icon"
                        @click="router.push({ name: 'task-add' })"
                        class="itbkk-button-add scale-90 xl:scale-90 lg:scale-[80%] md-vertical:scale-[85%] mobile:scale-[195%] hover:shadow-lg hover:scale-100 cursor-pointer rounded-full hover:bg-[#20ae27] transition-all duration-300 ease-in-out active:scale-[85%] active:transition-transform"
                      />
                    </div>
                  </th>
                  <th
                    class="xl:w-1/2 lg:w-[45%] px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    class="xl:w-2/6 lg:w-[22%] md-vertical:w-[28%] px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Assignees
                  </th>
                  <th
                    class="xl:w-[18%] lg:w-[22%] md-vertical:w-[26%] md-vertical:px-6 py-3 px-2 bg-lightgray border-b border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    <div class="flex">
                      <p class="content-center">Status</p>
                      <div @click="cycleSortType" class="cursor-pointer ml-5">
                        <img
                          src="../assets/alphabeticalSorting.svg"
                          alt=""
                          class="itbkk-status-sort w-5 mobile:w-4 content-center"
                          v-if="sortType === 'default'"
                        />
                        <img
                          src="../assets/alphabeticalSorting-green.svg"
                          alt=""
                          class="itbkk-status-sort w-5 mobile:w-4 content-center"
                          v-if="sortType === 'ascending'"
                        />
                        <img
                          src="../assets/alphabeticalReverse.svg"
                          alt=""
                          class="itbkk-status-sort w-5 mobile:w-4 content-center"
                          v-if="sortType === 'descending'"
                        />
                      </div>
                    </div>
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
                    class="text-center py-4 text-sm md-vertical:text-sm text-gray-600 border-b border-r border-gray-300 break-all"
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
                    class="px-6 py-4 md-vertical:px-6 mobile:px-1 text-sm text-gray-600 border-b border-gray-300 break-all"
                  >
                    <div class="flex justify-between items-center text-center">
                      <StatusButton
                        :statusName="task.status.name"
                        :statusColor="
                          statusStore.getStatusColor(task.status.name)
                        "
                      >
                        {{ task.status.name }}
                      </StatusButton>
                      <div>
                        <div
                          class="itbkk-button-action inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                          type="button"
                          ref="optionEditDelete"
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
                              <li @click="handleEditTask">
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
    <VisibilityConfirmModal
      v-if="popup.boardVisibilityPopup"
      :visibility-type="boardVisibility ? 'Private' : 'Public'"
      @closeBoardVisibility="popup.boardVisibilityPopup = false"
      @changeBoardVisibilityMode="confirmVisibilityChange"
    ></VisibilityConfirmModal>

    <DeleteModal
      v-if="popup.delete"
      :selectedId="selectedId"
      :selectedIndex="selectedIndex"
      @closeDelete="popup.delete = false"
      
      @confirmDeleteTask="popup.delete = false"
    ></DeleteModal>
    <StatusSetting
      v-if="openLimit"
      @closeLimitStatus="openLimit = false"
      @saveLimitStatus="saveLimitStatus"
    ></StatusSetting>
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
