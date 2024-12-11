<script setup>
import Breadcrumb from "primevue/breadcrumb";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  boardId: {
    type: String,
    default: "",
  },
});

const route = useRoute();
const router = useRouter();

// Define breadcrumb items
const items = ref([]);

// Watch for changes in the route and update items accordingly
watch(
  () => route.path,
  (newPath) => {
    const baseItems = [
      { label: "Board", routeName: "board" },
      { label: "Home", routeName: "board-task", params: { id: props.boardId } },
    ];

    if (newPath.includes("/status")) {
      baseItems.push({
        label: "Status",
        routeName: "board-status",
        params: { id: props.boardId },
      });
    } else if (newPath.includes("/collab")) {
      baseItems.push({
        label: "Collaborator",
        routeName: "board-collab",
        params: { id: props.boardId },
      });
    }

    items.value = baseItems;
  },
  { immediate: true }
);
</script>

<template>
  <Breadcrumb :model="items" class="bg-bgLightBlue">
    <template #item="{ item }">
      <router-link
        v-if="item.routeName"
        :to="{ name: item.routeName, params: item.params }"
      >
        <span class="text-primary font-semibold">{{ item.label }}</span>
      </router-link>
    </template>
  </Breadcrumb>
</template>

<style scoped></style>
