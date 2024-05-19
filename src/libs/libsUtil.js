import { ref } from 'vue'
const localTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)

const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleString('en-GB', { timeZone: localTimeZone.value })
}

const sortTasks = (tasks, sortType) => {
  if (sortType === 'ascending') {
    return tasks.sort((a, b) => a.status.name.localeCompare(b.status.name))
  } else if (sortType === 'descending') {
    return tasks.sort((a, b) => b.status.name.localeCompare(a.status.name))
  }
  return tasks
}

export { formatDate, localTimeZone, sortTasks }
