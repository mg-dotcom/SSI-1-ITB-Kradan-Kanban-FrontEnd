import { useRouter } from "vue-router";
const fetchAllStatus = async (url) => {
  const res = await fetch(`${url}`);
  const data = await res.json();
  return data;
};

const fetchStatusById = async (url, id) => {
  const data = await fetch(`${url}/${id}`);
  const res = await data.json();
  return res;
};

const deleteStatus = async (url, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: "DELETE",
  });
  console.log(res);
  return res;
};

const addStatus = async (url, newStatus) => {
  console.log(newStatus);
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
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
    },
    body: JSON.stringify({
      name: updatedStatus.name,
      description: updatedStatus.description,
      statusColor: updatedStatus.statusColor,
    }),
  });
  return res;
};

const fetchStatusSetting = async (url,id) => {
  const res = await fetch(`${url}/${id}
  `);
  console.log(res);
  const data = await res.json();
  console.log(data);
  return data;
}

const patchStatus = async (url, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: "PATCH",
  });
  return res;
};


export {
  fetchAllStatus,
  fetchStatusById,
  addStatus,
  updateStatus,
  deleteStatus,
  fetchStatusSetting,
  patchStatus
};
