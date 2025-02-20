<script setup>
import { RouterView } from "vue-router";
import Header from "@/components/Header.vue";
import NavigateTitle from "@/components/navigateTitle.vue";
import { useRoute } from "vue-router";
import AddCollab from "@/components/confirmModal/AddCollab.vue";
import { ref, computed, onMounted } from "vue";
import ConfirmModal from "@/components/confirmModal/ConfirmModal.vue";
import SubmitButton from "@/components/button/Button.vue";
import { useBoardStore } from "@/stores/BoardStore";
import { useCollabStore } from "@/stores/CollabStore";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "@/stores/UserStore";
import { handleAuthenticationClearAndRedirect } from "@/libs/libsUtil";
import buttonSubmit from "@/components/button/Button.vue";

const boardStore = useBoardStore();
const route = useRoute();
const boardId = route.params.id;
const openAddCollabModal = ref(false);
const openRemoveCollabModal = ref(false);
const openCancelPendingCollabModal = ref(false);
const changeAcessRightModal = ref(false);
const selectedCollabOid = ref("");
const newAccessRight = ref("");
const oldAccessRight = ref("");
const name = ref("");
const userStore = useUserStore();
const boardVisibility = ref(false);
const collabStore = useCollabStore();
const boardName = ref("");

const toast = useToast();

onMounted(async () => {
  const fetchedBoard = await boardStore.loadBoardById(boardId);
  await collabStore.loadCollab(boardId);
  boardStore.setCurrentBoard(fetchedBoard);

  boardName.value = fetchedBoard.name;
  boardVisibility.value = fetchedBoard.visibility === "PRIVATE" ? false : true;
});

const isOwner = computed(() => {
  const currentBoard = boardStore.getCurrentBoard;
  const currentUser = userStore.getUser;

  if (currentBoard?.owner && currentUser) {
    return currentBoard.owner.oid === currentUser.oid;
  }
  return false;
});

const handleAccessRightChange = (collabOid) => {
  const collab = collabStore.getCollaborators.find((c) => c.oid === collabOid);

  name.value = collab.name;
  newAccessRight.value = collab.accessRight;

  selectedCollabOid.value = collabOid;

  changeAcessRightModal.value = true;
};

const saveOriginalAccessRight = (collab) => {
  selectedCollabOid.value = collab.oid;
  oldAccessRight.value = collab.accessRight;
};

const handleCancleAccessRightChange = () => {
  const collab = collabStore.getCollaborators.find(
    (c) => c.oid === selectedCollabOid.value
  );
  collab.accessRight = oldAccessRight.value;
  changeAcessRightModal.value = false;
};

const confirmChangeAccessRight = async () => {
  const res = await collabStore.updateAccessRight(
    boardId,
    selectedCollabOid.value,
    newAccessRight.value
  );

  if (res.status === 200) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Collaborator access right changed successfully!",
      life: 3000,
    });
    changeAcessRightModal.value = false;
  } else if (res.status === 401) {
    handleAuthenticationClearAndRedirect();
  } else if (res.status === 403) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "You do not have permission to change collaborator access right.",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "There is a problem. Please try again later.",
      life: 3000,
    });
  }
};

const handleRemoveCollab = (collabOid) => {
  const collab = collabStore.getCollaborators.find((c) => c.oid === collabOid);
  name.value = collab.name;
  selectedCollabOid.value = collabOid;

  openRemoveCollabModal.value = true;
};

const handleCancelPendingCollab = (collabOid) => {
  const collab = collabStore.getCollaborators.find((c) => c.oid === collabOid);
  name.value = collab.name;
  selectedCollabOid.value = collabOid;
  openCancelPendingCollabModal.value = true;
};

const confirmRemoveCollab = async () => {
  const res = await collabStore.removeCollab(boardId, selectedCollabOid.value);

  if (res.status === 200) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Collaborator removed successfully!",
      life: 3000,
    });
    openCancelPendingCollabModal.value = false;
    openRemoveCollabModal.value = false;
  } else if (res.status === 401) {
    handleAuthenticationClearAndRedirect();
  } else if (res.status === 403) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "You do not have permission to remove collaborator.",
      life: 3000,
    });
  } else if (res.status === 404) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `${name.value} is not a collaborator.`,
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "There is a problem. Please try again later.",
      life: 3000,
    });
  }
};
const invitationUrl = ref(`${window.location.href}/invitations`);
console.log(invitationUrl.value);

