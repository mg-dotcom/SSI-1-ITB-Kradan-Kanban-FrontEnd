<script setup>
import { useRouter, useRoute } from 'vue-router'
import ConfirmModal from './ConfirmModal.vue'
import submitButton from '../button/Button.vue'
defineEmits(['closeDelete', 'deleteStatus'])
const props = defineProps({
  currentStatus: {
    Type: Object
  },
})
</script>

<template>
  <ConfirmModal>
    <template #title>
      <p>Delete a Status!</p>
    </template>
    <template #question>
      <p>
        Do you want to delete the
        <span class="font-bold">{{ props.currentStatus.name }}</span> status ?
      </p>
    </template>
    <template #button-left>
      <submitButton buttonType="cancel" @click="$emit('closeDelete')"
        >Cancel</submitButton
      >
    </template>
    <template #button-right>
      <submitButton
        buttonType="ok"
        @click="$emit('deleteStatus', currentStatus.id)"
        >Confirm</submitButton
      >
    </template>
  </ConfirmModal>
</template>

<style scoped></style>
