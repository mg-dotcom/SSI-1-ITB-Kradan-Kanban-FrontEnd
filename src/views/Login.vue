<script setup></script>

<template>
  <div class="flex h-screen font-nunito items-center overflow-hidden">
   <img src="../assets/w" alt="">
    <div
      class="flex flex-col animated-background bg-gradient-to-r from-blue via-blue-500 to-blue-status p-8 w-[50vw] h-full box-border"
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
          <div>
            <button
              class="btn w-full bg-blue hover:bg-oceanblue text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
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
