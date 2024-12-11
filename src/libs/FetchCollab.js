import { useUserToken, useUserStore } from "../stores/UserStore.js";

const fetchCollab = async (url) => {
  const res = await fetch(`${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  return res;
};
const addCollab = async (url, collaborator) => {
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
      AccessTokenMS: `${useUserStore().accessTokenMS}`,
    },

    body: JSON.stringify({
      email: collaborator.email,
      accessRight: collaborator.accessRight,
      url: collaborator.url,
    }),
  });

  return res;
};

const deleteCollab = async (url) => {
  const res = await fetch(`${url}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  return res;
};

const updateAccessRight = async (url, accessRight) => {
  const res = await fetch(`${url}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },

    body: JSON.stringify({
      accessRight: accessRight,
    }),
  });
  return res;
};

const verifyInvitation = async (url, collabStatus) => {
  const res = await fetch(`${url}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
    body: JSON.stringify({
      collabStatus: collabStatus,
    }),
  });
  return res;
};

const getInvitation = async (url) => {
  const res = await fetch(`${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  return res;
};

export {
  fetchCollab,
  addCollab,
  deleteCollab,
  updateAccessRight,
  verifyInvitation,
  getInvitation,
};
