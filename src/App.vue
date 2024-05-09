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
  <div>
    <!-- <RouterView /> -->
    <DeleteStatus/>
  </div>
</template>

<style scoped></style>
