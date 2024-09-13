<script setup>
import GradientLoginBg from "@/components/gradientLoginBg.vue";
import { ref, computed, watch } from "vue";
import { useUserStore } from "@/stores/UserStore";
import { useBoardStore } from "@/stores/BoardStore";
import { useRouter, RouterView } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const router = useRouter();
const userStore = useUserStore();
const boardStore = useBoardStore();
const isError = ref(false);
const username = ref("");
const password = ref("");

const isUsernameValid = computed(
  () => username.value.length > 0 && username.value.length <= 50
);
const isPasswordValid = computed(
  () => password.value.length > 0 && password.value.length <= 14
);
const isFormValid = computed(
  () => isUsernameValid.value && isPasswordValid.value
);

watch([username, password], () => {
  if (isError.value) {
    isError.value = false;
  }
});

const showPassword = ref(false);
const toggleShow = () => {
  showPassword.value = !showPassword.value;
};

const signIn = async () => {
  try {
    await userStore.login({
      username: username.value,
      password: password.value,
    });
    const user = userStore.getUser;
    await boardStore.loadBoards();
    const findBoardByUserOid = boardStore.findByOid(user.oid);
    if (findBoardByUserOid.length) {
      boardStore.setCurrentBoard(findBoardByUserOid[0]);
      router.push({
        name: "board-task",
        params: { id: findBoardByUserOid[0].id },
      });
    } else {
      router.push({ name: "board" });
    }
  } catch (error) {
    {
      isError.value = true;
    }
  }
};
</script>

<template>
  <div class="flex h-screen font-nunito items-center overflow-hidden">
    <GradientLoginBg class="h-screen" />
    <div
      class="flex flex-col animated-background bg-gradient-to-r from-blue via-blue-500 to-sky-300 p-8 w-[50vw] box-border ml-7 h-[93%] rounded-lg"
    >
      <div>
        <h2 class="text-4xl text-start font-bold text-white">
          School of Information <br />
          Technology.
        </h2>
      </div>
      <div class="flex justify-center flex-1">
        <img class="w-7/12" src="../assets/logInImg.svg" alt="" />
      </div>
      <div>
        <h2 class="text-2xl text-end font-bold text-white opacity-20">SSI-1</h2>
      </div>
    </div>

    <div
      class="w-full lg:w-1/2 flex items-center justify-center font-nunito h-screen"
    >
      <div class="max-w-md w-full p-6 scale-105">
        <h1 class="text-3xl font-bold mb-6 text-black text-center">
          Welcome to ITB-KK
        </h1>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Username</label
            >

            <input
              type="text"
              id="username"
              v-model="username"
              maxlength="50"
              class="itbkk-username mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-300"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <div
              class="flex mt-1 border rounded-md focus-within:ring-2 focus-within:ring-gray-300 focus-within:border-gray-300 transition-colors duration-300"
            >
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                id="password"
                maxlength="14"
                class="itbkk-password p-2 w-full z-0 rounded-l-md focus:outline-none transition-colors duration-300"
              />
              <div
                class="flex items-center justify-center px-4 cursor-pointer z-50 bg-white rounded-r-md"
                @click="toggleShow"
              >
                <FontAwesomeIcon
                  class="w-5"
                  :icon="
                    showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                  "
                />
              </div>
            </div>
          </div>

          <div
            class="flex gap-2 py-3 px-4 bg-rose-200 rounded popup"
            v-if="isError"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="#e65075"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="itbkk-message text-[#e65075] font-medium"
              >Username or Password is incorrect</span
            >
          </div>
          <div>
            <button
              :disabled="!isFormValid"
              class="itbkk-button-signin btn w-full bg-blue hover:bg-oceanblue text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              :class="{
                'disabled opacity-50 cursor-not-allowed': !isFormValid,
              }"
              @click="signIn"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
