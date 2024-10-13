import { useUserToken } from "../stores/UserStore.js";
import { handleResponseStatus } from "./libsUtil.js";
import { handleAuthenticationClearAndRedirect } from "./libsUtil.js";

const fetchCollab = async (url) => {
  const res = await fetch(`${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  handleResponseStatus(res);
  const data = await res.json();
  return data;
};

const addCollab = async (url, collaborator) => {
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },

    body: JSON.stringify({
      email: collaborator.email,
      accessRight: collaborator.accessRight,
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

const updateAccessRight = async (url, collaborator) => {
  const res = await fetch(`${url}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },

    body: JSON.stringify({
      access_right: collaborator.access_right,
    }),
  });
  return res;
};

export { fetchCollab, addCollab, deleteCollab, updateAccessRight };
