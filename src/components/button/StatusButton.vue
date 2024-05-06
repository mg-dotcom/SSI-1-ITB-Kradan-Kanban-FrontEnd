<script setup>
const props = defineProps({
  statusName: {
    validator(value) {
      return ["todo", "doing", "done", "nostatus"].includes(
        value.toLowerCase().trim()
      );
    },
  },
});
</script>

<template>
  <div>
    <div
      class="itbkk-status bg-gray-status text-white flex justify-center py-1 text-[13px] rounded-full"
      :class="[
        statusName === 'todo'
          ? 'bg-yellow-status w-20 '
          : statusName === 'doing'
          ? 'bg-blue-status w-20 '
          : statusName === 'done'
          ? 'bg-green-status w-20 '
          : 'bg-gray-status w-20  ',
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
