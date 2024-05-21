import { ref } from 'vue'
const localTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)

const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleString('en-GB', { timeZone: localTimeZone.value })
}

const sortTasks = (tasks, sortType) => {
  if (sortType === 'ascending') {
    tasks.sort((a, b) => a.status.localeCompare(b.status))
  } else if (sortType === 'descending') {
    tasks.sort((a, b) => b.status.localeCompare(a.status))
  }
}

export { formatDate, localTimeZone, sortTasks }
