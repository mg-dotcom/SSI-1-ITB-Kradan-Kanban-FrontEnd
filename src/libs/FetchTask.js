import { useUserToken } from "@/stores/UserStore";

const fetchAllTasks = async (url) => {
  const res = await fetch(`${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
<<<<<<< HEAD
  return res;
=======
  if (res.status === 401) {
    router.push("/login");
  }
  const data = await res.json();
  return data;
>>>>>>> parent of b4a34cf (401 fixing)
};

const fetchTaskDetails = async (url, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
<<<<<<< HEAD
  return res;
=======
  if (res.status === 401) {
    router.push("/login");
  }
  const data = await res.json();
  return data;
>>>>>>> parent of b4a34cf (401 fixing)
};

const addTask = async (url, newTask) => {
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
    body: JSON.stringify({
      title: newTask.title,
      description: newTask.description,
      assignees: newTask.assignees,
      status: newTask.statusId,
    }),
  });
<<<<<<< HEAD
=======
  if (res.status === 401) {
    router.push("/login");
  }
>>>>>>> parent of b4a34cf (401 fixing)
  return res;
};

const deleteTask = async (url, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
<<<<<<< HEAD
=======
  if (res.status === 401) {
    router.push("/login");
  }
>>>>>>> parent of b4a34cf (401 fixing)
  return res;
};

const updatedTask = async (url, updatedTask, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
    body: JSON.stringify({
      title: updatedTask.title,
      description: updatedTask.description,
      assignees: updatedTask.assignees,
      status: updatedTask.statusId,
    }),
  });
<<<<<<< HEAD
=======
  if (res.status === 401) {
    router.push("/login");
  }
>>>>>>> parent of b4a34cf (401 fixing)
  return res;
};

//FIXME: This function is cant fixed yet
const fetchFilterTasks = async (url, arr) => {
  const param = new URLSearchParams();
  param.append("filterStatuses", arr);
  const res = await fetch(`${url}?${param.toString()}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
<<<<<<< HEAD

=======
  if (res.status === 401) {
    router.push("/login");
  }
>>>>>>> parent of b4a34cf (401 fixing)
  const data = await res.json();
  return data;
};

export {
  fetchAllTasks,
  fetchTaskDetails,
  addTask,
  deleteTask,
  updatedTask,
  fetchFilterTasks,
};
