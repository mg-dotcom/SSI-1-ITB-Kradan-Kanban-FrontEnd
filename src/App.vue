<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useUserStore } from "@/stores/UserStore";

const userStore = useUserStore();

// onMounted(() => {
//   userStore.initialize(); // Call the method to check the token during app initialization
// });
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
