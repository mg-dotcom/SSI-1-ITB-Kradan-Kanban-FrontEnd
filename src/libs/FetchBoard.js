import { useUserToken } from "../stores/UserStore.js";
import { handleResponseStatus } from "./libsUtil.js";
import { handleAuthenticationClearAndRedirect } from "./libsUtil.js";
import { checkTokenExpiration } from "@/stores/UserStore.js";

const fetchAllBoards = async (url) => {
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

const fetchBoardById = async (url, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  await checkTokenExpiration(id);
  handleResponseStatus(res);
  const data = await res.json();
  return data;
};

const addBoard = async (url, newBoard) => {
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },

    body: JSON.stringify({
      name: newBoard.name,
      emoji: newBoard.emoji,
      color: newBoard.color,
    }),
  });
  handleResponseStatus(res);
  return res;
};
const patchBoardVisibility = async (url, visibilityMode) => {
  const res = await fetch(`${url}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
    body: JSON.stringify({
      visibility: visibilityMode,
    }),
  });

  if (res.status === 401 || res.status === 404) {
    handleAuthenticationClearAndRedirect();
  }

  if (res.status === 403) {
    alert("you do not have permission");
  }

  return res;
};

export { fetchAllBoards, fetchBoardById, addBoard, patchBoardVisibility };
