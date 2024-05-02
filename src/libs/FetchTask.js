import { useRouter } from 'vue-router'

async function fetchAllTasks(url) {
  try {
    const data = await fetch(url)
    const res = await data.json()
    console.log(res)
    return res
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

async function fetchTaskDetails(url, id) {
  try {
    const router = useRouter()
    const data = await fetch(`${url}/${id}`)
    if (!data.ok) {
      alert('The requested task does not exist')
      router.push('/')
      return
    }
    const res = await data.json()
    return res
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

const addTask = async (url, newTask) => {
  try {
    const data = await fetch(url)
    const res = await data.json()
    res.push(newTask)
    fetch("http://localhost:8080/v1/tasks",{
      method:"POST",
      body:JSON.stringify({
        newTask
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    return res
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

export { fetchAllTasks, fetchTaskDetails, addTask }
