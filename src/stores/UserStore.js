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
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid username or password.");
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
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
