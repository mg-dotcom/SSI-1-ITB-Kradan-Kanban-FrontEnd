import { useUserToken } from "@/stores/UserStore";

const fetchAllStatus = async (url) => {
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

const fetchStatusById = async (url, id) => {
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

const deleteStatus = async (url, id) => {

  const res = await fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
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
<<<<<<< HEAD

=======
  if (res.status === 401) {
    router.push("/login");
  }
>>>>>>> parent of b4a34cf (401 fixing)
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
<<<<<<< HEAD
=======
  if (res.status === 401) {
    router.push("/login");
  }
>>>>>>> parent of b4a34cf (401 fixing)

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
<<<<<<< HEAD
=======
  if (res.status === 401) {
    router.push("/login");
  }
>>>>>>> parent of b4a34cf (401 fixing)
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
