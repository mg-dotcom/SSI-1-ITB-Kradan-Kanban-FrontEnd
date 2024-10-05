<template>
  <div
    ref="mySlot"
    class="itbkk-button-home font-bold flex items-center text-blue xl:text-2xl lg:text-3xl md:text-2xl sm:text-lg md-vertical:px-3 mobile:px-0"
    :class="{
      'pt-6': props.currentPage === 'board-task',
    }"
  >
    <a
      class="relative after:bg-blue after:absolute after:h-[3px] after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
      :class="{ 'opacity-65': props.currentPage === 'board-status' }"
      @click="handleHomeClick"
    >
      <slot name="navigate-home"></slot>
    </a>
    <div class="flex" v-show="props.currentPage === 'board-status'">
      <div class="px-2">></div>
      <div class="itbkk-button-next cursor-pointer" @click="handleNextClick">
        <slot name="navigate-next"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const mySlot = ref(null);
const router = useRouter();

const props = defineProps({
  currentPage: String,
});

const handleHomeClick = () => {
  const homeSlotElement = mySlot.value?.querySelector("a");

  const homeContent = homeSlotElement.textContent
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  navigate(homeContent);
};

const handleNextClick = () => {
  const nextSlotElement = mySlot.value?.querySelector(".itbkk-button-next");

  if (!nextSlotElement) {
    console.error("Next slot element not found");
    return;
  }

  const nextContent = nextSlotElement.textContent
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  navigate(nextContent);
};

const navigate = (content) => {
  const routes = {
    home: "board-task",
    "task-status": "board-status",
    "board-list": "board-status",
  };


  const routeName = routes[content] || "home";

  router.push({ name: routeName });
};
</script>
