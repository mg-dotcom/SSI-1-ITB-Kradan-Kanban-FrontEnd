import { defineStore } from "pinia";
import {
  fetchAllStatus,
  fetchStatusById,
  deleteStatus,
  addStatus,
  updateStatus,
} from "../libs/FetchStatus.js";
import { useToast } from "primevue/usetoast";

export const useStatusStore = defineStore("StatusStore", {
  state: () => ({
    toast: useToast(),
    statuses: [],
    STATUS_ENDPOINT: "v2/statuses",

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
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}`
      );
      if (data.status < 200 && data.status > 299) {
        alert("Failed to fetch statuses");
      } else {
        this.statuses = data;
      }
    },

    async loadStatusDetail(id) {
      const data = await fetchStatusById(
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}`,
        id
      );
      if (data.status < 200 && data.status > 299) {
        alert("Failed to fetch statuses");
      } else {

        return this.statusDetails;
      }
    },

    async loadStatusDetail(id) {
      const data = await fetchStatusById(
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}`,
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
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}`,
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
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}`,
        id,
        updatedStatus
      );

      if (res.status === 200) {
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
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}/${currentId}`,
        newId
      );
      const newStatus = this.statuses.find((status) => status.id === newId);
      if (res.status === 200) {
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
      } else {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `An error has occurred, the status does not exist`,
          life: 3000,
        });
        router.push({ name: "task" });
      }
    },

    async removeStatus(id) {
      const res = await deleteStatus(
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}`,
        id
      );
      if (res.status === 200) {
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
