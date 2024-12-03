<script setup>
import ConfirmModal from "./ConfirmModal.vue";
import submitButton from "../button/Button.vue";
import { useBoardStore } from "@/stores/BoardStore";
import { ref, watch, computed } from "vue";
import { useUserStore } from "@/stores/UserStore";

defineEmits(["closeAddCollab", "addCollab"]);
const userStore = useUserStore();
const email = ref("");
const accessRight = ref("READ");

const ownerEmail = userStore.getUser.email;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateEmail = ref(false);
watch(email, (newEmail) => {
  if (!emailRegex.test(newEmail) || newEmail === ownerEmail) {
    validateEmail.value = false;
  } else {
    validateEmail.value = true;
  }
});

const boardStore = useBoardStore();

const isOwner = computed(() => {
  return boardStore.getBoards.owner.oid === userStore.getUser.oid;
});
</script>

<template>
  <ConfirmModal>
    <template #title>
      <p>Add Collaborator</p>
    </template>
    <template #question>
      <div class="flex gap-3">
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Collaborator E-mail</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            class="input input-bordered w-80 max-w-xs bg-white border-b-2 font-bold text-black"
            v-model.trim="email"
            maxlength="50"
          />
        </label>
        <label class="form-control w-full max-w-xs bg-white">
          <div class="label">
            <span class="label-text">Access Right</span>
          </div>
          <select
            class="select select-bordered bg-white border-b-2 font-bold text-black"
            v-model="accessRight"
            :class="{ 'disabled cursor-not-allowed': !isOwner }"
            :disabled="!isOwner"
          >
            <option>READ</option>
            <option>WRITE</option>
          </select>
        </label>
      </div>
    </template>
    <template #button-left>
      <submitButton
        buttonType="cancel"
        class="itbkk-button-cancel"
        @click="$emit('closeAddCollab')"
        >Cancel</submitButton
      >
    </template>
    <template #button-right>
      <submitButton
        class="itbkk-button-confirm"
        @click="$emit('addCollab', email, accessRight)"
        :disabled="!validateEmail"
        :class="
          !validateEmail
            ? 'disabled cursor-not-allowed bg-gray-400 px-4 py-2 rounded-md opacity-50  w-20  text-white hover:bg-gray-500 transition-colors active:scale-[93%] active:transition-transform'
            : 'group bg-[#03CC0B]  hover:shadow-md  font-bold duration-300 w-20 cursor-pointer active:scale-[93%] active:transition-transform text-white'
        "
        >Add</submitButton
      >
    </template>
  </ConfirmModal>
</template>

<style scoped></style>
