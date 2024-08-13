<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <!-- <div class="min-h-screen w-full">
    <Toast class="itbkk-message" />
    <div
      class="header max-w-full h-[90px] bg-gradient-to-r from-blue to-lightblue"
    >
      <img
        class="object-cover absolute right-0 max-w-max h-[90px]"
        src="/glass-overlay.png"
        alt=""
      />
      <div class="h-[90px] flex flex-col justify-center p-10">
        <h1 class="text-header text-white font-bold">
          IT-Bangmod Kradan kanban
        </h1>
      </div>
    </div>
    <RouterView />
  </div> -->



  <div class="flex items-center justify-center min-h-screen bg-gray-100 font-nunito">
    <div class="flex md:flex-row items-center justify-between max-w-5xlshadow-lg rounded-lg overflow-hidden">
      <!-- Left section with image and text -->
      <div class="w-full md:w-1/2 flex flex-col items-center justify-center bg-lightblue from-blue to-lightblue p-8">
        <h2 class="text-2xl font-bold text-white mb-4">
          School of Information Technology
        </h2>
        <img
          src="./assets/logInImg.svg"
          alt="log-in img"
          class="w-full h-auto object-cover rounded"
        />
      </div>

      <!-- Right section with login form -->
      <div class="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-4 font-nunito">
          Welcome to ITB-KK
        </h2>
        <form class="w-full max-w-sm">
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="username"
            >
              Username
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Enter your username"
            />
          </div>
          <div class="mb-6">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="password"
            >
              Password
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              class="btn btn-neutral w-full bg-blue hover:bg-oceanblue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

</template>

<style scoped></style>
