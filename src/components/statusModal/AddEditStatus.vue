<script setup>
import StatusModal from './StatusModal.vue'
import buttonSubmit from '../button/Button.vue'
import { defineEmits } from 'vue';
defineEmits(["closeAddEdit"]);

</script>

<template>
  <StatusModal>
    <template #title> Edit Status </template>
    <template #name></template>
    <template #desc></template>
    <template #timezone><p>Timezone: Asia/Bangkok</p></template>
    <template #createdon><p>Created On: 16/5/2024 08:00:00</p></template>
    <template #updatedon><p>Updated On: 16/5/2024 08:00:30</p></template>
    <template #button-left>
      <buttonSubmit buttonType="cancel" @click="$emit('closeAddEdit')">Cancel</buttonSubmit>
    </template>
    <template #button-right></template>
  </StatusModal>
</template>

<style scoped></style>
