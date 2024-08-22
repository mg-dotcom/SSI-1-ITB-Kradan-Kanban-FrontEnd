<script setup>
import { useUserStore } from '@/stores/UserStore'
import { useRouter, RouterView } from "vue-router";
import { ref } from 'vue';

const router = useRouter();
const userStore = useUserStore()
console.log('hi')

const userData=ref(userStore.user)
console.log(userData.value.name);

const logout=()=>{
    userStore.logout();
    router.push({ name: "login" });
}

</script>

<template>
    <Toast class="itbkk-message" />
    <div
        class="header max-w-full h-[90px] bg-gradient-to-r from-blue to-lightblue"
    >
        <img
            class="object-cover absolute left-10 max-w-max h-[90px]"
            src="/glass-overlay.png"
            alt=""
        />
        <div class="h-[90px] flex p-10 justify-between items-center">
            <h1 class="text-header text-white font-bold">
                IT-Bangmod Kradan kanban
            </h1>
            <div class="flex items-center gap-2">
                <div
                    class="flex bg-white bg-opacity-45 w-1/7 rounded-full items-center justify-between px-2 py-1"
                >
                    <div class="avatar">
                        <div class="w-10 rounded-full mr-4">
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            />
                        </div>
                    </div>
                    <div class="itbkk-fullname text-black font-bold">
                        {{ userData.name }}
                    </div>
                </div>
                <div>
                    <button class="logout-button" @click="logout">
                        <img
                            src="../assets/logoutIcon.svg"
                            alt="logout ja bitch"
                            class="w-8"
                        />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
