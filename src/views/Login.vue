<script setup>
import GradientLoginBg from "@/components/gradientLoginBg.vue";
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/UserStore";

const userStore = useUserStore();
const isError = ref(false);
const username = ref("");
const password = ref("");
const errorMessage = ref("");

const isUsernameValid = computed(
  () => username.value.length > 0 && username.value.length <= 50
);
const isPasswordValid = computed(
  () => password.value.length > 0 && password.value.length <= 14
);
const isFormValid = computed(
  () => isUsernameValid.value && isPasswordValid.value
);

const signIn = async () => {
  // console.log(isFormValid.value);
  
  if (isFormValid.value) {
    isError.value = true;
    console.log(isError.value);
    errorMessage.value =
      "Invalid input. Please check your username and password.";
    return;
  }

  try {
    await userStore.login({
      username: username.value,
      password: password.value,
    });
  } catch (error) {
    if (error.response && error.response.status === 400) {
      isError.value = true;
      errorMessage.value = "Incorrect username or password.";
    } else {
      console.error(error);
    }
  }
};
// console.log(isError.value);

</script>

<template>
  <div class="flex h-screen font-nunito items-center overflow-hidden">
    <GradientLoginBg />
    <div
      class="flex flex-col animated-background bg-gradient-to-r from-blue via-blue-500 to-sky-300 p-8 w-[50vw] h-full box-border"
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
            <label
              class="block text-sm font-medium text-gray-700"
              >Username</label
            >
            <input
              type="text"
              v-model="username"
              maxlength="50"
              class="itbkk-username mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <input
              type="password"
              v-model="password"
              maxlength="14"
              class="itbkk-password mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            />
          </div>
          <div
            class="flex gap-2 py-3 px-4 bg-rose-200 rounded popup"
            v-show="isError"
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
              :class="{'disabled': !isFormValid, 'opacity-50 cursor-not-allowed': !isFormValid}"
              @click="signIn"
            >
              Sign In
            </button>
          </div>
          <div v-if="isError" class="error-message">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
