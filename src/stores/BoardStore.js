import { defineStore } from "pinia";
import {
  fetchAllBoards,
  fetchBoardById,
  addBoard,
  patchBoardVisibility,
} from "../libs/FetchBoard.js";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "./UserStore.js";
import { handleResponseStatus } from "@/libs/libsUtil.js";
import { checkTokenExpiration } from "./UserStore.js";

const BOARD_ENDPOINT = import.meta.env.VITE_BOARD_ENDPOINT;

export const useBoardStore = defineStore("BoardStore", {
  state: () => ({
    board: [],
    toast: useToast(),
    currentBoard: {},
    userStore: useUserStore(),
  }),
  getters: {
    getBoards: (state) => state.board,
    getCurrentBoard: (state) => state.currentBoard,
    getBoardById: (state) => (id) => {
      if (Array.isArray(state.board.personalBoard)) {
        return state.board.personalBoard.find((board) => board.id === id);
      } else {
        console.error(
          "state.board.personalBoard is not an array:",
          state.board.personalBoard
        );
        return null;
      }
    },
    getVisibility: (state) => (id) => {
      return state.board.find((board) => board.id === id).visibility;
    },
    isBoardOwner: (state) => {
      if (!state.userStore.isLoggedIn || !state.currentBoard) {
        return false;
      }
      return state.userStore.user?.oid === state.currentBoard.owner?.oid;
    },
  },
  actions: {
    async loadBoards() {
      await checkTokenExpiration();

      const res = await fetchAllBoards(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}`
      );
      if (res.status !== 200) {
        handleResponseStatus(res);
      }

      const data = await res.json();
      this.board = data;
    },

    async loadBoardById(boardId) {
      await checkTokenExpiration(boardId);
      const res = await fetchBoardById(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}`,
        boardId
      );
      handleResponseStatus(res);

      const data = await res.json();
      this.board = data;
      return data;
    },

    getPersonalBoard() {
      if (Array.isArray(this.board.personalBoard)) {
        return this.board.personalBoard.sort(
          (a, b) => new Date(a.createdOn) - new Date(b.createdOn)
        );
      } else {
        return [];
      }
    },

    getCollabBoard() {
      if (Array.isArray(this.board.collabsBoard)) {
        return this.board.collabsBoard.sort(
          (a, b) => new Date(a.addedOn) - new Date(b.addedOn)
        );
      } else {
        return [];
      }
    },

    async addBoard(newBoard) {
      await checkTokenExpiration();
      const res = await addBoard(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}`,
        newBoard
      );

      //handle in vue
      const data = await res.json();
      this.board.personalBoard.push(data);
      return res;
    },

    async changeBoardVisibility(id, newVisibility) {
      await checkTokenExpiration(id);
      const res = await patchBoardVisibility(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${id}`,
        newVisibility
      );
      if (res.status === 200) {
        this.currentBoard.visibility = newVisibility;
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: "Board visibility changed successfully!",
          life: 3000,
        });
      }
      handleResponseStatus(res);
    },

    findPersonalBoardByOid(oid) {
      return this.board.personalBoard.filter((board) => board.userOid === oid);
    },

    setCurrentBoard(board) {
      this.currentBoard = board;
    },

    async isPublicBoard(boardId) {
      const board = await this.loadBoardById(boardId);
      return board?.visibility === "PUBLIC";
    },

    async checkIsOwner(boardId) {
      if (!this.board.personalBoard || this.board.personalBoard.length === 0) {
        await this.loadBoards();
      }

      const board = this.board.personalBoard.find(
        (board) => board.id === boardId
      );

      return board !== undefined;
    },
  },
});
