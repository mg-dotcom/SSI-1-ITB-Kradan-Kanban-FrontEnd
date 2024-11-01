<script setup>
import Header from "@/components/Header.vue";
import { RouterView } from "vue-router";
import NavigateTitle from "@/components/navigateTitle.vue";
import { useRoute } from "vue-router";
import submitButton from "@/components/button/Button.vue";
import ConfirmModal from "@/components/confirmModal/ConfirmModal.vue";
import { useBoardStore } from "@/stores/BoardStore";
import { computed, onMounted, ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useUserStore } from "@/stores/UserStore";
import router from "@/router/page";
import { handleAuthenticationClearAndRedirect } from "@/libs/libsUtil";
import { useToast } from "primevue/usetoast";
import { useCollabStore } from "@/stores/CollabStore";

const route = useRoute();
const boardStore = useBoardStore();
const collabStore = useCollabStore();
const userStore = useUserStore();
const toast = useToast();
const collabBoardName = ref("");
const isEmojiPickerVisible = ref(false);
const selectedCollabOid = ref("");
const emojiPicker = ref(null);
const selectedBoardId = ref("");

onClickOutside(emojiPicker, () => {
  isEmojiPickerVisible.value = false;
});

const leaveCollabModal = ref(false);

const handleLeaveCollab = (collabBoardId, collabOid) => {
  const collabBoard = boardStore
    .getCollabBoard()
    .find((collab) => collab.boardId === collabBoardId);
  selectedBoardId.value = collabBoard.boardId;
  selectedCollabOid.value = collabOid;
  collabBoardName.value = collabBoard.boardName;
  leaveCollabModal.value = true;
};

const confirmLeaveCollab = async () => {
  const res = await collabStore.leaveCollab(
    selectedBoardId.value,
    selectedCollabOid.value
  );

  if (res.status === 200 || res.status === 403 || res.status === 404) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "You have left the board.",
      life: 3000,
    });
    router.push({ name: "board" });
  } else if (res.status === 401) {
    handleAuthenticationClearAndRedirect();
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "There is a problem. Please try again later.",
      life: 3000,
    });
  }

  leaveCollabModal.value = false;
};
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
            v-for="(board, index) in boardStore.getPersonalBoard()"
            :key="index"
            @click="
              router.push({ name: 'board-task', params: { id: board.id } }),
                boardStore.setCurrentBoard(board)
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
              v-if="boardStore.getCollabBoard().length <= 0"
              class="empty-collab-board bg-white w-80 h-28 flex items-center justify-center rounded-md border border-solid border-gray-300"
            >
              <div class="text-center">
                <p class="text-xl font-semibold text-gray-400">
                  No Collaborative Boards Found
                </p>
                <p class="text-sm text-gray-400">
                  You don't have any collaborative boards yet.
                </p>
              </div>
            </div>

            <div
              class="itbkk-collab-item w-80 h-28 flex justify-between p-2 bg-white rounded-md border border-solid border-gray-300 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer hover:border-gray-400 hover:shadow-md"
              v-for="(collab, index) in boardStore.getCollabBoard()"
              :key="index"
              @click="
                router.push({
                  name: 'board-task',
                  params: { id: collab.boardId },
                })
              "
            >
              <div class="flex gap-x-5">
                <div
                  class="w-32 h-full rounded-md flex items-center justify-center"
                  :style="{ backgroundColor: collab.color }"
                >
                  <div class="text-2xl text-white">
                    {{ collab.emoji }}
                  </div>
                </div>
                <div class="flex flex-col justify-between">
                  <div>
                    <h3
                      class="itbkk-board-name text-lg font-semibold leading-tight"
                    >
                      {{ collab.boardName }}
                    </h3>
                    <div class="flex items-center">
                      <p
                        class="itbkk-access-right text-[11px] text-gray-500 font-semibold"
                      >
                        Access Right :
                        <span
                          :class="{
                            'text-[#0096FF] font-semibold':
                              collab.accessRight === 'READ',
                            'text-green-500 font-semibold':
                              collab.accessRight === 'WRITE',
                          }"
                          >{{ collab.accessRight }}</span
                        >
                      </p>
                    </div>
                  </div>

                  <div class="flex justify-between">
                    <p class="itbkk-owner-name text-sm text-gray-500">
                      {{ collab.ownerName }}
                    </p>

                    <button
                      class="itbkk-leave-board bg-red-500 hover:bg-red-600 rounded-md transition-colors px-2 active:scale-[93%] active:transition-transform text-white text-xs font-bold"
                      @click.stop="
                        handleLeaveCollab(collab.boardId, collab.oid)
                      "
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
  <ConfirmModal v-if="leaveCollabModal">
    <template #title>
      <p>Remove Collaborator</p>
    </template>
    <template #question>
      <div>Do you want to leave "{{ collabBoardName }}" board?</div>
    </template>
    <template #button-left>
      <submitButton
        buttonType="cancel"
        class="itbkk-button-cancel"
        @click="leaveCollabModal = false"
        >Cancel</submitButton
      >
    </template>
    <template #button-right>
      <submitButton
        buttonType="delete"
        class="itbkk-button-confirm"
        @click="confirmLeaveCollab"
        >Remove</submitButton
      >
    </template>
  </ConfirmModal>
</template>
<style scoped></style>
