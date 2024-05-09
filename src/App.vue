<script setup>
import { RouterView } from "vue-router";
// import ConfirmModal from './components/confirmModal/ConfirmModal.vue'
import Transfer from './components/confirmModal/Transfer.vue'
import DeleteStatus from "./components/confirmModal/DeleteStatus.vue";
import StatusModal from './components/statusModal/StatusModal.vue'
import EditStatus from './components/statusModal/EditStatus.vue'
import AddStatus from './components/statusModal/AddStatus.vue'

</script>

<template>
  <div class="h-screen w-full">
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
  </div>
</template>

<style scoped></style>
