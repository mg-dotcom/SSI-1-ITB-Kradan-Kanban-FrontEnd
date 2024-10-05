<script setup>
import Breadcrumb from 'primevue/breadcrumb';
import { ref, watch } from 'vue';

const props = defineProps({
  boardId: {
    type: String,
    default: ''
  }
});

// Define breadcrumb items
const items = ref([]);

// Watch for changes in boardId and update items accordingly
watch(
  () => props.boardId,
  (newBoardId) => {
    items.value = [
      { label: 'Home', routeName: 'board-task', params: { id: newBoardId } },
      { label: 'Status', routeName: 'board-status', params: { id: newBoardId } },
      { label: 'Collaborator', routeName: 'board-collab', params: { id: newBoardId } }
    ];
  },
  { immediate: true } // Trigger this watcher immediately when the component is mounted
);

</script>
  
<template>
      <Breadcrumb :home="home" :model="items">
        <template #item="{ item, props }">
            <router-link v-if="item.routeName" v-slot="{ href, navigate }" :to="{name:item.routeName, params:item.params}" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                    <span :class="[item.label, 'text-color']" />
                    <span class="text-primary font-semibold">{{ item.label }}</span>
                </a>
            </router-link>
        </template>
      </Breadcrumb>
</template>
  
<style scoped>

</style>