import { useUserToken } from "@/stores/UserStore";
import { handleResponseStatus } from "@/libs/libsUtil";

const fetchAllStatus = async (url) => {
  const res = await fetch(`${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  return res;
};

const fetchStatusById = async (url, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  return res;
};

const deleteStatus = async (url, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  handleResponseStatus(res);
  return res;
};

const addStatus = async (url, newStatus) => {
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
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
      Authorization: `Bearer ${useUserToken().value}`,
    },
    body: JSON.stringify({
      name: updatedStatus.name,
      description: updatedStatus.description,
      statusColor: updatedStatus.statusColor,
    }),
  });
  return res;
};

const updateStatusSetting = async (url, updatedLimit) => {
  console.log("updatedLimit", updatedLimit);

  const res = await fetch(`${url}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
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
