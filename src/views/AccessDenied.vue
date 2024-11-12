<script setup>
import { useRouter } from "vue-router";

import { useUserToken } from "@/stores/UserStore";

import Header from "@/components/Header.vue";

const router = useRouter();

const token = useUserToken().value;
</script>

<template>
  <Header />
  <!-- Back to login -->
  <div class="flex justify-center items-center h-[calc(100vh-90px)]">
    <div class="flex flex-col items-center">
      <h1 class="text-4xl font-bold">Access Denied</h1>
      <p class="text-lg">You don't have permission to access this page</p>
      <button
        @click="router.push(token ? { name: 'board' } : { name: 'login' })"
        class="mt-5 bg-blue text-white px-5 py-2 rounded-md"
      >
        {{ token ? "Back to board list" : "Back to Login" }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
