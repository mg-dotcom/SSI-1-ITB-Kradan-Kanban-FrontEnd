import { defineStore } from "pinia";

export const useStatusStore = defineStore("StatusStore", {
  state: () => ({
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
      return status.color;
    },
  },
  actions: {
    addAllStatuses(newStatuses) {
      newStatuses.forEach((status) => {
        this.addStatus(status);
      });
    },

    addStatus(newStatus) {
      this.statuses.push({
        id: newStatus.id,
        name: newStatus.name,
        description: newStatus.description,
        color: newStatus.statusColor,
        createdOn: newStatus.createdOn,
        updatedOn: newStatus.updatedOn,
      });
    },

    editStatus(id, updatedStatus) {
      const index = this.statuses.findIndex((status) => status.id === id);
      if (index === -1) {
        return;
      } else {
        this.statuses[index] = {
          id: id,
          name: updatedStatus.name,
          description: updatedStatus.description,
          color: updatedStatus.statusColor,
        };
      }
    },
  },
});
