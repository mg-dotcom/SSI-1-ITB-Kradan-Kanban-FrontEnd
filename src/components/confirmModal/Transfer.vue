<script setup>
import ConfirmModal from './ConfirmModal.vue'
import submitButton from '../button/Button.vue'
</script>

<template>
  <ConfirmModal>
    <template #title>
      <p>Transfer a Status</p>
    </template>
    <template #question>
      <p>There is some task associated with the Doing status.</p>
      <p>Transfer to</p>
    </template>
    <template #button-left>
      <submitButton buttonType="cancel">Cancel</submitButton>
    </template>
    <template #button-right>
      <submitButton buttonType="ok">Confirm</submitButton>
    </template>
  </ConfirmModal>
</template>

<style scoped></style>
