import { useUserStore } from "@/stores/UserStore";
const fetchAllStatus = async (url) => {
  const res = await fetch(`${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },
  });
  const data = await res.json();
  return data;
};

const fetchStatusById = async (url, id) => {
  const data = await fetch(`${url}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },
  });
  const res = await data.json();
  return res;
};

const deleteStatus = async (url, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },
  });
  return res;
};

const addStatus = async (url, newStatus) => {
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },
    body: JSON.stringify({
      name: newStatus.name,
      description: newStatus.description,
      statusColor: newStatus.statusColor,
    }),
  });
  return res;
};

const updateStatus = async (url, id, updatedStatus) => {
  const res = await fetch(`${url}/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },
    body: JSON.stringify({
      name: updatedStatus.name,
      description: updatedStatus.description,
      statusColor: updatedStatus.statusColor,
    }),
  });
  console.log(res);

  return res;
};

const updateStatusSetting = async (url, updatedLimit) => {
  const res = await fetch(`${url}/1/maximum-task`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },
    body: JSON.stringify({
      limitMaximumTask: updatedLimit,
    }),
  });
  return res;
};

export {
  fetchAllStatus,
  fetchStatusById,
  addStatus,
  updateStatus,
  deleteStatus,
  updateStatusSetting,
};
