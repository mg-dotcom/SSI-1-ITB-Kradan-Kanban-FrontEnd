import { defineStore } from "pinia";
import {
  fetchAllBoards,
  fetchBoardById,
  addBoard,
} from "../libs/FetchBoard.js";

const BOARD_ENDPOINT = import.meta.env.VITE_BOARD_ENDPOINT;

export const useBoardStore = defineStore("BoardStore", {
  state: () => ({
    board: [],
  }),
  getters: {
    getBoards() {
      return this.board;
    },
    getBoardById: (state) => (id) => {
      return state.board.find((board) => board.id === id);
    },
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
      const data = await addBoard(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}`,
        newBoard
      );
      if (data.status < 200 && data.status > 299) {
        alert("Failed to add board");
      } else {
        this.board.push(newBoard);
      }
    },
  },
});
