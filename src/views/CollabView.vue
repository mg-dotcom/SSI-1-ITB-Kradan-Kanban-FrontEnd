<script setup>
import { RouterView } from "vue-router";
import Header from "@/components/Header.vue";
import NavigateTitle from "@/components/navigateTitle.vue";
import { useRoute } from "vue-router";
import AddCollab from "@/components/confirmModal/AddCollab.vue";
import { ref } from "vue";
import ConfirmModal from "@/components/confirmModal/ConfirmModal.vue";
import SubmitButton from "@/components/button/Button.vue";
import { useBoardStore } from "@/stores/BoardStore";
import { useToast } from "primevue/usetoast";

const boardStore = useBoardStore();
const toast = useToast();
const route = useRoute();
const boardId = route.params.id;
const openAddCollabModal = ref(false);
const openRemoveCollabModal = ref(false);
const accessRight = ref("READ");
const addConfirmModal = ref(false);
const oldAccessRight = ref("");
const newAccessRight = ref("");

const collaborators = ref([
  { id: 1, name: "John Doe", email: "john@example.com", access_right: "READ" },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    access_right: "WRITE",
  },
]);

const showToast = (severity, summary, detail) => {
  toast.add({
    severity,
    summary,
    detail,
    life: 3000,
  });
};

const addCollab = async (email, accessRightValue) => {
  const res = await boardStore.addCollab(boardId, {
    email: email,
    accessRight: accessRightValue,
  });

  if (res.status === 403) {
    showToast(
      "error",
      "Error",
      "You do not have permission to add board collaborator."
    );
  } else if (res.status === 404) {
    showToast("error", "Error", "The user does not exist.");
  } else if (res.status === 409) {
    showToast(
      "error",
      "Error",
      "The user is already a collaborator of this board."
    );
  } else {
    showToast("success", "Success", "Collaborator added successfully!");
  }
  openAddCollabModal.value = false;
};

const removeCollab = async () => {
  console.log("Remove collaborator");

  // const res = await boardStore.deleteCollab(boardId, collabId, collabName);
  // if (res.success) {
  //   showToast("success", "Success", "Collaborator removed successfully!");
  //   // Optionally, refresh the collaborators list here
  // } else {
  //   showToast("error", "Error", "Failed to remove collaborator.");
  // }
  openRemoveCollabModal.value = false;
};

const confirmChangeAccessRight = async (collabId) => {
  boardStore.updateAccessRight(boardId, collabId, accessRight.value);

  if (res.status === 200) {
    showToast(
      "success",
      "Success",
      `Access right changed to ${accessRight.value}!`
    );
    addConfirmModal.value = false;
  } else if (res.status === 401) {
    showToast(
      "error",
      "Error",
      "You must be logged in to perform this action."
    );
  } else if (res.status === 403) {
    showToast(
      "error",
      "Error",
      "You do not have permission to change collaborator access right."
    );
  } else {
    showToast("error", "Error", "There is a problem. Please try again later.");
  }
};

const handleAccessRightChange = (collabId) => {
  addConfirmModal.value = true; // Show modal
};
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
                  v-if="true"
                  v-for="(collab, index) in collaborators"
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
                        v-model="accessRight"
                        @click.prevent="
                          (event) =>
                            handleAccessRight(
                              collab.id,
                              collab.email,
                              collab.access_right,
                              event.target.value,
                              event
                            )
                        "
                      >
                        <option>READ</option>
                        <option>WRITE</option>
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

    <!-- AddCollab -->
    <AddCollab
      v-if="openAddCollabModal"
      @closeAddCollab="openAddCollabModal = false"
      @addCollab="addCollab"
    ></AddCollab>

    <ConfirmModal v-if="addConfirmModal">
      <template #title>
        <p>Change Access Right</p>
      </template>
      <template #question>
        <div>
          Do you want to change access right of
          {{ oldAccessRight }} to {{ newAccessRight }}?
        </div>
      </template>
      <template #button-left>
        <SubmitButton
          buttonType="cancel"
          class="itbkk-button-cancel"
          @click="addConfirmModal = false"
          >Cancel</SubmitButton
        >
      </template>
      <template #button-right>
        <SubmitButton
          buttonType="add"
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
