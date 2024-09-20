import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/UserStore";

const fetchAllTasks = async (url) => {
  const router = useRouter();
  const res = await fetch(`${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },
  });
  if (!res.ok) {
    router.push({ name: "login" });
  }
  const data = await res.json();
  return data;
};

const fetchTaskDetails = async (url, id) => {
  const router = useRouter();
  const res = await fetch(`${url}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },
  });
  if (!res.ok) {
    router.push({ name: "login" });
  }
  const data = await res.json();
  return data;
};

const addTask = async (url, newTask) => {
  const router = useRouter();
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },
    body: JSON.stringify({
      title: newTask.title,
      description: newTask.description,
      assignees: newTask.assignees,
      status: newTask.statusId,
    }),
  });
  if (!res.ok) {
    router.push({ name: "login" });
  }
  return res;
};

const deleteTask = async (url, id) => {
  const router = useRouter();
  const res = await fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },
  });
  if (!res.ok) {
    router.push({ name: "login" });
  }
  return res;
};

const updatedTask = async (url, updatedTask, id) => {
  const router = useRouter();
  const res = await fetch(`${url}/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },
    body: JSON.stringify({
      title: updatedTask.title,
      description: updatedTask.description,
      assignees: updatedTask.assignees,
      status: updatedTask.statusId,
    }),
  });
  if (!res.ok) {
    router.push({ name: "login" });
  }
  return res;
};

const fetchFilterTasks = async (url, arr) => {
  const router = useRouter();
  const param = new URLSearchParams();
  param.append("filterStatuses", arr);
  const res = await fetch(`${url}?${param.toString()}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },
  });
  if (!res.ok) {
    router.push({ name: "login" });
  }
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
