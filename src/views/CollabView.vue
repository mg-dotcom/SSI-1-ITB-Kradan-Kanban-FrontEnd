<script setup>
import { RouterView } from "vue-router";
import Header from "@/components/Header.vue";
import NavigateTitle from "@/components/navigateTitle.vue";
import { useRoute } from "vue-router";
import AddCollab from "@/components/confirmModal/AddCollab.vue";
import { ref, computed, watch, onMounted } from "vue";
import ConfirmModal from "@/components/confirmModal/ConfirmModal.vue";
import SubmitButton from "@/components/button/Button.vue";
import { useBoardStore } from "@/stores/BoardStore";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "@/stores/UserStore";

const boardStore = useBoardStore();
const route = useRoute();
const boardId = route.params.id;
const openAddCollabModal = ref(false);
const openRemoveCollabModal = ref(false);
const changeAcessRightModal = ref(false);
const newAccessRight = ref("");
const oldAccessRight = ref("");
const name = ref("");
const userStore = useUserStore();

onMounted(async () => {
  await boardStore.loadCollab(boardId);
});

const isOwner = computed(() => {
  return boardStore.getBoards.owner.oid === userStore.getUser.oid;
});

const removeCollab = async () => {
  console.log("Remove collaborator");
  openRemoveCollabModal.value = false;
};

const handleAccessRightChange = (collabOid) => {
  const updatedCollaborator = boardStore.getCollaborators.find(
    (c) => c.oid === collabOid
  );
  name.value = updatedCollaborator.name;
  newAccessRight.value = updatedCollaborator.accessRight;

  changeAcessRightModal.value = true;
};

const handleCancleAccessRightChange = () => {
  const updatedCollaborator = boardStore.getCollaborators.find(
    (c) => c.name === name.value
  );
  updatedCollaborator.accessRight = oldAccessRight.value;
  changeAcessRightModal.value = false;
};

const confirmChangeAccessRight = () => {
  // await boardStore.updateAccessRight(boardId, collabId, accessRight.value);

  changeAcessRightModal.value = false;

  // if (res.status === 200) {
  //   showToast(
  //     "success",
  //     "Success",
  //     `Access right changed to ${accessRight.value}!`
  //   );
  //   changeAcessRightModal.value = false;
  // } else if (res.status === 401) {
  //   showToast(
  //     "error",
  //     "Error",
  //     "You must be logged in to perform this action."
  //   );
  // } else if (res.status === 403) {
  //   showToast(
  //     "error",
  //     "Error",
  //     "You do not have permission to change collaborator access right."
  //   );
  // } else {
  //   showToast("error", "Error", "There is a problem. Please try again later.");
  // }
};

watch(
  () => boardStore.getCollaborators.map((c) => c.accessRight).join(" "), // Join access rights into a string
  (newVal, oldVal) => {
    oldAccessRight.value = oldVal;
  }
);
</script>

<template>
  <RouterView />
  <div class="h-screen w-full bg-bgLightBlue">
    <Header />
    <div
      class="table-auto xl:px-24 lg:px-10 sm:px-10 px-6 py-6 z-10 md-vertical:px-9 mobile:px-5 overflow-hidden"
    >
      <div class="flex justify-center text-black text-2xl font-semibold">
        Collaborator Management
      </div>
      <div
        class="flex justify-between mobile:px-0 py-6 md-vertical:flex-row mobile:flex-col gap-3"
      >
        <NavigateTitle :boardId="boardId" />
        <div>
          <button
            class="itbkk-button-next bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
            @click="openAddCollabModal = true"
          >
            Add Collaborator
          </button>
        </div>
      </div>
      <div class="-my-2 mb-8 sm:-mx">
        <div
          class="py-2 align-middle inline-block sm:px-6 lg:px-8 md-vertical:px-4 mobile:px-0 w-full"
        >
          <div
            class="shadow overflow-y-auto border-b border-gray-200 sm:rounded-lg"
          >
            <table class="w-full h-full md-vertical:table-fixed mobile:table">
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
                <tr v-if="false">
                  <td class="border text-center" colspan="4">
                    No collaborator found
                  </td>
                </tr>
                <tr
                  class="itbkk-item py-4"
                  v-for="(collab, index) in boardStore.getCollaborators"
                  :key="index"
                >
                  <td
                    class="text-center p-5 text-sm text-gray-600 border-b border-r border-gray-300 break-all"
                  >
                    {{ index + 1 }}
                  </td>
                  <td
                    class="itbkk-status-name md-vertical:px-3 mobile:p-0 text-sm text-gray-600 border-b border-r border-gray-300 break-all"
                  >
                    {{ collab.name }}
                  </td>
                  <td
                    class="itbkk-status-description text-sm border-b border-r border-gray-300 break-all"
                  >
                    {{ collab.email }}
                  </td>

                  <td
                    class="itbkk-status-description text-sm border-b border-r border-gray-300 break-all"
                  >
                    <label class="form-control w-full max-w-xs bg-white">
                      <select
                        class="select select-bordered bg-white border-b-2 font-bold text-black"
                        v-model="collab.accessRight"
                        :class="{ 'disabled cursor-not-allowed': !isOwner }"
                        :disabled="!isOwner"
                        @change="handleAccessRightChange(collab.oid)"
                      >
                        <option value="READ">READ</option>
                        <option value="WRITE">WRITE</option>
                      </select>
                    </label>
                  </td>
                  <td
                    class="itbkk-status-description text-sm border-b border-r border-gray-300 break-all"
                  >
                    <SubmitButton
                      buttonType="delete"
                      class="itbkk-button-confirm"
                      @click="openRemoveCollabModal = true"
                      >Remove</SubmitButton
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

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

    <ConfirmModal v-if="openRemoveCollabModal">
      <template #title>
        <p>Remove Collaborator</p>
      </template>
      <template #question>
        <div>Do you want to remove this collaborator from the board?</div>
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
          @click="removeCollab"
          >Remove</SubmitButton
        >
      </template>
    </ConfirmModal>
  </div>
</template>

<style scoped></style>
