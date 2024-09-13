<script setup>
import Header from "@/components/Header.vue";
import { RouterView } from "vue-router";
import NavigateTitle from "@/components/navigateTitle.vue";
import { useBoardStore } from "@/stores/BoardStore";
import { onMounted, ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useUserStore } from "@/stores/UserStore";
import router from "@/router/page";

const boardStore = useBoardStore();
const userStore = useUserStore();

onMounted(async () => {
  await boardStore.loadBoards();
});

const isEmojiPickerVisible = ref(false);
const emojiPicker = ref(null);

onClickOutside(emojiPicker, () => {
  isEmojiPickerVisible.value = false;
});
</script>

<template>
  <RouterView />
  <div class="h-screen w-full bg-bgLightBlue flex flex-col">
    <!-- Header Component -->
    <Header />

    <!-- Content Section -->
    <div class="flex-grow overflow-auto">
      <div
        class="content h-full flex flex-col py-6 xl:px-24 lg:px-10 sm:px-10 px-6 z-10 md-vertical:px-9 mobile:px-5"
      >
        <NavigateTitle>
          <template #navigate-home> Board List </template>
        </NavigateTitle>
        <div class="flex p-7">
          <div class="grid grid-cols-4 gap-8">
            <div
              class="itbkk-button-create w-72 h-28 border-dashed border-[4px] border-[#e0dfdf] rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer hover:border-gray-400 group hover:bg-[#ffffff] flex items-center justify-center hover:shadow-md"
              @click="router.push({ name: 'board-add' })"
              v-if="boardStore.getBoards.length === 0"
            >
              <div class="flex justify-center items-center h-full">
                <div class="text-center">
                  <div class="flex justify-center items-center mb-2">
                    <img
                      src="../assets/addTaskIcon.svg"
                      alt="add-task-icon"
                      class="w-5 opacity-50 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
                    />
                  </div>
                  <div
                    class="text-[#D3D3D3] text-sm group-hover:text-gray-500 duration-200 ease-out"
                  >
                    Add Board
                  </div>
                </div>
              </div>
            </div>

            <!-- v-for="(board, index) in boards" -->
            <div
              class="w-72 h-28 flex items-center justify-between p-4 bg-white rounded-md border border-solid border-gray-300 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer hover:border-gray-400 hover:shadow-md"
              v-else="boardStore.getBoards.length > 0"
              v-for="(board, index) in boardStore.getBoards"
              :key="index"
            >
              <div class="flex gap-x-5">
                <div
                  class="w-32 h-20 rounded-md flex items-center justify-center"
                  :style="{ backgroundColor: board.color }"
                >
                  <div class="text-2xl text-white">
                    {{ board.emoji }}
                  </div>
                </div>
                <div class="flex flex-col justify-between">
                  <h3 class="text-lg font-semibold leading-tight">
                    {{ board.name }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{ userStore.getUser.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
