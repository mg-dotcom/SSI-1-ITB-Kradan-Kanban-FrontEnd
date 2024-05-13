<script setup>
import ConfirmModal from "./ConfirmModal.vue";
import submitButton from "../button/Button.vue";
defineEmits(["closeDelete", "deleteStatus"]);
const props = defineProps({
  currentStatus: {
    Type: Object,
  },
});
</script>

<template>
  <ConfirmModal>
    <template #title>
      <p>Delete a Status!</p>
    </template>
    <template #question>
      <p class="itbkk-massage">
        Do you want to delete the
        <span class="font-bold">{{ props.currentStatus.name }}</span> status ?
      </p>
    </template>
    <template #button-left>
      <submitButton
        buttonType="cancel"
        class="itbkk-button-cancel"
        @click="$emit('closeDelete')"
        >Cancel</submitButton
      >
    </template>
    <template #button-right>
      <submitButton
        buttonType="ok"
        class="itbkk-button-confirm"
        @click="$emit('deleteStatus', currentStatus.id)"
        >Confirm</submitButton
      >
    </template>
  </ConfirmModal>
</template>

<style scoped></style>
