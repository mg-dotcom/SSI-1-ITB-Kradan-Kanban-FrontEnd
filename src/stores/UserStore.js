import { defineStore } from "pinia";

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
      const data = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const res = await data.json();
      if (res.status === "success") {
        this.user = res.data.user;
        this.token = res.data.token;
        this.isLoggedIn = true;
      } else {
        alert("Failed to login");
      }
    },
    async logout() {
      this.user = {};
      this.token = "";
      this.isLoggedIn = false;
    },
  },
});
