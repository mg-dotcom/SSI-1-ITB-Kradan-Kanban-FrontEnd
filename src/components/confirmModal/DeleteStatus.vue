<script setup>
import ConfirmModal from './ConfirmModal.vue'
import submitButton from '../button/Button.vue'
defineEmits(["closeDelete", "deleteStatus"]);
const props=defineProps({
  selectedStatus:{
    Type:Object,
  }
})

</script>
 
<template>
  <ConfirmModal>
    <template #title>
      <p>Delete a Status!</p>
    </template>
    <template #question>
      <p>Do you want to delete the <span class="font-bold">Doing</span>  Status?</p>
    </template>
    <template #button-left>
      <submitButton buttonType="cancel" @click="$emit('closeDelete')">Cancel</submitButton>
    </template>
    <template #button-right>
      <submitButton buttonType="ok" @click="$emit('deleteStatus',selectedStatus.id)">Confirm</submitButton>
    </template>
  </ConfirmModal>
</template>
 
<style scoped>

</style>