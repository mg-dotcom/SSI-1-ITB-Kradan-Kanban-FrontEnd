<script setup>
import ModalDetail from './ModalDetail.vue'
import buttonSubmit from './components/button/Button.vue';
import StatusButton from './components/button/StatusButton.vue';
</script>

<template>
  <ModalDetail>
    <template #title>
      <input type="text" class="" placeholder="Type Title..." />
    </template>
    <template #desc>
      <input type="text" name="" id="" />
    </template>
    <template #assignees>
      <input type="text" />
    </template>
    <template #status>
      <form class="lg:w-[230px] sm:w-[200px]">
        <select
          id="countries"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option selected class="itbkk-status hidden">
            
          </option>
          <option>No Status</option>
          <option>To Do</option>
          <option>Doing</option>
          <option>Done</option>
        </select>
      </form>
    </template>
    <template #Timezone>
      {{ localTimeZone }}
    </template>
    <template #createdOn></template>
    <template #updatedOn> </template>
    <template #button-left>
      <buttonSubmit
        buttonType="Ok"
        @click="$emit('closeDetail')"
      ></buttonSubmit>
    </template>
    <template #button-right>
      <buttonSubmit
        buttonType="Cancel"
        @click="$emit('closeDetail')"
      ></buttonSubmit>
    </template>
  </ModalDetail>
</template>

<style scoped></style>
