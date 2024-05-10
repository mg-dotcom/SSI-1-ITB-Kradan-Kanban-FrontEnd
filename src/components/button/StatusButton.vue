<script setup>
const props = defineProps({
  statusColor: {
    type: String,
    default: "#CCCCCC",
  },
  statusName: {
    type: String,
    default: "No Status",
  },
});
</script>

<template>
  <div>
    <div
      class="itbkk-status flex justify-center py-1 text-[13px] font-semibold rounded-full"
      :style="{ backgroundColor: statusColor }"
    >
      <span
        class="relative flex h-2 w-3 top-1 -left-[5px]"
        v-if="statusName !== 'No Status'"
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
