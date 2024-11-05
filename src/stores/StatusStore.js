import { defineStore } from "pinia";
import {
  fetchAllStatus,
  fetchStatusById,
  deleteStatus,
  addStatus,
  updateStatus,
  updateStatusSetting,
} from "../libs/FetchStatus.js";
import { useToast } from "primevue/usetoast";
import { useTaskStore } from "./TaskStore.js";
import { useBoardStore } from "./BoardStore.js";
import { checkTokenExpiration } from "./UserStore.js";
import { handleResponseStatus } from "@/libs/libsUtil.js";
const STATUS_ENDPOINT = import.meta.env.VITE_STATUS_ENDPOINT;
const BOARD_ENDPOINT = import.meta.env.VITE_BOARD_ENDPOINT;

export const useStatusStore = defineStore("StatusStore", {
  state: () => ({
    toast: useToast(),
    boardStore: useBoardStore(),
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
    async loadStatuses(boardId) {
      await checkTokenExpiration(boardId);
      const res = await fetchAllStatus(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/statuses`
      );
      handleResponseStatus(res);
      const data = await res.json();
      this.statuses = data;
    },

    // FIXME: This function is not working as expected
    async editStatusSetting(updatedLimit, maximumTask) {
      await checkTokenExpiration();
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

    async loadStatusDetail(id, boardId) {
      await checkTokenExpiration(boardId);

      const res = await fetchStatusById(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/statuses`,
        id
      );
      handleResponseStatus(res);
      const data = await res.json();
      return data;
    },

    async addStatus(newStatus) {
      const boardId = this.boardStore.getCurrentBoard.id;
      await checkTokenExpiration(boardId);

      const res = await addStatus(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/statuses`,
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
        handleResponseStatus(res);
      }
    },

    async editStatus(id, updatedStatus) {
      const boardId = this.boardStore.getCurrentBoard.id;
      await checkTokenExpiration(boardId);

      const res = await updateStatus(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/statuses`,
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
      } else if (res.status === 404) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `An error has occurred, the status does not exist.`,
          life: 3000,
        });
      } else {
        handleResponseStatus(res);
      }
    },

    async transferStatus(currentId, newId, numberOfTasks) {
      const boardId = this.boardStore.getCurrentBoard.id;
      await checkTokenExpiration(boardId);

      const taskStore = useTaskStore();
      const res = await deleteStatus(
        `${
          import.meta.env.VITE_BASE_URL
        }${BOARD_ENDPOINT}/${boardId}/statuses/${currentId}`,
        newId
      );
      const newStatus = this.statuses.find((status) => status.id === newId);
      const currentStatus = this.statuses.find(
        (status) => status.id === currentId
      );
      if (res.status >= 200 && res.status <= 299) {
        const index = this.statuses.findIndex(
          (status) => status.id === currentId
        );
        if (index === -1) {
          return;
        } else {
          this.statuses.splice(index, 1);
          taskStore.transferTasksStatus(currentStatus, newStatus);
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
      } else if (res.status === 404) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `An error has occurred, the status does not exist.`,
          life: 3000,
        });
      } else {
        handleResponseStatus(res);
      }
    },

    async removeStatus(id) {
      const boardId = this.boardStore.getCurrentBoard.id;
      await checkTokenExpiration(boardId);

      const res = await deleteStatus(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/statuses`,
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
      } else if (res.status === 404) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: `An error has occurred, the status does not exist.`,
          life: 3000,
        });
      } else {
        handleResponseStatus(res);
      }
    },
  },
});
