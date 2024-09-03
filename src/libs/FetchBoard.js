import { useUserStore } from "../stores/UserStore.js";

const fetchAllBoards = async (url) => {
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

const fetchBoardById = async (url, id) => {
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

const addBoard = async (url, newBoard) => {
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },

    body: JSON.stringify({
      name: newBoard.name,
      emoji: newBoard.emoji,
      color: newBoard.color,
    }),
  });
  return res;
};

export { fetchAllBoards, fetchBoardById, addBoard };
