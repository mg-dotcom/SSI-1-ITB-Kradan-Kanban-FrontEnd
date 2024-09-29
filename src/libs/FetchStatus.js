import { useUserToken } from "@/stores/UserStore";
import { handleAuthenticationClearAndRedirect } from "@/libs/libsUtil";
import router from "@/router/page";

const fetchAllStatus = async (url) => {
  const res = await fetch(`${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  if (res.status === 401 || res.status === 404) {
    handleAuthenticationClearAndRedirect();
  }
  const data = await res.json();

  return data;
};

const fetchStatusById = async (url, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  if (res.status === 401 || res.status === 404) {
    handleAuthenticationClearAndRedirect();
  }
  const data = await res.json();
  return data;
};

const deleteStatus = async (url, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  if (res.status === 401 || res.status === 404) {
    handleAuthenticationClearAndRedirect();
  }
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
  if (res.status === 401 || res.status === 404) {
    handleAuthenticationClearAndRedirect();
  }
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
  if (res.status === 401 || res.status === 404) {
    handleAuthenticationClearAndRedirect();
  }

  return res;
};

const updateStatusSetting = async (url, updatedLimit) => {
  const res = await fetch(`${url}/1/maximum-task`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
    body: JSON.stringify({
      limitMaximumTask: updatedLimit,
    }),
  });
  if (res.status === 401 || res.status === 404) {
    handleAuthenticationClearAndRedirect();
  }
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
