import { defineStore } from "pinia";
import {
  fetchAllTasks,
  addTask,
  deleteTask,
  fetchTaskDetails,
  updatedTask,
  fetchFilterTasks,
} from "../libs/FetchTask.js";
import { sortTasks } from "../libs/libsUtil.js";
import { useToast } from "primevue/usetoast";
const TASK_ENDPOINT = import.meta.env.VITE_TASK_ENDPOINT;

export const useTaskStore = defineStore("TaskStore", {
  state: () => ({
    toast: useToast(),
    tasks: [],
    sortType: "",
  }),
  getters: {
    getTasks() {
      return this.tasks;
    },
    getTaskById: (state) => (id) => {
      return state.tasks.find((task) => task.id === id);
    },
    getTasksByStatus: (state) => (status) => {
      return state.tasks.filter((task) => task.status.name === status);
    },
  },
  actions: {
    async loadTasks() {
      const data = await fetchAllTasks(
        `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`
      );
      if (data.status < 200 && data.status > 299) {
        //fetch data failed
        alert("Failed to fetch tasks");
      } else {
        this.tasks = data;
      }
    },

    async loadTaskDetails(id) {
      const data = await fetchTaskDetails(
        `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`,
        id
      );
      if (data.status < 200 && data.status > 299) {
        //fetch data failed
        alert("Failed to fetch task details");
      } else {
        return data;
      }
    },

    async addTask(newTask) {
      const res = await addTask(
        `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`,
        newTask
      );
      if (res.status >= 200 && res.status <= 299) {
        const addedData = await res.json();
        this.tasks.push(addedData);
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: `The task has been successfully added`,
          life: 3000,
        });
      } else {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `Can not Add Task since it will exceed the limit. Please choose another status to add task.`,
          life: 3000,
        });
      }
    },

    async deleteTask(id) {
      const res = await deleteTask(
        `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`,
        id
      );
      const taskIndex = this.tasks.findIndex((task) => task.id === id);
      if (res.status >= 200 && res.status <= 299) {
        console.log("Task deleted successfully");
        this.tasks.splice(taskIndex, 1);
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: `The task has been deleted`,
          life: 3000,
        });
      } else {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `An error has occurred, the task does not exist.`,
          life: 3000,
        });
      }
    },

    async editTask(id, updatedTaskInput, statusDetails) {
      const res = await updatedTask(
        `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`,
        updatedTaskInput,
        id
      );
      const taskIndex = this.tasks.findIndex((task) => task.id === id);
      if (res.status >= 200 && res.status <= 299) {
        const updateData = await res.json();
        this.tasks[taskIndex] = {
          ...updateData,
          status: statusDetails,
        };

        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: `The task has been updated`,
          life: 3000,
        });
      } else {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `Can not Add Task since it will exceed the limit. Please choose another status to add task.`,
          life: 3000,
        });
      }
    },

    transferTasksStatus(currentStatus, newStatus) {
      const tasksToUpdate = this.tasks.filter(
        (task) => task.statusName === currentStatus
      );

      tasksToUpdate.forEach((task) => {
        task.statusName = newStatus;
      });
    },

    async loadSortTasks(sortType) {
      const data = await fetchAllTasks(
        `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`
      );
      if (data.status < 200 && data.status > 299) {
        //fetch data failed
        alert("Failed to fetch tasks");
      } else {
        this.tasks = data;
        return sortTasks(this.tasks, sortType);
      }
    },
    async loadFilterTasks(arrayOfStatusesId, sortType) {
      const data = await fetchFilterTasks(
        `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`,
        arrayOfStatusesId
      );
      if (arrayOfStatusesId.length === 0) {
        return sortTasks(this.tasks, sortType);
      }
      this.tasks = data;
      return sortTasks(this.tasks, sortType);
    },
  },
});
