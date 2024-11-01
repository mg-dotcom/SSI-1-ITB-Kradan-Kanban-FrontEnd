import { defineStore } from "pinia";
import {
  fetchCollab,
  deleteCollab,
  updateAccessRight,
  addCollab,
} from "../libs/FetchCollab.js";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "./UserStore.js";
import { handleAuthenticationClearAndRedirect } from "@/libs/libsUtil.js";
import { checkTokenExpiration } from "./UserStore.js";
import { useBoardStore } from "./BoardStore.js";

const BOARD_ENDPOINT = import.meta.env.VITE_BOARD_ENDPOINT;

export const useCollabStore = defineStore("CollabStore", {
  state: () => ({
    collaborators: [],
  }),
  getters: {
    getCollaborators: (state) => state.collaborators,
  },
  actions: {
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
        handleAuthenticationClearAndRedirect();
      }
    },
    async addCollab(boardId, newCollab) {
      const res = await addCollab(
        `${import.meta.env.VITE_BASE_URL}${BOARD_ENDPOINT}/${boardId}/collabs`,
        newCollab
      );
      if (res.status === 201) {
        const data = await res.json();
        this.collaborators.push(data);
      }
      return res;
    },
    async updateAccessRight(boardId, collabOid, accessRight) {
      await checkTokenExpiration();
      const res = await updateAccessRight(
        `${
          import.meta.env.VITE_BASE_URL
        }${BOARD_ENDPOINT}/${boardId}/collabs/${collabOid}`,
        accessRight
      );

      if (res.status === 200) {
        const index = this.collaborators.findIndex(
          (collab) => collab.oid === collabOid
        );
        this.collaborators[index].accessRight = accessRight;
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
    async leaveCollab(boardId, collabOid) {
      const boardStore = useBoardStore();
      await checkTokenExpiration();
      const res = await deleteCollab(
        `${
          import.meta.env.VITE_BASE_URL
        }${BOARD_ENDPOINT}/${boardId}/collabs/${collabOid}`
      );

      if (res.status === 200) {
        const index = boardStore
          .getCollabBoard()
          .findIndex((collab) => collab.oid === collabOid);
        boardStore.getCollabBoard().splice(index, 1);
      }
      return res;
    },
    checkAccessRight() {
      const userStore = useUserStore();
      const collabArr = this.collaborators;
      if (Array.isArray(collabArr)) {
        const collab = collabArr.find(
          (collab) => collab.oid === userStore.getUser.oid
        );
        if (collab) {
          console.log("Collaborator found:", collab);
        } else {
          console.log("No matching collaborator found.");
        }
      } else {
        console.error("getCollaborators did not return an array:", collabArr);
        return [];
      }
    },
    findCollabBoardByOid(oid) {
      return this.collaborators.find((collab) => collab.oid === oid);
    },
  },
});
