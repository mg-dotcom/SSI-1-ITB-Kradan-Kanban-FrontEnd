<script setup>
import GradientLoginBg from "@/components/gradientLoginBg.vue";
import { ref } from "vue";

const isError = ref(false);
</script>

<template>
  <div class="flex h-screen font-nunito items-center overflow-hidden">
    <GradientLoginBg />
    <div
      class="flex flex-col animated-background bg-gradient-to-r from-blue via-blue-500 to-sky-300 p-8 w-[50vw] h-full box-border"
    >
      <div>
        <h2 class="text-4xl text-start font-bold text-white">
          School of Information <br />
          Technology .
        </h2>
      </div>
      <div class="flex justify-center flex-1">
        <img class="w-7/12" src="../assets/logInImg.svg" alt="" />
      </div>
      <div>
        <h2 class="text-2xl text-end font-bold text-white opacity-20">SSI-1</h2>
      </div>
    </div>

    <div
      class="w-full lg:w-1/2 flex items-center justify-center font-nunito h-screen"
    >
      <div class="max-w-md w-full p-6 scale-105">
        <h1 class="text-3xl font-bold mb-6 text-black text-center">
          Welcome to ITB-KK
        </h1>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Username</label
            >
            <input
              type="text"
              class="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <input
              type="password"
              class="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            />
          </div>
          <div
            class="flex gap-2 py-3 px-4 bg-rose-200 rounded popup"
            v-show="isError"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="#e65075"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="text-[#e65075] font-medium"
              >Incorrect username and password</span
            >
          </div>
          <div>
            <button
              class="btn w-full bg-blue hover:bg-oceanblue text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              @click="isError = !isError"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
