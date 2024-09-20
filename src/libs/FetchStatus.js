import { useUserStore } from "@/stores/UserStore";
import { useRouter } from "vue-router";

const fetchAllStatus = async (url) => {
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

const fetchStatusById = async (url, id) => {
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

const deleteStatus = async (url, id) => {
  const router = useRouter();
  const res = await fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },
  });
  if (!res.ok) {
    router.push({ name: "login" });
  }
  return res;
};

const addStatus = async (url, newStatus) => {
  const router = useRouter();
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
  if (!res.ok) {
    router.push({ name: "login" });
  }
  return res;
};

const updateStatus = async (url, id, updatedStatus) => {
  const router = useRouter();
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
  if (!res.ok) {
    router.push({ name: "login" });
  }

  return res;
};

const updateStatusSetting = async (url, updatedLimit) => {
  const router = useRouter();
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
  if (!res.ok) {
    router.push({ name: "login" });
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
