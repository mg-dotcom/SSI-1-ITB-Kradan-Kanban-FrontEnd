import { defineStore } from "pinia";
import {
  fetchAllTasks,
  addTask,
  deleteTask,
  fetchTaskDetails,
  updatedTaskWithFiles,
  deleteTaskFile,
} from "../libs/FetchTask.js";
import { sortTasks } from "../libs/libsUtil.js";
import { useToast } from "primevue/usetoast";
import { useBoardStore } from "./BoardStore.js";
import { useStatusStore } from "./StatusStore.js";
import { checkTokenExpiration } from "./UserStore.js";
import { handleResponseStatus } from "../libs/libsUtil.js";

const BOARD_ENDPOINT = import.meta.env.VITE_BOARD_ENDPOINT;

export const useTaskStore = defineStore("TaskStore", {
  state: () => ({
    toast: useToast(),
    boardStore: useBoardStore(),
    taskFiles: [],
    tasks: [],
    sortType: "",
    filterStatuses: [],
  }),
  getters: {
    getTasks() {
      return this.tasks;
    },
    getTaskById: (state) => (id) => {
      return state.tasks.find((task) => task.id === Number(id));
    },
    getTasksByStatus: (state) => (status) => {
      return state.tasks.filter((task) => task.status === status);
    },
    getTaskFilesById: (state) => (id) => {
      return state.tasks.find((task) => task.id === Number(id)).files;
    },
  },

  actions: {
    async loadTasks(boardId) {
      await checkTokenExpiration(boardId);
      const res = await fetchAllTasks(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/tasks`
      );

      handleResponseStatus(res);
      const data = await res.json();
      this.tasks = data;
    },

    async loadTaskDetails(id, boardId) {
      await checkTokenExpiration(boardId);
      const res = await fetchTaskDetails(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/tasks`,
        id
      );
      handleResponseStatus(res);
      const data = await res.json();
      return data;
    },

    async addTask(newTask) {
      await checkTokenExpiration();
      const boardId = this.boardStore.getCurrentBoard.id;

      const res = await addTask(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/tasks`,
        newTask
      );

      const statusStore = useStatusStore();
      const status = statusStore.getStatusById(newTask.statusId);
      if (res.status >= 200 && res.status <= 299) {
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: `The task has been successfully added`,
          life: 3000,
        });
      } else if (res.status === 400) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `The status ${status.name} will have too many tasks. Please make progress and update status of existing tasks .`,
          life: 3000,
        });
      } else {
        handleResponseStatus(res);
      }
      return res;
    },

    async deleteTask(id) {
      const boardId = this.boardStore.getCurrentBoard.id;
      await checkTokenExpiration(boardId);

      const res = await deleteTask(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/tasks`,
        id
      );
      const taskIndex = this.tasks.findIndex((task) => task.id === id);
      if (res.status >= 200 && res.status <= 299) {
        this.tasks.splice(taskIndex, 1);
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: `The task has been deleted`,
          life: 3000,
        });
      } else if (res.status === 404) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `An error has occurred, the task does not exist.`,
          life: 3000,
        });
      } else {
        handleResponseStatus(res);
      }
    },

    async editTaskWithFiles(id, updatedTaskData, updatedTaskFiles) {
      const boardId = this.boardStore.getCurrentBoard.id;
      await checkTokenExpiration(boardId);

      const res = await updatedTaskWithFiles(
        `${
          import.meta.env.VITE_BASE_URL
        }${BOARD_ENDPOINT}/${boardId}/tasks/${id}`,
        updatedTaskData,
        updatedTaskFiles
      );

      const data = await res.json();
      const message = data.message;
      const fileErrors = data.fileErrors || [];
      const fileName = fileErrors.map((file) => file.fileName);

      const taskIndex = this.tasks.findIndex((task) => task.id === id);
      if (res.status >= 200 && res.status <= 299) {
        this.tasks[taskIndex] = data;

        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: `The task has been updated`,
          life: 3000,
        });
      } else if (res.status === 404) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `An error has occurred, the task does not exist.`,
          life: 3000,
        });
      } else if (res.status === 400) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `${message} ${fileName.join(", ")}`,
          life: 3000,
        });
      } else {
        handleResponseStatus(res);
      }
      return res;
    },

    async deleteTaskFile(file, taskId) {
      const boardId = this.boardStore.getCurrentBoard.id;
      await checkTokenExpiration(boardId);

      const res = await deleteTaskFile(
        `${
          import.meta.env.VITE_BASE_URL
        }${BOARD_ENDPOINT}/${boardId}/tasks/${taskId}/files/${file.fileName}`
      );

      const taskIndex = this.tasks.findIndex(
        (task) => task.id === Number(taskId)
      );
      if (res.status >= 200 && res.status <= 299) {
        const fileIndex = this.tasks[taskIndex].files.findIndex(
          (file) => file.id === file.id
        );
        this.tasks[taskIndex].files.splice(fileIndex, 1);
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: `The file has been deleted`,
          life: 3000,
        });
      } else if (res.status === 404) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `An error has occurred, the file does not exist.`,
          life: 3000,
        });
      } else {
        handleResponseStatus(res);
      }
    },

    async transferTasksStatus(currentStatus, newStatus) {
      await checkTokenExpiration();
      const tasksToUpdate = this.tasks.filter(
        (task) => task.status === currentStatus
      );
      tasksToUpdate.forEach((task) => {
        task.status = newStatus;
      });
    },

    async loadSortTasks(sortType) {
      await checkTokenExpiration();
      const boardId = this.boardStore.getCurrentBoard.id;

      const data = await fetchAllTasks(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/tasks`
      );
      if (data.status < 200 && data.status > 299) {
        //fetch data failed
        alert("Failed to fetch tasks");
      } else {
        this.tasks = data;
        return sortTasks(this.tasks, sortType);
      }
    },

    //FIX: this function is not used
    // async loadFilterTasks(arrayStatusesName, sortType) {
    //   if (arrayStatusesName.length === 0) {
    //     await this.loadTasks();
    //   } else {
    //     const data = await fetchFilterTasks(
    //       `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`,
    //       arrayStatusesName
    //     );
    //     this.tasks = data;
    //   }
    //   sortTasks(this.tasks, sortType);
    // },
  },
});
