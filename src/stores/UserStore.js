// stores/UserStore.js

import { defineStore } from "pinia";
import { fetchUser } from '../libs/FetchUser.js';

export const useUserStore = defineStore("UserStore", {
  state: () => ({
    user: {},
    token: "",
    isLoggedIn: false,
  }),
  getters: {
    getUser() {
      return this.user;
    },
    getToken() {
      return this.token;
    },
    getIsLoggedIn() {
      return this.isLoggedIn;
    },
  },
  actions: {
    async login(user) {
      try {
        const data = await fetchUser("http://localhost:8080/api/auth/login", user);

        if (data.status === "success") {
          this.user = data.data.user;
          this.token = data.data.token;
          this.isLoggedIn = true;
        } else {
          alert("Failed to login");
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async logout() {
      this.user = {};
      this.token = "";
      this.isLoggedIn = false;
    },
  },
});
