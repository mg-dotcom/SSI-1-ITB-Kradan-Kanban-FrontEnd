import { defineStore } from "pinia";
import {
  fetchAllBoards,
  fetchBoardById,
  addBoard,
  patchBoardVisibility,
} from "../libs/FetchBoard.js";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "./UserStore.js";
import { handleAuthenticationClearAndRedirect } from "@/libs/libsUtil.js";
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
      return state.board.find((board) => board.id === id);
    },
    getVisibility: (state) => (id) => {
      return state.board.find((board) => board.id === id).visibility;
    },
    isBoardOwner: (state) => {
      // Check if the user is logged in and if the current board exists
      if (!state.userStore.isLoggedIn || !state.currentBoard) {
        return false;
      }
      // Return true if the logged-in user is the owner of the current board
      return state.userStore.user?.oid === state.currentBoard.owner?.oid;
    },
  },
  actions: {
    async loadBoards() {
      try {
        const data = await fetchAllBoards(
          `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}`
        );

        if (data.status < 200 && data.status > 299) {
          alert("Failed to fetch boards");
        } else {
          this.board = data;
        }
      } catch (error) {
        console.log(error);

        handleAuthenticationClearAndRedirect();
      }
    },
    async loadBoardById(boardId) {
      await checkTokenExpiration(boardId);
      const data = await fetchBoardById(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}`,
        boardId
      );

      if (data.status < 200 && data.status > 299) {
        alert("Failed to fetch board");
      } else {
        this.board = data;
        return data;
      }
    },
    async addBoard(newBoard) {
      await checkTokenExpiration();
      const res = await addBoard(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}`,
        newBoard
      );
      if (res.status === 401 || res.status === 404) {
        handleAuthenticationClearAndRedirect();
      } else if (res.status < 200 || res.status > 299) {
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
    async changeBoardVisibility(id, newVisibility) {
      try {
        const res = await patchBoardVisibility(
          `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${id}`,
          newVisibility
        );
        console.log(`${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${id}`);
        if (res.status >= 200 && res.status < 300) {
          this.currentBoard.visibility = newVisibility;
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: "Board visibility changed successfully!",
            life: 3000,
          });
        }
      } catch (error) {
        console.error("Error changing board visibility:", error);
        alert("There is a problem. Please try again later.");
      }
    },
    findByOid(oid) {
      return this.board.filter((board) => board.userOid === oid);
    },
    setCurrentBoard(board) {
      this.currentBoard = board;
    },
    async isPublicBoard(boardId) {
      const board = await this.loadBoardById(boardId);
      console.log(board);

      return board.visibility === "PUBLIC";
    },
  },
});
