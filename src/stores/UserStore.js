import { defineStore } from "pinia";
import { fetchUser,fetchToken } from "../libs/FetchUser.js";
import { jwtDecode } from "jwt-decode";
import { CookieUtil } from "../libs/CookieUtil.js";
import { computed, watch } from "vue";

const USER_ENDPOINT = import.meta.env.VITE_USER_ENDPOINT;

export const useUserStore = defineStore("UserStore", {
  state: () => ({
    user: {},
    userStore: useUserStore(),
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
        console.log("error");

        throw new Error(error.message);
      }
    },
    logout() {
      this.user = {};
      this.token = "";
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
});

export const useUserToken = () => {
  const userStore = useUserStore();

  // Create a computed property for the token
  const token = computed(() => CookieUtil.get("access_token") || "");

  // Watch for changes to the cookie and update the store if necessary
  watch(token, (newToken) => {
    userStore.token = newToken;
  });

  return token;
};

export const checkTokenExpiration=async()=>{
  console.log('check token expiration');
  
  const userStore = useUserStore();
  const decoded = jwtDecode(userStore.token);
  if(decoded.exp < Date.now() / 1000) {
    console.log('token expired');
    
    //fetch refresh token return new access token
    try{
      
      const data=await fetchToken(`${import.meta.env.VITE_BASE_URL}${USER_ENDPOINT}/token`);
      console.log('new token',data.access_token);
      
      const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
      CookieUtil.set("access_token", data.access_token, expires);
      userStore.token=data.access_token;
      console.log(userStore.token);
      
    }catch{
      //if refresh token expired then logout
      userStore.logout();
    }
  }
}
