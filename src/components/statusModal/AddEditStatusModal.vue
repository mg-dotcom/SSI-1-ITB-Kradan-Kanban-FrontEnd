<script setup>
import buttonSubmit from "../button/Button.vue";
import { onMounted, ref, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStatusStore } from "../../stores/StatusStore.js";

const router = useRouter();
const route = useRoute();
const statusStore = useStatusStore();
const mode = route.name === "status-add" ? "add" : "edit";
const inputStatus = ref({});
const unEditedStatus = ref({});
const isChanged = ref(false);
const statusId = Number(route.params.id);

const localTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleString("en-GB", { timeZone: localTimeZone.value });
}

onMounted(async () => {
  if (mode === "edit") {
    const selectedStatus = await statusStore.loadStatusDetail(statusId);
    console.log(selectedStatus);
    inputStatus.value = selectedStatus;
    inputStatus.value.timeZone = localTimeZone.value;
    inputStatus.value.createdOn = formatDate(selectedStatus.createdOn);
    inputStatus.value.updatedOn = formatDate(selectedStatus.updatedOn);
    unEditedStatus.value = { ...selectedStatus };
  } else if (mode === "add") {
    inputStatus.value = {
      name: "",
      description: "",
      statusColor: "#CCCCCC",
    };
  }
});

watch(
  inputStatus,
  (newValue) => {
    if (mode === "add") {
      if (!newValue.title) {
        isChanged.value = false;
      } else {
        isChanged.value = true;
        return;
      }
    }
    if (mode === "edit") {
      if (
        newValue.name !== unEditedStatus.value.name ||
        newValue.description !== unEditedStatus.value.description ||
        (newValue.statusColor !== unEditedStatus.value.statusColor &&
          newValue.name !== "")
      ) {
        isChanged.value = false;
      } else {
        isChanged.value = true;
      }
    }
  },
  { deep: true }
);

// ห้ามลบบบบบบบบบบบบบบบบ !!!! เอาไว้ validate
// const isExistingName = computed(() => {
//   if (mode === "add") {
//     return statusStore.getStatuses.some(
//       (status) => status.name === inputStatus.value.name
//     );
//   }
//   if (mode === "edit") {
//     return statusStore.getStatuses.some(
//       (status) =>
//         status.name === inputStatus.value.name &&
//         status.id !== inputStatus.value.id
//     );
//   }
// });

const save = async () => {
  if (mode === "edit") {
    await statusStore.editStatus(inputStatus.value.id, inputStatus.value);
    router.go(-1);
  } else {
    await statusStore.addStatus(inputStatus.value);
    router.go(-1);
  }
};
</script>

<template>
  <div
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 itbkk-item z-50"
  >
    <div
      class="bg-[#F2F2F2] sm:w-[75%] sm:h-[89%] md:w-[45%] md:h-[85%] shadow-lg overflow-hidden border-gray-500 sm:rounded-lg py-16 relative"
    >
      <div
        class="font-bold text-xl overflow-hidden whitespace-nowrap truncate w-full absolute top-5 px-3"
      >
        {{ mode === "add" ? "New Status" : "Edit Status" }}
      </div>

      <div
        class="bg-white w-full h-full border-b border-t border-[#CACACA] py-6 px-8"
      >
        <div class="w-full h-full">
          <div class="flex">
            <div class="w-1/2">
              <p class="font-semibold mb-2">Name</p>
              <div class="px-3">
                <input
                  v-model.trim="inputStatus.name"
                  maxlength="50"
                  type="text"
                  id="default-input"
                  class="itbkk-title bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <div class="w-1/2">
              <p class="font-semibold mb-2">Color</p>
              <input
                type="color"
                v-model="inputStatus.statusColor"
                id="color"
                class="itbkk-color w-10 h-10 rounded-lg"
              />
            </div>
          </div>
          <div class="flex flex-col flex-grow mt-5">
            <p class="font-semibold mb-2">Description</p>
            <div class="px-3">
              <textarea
                maxlength="200"
                v-model.trim="inputStatus.description"
                class="itbkk-description block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full h-52"
              ></textarea>
            </div>
          </div>
          <div class="text-sm" v-if="mode === 'edit'">
            <div class="pt-5">
              <span class="itbkk-timezone font-semibold">TimeZone</span> :
              Asia/Bangkok <br />
              <span class="itbkk-created-on font-semibold">Created On</span> :
              {{ inputStatus.createdOn }} <br />
              <span class="itbkk-updated-on font-semibold">Updated On</span> :
              {{ inputStatus.updatedOn }} <br />
            </div>
          </div>
        </div>
      </div>
      <div class="absolute right-6 bottom-3">
        <buttonSubmit
          buttonType="cancel"
          @click="router.push({ name: 'status' })"
          >Cancel</buttonSubmit
        >

        <buttonSubmit
          :buttonType="
            inputStatus.name === '' ||
            isChanged === true ||
            isExistingName === true
              ? 'cancel'
              : 'ok'
          "
          @click="save"
          :disabled="
            inputStatus.name === '' ||
            isChanged === true ||
            isExistingName === true
          "
          :class="
            inputStatus.name === '' ||
            isChanged === true ||
            isExistingName === true
              ? 'bg-gray-300 px-4 py-2 rounded-md cursor-not-allowed opacity-50 transition-colors disabled'
              : ''
          "
          >Save</buttonSubmit
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
