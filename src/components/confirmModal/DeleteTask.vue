<script setup>
import submitButton from '../button/Button.vue'
import { defineEmits } from 'vue'
defineEmits(['closeDelete', 'deleteData'])
const props = defineProps({
  selectedTask: {
    type: Object
  },
  selectedIndex: {
    type: Number
  }
})

console.log(props.selectedIndex)
</script>

<template>
  <div
    class="delete-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white max-w-md p-6 rounded-lg shadow-lg">
      <div class="font-bold mb-4">
        <p>Delete a Task!</p>
      </div>
      <div class="title-line w-full h-px bg-gray-300 mb-4"></div>
      <div class="itbkk-message mb-6 break-all">
        <p>
          Do you want to delete the task number {{ props.selectedIndex + 1 }} -
          {{ selectedTask.title }} ?
        </p>
      </div>
      <div class="button-container flex justify-end">
        <div class="itbkk-button-cancel">
          <submitButton buttonType="cancel" @click="$emit('closeDelete')"
            >Cancel</submitButton
          >
        </div>
        <div class="itbkk-button-confirm">
          <submitButton
            buttonType="ok"
            @click="$emit('deleteData', selectedTask.id)"
            >Confirm</submitButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
