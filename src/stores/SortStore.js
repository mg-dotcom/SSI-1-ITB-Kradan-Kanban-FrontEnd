import { defineStore } from 'pinia'

export const useSortStore = defineStore('SortStore', {
  state: () => ({
    sortType: 'default'
  }),
  getters: {
    getSortType() {
      return this.sortType
    }
  },
  actions: {
    setSortType(type) {
        this.sortType = type
    }
  }
})
