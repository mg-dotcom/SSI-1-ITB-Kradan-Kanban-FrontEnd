import { handleAuthenticationClearAndRedirect } from "@/libs/libsUtil.js";
import { useUserToken } from "../stores/UserStore.js";
import { useRouter } from "vue-router";

const fetchAllBoards = async (url) => {
  const router = useRouter();
  const res = await fetch(`${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  if (res.status === 401) {
    handleAuthenticationClearAndRedirect();
  }
  const data = await res.json();
  return data;
};

const fetchBoardById = async (url, id) => {
  const router = useRouter();
  const res = await fetch(`${url}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserToken().value}`,
    },
  });
  if (res.status === 401) {
    handleAuthenticationClearAndRedirect();
  }
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
  if (res.status === 401) {
    handleAuthenticationClearAndRedirect();
  }
  return res;
};

export { fetchAllBoards, fetchBoardById, addBoard };
