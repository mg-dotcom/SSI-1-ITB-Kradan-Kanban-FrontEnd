<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/UserStore";

const userStore = useUserStore();

const router = useRouter();

userStore.initialize();

// Ensure the store is initialized (retrieve user data from the cookie if available)

const logout = () => {
  userStore.logout();
  console.log('logout');
  router.push({ name: "login" });
};
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
      <h1 class="text-header text-white font-bold">IT-Bangmod Kradan kanban</h1>
      <div class="flex items-center gap-2">
        <div
          class="flex bg-white bg-opacity-45 w-1/7 rounded-full items-center justify-between px-2 py-1 hover:shadow-md transition-all duration-300"
        >
          <div class="avatar">
            <div class="w-8 rounded-full">
              <img
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <div class="itbkk-fullname text-sky-950 font-semibold mx-2">
            {{ userStore.getUser.name }}
          </div>
        </div>
        <div class="flex justify-center items-center p-2 rounded-full">
          <button class="logout-btn" @click="logout">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#082f49"
              height="24px"
              width="24px"
              viewBox="0 0 489.9 489.9"
              class="logout-icon"
            >
              <path
                d="M468.3,255.8c0.1-0.1,0.1-0.1,0.2-0.2c0.3-0.4,0.6-0.7,0.8-1.1c0.1-0.1,0.1-0.2,0.2-0.3c0.2-0.4,0.5-0.8,0.7-1.2     c0-0.1,0.1-0.2,0.1-0.2c0.2-0.4,0.4-0.8,0.6-1.3c0-0.1,0-0.1,0.1-0.2c0.2-0.4,0.3-0.9,0.5-1.4c0-0.1,0-0.2,0.1-0.2     c0.1-0.5,0.3-0.9,0.3-1.4c0-0.2,0-0.3,0.1-0.5c0.1-0.4,0.1-0.8,0.2-1.2c0.1-0.6,0.1-1.1,0.1-1.7c0-0.6,0-1.1-0.1-1.7     c0-0.4-0.1-0.8-0.2-1.2c0-0.2,0-0.3-0.1-0.5c-0.1-0.5-0.2-0.9-0.3-1.4c0-0.1,0-0.2-0.1-0.2c-0.1-0.5-0.3-0.9-0.5-1.4     c0-0.1,0-0.1-0.1-0.2c-0.2-0.4-0.4-0.9-0.6-1.3c0-0.1-0.1-0.2-0.1-0.2c-0.2-0.4-0.4-0.8-0.7-1.2c-0.1-0.1-0.1-0.2-0.2-0.3     c-0.3-0.4-0.5-0.8-0.8-1.1c-0.1-0.1-0.1-0.1-0.2-0.2c-0.4-0.4-0.7-0.9-1.2-1.3l-98.9-98.8c-6.7-6.7-17.6-6.7-24.3,0     c-6.7,6.7-6.7,17.6,0,24.3l69.6,69.6H136.8c-9.5,0-17.2,7.7-17.2,17.1c0,9.5,7.7,17.2,17.2,17.2h276.8l-69.1,69.1     c-6.7,6.7-6.7,17.6,0,24.3c3.3,3.3,7.7,5,12.1,5s8.8-1.7,12.1-5l98.3-98.3C467.5,256.6,467.9,256.2,468.3,255.8z"
              />
              <path
                d="M110.7,34.3h128c9.5,0,17.2-7.7,17.2-17.1c0-9.5-7.7-17.2-17.2-17.2h-128C59.4,0,17.6,41.8,17.6,93.1v303.7     c0,51.3,41.8,93.1,93.1,93.1h125.9c9.5,0,17.2-7.7,17.2-17.1c0-9.5-7.7-17.2-17.2-17.2H110.7c-32.4,0-58.8-26.4-58.8-58.8V93.1     C52,60.6,78.3,34.3,110.7,34.3z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
