<script setup>
import Header from '@/components/Header.vue'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
    <div class="min-h-screen flex flex-col bg-bgLightBlue">
        <!-- Header -->
        <Header />
        <!-- Main Content Wrapper -->
        <div class="flex-grow flex items-center justify-center" v-if="false">
            <div class="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 text-center space-y-6">
                <!-- Invite Icons -->
                <div class="flex items-center justify-center space-x-4">
                    <div class="bg-[#CCDDEE] w-24 h-24 rounded-full flex justify-center items-center">
                        <span class="text-black font-bold text-2xl">SAN</span>
                    </div>
                    <span class="text-black text-3xl font-bold">+</span>
                    <div class="bg-[#D9D9D9] w-24 h-24 rounded-full flex justify-center items-center">
                        <span class="text-black font-bold text-2xl">OLA</span>
                    </div>
                </div>

                <!-- Invitation Text -->
                <div class="text-gray-800">
                    <p class="font-semibold text-lg">
                        <span class="font-bold">“itbkk.sanit”</span> has invited you to collaborate
                    </p>
                    <p>
                        with <span class="text-blue font-bold">READ</span> access on the
                        <span class="font-bold">ITBKK OLARN personal board</span>
                    </p>
                </div>

                <!-- Buttons -->
                <div class="flex space-x-4 justify-center">
                    <button class="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none">
                        Accept Invitation
                    </button>
                    <button class="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 focus:outline-none">
                        Decline
                    </button>
                </div>
            </div>
        </div>
        <div class="empty-invitation flex flex-col" v-if="true">
            <div><img src="/public/image 9.png" alt=""></div>
            <div class="font-semibold text-lg text-black">Sorry, we couldn't find the invitation to this board.</div>
        </div>
        
    </div>
</template>

<style scoped>

</style>
