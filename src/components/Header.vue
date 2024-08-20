<script setup></script>

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
                    <div class="text-black font-bold">Somchai Jaidee</div>
                </div>
                <div>
                    <button class="">
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
