<script setup>
import StatusModal from "./StatusModal.vue";
import buttonSubmit from "../button/Button.vue";
import { defineEmits, defineProps, computed, ref } from "vue";
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

const props = defineProps({
  selectedStatus: Object,
  localTimeZone: String,
});

const status = reactive({
  name: props.selectedStatus.name,
  description: props.selectedStatus.description,
  color: props.selectedStatus.color,
});

console.log(status);

const oldStatus = {
  name: props.selectedStatus.name,
  description: props.selectedStatus.description,
  color: props.selectedStatus.color,
};

const isStatusEdited = computed(() => {
  return (
    status.name !== oldStatus.name ||
    status.description !== oldStatus.description ||
    status.color !== oldStatus.color
  );
});

const save = () => {
  if (props.selectedStatus.id !== "" && isStatusEdited.value === true) {
    emit("editStatus", status);
    router.push({ name: "status" });
  } else if (props.selectedStatus.id === "") {
    emit("addNewStatus", status);
  }
};

const emit = defineEmits(["closeAddEdit", "editStatus", "addNewStatus"]);
</script>

<template>
  <StatusModal>
    <template #title>
      {{ selectedStatus.id === "" ? "New Task" : "Edit Task" }}
    </template>
    <template #name>
      <input
        v-model.trim="status.name"
        maxlength="50"
        type="text"
        id="default-input"
        class="itbkk-title bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </template>
    <template #color>
      <input
        type="color"
        v-model="status.color"
        id="color"
        class="itbkk-color w-10 h-10 rounded-lg"
    /></template>
    <template #desc>
      <textarea
        maxlength="200"
        v-model.trim="status.description"
        :class="selectedStatus.id == '' ? 'h-[241px]' : 'h-44'"
        class="itbkk-description block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
      ></textarea>
    </template>
    <template #time>
      <div class="pt-6" :class="selectedStatus.id == '' ? 'hidden' : 'visible'">
        <span class="itbkk-timezone font-semibold">TimeZone</span> :
        {{ localTimeZone }} <br />
        <span class="itbkk-created-on font-semibold">Created On</span> :
        {{ props.selectedStatus.createdOn }} <br />
        <span class="itbkk-updated-on font-semibold">Updated On</span> :
        {{ props.selectedStatus.updatedOn }} <br />
      </div>
    </template>
    <template #button-left>
      <buttonSubmit buttonType="cancel" @click="$emit('closeAddEdit')"
        >Cancel</buttonSubmit
      >

    </template>
    <template #button-right>
      <buttonSubmit
        class="itbkk-button-confirm w-20"
        :buttonType="
          status.name === '' || isStatusEdited === false ? 'cancel' : 'ok'
        "
        :disabled="status.name === '' || isStatusEdited === false"
        @click="save"
        :class="
          status.name === '' || isStatusEdited === false
            ? 'bg-gray-300 px-4 py-2 rounded-md cursor-not-allowed opacity-50 transition-colors disabled'
            : ''
        "
        >Save</buttonSubmit
      >
    </template>
  </StatusModal>
</template>

<style scoped></style>
