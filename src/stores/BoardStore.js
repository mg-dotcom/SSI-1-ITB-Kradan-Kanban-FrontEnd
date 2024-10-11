import { defineStore } from "pinia";
import {
  fetchAllBoards,
  fetchBoardById,
  addBoard,
  patchBoardVisibility,
  fetchCollab,
  deleteCollab,
  updateAccessRight,
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
    collaborators: [],
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
    getPersonalBoard: (state) => {
      return state.board.sort((a, b) => {
        return new Date(b.createdOn) - new Date(a.createdOn);
      });
    },
    getPublicBoard: (state) => {
      return state.board.sort((a, b) => {
        return new Date(b.addedOn) - new Date(a.addedOn);
      });
    },
    getCollaborators: (state) => state.collaborators,
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
      return board.visibility === "PUBLIC";
    },

    //collaborators
    async loadCollab(boardId) {
      await checkTokenExpiration();
      try {
        const data = await fetchCollab(
          `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/collabs`
        );

        if (data.status < 200 && data.status > 299) {
          alert("Failed to fetch boards");
        } else {
          this.collaborators = data;
        }
      } catch (error) {
        console.log(error);
        handleAuthenticationClearAndRedirect();
      }
    },
    async updateAccessRight(boardId, collabOid, collaborator) {
      await checkTokenExpiration();
      const res = await updateAccessRight(
        `${
          import.meta.env.VITE_BASE_URL
        }${BOARD_ENDPOINT}/${boardId}/collabs/${collabOid}`,
        collaborator
      );

      if (res.status === 200) {
        const index = this.collaborators.findIndex(
          (collab) => collab.oid === collabOid
        );
        this.collaborators[index].accessRight = collaborator.accessRight;
      }
      return res;
    },
    async removeCollab(boardId, collabOid) {
      await checkTokenExpiration();
      const res = await deleteCollab(
        `${
          import.meta.env.VITE_BASE_URL
        }${BOARD_ENDPOINT}/${boardId}/collabs/${collabOid}`
      );

      const index = this.collaborators.findIndex(
        (collab) => collab.oid === collabOid
      );

      if (res.status === 200) {
        this.collaborators.splice(index, 1);
      }

      return res;
    },
    async leaveCollab(collabOid) {
      await checkTokenExpiration();
      const res = await deleteCollab(
        `${
          import.meta.env.VITE_BASE_URL
        }${BOARD_ENDPOINT}/${boardId}/collabs/${collabOid}`
      );

      if (res.status === 200) {
        const index = this.collaborators.findIndex(
          (collab) => collab.oid === this.userStore.user.oid
        );
        this.collaborators.splice(index, 1);
      }

      return res;
    },
  },
});
