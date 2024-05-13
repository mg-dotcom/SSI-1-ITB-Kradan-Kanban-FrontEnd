import { useRouter } from "vue-router";

const fetchAllTasks = async (url) => {
  const res = await fetch(`${url}`);
  const data = await res.json();
  return data;
};

const fetchTaskDetails = async (url, id) => {
  const router = useRouter();
  const data = await fetch(`${url}/${id}`);
  if (!data.ok) {
    alert("The requested task does not exist");
    router.push("/");
    return;
  }
  const res = await data.json();
  return res;
};

const addTask = async (url, newTask) => {
  console.log(newTask);
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title: newTask.title,
      description: newTask.description,
      assignees: newTask.assignees,
      status: newTask.statusId,
    }),
  });
  return res;
};

const deleteTask = async (url, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: "DELETE",
  });
  return res;
};

const updatedTask = async (url, updatedTask, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title: updatedTask.title,
      description: updatedTask.description,
      assignees: updatedTask.assignees,
      status: updatedTask.statusId,
    }),
  });
  return res;
};

export { fetchAllTasks, fetchTaskDetails, addTask, deleteTask, updatedTask };
