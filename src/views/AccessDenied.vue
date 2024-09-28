<script setup>
import Header from "@/components/Header.vue";
import accessDeniedShield from "@/assets/accessDeniedShield.svg";
</script>

<template>
  <div class="h-screen w-full bg-bgLightBlue flex flex-col">
    <Header />
    <div class="flex flex-col justify-center w-full items-center h-full gap-8">
      <img :src="accessDeniedShield" alt="shield" class="w-[10%]" />
      <h1 class="font-mono font-semibold text-2xl">
        Access denied, you do not have permission to view this page.
      </h1>
    </div>
  </div>
</template>

<style scoped></style>
