<script setup>
import buttonSubmit from "../button/Button.vue";
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStatusStore } from "../../stores/StatusStore.js";
import { localTimeZone, formatDate } from "../../libs/libsUtil.js";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const statusStore = useStatusStore();
const mode = route.name === "status-add" ? "add" : "edit";
const inputStatus = ref({});
const unEditedStatus = ref({});
const isChanged = ref(false);
const statusId = Number(route.params.id);

onMounted(async () => {
  if (statusId === 1) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "You cannot edit or delete this default status",
      life: 3000,
    });
    router.push({ name: "status" });
  }

  if (statusId === 4) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "You cannot edit or delete this done status",
      life: 3000,
    });
    router.push({ name: "status" });
  }

  if (mode === "edit") {
    const selectedStatus = await statusStore.loadStatusDetail(statusId);
    if (!selectedStatus.id) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "An error has occurred, the status does not exist",
        life: 3000,
      });
      router.push({ name: "status" });
    }
    selectedStatus.description
      ? selectedStatus.description
      : (selectedStatus.description = "");
    inputStatus.value = selectedStatus;
    inputStatus.value.timeZone = localTimeZone;
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

const limitExceed=ref(false)

watch(
  inputStatus,
  (newValue) => {
    // const existingStatus = statusStore.statuses.find(
    //     (status) => status.name === newValue.name
    //   );
    // if(existingStatus){
    //   toast.add({
    //       severity: "error",
    //       summary: "Error",
    //       detail: `Status with name "${newStatus.name}" already exists`,
    //       life: 3000,
    //     });
    // }
    
    if(newValue.name.length >50 || newValue.description?.length > 200){
      limitExceed.value=true
    }else{
      limitExceed.value=false
    }

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

const save = async () => {
  if (mode === "edit") {
    await statusStore.editStatus(inputStatus.value.id, inputStatus.value);
    router.go(-1);
  } else {
    if (inputStatus.value.description === "")
      inputStatus.value.description = null;
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
      class="itbkk-modal-status bg-[#F2F2F2] rounded-lg xl:w-[42%] lg:w-[55%] h-[85%] w-[65%] mobile:w-[80%] md-vertical:w-[65%] shadow-lg overflow-hidden border-gray-500 sm:rounded-lg xl:py-16 lg:py-12 py-12 relative"
    >
      <div
        class="font-bold lg:text-xl md-vertical:text-lg overflow-hidden whitespace-nowrap truncate w-full absolute xl:top-5 lg:top-2.5 px-3 top-2.5 mobile:text-lg text-base"
      >
        {{ mode === "add" ? "Add Status" : "Edit Status" }}
      </div>

      <div
        class="bg-white w-full h-full border-b border-t border-[#CACACA] xl:py-2 px-5 lg:py-3 py-2 mobile:overflow-auto md-vertical:overflow-hidden overflow-hidden"
      >
        <div class="w-full h-full">
          <div class="flex">
            <div class="w-1/2">
              <p class="font-semibold mb-2">Name</p>
              <div class="px-3">
                <input
                  v-model.trim="inputStatus.name"
                  
                  type="text"
                  id="default-input"
                  class="itbkk-status-name bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                class="itbkk-status-description block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full xl:h-52 mobile:h-44 h-44"
              ></textarea>
            </div>
          </div>
          <div class="text-xs" v-if="mode === 'edit'">
            <div class="md-vertical:m-0 py-5">
              <span class="itbkk-timezone font-semibold">TimeZone</span> :
              {{ localTimeZone }} <br />
              <span class="itbkk-created-on font-semibold">Created On</span> :
              {{ inputStatus.createdOn }} <br />
              <span class="itbkk-updated-on font-semibold">Updated On</span> :
              {{ inputStatus.updatedOn }} <br />
            </div>
          </div>
        </div>
      </div>
      <div class="absolute right-6 xl:bottom-3 lg:bottom-1.5 bottom-1">
        <buttonSubmit
          class="itbkk-button-cancel"
          buttonType="cancel"
          @click="router.push({ name: 'status' })"
          >Cancel</buttonSubmit
        >

        <buttonSubmit
          class="itbkk-button-confirm"
          :buttonType="
            inputStatus.name === '' || isChanged === true || limitExceed===true ? 'cancel' : 'ok'
          "
          @click="save"
          :disabled="inputStatus.name === '' || isChanged === true || limitExceed===true"
          :class="
            inputStatus.name === '' || isChanged === true || limitExceed===true
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
