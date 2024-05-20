import { defineStore } from "pinia";
import {
  fetchAllStatus,
  fetchStatusById,
  deleteStatus,
  addStatus,
  updateStatus,
  updateStatusSetting,
  fetchStatusSetting,
} from "../libs/FetchStatus.js";
import { useToast } from "primevue/usetoast";
import { useTaskStore } from "./TaskStore.js";

const STATUS_ENDPOINT = import.meta.env.VITE_STATUS_ENDPOINT;

export const useStatusStore = defineStore("StatusStore", {
  state: () => ({
    toast: useToast(),
    statuses: [],
  }),

  getters: {
    getStatuses(state) {
      return state.statuses;
    },
    getStatusById: (state) => (id) => {
      return state.statuses.find((status) => status.id === id);
    },
    getStatusColor: (state) => (name) => {
      const status = state.statuses.find((status) => status.name === name);
      return status ? status.statusColor : "";
    },
  },
  actions: {
    async loadStatuses() {
      const data = await fetchAllStatus(
        `${import.meta.env.VITE_BASE_URL}${STATUS_ENDPOINT}`
      );
      if (data.status < 200 && data.status > 299) {
        alert("Failed to fetch statuses");
      } else {
        this.statuses = data;
      }
    },

    async loadStatusSetting() {
      const data = await fetchStatusSetting(
        `${import.meta.env.VITE_BASE_URL}${STATUS_ENDPOINT}`
      );
      if (data.status < 200 && data.status > 299) {
        alert("Failed to fetch statuses setting");
      } else {
        return data;
      }
    },

    async editStatusSetting(updatedLimit, maximumTask) {
      const res = await updateStatusSetting(
        `${import.meta.env.VITE_BASE_URL}${STATUS_ENDPOINT}`,
        updatedLimit
      );
      if (res.status >= 200 && res.status <= 299) {
        if (updatedLimit === true) {
          this.toast.add({
            severity: "success",
            summary: "Enabled Limit",
            detail: `The kanban board now limits ${maximumTask} tasks in each status`,
            life: 3000,
          });

          const taskStore = useTaskStore();
          const allStatus = this.getStatuses.filter(
            (status) => status.name !== "No Status" && status.name !== "Done"
          );
          const statusesExceedLimit = allStatus
            .filter((status) => {
              const tasks = taskStore.getTasksByStatus(status.name);
              return tasks.length > maximumTask;
            })
            .map(
              (status) =>
                `${status.name}: ${
                  taskStore.getTasksByStatus(status.name).length
                } tasks`
            )
            .join(", ");
          if (statusesExceedLimit.length > 0) {
            this.toast.add({
              severity: "warn",
              summary: "Enabled Limit Status",
              detail: `${statusesExceedLimit}
                  These statuses have reached the task limit. No additional tasks can be added to these statuses at this time.`,
            });
          }
        } else {
          this.toast.add({
            severity: "success",
            summary: "Disabled Limit",
            detail: `The kanban board has disabled the task limit in each status`,
            life: 3000,
          });
        }
      } else {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `An error has occurred, the status setting can not update.`,
          life: 3000,
        });
      }
    },

    async loadStatusDetail(id) {
      const data = await fetchStatusById(
        `${import.meta.env.VITE_BASE_URL}${STATUS_ENDPOINT}`,
        id
      );
      if (data.status < 200 && data.status > 299) {
        alert("Failed to fetch statuses");
      } else {
        return data;
      }
    },

    async addStatus(newStatus) {
      const res = await addStatus(
        `${import.meta.env.VITE_BASE_URL}${STATUS_ENDPOINT}`,
        newStatus
      );

      const existingStatus = this.statuses.find(
        (status) => status.name === newStatus.name
      );

      if (res.status === 201) {
        const data = await res.json();
        this.statuses.push(data);
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: `The status has been added`,
          life: 3000,
        });
      } else if (existingStatus) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `Status with name "${newStatus.name}" already exists`,
          life: 3000,
        });
      } else {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `An error has occurred, the status could not be added.`,
          life: 3000,
        });
      }
    },

    async editStatus(id, updatedStatus) {
      const res = await updateStatus(
        `${import.meta.env.VITE_BASE_URL}${STATUS_ENDPOINT}`,
        id,
        updatedStatus
      );

      if (res.status >= 200 && res.status <= 299) {
        const data = await res.json();
        const index = this.statuses.findIndex((status) => status.id === id);
        if (index === -1) {
          return alert("Failed to update status, status not found");
        } else {
          this.statuses[index] = {
            ...data,
          };
        }
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: `The status has been updated`,
          life: 3000,
        });
      } else {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `An error has occurred, the status does not exist.`,
          life: 3000,
        });
      }
    },

    async transferStatus(currentId, newId, numberOfTasks) {
      const res = await deleteStatus(
        `${import.meta.env.VITE_BASE_URL}${STATUS_ENDPOINT}/${currentId}`,
        newId
      );

      const newStatus = this.statuses.find((status) => status.id === newId);
      if (res.status >= 200 && res.status <= 299) {
        const index = this.statuses.findIndex(
          (status) => status.id === currentId
        );
        if (index === -1) {
          return;
        } else {
          this.statuses.splice(index, 1);
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: `${numberOfTasks} ${
              numberOfTasks > 1 ? "tasks" : "task"
            } have been transferred and the status has been deleted`,
            life: 3000,
          });
        }
      } else if (res.status === 400) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `Cannot transfer to "${newStatus.name}" status
           since it will exceed the limit.  Please choose another status to transfer to.`,
          life: 3000,
        });
      } else {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `An error has occurred, the status does not exist.`,
          life: 3000,
        });
      }
    },

    async removeStatus(id) {
      const res = await deleteStatus(
        `${import.meta.env.VITE_BASE_URL}${STATUS_ENDPOINT}`,
        id
      );
      if (res.status >= 200 && res.status <= 299) {
        const index = this.statuses.findIndex((status) => status.id === id);
        if (index === -1) {
          return;
        } else {
          this.statuses.splice(index, 1);
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: `The status has been deleted`,
            life: 3000,
          });
        }
      } else {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `An error has occurred, the status does not exist.`,
          life: 3000,
        });
      }
    },
  },
});
