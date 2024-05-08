<script setup>
import ConfirmModal from './ConfirmModal.vue'
import submitButton from '../button/Button.vue'
</script>
 
<template>
  <ConfirmModal>
    <template #title>
      <p>Delete a Status!</p>
    </template>
    <template #question>
      <p>Do you want to delete the Doing Status?</p>
    </template>
    <template #button-left>
      <submitButton buttonType="cancel">Cancel</submitButton>
    </template>
    <template #button-right>
      <submitButton buttonType="ok">Confirm</submitButton>
    </template>
  </ConfirmModal>
</template>
 
<style scoped>

</style>