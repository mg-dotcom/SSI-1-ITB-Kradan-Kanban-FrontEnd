import { defineStore } from "pinia";
import {
  fetchAllBoards,
  fetchBoardById,
  addBoard,
} from "../libs/FetchBoard.js";
import { useToast } from "primevue/usetoast";

const BOARD_ENDPOINT = import.meta.env.VITE_BOARD_ENDPOINT;

export const useBoardStore = defineStore("BoardStore", {
  state: () => ({
    board: [],
    toast: useToast(),
    selectedBoard: {},
  }),
  getters: {
    getBoards: (state) => state.board,
    getBoardById: (state) => (id) => {
      return state.board.find((board) => board.id === id);
    },
    getSelectedBoard: (state) => state.selectedBoard,
  },
  actions: {
    async loadBoards() {
      const data = await fetchAllBoards(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}`
      );
      if (data.status < 200 && data.status > 299) {
        alert("Failed to fetch boards");
      } else {
        this.board = data;
      }
    },
    async loadBoardById(id) {
      const data = await fetchBoardById(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}`,
        id
      );
      if (data.status < 200 && data.status > 299) {
        alert("Failed to fetch board");
      } else {
        this.board = data;
      }
    },
    async addBoard(newBoard) {
      const res = await addBoard(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}`,
        newBoard
      );
      if (res.status < 200 && res.status > 299 && res.status !== 401) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "There is a problem. Please try again later",
          life: 3000,
        });
      } else {
        this.board.push(newBoard);
      }

      return res;
    },
    findByOid(oid) {
      return this.board.filter((board) => board.userOid === oid);
    },
    setCurrentBoardId(id) {
      console.log(id);
      this.selectedBoard = this.getBoardById(id);
    },
  },
});
