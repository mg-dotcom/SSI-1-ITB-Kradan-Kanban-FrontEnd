import { defineStore } from "pinia";
import { fetchUser, fetchToken } from "../libs/FetchUser.js";
import { useBoardStore } from "./BoardStore.js";
import { useRoute, useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { CookieUtil } from "../libs/CookieUtil.js";
import { computed, watch } from "vue";
import * as msal from "@azure/msal-browser";

const USER_ENDPOINT = import.meta.env.VITE_USER_ENDPOINT;
const AZURE_CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID;
const AZURE_TENANT_ID = import.meta.env.VITE_AZURE_TENANT_ID;

const msalConfig = {
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${AZURE_TENANT_ID}`,
    redirectUri: "http://localhost:5173",
  },
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

export const useUserStore = defineStore("UserStore", {
  state: () => ({
    user: {},
    userStore: useUserStore(),
    boardStore: useBoardStore(),
    token: CookieUtil.get("access_token") || "",
    refreshToken: CookieUtil.get("refresh_token") || "",
    isLoggedIn: !!CookieUtil.get("access_token"),
    redirectAfterLogin: "",
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
    getRedirectAfterLogin() {
      return this.redirectAfterLogin;
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

          // Set the access token in a cookie with a 30-min expiration
          const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
          const refreshToken = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24hours from now
          CookieUtil.set("access_token", this.token, expires);
          CookieUtil.set("refresh_token", data.refresh_token, refreshToken);
        } else {
          alert("Failed to login");
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async loginWithMicrosoft() {
      try {
        // Trigger Microsoft login redirect
        await msalInstance.loginRedirect({
          scopes: ["user.read"], // Required Microsoft Graph scopes
        });
      } catch (error) {
        console.error("Error during login:", error);
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

    setRedirectAfterLogin(redirectName) {
      this.redirectAfterLogin = redirectName;
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

let isCheckingToken = false; // Initialize at top of the file

export const checkTokenExpiration = async (boardId) => {
  if (isCheckingToken) return; // If already checking, exit early
  isCheckingToken = true; // Set flag to prevent re-entry

  const userStore = useUserStore();
  const boardStore = useBoardStore();
  const router = useRouter();

  const isPublicBoard = boardId
    ? await boardStore.isPublicBoard(boardId)
    : false;

  if (!userStore.token) {
    if (isPublicBoard) {
      isCheckingToken = false; // Reset the flag
      return;
    } else {
      router.push({ name: "access-denied" });
      isCheckingToken = false; // Reset the flag
      return;
    }
  }

  const decoded = jwtDecode(CookieUtil.get("access_token"));
  const decodedRft = jwtDecode(CookieUtil.get("refresh_token"));

  if (decoded.exp < Date.now() / 1000 && decodedRft.exp > Date.now() / 1000) {
    // Token has expired; try to refresh it

    try {
      const data = await fetchToken(`${import.meta.env.VITE_BASE_URL}token`);
      // console.log(data)

      const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
      CookieUtil.set("access_token", data.access_token, expires);
      userStore.token = data.access_token;

      isCheckingToken = false; // Reset flag after successful refresh
      return data.access_token;
    } catch {
      userStore.logout();
      isCheckingToken = false; // Reset flag on failure
    }
  } else if (decodedRft && decodedRft.exp < Date.now() / 1000) {
    // userStore.$reset()
    userStore.logout();
  } else {
    isCheckingToken = false; // Reset flag if token is still valid
    return userStore.token; // Token is still valid
  }
};
