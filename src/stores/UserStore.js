import { defineStore } from "pinia";
import { fetchUser, fetchToken } from "../libs/FetchUser.js";
import { useBoardStore } from "./BoardStore.js";
import { useRoute, useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { CookieUtil } from "../libs/CookieUtil.js";
import { computed, watch } from "vue";

const USER_ENDPOINT = import.meta.env.VITE_USER_ENDPOINT;

export const useUserStore = defineStore("UserStore", {
  state: () => ({
    user: {},
    userStore: useUserStore(),
    boardStore: useBoardStore(),
    token: CookieUtil.get("access_token") || "",
    refreshToken: CookieUtil.get("refresh_token") || "",
    isLoggedIn: !!CookieUtil.get("access_token"),
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
        const data = await fetchUser(
          `${import.meta.env.VITE_BASE_URL}${USER_ENDPOINT}`,
          user
        );
        // initialize()
        const decoded = jwtDecode(data.access_token);
        this.token = data.access_token;
        this.refreshToken = data.refresh_token;

        if (decoded) {
          this.user = decoded;
          this.isLoggedIn = true;

          // Set the access token in a cookie with a 30-minute expiration
          const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
          const refreshToken = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
          CookieUtil.set("access_token", this.token, expires);
          CookieUtil.set("refresh_token", data.refresh_token, refreshToken);
        } else {
          alert("Failed to login");
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    logout() {
      this.user = {};
      this.token = "";
      this.refreshToken = "";
      this.isLoggedIn = false;

      // Remove the access token cookie when logging out
      CookieUtil.unset("access_token");
      CookieUtil.unset("refresh_token");
    },

    async initialize() {
      // Check if the token exists in the cookie during initialization
      const token = CookieUtil.get("access_token");
      if (token) {
        this.token = token;
        const decoded = jwtDecode(token);

        this.user = decoded;
        this.isLoggedIn = true;
      }
    },
  },
  checkPermission() {},
});

export const useUserToken = () => {
  const userStore = useUserStore();

  // Create a computed property for the token
  const token = computed(() => CookieUtil.get("access_token") || null);

  // Watch for changes to the cookie and update the store if necessary
  watch(token, (newToken) => {
    userStore.token = newToken;
  });

  return token;
};

let isCheckingToken = false;

export const checkTokenExpiration = async (boardId) => {
  if (isCheckingToken) return { refreshed: false, isValid: false };
  isCheckingToken = true;

  const userStore = useUserStore();
  const boardStore = useBoardStore(); // Get board store for public board check
  const router = useRouter(); // Get router for navigation

  const isPublicBoard = boardId
    ? await boardStore.isPublicBoard(boardId)
    : false;

  // If there is no token and the board is not public, redirect to "access-denied"
  if (!userStore.token) {
    if (!isPublicBoard) {
      router.push({ name: "access-denied" });
    }
    isCheckingToken = false; // Reset the flag before returning
    return { refreshed: false, isValid: false }; // No token present
  }

  const decoded = jwtDecode(userStore.token); // Decode the token to check its expiration

  // Check if the token is expired
  if (decoded.exp < Date.now() / 1000) {
    try {
      // Attempt to refresh the token
      const data = await fetchToken(`${import.meta.env.VITE_BASE_URL}token`);
      const expires = new Date(Date.now() + 30 * 60 * 1000); // Set token expiration to 30 minutes from now
      CookieUtil.set("access_token", data.access_token, expires); // Save new token in cookies
      userStore.token = data.access_token; // Update the token in the user store

      isCheckingToken = false; // Reset the flag before returning
      return { refreshed: true, isValid: true }; // Token was refreshed successfully
    } catch (error) {
      console.error("Failed to refresh token:", error); // Log any errors during refresh
      router.push({ name: "access-denied" }); // Redirect if refresh fails
      isCheckingToken = false; // Reset the flag before returning
      return { refreshed: false, isValid: false }; // Refresh failed
    }
  }

  // Token is still valid
  isCheckingToken = false; // Reset the flag before returning
  return { refreshed: false, isValid: true }; // Token is valid
};
