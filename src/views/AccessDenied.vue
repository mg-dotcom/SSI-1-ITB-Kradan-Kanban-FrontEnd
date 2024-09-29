<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import { onMounted } from "vue";

const userStore = useUserStore();

onMounted(() => {
  console.log("AccessDenied.vue mounted");
});
</script>

<template>
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
    </div>
    <div>Access denied</div>
  </div>
</template>

<style lang="scss" scoped></style>
