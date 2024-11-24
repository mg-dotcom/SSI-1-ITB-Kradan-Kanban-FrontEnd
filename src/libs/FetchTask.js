import { useUserToken } from "@/stores/UserStore";
import { handleResponseStatus } from "./libsUtil.js";

const fetchAllTasks = async (url) => {
  const res = await fetch(`${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  return res;
};

const fetchTaskDetails = async (url, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  return res;
};

const addTask = async (url, newTask) => {
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
    body: JSON.stringify(newTask),
  });
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
  return res;
};

const updatedTaskWithFiles = async (url, updatedTaskData, updatedTaskFiles) => {
  const formData = new FormData();

  formData.append("taskDto", JSON.stringify(updatedTaskData));

  updatedTaskFiles.forEach((file) => {
    formData.append("files", file.fileData);
  });

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${useUserToken().value}`,
    },
    body: formData,
  });

  return res;
};

const fetchFilePreview = async (url) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  return res;
};

const deleteTaskFile = async (url) => {
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  return res;
};

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
  handleResponseStatus(res);
  const data = await res.json();
  return data;
};

export {
  fetchAllTasks,
  fetchTaskDetails,
  addTask,
  deleteTask,
  fetchFilterTasks,
  updatedTaskWithFiles,
  deleteTaskFile,
  fetchFilePreview,
};
