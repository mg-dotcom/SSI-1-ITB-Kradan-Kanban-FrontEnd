import { defineStore } from 'pinia'
import {
  fetchAllTasks,
  addTask,
  deleteTask,
  fetchTaskDetails,
  updatedTask,
  fetchFilterTasks
} from '../libs/FetchTask.js'
import { sortTasks } from '../libs/libsUtil.js'
import { useToast } from 'primevue/usetoast'
import { useStatusStore } from './StatusStore.js'
const TASK_ENDPOINT = import.meta.env.VITE_TASK_ENDPOINT

export const useTaskStore = defineStore('TaskStore', {
  state: () => ({
    toast: useToast(),
    tasks: [],
    sortType: '',
    filterStatuses: []
  }),
  getters: {
    getTasks() {
      return this.tasks
    },
    getTaskById: (state) => (id) => {
      return state.tasks.find((task) => task.id === id)
    },
    getTasksByStatus: (state) => (status) => {
      return state.tasks.filter((task) => task.status === status)
    }
  },
  actions: {
    async loadTasks() {
      const data = await fetchAllTasks(
        `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`
      )
      if (data.status < 200 && data.status > 299) {
        alert('Failed to fetch tasks')
      } else {
        this.tasks = data
      }
    },

    async loadTaskDetails(id) {
      const data = await fetchTaskDetails(
        `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`,
        id
      )
      if (data.status < 200 && data.status > 299) {
        //fetch data failed
        alert('Failed to fetch task details')
      } else {
        return data
      }
    },

    async addTask(newTask) {
      const res = await addTask(
        `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`,
        newTask
      )
      const addedData = await res.json()
      const statusStore = useStatusStore()
      const status = statusStore.getStatusById(newTask.statusId)
      if (res.status >= 200 && res.status <= 299) {
        this.toast.add({
          severity: 'success',
          summary: 'Success',
          detail: `The task has been successfully added`,
          life: 3000
        })
      } else if (res.status === 400) {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `The status ${status.name} will have too many tasks. Please make progress and update status of existing tasks .`,
          life: 3000
        })
      } else {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error has occurred, the task could not be added.`,
          life: 3000
        })
      }
      return res
    },

    async deleteTask(id) {
      const res = await deleteTask(
        `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`,
        id
      )
      const taskIndex = this.tasks.findIndex((task) => task.id === id)
      if (res.status >= 200 && res.status <= 299) {
        this.tasks.splice(taskIndex, 1)
        this.toast.add({
          severity: 'success',
          summary: 'Success',
          detail: `The task has been deleted`,
          life: 3000
        })
      } else {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error has occurred, the task does not exist.`,
          life: 3000
        })
      }
    },

    async editTask(id, updatedTaskInput, statusDetails) {
      const res = await updatedTask(
        `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`,
        updatedTaskInput,
        id
      )
      const taskIndex = this.tasks.findIndex((task) => task.id === id)
      if (res.status >= 200 && res.status <= 299) {
        const updateData = await res.json()
        this.tasks[taskIndex] = {
          ...updateData,
          status: statusDetails.name
        }

        this.toast.add({
          severity: 'success',
          summary: 'Success',
          detail: `The task has been updated`,
          life: 3000
        })
      } else if (res.status === 400) {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `the status ${statusDetails.name} will have too many tasks. Please make progress and update status of existing tasks .`,
          life: 3000
        })
      } else {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error has occurred, the task does not exist.`,
          life: 3000
        })
      }
      return res
    },

    transferTasksStatus(currentStatus, newStatus) {
      console.log(currentStatus);
      console.log(this.tasks);
      const tasksToUpdate = this.tasks.filter(
        (task) => task.status === currentStatus
      )
      tasksToUpdate.forEach((task) => {
        task.status = newStatus
      })
    },

    async loadSortTasks(sortType) {
      const data = await fetchAllTasks(
        `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`
      )
      if (data.status < 200 && data.status > 299) {
        //fetch data failed
        alert('Failed to fetch tasks')
      } else {
        this.tasks = data
        return sortTasks(this.tasks, sortType)
      }
    },
    async loadFilterTasks(arrayStatusesId, sortType) {
      if (arrayStatusesId.length === 0) {
        await this.loadTasks()
      } else {
        const data = await fetchFilterTasks(
          `${import.meta.env.VITE_BASE_URL}${TASK_ENDPOINT}`,
          arrayStatusesId
        )
        this.tasks = data
      }
      sortTasks(this.tasks, sortType)
    }
  }
})
