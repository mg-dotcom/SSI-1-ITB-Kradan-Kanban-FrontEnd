<script setup>
import { useRouter } from "vue-router";
import { useUserStore, useUserToken } from "@/stores/UserStore";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const route = useRoute();

const userStore = useUserStore();

const router = useRouter();

userStore.initialize();

const logout = () => {
  userStore.logout();
  router.push({ name: "login" });
};

const isValidToken = ref(true);

if (!useUserToken().value) {
  isValidToken.value = false;
}

const dropdownMenu = ref(null);

const toggleDropdown = () => {
  dropdownMenu.value = !dropdownMenu.value;
};

onClickOutside(dropdownMenu, () => {
  dropdownMenu.value = false;
});
</script>

<template>
  <Toast class="itbkk-message" />
  <div
    class="header max-w-full h-[90px] bg-gradient-to-r from-blue to-lightblue"
  >
    <img
      class="object-cover absolute left-10 max-w-max h-[90px]"
      src="/glass-overlay.png"
      alt=""
    />
    <div class="h-[90px] flex p-10 justify-between items-center">
      <h1 class="text-header text-white font-bold">IT-Bangmod Kradan Kanban</h1>
      <div
        class="flex items-center gap-2"
        v-if="route.name !== 'login' && route.name !== 'access-denied'"
      >
        <div class="group-user flex" v-if="isValidToken">
          <div class="relative w-max mx-auto">
            <button
              @click="toggleDropdown"
              class="px-4 py-2 flex items-center rounded-full text-[#333] text-sm border bg-white bg-opacity-45 outline-none hover:bg-gray-100 duration-300"
            >
              <img
                src="https://readymadeui.com/profile_6.webp"
                class="w-7 h-7 mr-3 rounded-full shrink-0"
                alt="User Profile"
              />
              {{ userStore.getUser.name }}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3 fill-gray-400 inline ml-3"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <ul
              v-if="dropdownMenu"
              class="absolute block shadow-lg bg-white py-2 z-[1000] min-w-full w-max rounded-lg max-h-96 overflow-auto"
            >
              <li
                class="py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer"
                @click="logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  class="w-4 h-4 mr-3"
                  viewBox="0 0 6.35 6.35"
                >
                  <path
                    d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                  ></path>
                </svg>
                Logout
              </li>
            </ul>
          </div>
        </div>
        <div class="login-btn" v-else>
          <button
            type="button"
            @click="handleLogin"
            class="px-5 py-2.5 bg-blue gap-x-1 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:shadow-md transition-all duration-300"
          >
            Login
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M2.00098 11.999L16.001 11.999M16.001 11.999L12.501 8.99902M16.001 11.999L12.501 14.999"
                stroke="#FFFFFF"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.3531 21.8897 19.1752 21.9862 17 21.9983M9.00195 17C9.01406 19.175 9.11051 20.3529 9.87889 21.1213C10.5202 21.7626 11.4467 21.9359 13 21.9827"
                stroke="#FFFFFF"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
