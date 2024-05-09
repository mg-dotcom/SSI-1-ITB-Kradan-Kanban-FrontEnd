import EditStatus from "@/components/statusModal/EditStatus.vue";
import { addTask } from "@/libs/FetchTask";
import { defineStore } from "pinia";

export const useStatusStore = defineStore("StatusStore", {
  state: () => ({
    statuses: [],
  }),
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
        statusColor: newStatus.color,
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
          statusColor: updatedStatus.color,
        };
      }
    },
  },
});
