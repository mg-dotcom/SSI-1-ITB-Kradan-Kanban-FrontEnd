<script setup>
const props = defineProps({
  statusName: {
    validator(value) {
      const lowerCaseValue = value.toLowerCase();
      return ["todo", "doing", "done", "nostatus"].includes(lowerCaseValue);
    },
  },
});

</script>

<template>
  <div>
    <div
      class="itbkk-status bg-gray-status text-white flex justify-start py-1 rounded-2xl"
      :class="[
        statusName === 'todo'
          ? 'bg-yellow-status w-20 pl-4'
          : statusName === 'doing'
          ? 'bg-blue-status w-20 pl-4'
          : statusName === 'done'
          ? 'bg-green-status w-20 pl-4'
          : 'bg-gray-status w-20 px-2',
      ]"
    >
      <span
        class="relative flex h-2 w-3 top-1 -left-[5px]"
        v-if="statusName !== 'nostatus'"
      >
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"
        ></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
      <slot class="">No Status</slot>
    </div>
  </div>
</template>

<style scoped>
.bg-blue-status {
  background-color: #3b82f6;
}
</style>
