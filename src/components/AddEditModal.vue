<script setup>
import ModalDetail from "./ModalDetail.vue";
import buttonSubmit from "./button/Button.vue";

import { defineProps, defineEmits } from "vue";

const props = defineProps({
  selectedTask: Object,
  localTimeZone: String,
});
defineEmits(["closeDetail"]);
console.log(props.selectedTask);
console.log(props.localTimeZone);
</script>

<template>
  <ModalDetail :selectedTask="selectedTask">
    <template #title> {{ props.selectedTask.id===0 ? "Edit Task" : "New Task" }}</template>
    <div class="mb-4">
      <label
        for="default-input"
        class="block mb-2 text-base font-semibold text-gray-900 dark:text-white"
        >Title</label
      >
      <div class="px-3">
        <input
          maxlength="100"
          type="text"
          id="default-input"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model="props.selectedTask.title"
          required
          />
      
      </div>
    </div>
    <template #desc>
      <textarea
        maxlength="500"
        class="block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full h-3/4"
        v-model="props.selectedTask.description"
        ></textarea>
    </template>
    <template #assignees>
      <textarea
        maxlength="30"
        class="block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full h-3/4"
        v-model="props.selectedTask.assignees"
        ></textarea>
    </template>
    <template #status>
      <form class="px-3">
        <select
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model="props.selectedTask.status"
          >
          <option selected class="itbkk-status">Choose Status</option>
          <option>No Status</option>
          <option>To Do</option>
          <option>Doing</option>
          <option>Done</option>
        </select>
      </form>
    </template>

    
    <template #Timezone> {{ props.selectedTask.id==0 ? "":"TimeZone : "+props.localTimeZone }} </template>
    <template #createdOn>
      {{ props.selectedTask.id==0 ? "":"Created On : "+props.selectedTask.createdOn }}
    </template>
    <template #updatedOn>
      {{ props.selectedTask.id==0 ? "":"Updated On :"+props.selectedTask.updatedOn }}</template
    >

    <template #button-left>
      <buttonSubmit buttonType="Ok" @click="$emit('closeDetail')"
        >Save</buttonSubmit
      >
    </template>
    <template #button-right>
      <buttonSubmit buttonType="Cancel" @click="$emit('closeDetail')"
        >Cancel</buttonSubmit
      >
    </template>
  </ModalDetail>
</template>

<style scoped></style>
