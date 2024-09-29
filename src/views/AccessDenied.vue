<script setup>
import { useRouter } from "vue-router";

import { useUserStore } from "@/stores/UserStore";
import Header from "@/components/Header.vue";

import { onMounted } from "vue";

const userStore = useUserStore();

const router = useRouter();
</script>

<template>
  <Header />
  <!-- Back to login -->
  <div class="flex justify-center items-center h-[calc(100vh-90px)]">
    <div class="flex flex-col items-center">
      <h1 class="text-4xl font-bold">Access Denied</h1>
      <p class="text-lg">You don't have permission to access this page</p>
      <button
        @click="router.push({ name: 'login' })"
        class="mt-5 bg-blue text-white px-5 py-2 rounded-md"
      >
        Back to login
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
