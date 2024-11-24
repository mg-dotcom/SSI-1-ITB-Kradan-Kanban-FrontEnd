import { defineStore } from "pinia";
import {
  fetchAllTasks,
  addTask,
  deleteTask,
  fetchTaskDetails,
  updatedTaskWithFiles,
  fetchFilePreview,
  deleteTaskFile,
  fetchFilterTasks,
} from "../libs/FetchTask.js";
import { sortTasks } from "../libs/libsUtil.js";
import { useToast } from "primevue/usetoast";
import { useBoardStore } from "./BoardStore.js";
import { useStatusStore } from "./StatusStore.js";
import { checkTokenExpiration } from "./UserStore.js";
import { handleResponseStatus } from "../libs/libsUtil.js";

const BOARD_ENDPOINT = import.meta.env.VITE_BOARD_ENDPOINT;
const TASK_ENDPOINT = import.meta.env.VITE_TASK_ENDPOINT;

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
    getTasks: (state) => state.tasks,
    getTaskById: (state) => (id) =>
      state.tasks.find((task) => task.id === Number(id)),
    getTasksByStatus: (state) => (status) =>
      state.tasks.filter((task) => task.status === status),
    getTaskFilesById: (state) => (id) =>
      state.tasks.find((task) => task.id === Number(id))?.files || [],
  },
  actions: {
    async loadTasks(boardId) {
      await checkTokenExpiration(boardId);
      const res = await fetchAllTasks(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/tasks`
      );
      handleResponseStatus(res);
      this.tasks = await res.json();
    },
    async loadTaskDetails(id, boardId) {
      await checkTokenExpiration(boardId);
      const res = await fetchTaskDetails(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/tasks`,
        id
      );
      handleResponseStatus(res);
      return await res.json();
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
          detail: "The task has been successfully added",
          life: 3000,
        });
      } else if (res.status === 400) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `The status ${status.name} will have too many tasks. Please make progress and update status of existing tasks.`,
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
      if (res.status >= 200 && res.status <= 299) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: "The task has been deleted",
          life: 3000,
        });
      } else if (res.status === 404) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "An error has occurred, the task does not exist.",
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
      if (res.status >= 200 && res.status <= 299) {
        const taskIndex = this.tasks.findIndex((task) => task.id === id);
        this.tasks[taskIndex] = data;
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: "The task has been updated",
          life: 3000,
        });
      } else if (res.status === 404) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "An error has occurred, the task does not exist.",
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
    async fetchFilePreview(fileName, taskId) {
      const boardId = this.boardStore.getCurrentBoard.id;
      await checkTokenExpiration(boardId);
      const res = await fetchFilePreview(
        `${
          import.meta.env.VITE_BASE_URL
        }${BOARD_ENDPOINT}/${boardId}/tasks/${taskId}/files/${fileName}`
      );
      if (res.status === 200) {
        return res;
      } else {
        handleResponseStatus(res);
      }
    },
    async deleteTaskFile(file, taskId) {
      const boardId = this.boardStore.getCurrentBoard.id;
      await checkTokenExpiration(boardId);
      const res = await deleteTaskFile(
        `${
          import.meta.env.VITE_BASE_URL
        }${BOARD_ENDPOINT}/${boardId}/tasks/${taskId}/files/${file.fileName}`
      );
      if (res.status >= 200 && res.status <= 299) {
        const taskIndex = this.tasks.findIndex(
          (task) => task.id === Number(taskId)
        );
        this.tasks[taskIndex].files = this.tasks[taskIndex].files.filter(
          (f) => f.id !== file.id
        );
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: "The file has been deleted",
          life: 3000,
        });
      } else if (res.status === 404) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "An error has occurred, the file does not exist.",
          life: 3000,
        });
      } else {
        handleResponseStatus(res);
      }
    },
    async transferTasksStatus(currentStatus, newStatus) {
      await checkTokenExpiration();
      this.tasks.forEach((task) => {
        if (task.status === currentStatus) {
          task.status = newStatus;
        }
      });
    },
    async loadSortTasks(sortType, arrayStatusesName = []) {
      const boardId = this.boardStore.getCurrentBoard.id;
      await checkTokenExpiration(boardId);

      const res = await fetchAllTasks(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/tasks`
      );

      if (res.status >= 200 && res.status <= 299) {
        const tasks = await res.json();

        // Only filter tasks based on the statuses, then sort them
        const filteredAndSortedTasks = sortTasks(
          tasks,
          sortType,
          arrayStatusesName
        );


        this.tasks = filteredAndSortedTasks;
      } else {
        alert("Failed to fetch tasks");
      }
    },

    addTaskFile(file) {
      this.taskFiles.push(file);
    },
    deleteTaskFile(fileName) {
      this.taskFiles = this.taskFiles.filter(
        (file) => file.fileName !== fileName
      );
    },
    async loadFilterTasks(arrayStatusesName, sortType) {
      const boardId = this.boardStore.getCurrentBoard.id;
      await checkTokenExpiration(boardId);
      if (arrayStatusesName.length === 0) {
        const res = await fetchAllTasks(
          `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/tasks`
        );
        this.tasks = await res.json();
      } else {
        this.tasks = await fetchFilterTasks(
          `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/tasks`,
          arrayStatusesName
        );
      }
      sortTasks(this.tasks, sortType);
    },
  },
});
