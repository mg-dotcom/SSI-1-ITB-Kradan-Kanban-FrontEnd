import { useRouter } from "vue-router";

async function fetchAllTasks(url) {
  try {
    const data = await fetch(`${url}`);
    const res = await data.json();
    return res;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function fetchTaskDetails(url, id) {
  try {
    const router = useRouter();
    const data = await fetch(`${url}/${id}`);
    if (!data.ok) {
      alert("The requested task does not exist");
      router.push("/");
      return;
    }
    const res = await data.json();
    return res;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function addTask(url, newTask) {
  try {
    const res = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title: newTask.title,
        description: newTask.description,
        assignees: newTask.assignees,
        statusName: newTask.status,
      }),
    });

    return res;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

const deleteTask = async (url, id) => {
  try {
    const res = await fetch(`${url}/${id}`, {
      method: "DELETE",
    });
    return res.status;
  } catch (error) {
    console.log(`error: ${error}`);
  }
};

async function updatedTask(url, updatedTask, id) {
  try {
    const res = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title: updatedTask.title,
        description: updatedTask.description,
        assignees: updatedTask.assignees,
        statusName: updatedTask.status,
      }),
    });
    return res;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

export { fetchAllTasks, fetchTaskDetails, addTask, deleteTask, updatedTask };
