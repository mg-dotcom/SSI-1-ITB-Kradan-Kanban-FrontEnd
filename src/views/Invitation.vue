<script setup>
import Header from '@/components/Header.vue'
import { useRoute,useRouter } from 'vue-router'

const router = useRouter();
const route = useRoute()
const boardId = route.params.id;
</script>

<template>
    <div class="min-h-screen flex flex-col bg-bgLightBlue">
        <!-- Header -->
        <Header />
        <!-- Main Content Wrapper -->
        <div class="flex-grow flex items-center justify-center" v-if="true">
            <div
                class="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 text-center space-y-6"
            >
                <!-- Invite Icons -->
                <div class="flex items-center justify-center space-x-4">
                    <div
                        class="bg-[#CCDDEE] w-24 h-24 rounded-full flex justify-center items-center"
                    >
                        <span class="text-black font-bold text-2xl">SAN</span>
                    </div>
                    <span class="text-black text-3xl font-bold">+</span>
                    <div
                        class="bg-[#D9D9D9] w-24 h-24 rounded-full flex justify-center items-center"
                    >
                        <span class="text-black font-bold text-2xl">OLA</span>
                    </div>
                </div>

                <!-- Invitation Text -->
                <div class="text-gray-800">
                    <p class="font-semibold text-lg">
                        <span class="font-bold">“itbkk.sanit”</span> has invited
                        you to collaborate
                    </p>
                    <p>
                        with
                        <span class="text-blue font-bold">READ</span> access on
                        the
                        <span class="font-bold">ITBKK OLARN personal board</span>
                    </p>
                </div>

                <!-- Buttons -->
                <div class="flex space-x-4 justify-center">
                    <button
                        class="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none"
                    >
                        Accept Invitation
                    </button>
                    <button
                        class="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 focus:outline-none"
                        @click="router.push({ name: 'board-detail',id: boardId })"
                        >
                        Decline
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty Invitation Message -->
        <div class="flex-grow flex items-center justify-center" v-if="false">
            <div class="text-center space-y-4 max-w-md p-4">
                <img src="/public/image 9.png" alt="Not Found Image" class="mx-auto w-72 h-56" />
                <div class="font-bold text-lg text-black mt-4">
                    Sorry, we couldn't find the invitation to this board.
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
