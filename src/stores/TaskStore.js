import { defineStore } from "pinia";
import {
  fetchAllTasks,
  addTask,
  deleteTask,
  fetchTaskDetails,
  updatedTask,
} from "../libs/FetchTask.js";
import { useToast } from "primevue/usetoast";

export const useTaskStore = defineStore("TaskStore", {
  state: () => ({
    toast: useToast(),
    tasks: [],
    TASK_ENDPOINT: "v2/tasks",
    taskDetails: {
      id: "",
      title: "",
      description: "",
      assignees: "",
      status: {},
      createdOn: "",
      updatedOn: "",
    },
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
        `${import.meta.env.VITE_BASE_URL}${this.TASK_ENDPOINT}`
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
        `${import.meta.env.VITE_BASE_URL}${this.TASK_ENDPOINT}`,
        id
      );
      if (data.status < 200 && data.status > 299) {
        //fetch data failed
        alert("Failed to fetch task details");
      } else {
        this.taskDetails = {
          id: data.id || "",
          title: data.title || "",
          description: data.description || "",
          assignees: data.assignees || "",
          status: data.status || {},
          createdOn: data.createdOn || "",
          updatedOn: data.updatedOn || "",
        };
        return this.taskDetails;
      }
    },

    async addTask(newTask) {
      const res = await addTask(
        `${import.meta.env.VITE_BASE_URL}${this.TASK_ENDPOINT}`,
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
          detail: `An error occurred adding the task "${addedData.title}"`,
          life: 3000,
        });
      }
    },

    async deleteTask(id) {
      const res = await deleteTask(
        `${import.meta.env.VITE_BASE_URL}${this.TASK_ENDPOINT}`,
        id
      );
      const taskIndex = this.tasks.findIndex((task) => task.id === id);
      if (res.status === 200) {
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
        `${import.meta.env.VITE_BASE_URL}${this.TASK_ENDPOINT}`,
        updatedTaskInput,
        id
      );
      const taskIndex = this.tasks.findIndex((task) => task.id === id);
      if (res.status === 200) {
        const updateData = await res.json();
        this.tasks[taskIndex] = {
          ...updateData,
        };
        this.tasks[taskIndex].status = statusDetails;

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
          detail: `An error has occurred, the task does not exist`,
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
  },
});
