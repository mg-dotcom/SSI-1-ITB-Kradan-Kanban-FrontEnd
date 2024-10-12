import { defineStore } from "pinia";
import {
  fetchCollab,
  deleteCollab,
  updateAccessRight,
} from "../libs/FetchCollab.js";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "./UserStore.js";
import { handleAuthenticationClearAndRedirect } from "@/libs/libsUtil.js";
import { checkTokenExpiration } from "./UserStore.js";

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
          console.log(this.collaborators);
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
