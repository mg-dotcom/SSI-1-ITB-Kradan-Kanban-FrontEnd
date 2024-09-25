<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()

const router = useRouter()

userStore.initialize()

// Ensure the store is initialized (retrieve user data from the cookie if available)

const logout = () => {
    userStore.logout()
    router.push({ name: 'login' })
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
            alt="nav bar"
        />
        <div class="h-[90px] flex p-10 justify-between items-center">
            <h1 class="text-header text-white font-bold">
                IT-Bangmod Kradan kanban
            </h1>
            <!-- profile -->
            <details  class="dropdown flex items-center">
                <summary 
                    class="flex bg-white bg-opacity-45 w-1/7 rounded-full items-center justify-between px-2 py-1 hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                    <div class="avatar">
                        <div class="w-8 rounded-full">
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            />
                        </div>
                    </div>
                    <div class="itbkk-fullname text-sky-950 font-semibold mx-2">
                        {{ userStore.getUser.name }}
                    </div>
                </summary>
                <!-- dropdown -->
                <ul
                    class="itbkk-sign-out menu dropdown-content bg-base-100 rounded-box z-[1] w-1/7 p-2 shadow"
                    @click="logout"
                >
                    <li><a>Sign out</a></li>
                </ul>
            </details>
        </div>
    </div>
</template>

<style scoped></style>
