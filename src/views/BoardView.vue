<script setup>
import Header from "@/components/Header.vue";
import { RouterView } from "vue-router";
import NavigateTitle from "@/components/navigateTitle.vue";
import { useBoardStore } from "@/stores/BoardStore";
import { computed, onMounted, ref } from "vue";
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

const collab = ref({
  boardId: "",
  accessRight: "Write",
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
        <div class="itbkk-personal-board text-2xl font-bold text-blue">
          Personal Boards
        </div>

        <div class="grid grid-cols-4 gap-32 p-7 pb-20 personal-board">
          <div
            class="itbkk-button-create w-80 h-28 border-dashed border-[4px] border-[#e0dfdf] rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer hover:border-gray-400 group hover:bg-[#ffffff] flex items-center justify-center hover:shadow-md"
            @click="router.push({ name: 'board-add' })"
          >
            <div class="flex justify-center items-center h-28">
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
            class="itbkk-personal-item w-80 h-28 flex justify-between p-2 bg-white rounded-md border border-solid border-gray-300 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer hover:border-gray-400 hover:shadow-md"
            v-for="(board, index) in boardStore.getBoards"
            :key="index"
            @click="
              router.push({ name: 'board-task', params: { id: board.id } })
            "
          >
            <div class="flex gap-x-5">
              <div
                class="w-32 h-full rounded-md flex items-center justify-center"
                :style="{ backgroundColor: board.color }"
              >
                <div class="text-2xl text-white">
                  {{ board.emoji }}
                </div>
              </div>
              <div class="flex flex-col justify-between">
                <div>
                  <h3
                    class="itbkk-board-name text-lg font-semibold leading-tight"
                  >
                    {{ board.name }}
                  </h3>
                  <div class="flex items-center">
                    <img
                      v-if="board.visibility === 'PRIVATE'"
                      class="w-4 h-4 mr-0.5"
                      src="../assets/privateIcon.svg"
                      alt="private icon"
                    />
                    <img
                      v-else
                      class="w-4 h-4 mr-1"
                      src="../assets/publicIcon.svg"
                      alt="public icon"
                    />
                    <p
                      class="itbkk-board-visibility text-[11px] text-gray-500 font-semibold"
                    >
                      {{ board.visibility }}
                    </p>
                  </div>
                </div>

                <p class="itbkk-owner-name text-sm text-gray-500">
                  {{ userStore.getUser.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="collab-board">
          <div class="itbkk-collab-board text-2xl font-bold text-blue">
            Collab Boards
          </div>
          <div class="grid grid-cols-4 gap-32 p-7 pb-20">
            <div
              class="itbkk-collab-item w-80 h-28 flex justify-between p-2 bg-white rounded-md border border-solid border-gray-300 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer hover:border-gray-400 hover:shadow-md"
              v-for="(board, index) in boardStore.getBoards"
              :key="index"
              @click="
                router.push({ name: 'board-task', params: { id: board.id } })
              "
            >
              <div class="flex gap-x-5">
                <div
                  class="w-32 h-full rounded-md flex items-center justify-center"
                  :style="{ backgroundColor: board.color }"
                >
                  <div class="text-2xl text-white">
                    {{ board.emoji }}
                  </div>
                </div>
                <div class="flex flex-col justify-between">
                  <div>
                    <h3
                      class="itbkk-board-name text-lg font-semibold leading-tight"
                    >
                      {{ board.name }}
                    </h3>
                    <div class="flex items-center">
                      <p
                        class="itbkk-access-right text-[11px] text-gray-500 font-semibold"
                      >
                        Access Right :
                        <span
                          :class="{
                            'text-[#0096FF] font-semibold':
                              collab.accessRight === 'Read',
                            'text-green-500 font-semibold':
                              collab.accessRight === 'Write',
                          }"
                          >{{ collab.accessRight }}</span
                        >
                      </p>
                    </div>
                  </div>

                  <div class="flex justify-between">
                    <p class="itbkk-owner-name text-sm text-gray-500">
                      {{ userStore.getUser.name }}
                    </p>

                    <button
                      class="itbkk-leave-board bg-red-500 hover:bg-red-600 rounded-md transition-colors px-2 active:scale-[93%] active:transition-transform text-white text-xs font-bold"
                      @click.stop="leaveBoard(board.id)"
                    >
                      LEAVE
                    </button>
                  </div>
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
