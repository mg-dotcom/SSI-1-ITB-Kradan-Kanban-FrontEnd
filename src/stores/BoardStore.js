import { defineStore } from "pinia";
import {
  fetchAllBoards,
  fetchBoardById,
  addBoard,
  patchBoardVisibility,
  fetchCollab,
  addCollab,
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
    async isBoardOwnerByRoute(boardId, userOid) {
      const board = await this.loadBoardById(boardId);

      return board.owner.oid === userOid;
    },
    //collaborators
    async loadCollab(boardId) {
      try {
        const data = await fetchCollab(
          `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/collabs`
        );

        if (data.status < 200 && data.status > 299) {
          alert("Failed to fetch boards");
        } else {
          this.collaborators = data;
          console.log(data);
        }
      } catch (error) {
        console.log(error);
        handleAuthenticationClearAndRedirect();
      }
    },
    async addCollab(boardId, newCollab) {
      await checkTokenExpiration(); // Ensure token is valid before making a request
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/collabs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use the correct authentication mechanism
          },
          body: JSON.stringify(newCollab),
        }
      );

      if (res.status === 401) {
        handleAuthenticationClearAndRedirect(); // Handle unauthorized case
      } else if (res.status === 403) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail:
            "You do not have permission to change collaborator access right.",
          life: 3000,
        });
      } else if (res.status === 201) {
        this.collaborators.push(newCollab); // Add the new collaborator to the list
      } else {
        alert("There was an issue adding the collaborator. Please try again.");
      }
    },
    async updateAccessRight(boardId, collabId, collaborator) {
      await checkTokenExpiration();
      const res = await updateAccessRight(
        `${
          import.meta.env.VITE_BASE_URL
        }${BOARD_ENDPOINT}/${boardId}/collabs/${collabId}`,
        collaborator
      );
      if (res.status === 401) {
        handleAuthenticationClearAndRedirect();
      } else if (res.status === 200) {
        const index = this.collaborators.findIndex(
          (collab) => collab.id === collabId
        );
        this.collaborators[index].access_right = collaborator.access_right;
      } else {
        return res;
      }
    },
  },
});
