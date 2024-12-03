<script setup>
import { ref, onMounted, reactive } from "vue";
import Header from "@/components/Header.vue";
import { useRoute, useRouter } from "vue-router";
import { useBoardStore } from "@/stores/BoardStore";
import { useCollabStore } from "@/stores/CollabStore";
import { useUserStore } from "@/stores/UserStore";
import { useToast } from "primevue/usetoast";
import {
  handleAuthenticationClearAndRedirect,
  handleResponseStatus,
} from "../libs/libsUtil.js";
const router = useRouter();
const route = useRoute();
const boardId = route.params.id;
const collabStore = useCollabStore();
const boardStore = useBoardStore();
const userStore = useUserStore();
const boardName = ref("");
const collabStatus = ref("");
const toast = useToast();
const dontHasInvitation = ref(false);

const currentCollaborator = reactive({
  accessRight: null,
  name: "",
  status: "",
});

const currentOwner = reactive({
  oid: null,
  name: "",
  username: "",
});

const invitationRes = reactive({
  accessRight: "",
});

const confirmInvitation = async () => {
  collabStatus.value = "ACTIVE";
  const res = await collabStore.verifyCollab(boardId, collabStatus.value);

  if (res.status === 200) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Accept Invitation successfully!",
      life: 3000,
    });
    router.push({ name: "board-detail", params: { id: boardId } });
  } else if (res.status === 401) {
    handleAuthenticationClearAndRedirect();
  } else if (res.status === 403) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "You do not have permissions to change collaborator status.",
      life: 3000,
    });
    router.push({ name: "access-denied" });
  } else {
    handleResponseStatus(res.status);
  }
};

const declineInvitation = async () => {
  collabStatus.value = "Decline";
  const res = await collabStore.verifyCollab(boardId, collabStatus.value);
  if (res.status === 200) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Accept Invitation successfully!",
      life: 3000,
    });
    router.push({ name: "board" });
  } else if (res.status === 401) {
    handleAuthenticationClearAndRedirect();
  } else if (res.status === 403) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "You do not have permissions to change collaborator status.",
      life: 3000,
    });
    router.push({ name: "access-denied" });
  } else {
    handleResponseStatus(res.status);
  }
};

onMounted(async () => {
  const invitationRes = await collabStore.getInvitaionStatus(boardId);
  const data = await invitationRes.json();
  if (!invitationRes.ok || data.invitationStatus === "ACTIVE") {
    dontHasInvitation.value = true;
    return;
  }
  const fetchedBoard = await boardStore.loadBoardById(boardId);
  await collabStore.loadCollab(boardId);
  boardStore.setCurrentBoard(fetchedBoard);

  boardName.value = fetchedBoard.name;
  const userOid = userStore.getUser.oid; // Adjust according to actual user oid getter
  const collaborator = collabStore.getCollaborators.find(
    (collab) => collab.oid === userOid
  );
  // const ownerBoard = userStore.getUser.find(ownerBoard => ownerBoard.oid === fetchedBoard.owner.oid) ;

  if (collaborator) {
    currentCollaborator.accessRight = collaborator.accessRight;
    currentCollaborator.name = collaborator.name;
    currentCollaborator.status = collaborator.status;
  } else {
    console.log("Collaborator not found for current user.");
  }

  if (fetchedBoard) {
    currentOwner.oid = fetchedBoard.owner.oid;
    currentOwner.name = fetchedBoard.owner.name;
    currentOwner.username = fetchedBoard.owner.username;
  }

  console.log(currentCollaborator);
});

function extractShortName(fullName) {
  const words = fullName.split(" ");
  if (words.length < 2) return null; // Ensure there's a second word
  return words[1].substring(0, 3).toUpperCase();
}

function extractCollabFullName(fullName) {
  const words = fullName.split(" ");
  if (words.length < 1) return null; // Ensure there's a first word
  return words[0].substring(0, 3).toUpperCase();
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bgLightBlue">
    <!-- Header -->
    <Header />

    <!-- Main Content Wrapper -->
    <div
      class="flex-grow flex items-center justify-center px-4 sm:px-8 lg:px-12"
      v-if="!dontHasInvitation"
    >
      <div
        class="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 text-center space-y-6"
      >
        <!-- Invite Icons -->
        <div class="flex items-center justify-center space-x-4">
          <div
            class="bg-[#CCDDEE] w-20 h-20 sm:w-24 sm:h-24 rounded-full flex justify-center items-center"
          >
            <span class="text-black font-bold text-xl sm:text-2xl">{{
              extractShortName(currentOwner.name)
            }}</span>
          </div>
          <span class="text-black text-2xl sm:text-3xl font-bold">+</span>
          <div
            class="bg-[#D9D9D9] w-20 h-20 sm:w-24 sm:h-24 rounded-full flex justify-center items-center"
          >
            <span class="text-black font-bold text-xl sm:text-2xl">{{
              extractCollabFullName(currentCollaborator.name)
            }}</span>
          </div>
        </div>

        <!-- Invitation Text -->
        
        <div class="text-gray-800">
          <p class="text-base sm:text-lg whitespace-pre-wrap">
            <span class="font-bold">{{ currentOwner.username }}</span>
            has invited you to collaborate with
            <span class="text-blue font-bold">{{
              currentCollaborator.accessRight
            }}</span>
            access on the
            <span class="font-bold">{{ boardName }}</span>
            personal board
          </p>
        </div>

        <!-- Buttons -->
        <div
          class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center"
        >
          <button
            class="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none"
            @click="confirmInvitation(boardId, collabStatus.value)"
          >
            Accept Invitation
          </button>
          <button
            class="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 focus:outline-none"
            @click="declineInvitation(boardId, collabStatus.value)"
          >
            Decline
          </button>
        </div>
      </div>
    </div>

    <!-- Empty Invitation Message -->
    <div
      class="flex-grow flex items-center justify-center px-4 sm:px-8 lg:px-12"
      v-if="dontHasInvitation"
    >
      <div class="text-center space-y-4 max-w-md p-4">
        <img
          src="/image 9.png"
          alt="Not Found Image"
          class="mx-auto w-64 sm:w-72 lg:w-80 h-48 sm:h-56 lg:h-64"
        />
        <div class="font-bold text-sm sm:text-lg text-black mt-4">
          Sorry, we couldn't find the invitation to this board.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
