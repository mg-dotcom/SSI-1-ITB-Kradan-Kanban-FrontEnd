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
      try {
        const data = await fetchAllBoards(
          `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}`
        );

        if (data.status < 200 && data.status > 299) {
          alert("Failed to fetch boards");
        } else {
          this.board = data;
          console.log(this.board);
        }
      } catch (error) {
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
        const data = await res.json();
        this.board.personalBoard.push(data);
      }

      return res;
    },
    async changeBoardVisibility(id, newVisibility) {
      await checkTokenExpiration();
      try {
        const res = await patchBoardVisibility(
          `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${id}`,
          newVisibility
        );
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
    findPersonalBoardByOid(oid) {
      return this.board.personalBoard.filter((board) => board.userOid === oid);
    },
    setCurrentBoard(board) {
      this.currentBoard = board;
    },
    async isPublicBoard(boardId) {
      await checkTokenExpiration();
      const board = await this.loadBoardById(boardId);
      return board.visibility === "PUBLIC";
    },
    async checkIsOwner(boardId) {
      await checkTokenExpiration();
      await this.loadBoards();
      const board = this.board.personalBoard.find(
        (board) => board.id === boardId
      );
      return board;
    },
  },
});
