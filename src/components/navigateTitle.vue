<script setup>
import Breadcrumb from "primevue/breadcrumb";
import { ref, watch } from "vue";

const props = defineProps({
  boardId: {
    type: String,
    default: "",
  },
});

// Define breadcrumb items
const items = ref([]);

// Watch for changes in boardId and update items accordingly
watch(
  () => props.boardId,
  (newBoardId) => {
    items.value = [
      {
        label: "Board",
        routeName: "board",
      },
      { label: "Home", routeName: "board-task", params: { id: newBoardId } },
      {
        label: "Status",
        routeName: "board-status",
        params: { id: newBoardId },
      },
      {
        label: "Collaborator",
        routeName: "board-collab",
        params: { id: newBoardId },
      },
      {
        label: "Invitation",
        routeName: "board-invitation",
        params: { id: newBoardId },
      },
    ];
  },
  { immediate: true } // Trigger this watcher immediately when the component is mounted
);

const handleNextClick = () => {
  const nextSlotElement = mySlot.value?.querySelector(".itbkk-button-next");

  if (!nextSlotElement) {
    console.error("Next slot element not found");
    return;
  }

  const nextContent = nextSlotElement.textContent
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  navigate(nextContent);
};

const navigate = (content) => {
  const routes = {
    home: "board-task",
    "task-status": "board-status",
    "board-list": "board-status",
  };

  const routeName = routes[content] || "home";

  router.push({ name: routeName });
};
</script>

<template>
  <Breadcrumb :home="home" :model="items" class="bg-bgLightBlue">
    <template #item="{ item, props }">
      <router-link
        v-if="item.routeName"
        v-slot="{ href, navigate }"
        :to="{ name: item.routeName, params: item.params }"
        custom
      >
        <a :href="href" v-bind="props.action" @click="navigate">
          <span :class="[item.label, 'text-color']" />
          <span class="text-primary font-semibold">{{ item.label }}</span>
        </a>
      </router-link>
    </template>
  </Breadcrumb>
</template>

<style scoped></style>
