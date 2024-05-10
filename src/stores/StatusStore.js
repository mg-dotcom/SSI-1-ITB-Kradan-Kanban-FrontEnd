import { defineStore } from 'pinia'

export const useStatusStore = defineStore('StatusStore', {
  state: () => ({
    statuses: []
  }),
  getters: {
    getStatuses(state) {
      return state.statuses
    },
    getStatusById: (state) => (id) => {
      return state.statuses.find((status) => status.id === id)
    }
  },
  actions: {
    addAllStatuses(newStatuses) {
      newStatuses.forEach((status) => {
        this.addStatus(status)
      })
    },

    addStatus(newStatus) {
      this.statuses.push({
        id: newStatus.id,
        name: newStatus.name,
        description: newStatus.description,
        statusColor: newStatus.color
      })
    },

    editStatus(id, updatedStatus) {
      const index = this.statuses.findIndex((status) => status.id === id)
      if (index === -1) {
        return
      } else {
        this.statuses[index] = {
          id: id,
          name: updatedStatus.name,
          description: updatedStatus.description,
          statusColor: updatedStatus.color
        }
      }
    },

    removeStatus(id) {
      const index = this.statuses.findIndex((status) => status.id === id)
      if (index === -1) {
        return
      } else {
        this.statuses.splice(index, 1)
      }
    }
  }
})
