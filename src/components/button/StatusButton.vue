<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  statusColor: {
    type: String,
    default: "#CCCCCC",
  },
  statusName: {
    type: String,
    default: "No Status",
  },
  filterStatuses: {
    type: Array,
  },
});

const selectedId = defineEmits(["clear-status"]);
</script>

<template>
  <div>
    <div
      class="itbkk-status flex py-1 px-3 text-[13px] font-semibold rounded-full text-white sm:min-w-[120px] sm:w-fit md:min-w-[110px] md:w-fit lg:min-w-[160px] lg:w-fit xl:min-w-[135px] relative"
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
      <span
        class="itbkk-filter-item-clear absolute right-3 hover:shadow-md bg-red-400 cursor-pointer transition-all duration-300 rounded-full w-5 text-center z-[100] hover:bg-red-500"
        v-if="filterStatuses"
        @click="$emit('clear-status', statusName)"
      >
        <font-awesome-icon icon="fa-solid fa-xmark" class="" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.bg-blue-status {
  background-color: #3b82f6;
}
</style>
