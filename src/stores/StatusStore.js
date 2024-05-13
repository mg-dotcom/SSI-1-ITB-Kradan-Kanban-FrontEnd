import { defineStore } from 'pinia'
import {
  fetchAllStatus,
  fetchStatusById,
  deleteStatus,
  addStatus,
  updateStatus
} from '../libs/FetchStatus.js'

export const useStatusStore = defineStore('StatusStore', {
  state: () => ({
    statuses: [],
    STATUS_ENDPOINT: 'v2/statuses'
  }),
  getters: {
    getStatuses(state) {
      return state.statuses
    },
    getStatusById: (state) => (id) => {
      return state.statuses.find((status) => status.id === id)
    },
    getStatusColor: (state) => (name) => {
      const status = state.statuses.find((status) => status.name === name)
      return status ? status.color : ''
    }
  },
  actions: {
    async loadStatuses() {
      const data = await fetchAllStatus(
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}`
      )
      if (data.status < 200 && data.status > 299) {
        alert('Failed to fetch statuses')
      } else {
        this.statuses = data
        return this.statuses
        //toast success
      }
    },

    async addStatus(newStatus) {
      const res = await addStatus(
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}`,
        newStatus
      )
      console.log(res)
      if (res.status === 201) {
        this.statuses.push(res)
        //toast success
      } else {
        //toast error
      }
    },

    async editStatus(id, updatedStatus) {
      const res = await updateStatus(
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}`,
        id,
        updatedStatus
      )
      if (res.status === 200) {
        const index = this.statuses.findIndex((status) => status.id === id)
        if (index === -1) {
          return
        } else {
          this.statuses[index] = {
            ...res
          }
        }
      } else {
        //toast error
      }
    },

    async removeStatus(id) {
      const res = await deleteStatus(
        `${import.meta.env.VITE_BASE_URL}${this.STATUS_ENDPOINT}`,
        id
      )
      if (res.status === 204) {
        const index = this.statuses.findIndex((status) => status.id === id)
        if (index === -1) {
          return
        } else {
          this.statuses.splice(index, 1)
        }
        //toast success
      } else {
        //toast error
      }
    }
  }
})
