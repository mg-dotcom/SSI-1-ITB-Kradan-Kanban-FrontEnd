<script setup>
import { onMounted, ref } from "vue";
import submitButton from "@/components/button/Button.vue";
import { useBoardStore } from "@/stores/BoardStore";
import { useUserStore } from "@/stores/UserStore";
import { onClickOutside } from "@vueuse/core";
import router from "@/router/page";

const emojiPicker = ref(null);
const boardStore = useBoardStore();

const toggleInputEmoji = () => {
  isEmojiPickerVisible.value = !isEmojiPickerVisible.value;
};

const userStore = useUserStore();

onMounted(async () => {
  await boardStore.loadBoards();

  boardTemplate.value.name = `${userStore.getUser.name}  personal board`;
  boardTemplate.value.emoji = "🙂";
  boardTemplate.value.color = "#DEDEDE";
});

const boardTemplate = ref({
  name: "",
  emoji: "",
  color: "",
});

const isEmojiPickerVisible = ref(false);

const selectEmoji = (emoji) => {
  boardTemplate.value.emoji = emoji.i;
  isEmojiPickerVisible.value = false;
};

const saveBoard = async () => {
  const res = await boardStore.addBoard(boardTemplate.value);

  if (res.status === 201) {
    router.push({ name: "board" });
  } else if (res.status === 401) {
    userStore.logout();
    router.push({ name: "login" });
  }
};

onClickOutside(emojiPicker, () => {
  isEmojiPickerVisible.value = false;
});
</script>

<template>
  <!-- Modal Add Board -->

  <div class="fixed inset-0 flex items-center justify-center z-10">
    <div class="absolute inset-0 bg-black opacity-50"></div>
    <div
      class="relative itbkk-board-modal max-w-2xl w-[600px] bg-white rounded-lg shadow-xl"
    >
      <h2 class="text-2xl font-bold p-4">New Board</h2>
      <hr />
      <div class="flex flex-row items-center p-7">
        <!-- Preview Board Status -->
        <div
          class="preview-board-status w-[28%] h-32 rounded-md mr-8 flex justify-center items-center border-2 border-solid border-gray-300"
          :style="{ backgroundColor: boardTemplate.color }"
        >
          <div class="text-4xl text-white" @click="">
            {{ boardTemplate.emoji }}
          </div>
        </div>

        <!-- Form Inputs -->
        <div class="flex flex-col flex-grow">
          <div class="flex flex-row mb-2">
            <!-- Color Input -->
            <div class="w-1/2 mr-4">
              <label for="color" class="block text-gray-700 font-bold mb-2"
                >Color</label
              >
              <input
                v-model.trim="boardTemplate.color"
                type="color"
                id="color"
                class="w-full border rounded-md px-3 h-10"
              />
            </div>
            <!-- Emoji Input -->
            <div class="w-1/2 relative">
              <label for="emoji" class="block text-gray-700 font-bold mb-2"
                >Emoji</label
              >
              <input
                @click="toggleInputEmoji"
                v-model="boardTemplate.emoji"
                placeholder="Enter emoji"
                type="text"
                id="emoji"
                class="w-full border rounded-md px-3 py-2 h-10"
              />
              <EmojiPicker
                v-if="isEmojiPickerVisible"
                ref="emojiPicker"
                class="absolute"
                :native="true"
                @select="selectEmoji"
              />
            </div>
          </div>
          <!-- Name Input -->
          <label for="name" class="block text-gray-700 font-bold mb-2"
            >Name</label
          >
          <input
            v-model.trim="boardTemplate.name"
            type="text"
            id="name"
            class="itbkk-board-name w-full border rounded-md px-3 py-2 h-10"
            placeholder="Enter board name"
          />
        </div>
      </div>
      <hr />
      <div class="flex justify-end p-4">
        <form method="dialog">
          <submitButton
            buttonType="cancel"
            class="itbkk-button-cancel"
            @click="router.push({ name: 'board' })"
            >Cancel</submitButton
          >
          <submitButton
            buttonType="ok"
            class="itbkk-button-ok"
            @click="saveBoard"
            >Save</submitButton
          >
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
