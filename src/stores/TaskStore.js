import { defineStore } from "pinia";

export const useTaskStore = defineStore("TaskStore", {
  state: () => ({
    tasks: [],
  }),
  getters: {
    getTasks() {
      return this.tasks;
    },
    getTasksById: (state) => (id) => {
      return state.tasks.find((task) => task.id === id);
    },
    getNumberOfTasks(statusName) {
      return state.tasks.forEach((task) => task.status===statusName).length;
  },
  actions: {
    addAllTasks(newTasks) {
      newTasks.forEach((task) => {
        this.addTask(task);
      });
    },

    addTask(newTask) {
      this.tasks.push({
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        assignees: newTask.assignees,
        status: newTask.statusName,
        createdOn: newTask.createdOn,
        updatedOn: newTask.updatedOn,
      });
    },

    removeTask(index) {
      this.tasks.splice(index, 1);
    },

    editTask(id, updatedTask) {
      const index = this.tasks.findIndex((task) => task.id === id);
      if (index === -1) {
        return;
      } else {
        this.tasks[index] = {
          id: id,
          title: updatedTask.title,
          description: updatedTask.description,
          assignees: updatedTask.assignees,
          status: updatedTask.statusName,
          createdOn: updatedTask.createdOn,
          updatedOn: updatedTask.updatedOn,
        };
      }
    },

    getTasksByStatus(status) {
      return this.tasks.filter((task) => task.status === status);
    },

    transferTasksStatus(currentStatus, newStatus) {
      console.log("currentStatus", currentStatus);
      console.log("newStatus", newStatus);
      const tasksToUpdate = this.tasks.filter(
        (task) => task.status === currentStatus
      );
      tasksToUpdate.forEach((task) => {
        task.status = newStatus;
      });
    },
  },}
});