const confirmAddCollab = async (email, accessRightValue) => {
  console.log("FROM confirmAddCollab : ", userStore.accessTokenMS);
  const res = await collabStore.addCollab(boardId, {
    email: email,
    accessRight: accessRightValue,
    url: invitationUrl.value,
  });
  if (res.status >= 200 && res.status <= 299) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Collaborator added successfully!",
      life: 3000,
    });
    openAddCollabModal.value = false;
    return;
  }
  if (res.status === 401) {
    handleAuthenticationClearAndRedirect();
  } else if (res.status === 403) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "You do not have permission to add board collaborator.",
      life: 3000,
    });
  } else if (res.status === 404) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "The user does not exist.",
      life: 3000,
    });
  } else if (res.status === 409) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "The user is already a collaborator of this board.",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "An error has occurred",
      life: 3000,
    });
    openAddCollabModal.value = false;
  }
};
</script>

<template>
  <RouterView />
  <div class="h-screen w-full bg-bgLightBlue">
    <Header />
    <div
      class="table-auto xl:px-24 lg:px-10 sm:px-10 px-6 py-6 z-10 md-vertical:px-9 mobile:px-5 overflow-hidden"
    >
      <div
        class="font-bold flex flex-col items-center justify-center text-black text-center xl:text-2xl lg:text-3xl md:text-2xl sm:text-lg md-vertical:px-3 mobile:px-0 py-5"
      >
        Collaborator Management
        <div class="itbkk-board-name text-lg font-medium mt-2 text-gray-700">
          {{ boardName }}
        </div>
      </div>

      <div
        class="flex justify-between mobile:px-0 py-4 md-vertical:flex-row mobile:flex-col mx-5"
      >
        <NavigateTitle :boardId="boardId" />

        <div class="flex gap">
          <div
            :class="{ tooltip: isPublic }"
            data-tip="You need to be board owner to perform this action."
          >
            <buttonSubmit
              class="itbkk-collaborator-add"
              data-tip="You need to be board owner to perform this action."
              button-type="add"
              :class="{
                'disabled cursor-not-allowed bg-gray-300 px-4 py-2 rounded-md   text-white hover:bg-gray-400 transition-colors active:scale-[93%] active:transition-transform ':
                  !isOwner,
                'tooltip tooltip-bottom hover:cursor-not-allowed': !isOwner,
              }"
              @click.prevent="isOwner ? (openAddCollabModal = true) : null"
              :disabled="!isOwner"
              >+ Add Collaborator</buttonSubmit
            >
          </div>
        </div>
      </div>
      <div class="-my-2 mb-8 sm:-mx">
        <div
          class="py-2 align-middle inline-block sm:px-6 lg:px-8 md-vertical:px-4 mobile:px-0 w-full"
        >
          <div class="table-tooltip relative">
            <table class="table">
              <thead class="bg-lightgray">
                <tr>
                  <th
                    class="w-[5%] px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    No
                  </th>
                  <th
                    class="w-1/6 px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    class="w-1/2 px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    class="w-1/5 px-6 py-3 bg-lightgray border-b border-r border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Access Right
                  </th>
                  <th
                    class="w-1/12 px-6 py-3 bg-lightgray border-b border-gray-300 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody class="bg-white">
                <tr v-if="collabStore.getCollaborators <= 0">
                  <td class="border text-center text-gray-800" colspan="5">
                    No collaborator found
                  </td>
                </tr>
                <tr
                  class="itbkk-item py-4"
                  v-for="(collab, index) in collabStore.getCollaborators"
                  :key="index"
                >
                  <td
                    class="text-center p-5 text-sm text-gray-600 border-b border-r border-gray-300 break-all"
                    :class="{ 'opacity-50': collab.status === 'PENDING' }"
                  >
                    {{ index + 1 }}
                  </td>
                  <td
                    class="itbkk-name md-vertical:px-3 mobile:p-0 text-sm text-gray-600 border-b border-r border-gray-300 break-all"
                    :class="{ 'opacity-50': collab.status === 'PENDING' }"
                  >
                    {{
                      collab.status === "PENDING"
                        ? collab.name + "(Pending)"
                        : collab.name
                    }}
                  </td>
                  <td
                    class="itbkk-email text-sm border-b border-r border-gray-300 break-all"
                    :class="{ 'opacity-50': collab.status === 'PENDING' }"
                  >
                    {{ collab.email }}
                  </td>

                  <td
                    class="itbkk-access-right text-sm border-b border-r border-gray-300 break-all"
                  >
                    <label class="form-control w-full max-w-xs bg-white">
                      <select
                        data-tip="You need to be board owner to perform this action."
                        class="select select-bordered bg-white border-b-2 font-bold text-black"
                        v-model="collab.accessRight"
                        :class="{
                          'disabled cursor-not-allowed': !isOwner,
                        }"
                        :disabled="!isOwner"
                        @focus="saveOriginalAccessRight(collab)"
                        @change="handleAccessRightChange(collab.oid)"
                      >
                        <option value="READ">READ</option>
                        <option value="WRITE">WRITE</option>
                      </select>
                    </label>
                  </td>

                  <td
                    class="itbkk-collab-remove text-sm border-b border-r border-gray-300 break-all"
                  >
                    <SubmitButton
                      :buttonType="isOwner ? 'delete' : 'disabled'"
                      data-tip="You need to be board owner to perform this action."
                      :class="{
                        'disabled cursor-not-allowed bg-gray-300 tooltip tooltip-bottom':
                          !isOwner,
                      }"
                      :disabled="!isOwner"
                      @click.prevent="
                        collab.status === 'PENDING'
                          ? handleCancelPendingCollab(collab.oid)
                          : handleRemoveCollab(collab.oid)
                      "
                      >{{
                        collab.status === "PENDING" ? "Cancel" : "Remove"
                      }}</SubmitButton
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <AddCollab
      v-if="openAddCollabModal"
      @closeAddCollab="openAddCollabModal = false"
      @addCollab="confirmAddCollab"
    ></AddCollab>

    <ConfirmModal v-if="changeAcessRightModal" class="itbkk-modal-alert">
      <template #title>
        <p>Change Access Right</p>
      </template>
      <template #question>
        <div class="itbkk-message">
          Do you want to change access right of "{{ name }}" to "{{
            newAccessRight
          }}"?
        </div>
      </template>
      <template #button-left>
        <SubmitButton
          buttonType="cancel"
          class="itbkk-button-cancel"
          @click="handleCancleAccessRightChange"
          >Cancel</SubmitButton
        >
      </template>
      <template #button-right>
        <SubmitButton
          buttonType="ok"
          class="itbkk-button-confirm"
          @click="confirmChangeAccessRight"
          >Confirm</SubmitButton
        >
      </template>
    </ConfirmModal>

    <ConfirmModal v-if="openRemoveCollabModal" class="itbkk-modal-alert">
      <template #title>
        <p>Remove Collaborator</p>
      </template>
      <template #question>
        <div class="itbkk-message">
          Do you want to remove "{{ name }}" from the board?
        </div>
      </template>
      <template #button-left>
        <SubmitButton
          buttonType="cancel"
          class="itbkk-button-cancel"
          @click="openRemoveCollabModal = false"
          >Cancel</SubmitButton
        >
      </template>
      <template #button-right>
        <SubmitButton
          buttonType="delete"
          class="itbkk-button-confirm"
          @click="confirmRemoveCollab"
          >Remove</SubmitButton
        >
      </template>
    </ConfirmModal>

    <ConfirmModal v-if="openCancelPendingCollabModal" class="itbkk-modal-alert">
      <template #title>
        <p>Cancel pending invitation</p>
      </template>
      <template #question>
        <div class="itbkk-message">
          Do you want to cancel invitation to "{{ name }}" ?
        </div>
      </template>
      <template #button-left>
        <SubmitButton
          buttonType="cancel"
          class="itbkk-button-cancel"
          @click="openCancelPendingCollabModal = false"
          >Cancel</SubmitButton
        >
      </template>
      <template #button-right>
        <SubmitButton
          buttonType="delete"
          class="itbkk-button-confirm"
          @click="confirmRemoveCollab"
          >Confirm</SubmitButton
        >
      </template>
    </ConfirmModal>
  </div>
</template>

<style scoped></style>
