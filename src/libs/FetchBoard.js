import router from "@/router/page.js";
import { useUserStore } from "../stores/UserStore.js";
import { useRouter } from "vue-router";

const fetchAllBoards = async (url) => {
  const router = useRouter();
  const res = await fetch(`${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserStore().token}`,
    },
  });
  if (res.status === 401) {
    router.push("/login");
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
      Authorization: `Bearer ${useUserStore().token}`,
    },
  });
  if (res.status === 401) {
    router.push("/login");
  }
  const data = await res.json();
  return data;
};

const addBoard = async (url, newBoard) => {
  const router = useRouter();
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
  if (res.status === 401) {
    router.push("/login");
  }
  return res;
};

export { fetchAllBoards, fetchBoardById, addBoard };
