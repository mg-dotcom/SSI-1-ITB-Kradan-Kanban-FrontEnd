<script setup>
import GradientLoginBg from "@/components/gradientLoginBg.vue";
import { ref, computed, watch, onMounted } from "vue";
import { useUserStore } from "@/stores/UserStore";
import { useBoardStore } from "@/stores/BoardStore";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { CookieUtil } from "@/libs/CookieUtil";
const router = useRouter();
const userStore = useUserStore();
const boardStore = useBoardStore();
const isError = ref(false);
const username = ref("");
const password = ref("");

onMounted(async () => {
  await userStore.initializeMsal();
});

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
    CookieUtil.unset("authMethod");
  }
});

const showPassword = ref(false);
const toggleShow = () => {
  showPassword.value = !showPassword.value;
};

const handleBoardRedirection = async () => {
  await boardStore.loadBoards();

  const user = userStore.getUser;
  const boardByUserOid = boardStore.findPersonalBoardByOid(user.oid);
  const collabBoards = boardStore.getCollabBoard();

  if (userStore.getRedirectAfterLogin) {
    console.log(userStore.getRedirectAfterLogin);
    router.push({
      name: "board-invitation",
      params: { id: userStore.getRedirectAfterLogin },
    });
    return;
  }

  if (boardByUserOid.length === 1 && collabBoards.length === 0) {
    const currentBoard = boardByUserOid[0];
    boardStore.setCurrentBoard(currentBoard);
    router.push({ name: "board-task", params: { id: currentBoard.id } });
  } else {
    router.push({ name: "board" });
  }
};

const signIn = async () => {
  try {
    await userStore.login({
      username: username.value,
      password: password.value,
    });
    await handleBoardRedirection();
  } catch (error) {
    isError.value = true;
  }
};

const signInWithMicrosoft = async () => {
  try {
    await userStore.loginWithMicrosoft();
    await handleBoardRedirection();
  } catch (error) {
    isError.value = true;
  }
};
</script>

<template>
  <div class="flex flex-col lg:flex-row h-screen font-nunito items-center p-7">
    <!-- Left Section -->
    <GradientLoginBg class="h-screen lg:h-full lg:w-1/2" />
    <div
      class="flex flex-col animated-background bg-gradient-to-r from-blue via-blue-500 to-sky-300 p-8 md-vertical:w-[50vw] w-full box-border h-[93%] md-vertical:h-full rounded-lg hide-on-mobile"
    >
      <div>
        <h2 class="text-2xl lg:text-4xl text-start font-bold text-white">
          School of Information <br />
          Technology.
        </h2>
      </div>
      <div class="flex justify-center flex-1">
        <img
          class="w-8/12 lg:w-[55%]"
          src="../assets/logInImg.svg"
          alt="Login Image"
        />
      </div>
      <div>
        <h2
          class="text-sm lg:text-2xl text-end font-bold text-white opacity-20"
        >
          SSI-1
        </h2>
      </div>
    </div>

    <!-- Right Section -->
    <div class="w-full lg:w-1/2 flex items-center justify-center h-screen">
      <div class="max-w-md w-full p-6 scale-100 lg:scale-105">
        <h1 class="text-2xl lg:text-3xl font-bold mb-6 text-black text-center">
          Welcome to ITB-KK
        </h1>

        <div class="space-y-4">
          <!-- Username Input -->
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

          <!-- Password Input -->
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

          <!-- Error Message -->
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
            <span class="itbkk-message text-[#e65075] font-medium">
              Username or Password is incorrect
            </span>
          </div>

          <!-- Sign In Button -->
          <div>
            <button
              :disabled="!isFormValid"
              class="itbkk-button-signin btn w-full bg-blue hover:bg-oceanblue text-white font-bold px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              :class="{
                'disabled opacity-50 cursor-not-allowed': !isFormValid,
              }"
              @click="signIn"
            >
              Sign In
            </button>
          </div>

          <!-- Divider -->
          <div class="py-4">
            <div class="flex items-center justify-center">
              <div class="border-t border-gray-300 w-full"></div>
              <span class="text-gray-500 mx-3 font-semibold">OR</span>
              <div class="border-t border-gray-300 w-full"></div>
            </div>
          </div>

          <!-- Microsoft Sign In -->
          <div>
            <button
              class="itbkk-button-signin-microsoft-team btn w-full bg-white hover:bg-gray-100 text-gray-700 font-bold px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center gap-2"
              @click="signInWithMicrosoft"
            >
              <img src="/Microsoft_logo.png" alt="Microsoft Logo" class="w-5" />
              <span>Sign in with Microsoft</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 1023px) {
  .hide-on-mobile {
    display: none;
  }
}
</style>
