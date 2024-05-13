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
      return status ? status.color : "";
    },
  },
  actions: {
    async loadStatuses() {
      const data = await fetchAllStatus(
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}`
      );
      // console.log(data);
      if (data.status < 200 && data.status > 299) {
        alert("Failed to fetch statuses");
      } else {
        this.statuses = data;
        console.log(this.getStatuses);
      }
    },

    async addStatus(newStatus) {
      console.log(newStatus);
      const res = await addStatus(
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}`,
        newStatus
      );

      const existingStatus = this.statuses.find(
        (status) => status.name === newStatus.name
      );

      if (res.status === 201) {
        const data = await res.json();
        this.statuses.push(res);
        //toast success
      } else if (existingStatus) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `Status with name "${newStatus.name}" already exists`,
          life: 3000,
        });
      } else {
        console.log("error");
        //toast error
      }
    },

    async editStatus(id, updatedStatus) {
      const res = await updateStatus(
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}`,
        id,
        updatedStatus
      );
      if (res.status === 200) {
        const index = this.statuses.findIndex((status) => status.id === id);
        if (index === -1) {
          return;
        } else {
          this.statuses[index] = {
            ...res,
          };
        }
      } else {
        //toast error
      }
    },

    async removeStatus(id) {
      const res = await deleteStatus(
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}`,
        id
      );
      if (res.status === 204) {
        const index = this.statuses.findIndex((status) => status.id === id);
        if (index === -1) {
          return;
        } else {
          this.statuses.splice(index, 1);
        }
        //toast success
      } else {
        //toast error
      }
    },
  },
});
