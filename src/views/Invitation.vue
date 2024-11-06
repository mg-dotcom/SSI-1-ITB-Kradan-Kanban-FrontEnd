<script setup>
import Header from '@/components/Header.vue'
import { RouterView } from 'vue-router'
import NavigateTitle from '@/components/navigateTitle.vue'
import { useRoute } from "vue-router";

const route = useRoute();

const boardId = route.params.id;
</script>

<template>
    <RouterView />
    <div class="h-screen w-full bg-bgLightBlue">
        <Header />
        <NavigateTitle :boardId="boardId" />
    </div>
</template>

<style scoped></style>
