<script setup>
import ModalDetail from "./ModalDetail.vue";
import buttonSubmit from "../button/Button.vue";
import { useRouter, useRoute } from "vue-router";
import { defineEmits, ref, onMounted, watch, computed } from "vue";
import { useStatusStore } from "../../stores/StatusStore.js";
import { useSortStore } from "../../stores/SortStore.js";
import { useBoardStore } from "../../stores/BoardStore.js";
import { useTaskStore } from "../../stores/TaskStore.js";
import {
  localTimeZone,
  formatDate,
  getFileIcon,
  openFile,
  MAX_FILES,
  MAX_FILE_SIZE,
} from "../../libs/libsUtil.js";
import { checkTokenExpiration } from "@/stores/UserStore";
import { useToast } from "primevue/usetoast";
const emit = defineEmits(["addNewTask", "editNewTask"]);
const statusStore = useStatusStore();
const taskStore = useTaskStore();
const sortStore = useSortStore();
const boardStore = useBoardStore();
const router = useRouter();
const route = useRoute();

const isChanged = ref(false);
const mode = route.name === "task-add" ? "add" : "edit";
const limitMaximumTask = ref(false);
const maximumTask = ref(10);
const newFiles = ref([]);
const toast = useToast();

const selectedTask = ref({
  title: "",
  description: "",
  assignees: "",
  statusId: 1,
  createdOn: "",
  updatedOn: "",
  files: [],
});

const outputTask = ref({
  title: "",
  description: "",
  assignees: "",
  statusId: 1,
});

const oldFilesLength = ref(0);
const originalTaskData = ref({});
const boardId = route.params.id;
const taskId = route.params.taskId;

onMounted(async () => {
  console.log(taskStore.getTasks);
  await checkTokenExpiration(boardId);
  await taskStore.loadTasks(boardId);
  await statusStore.loadStatuses(boardId);
  const board = await boardStore.loadBoardById(boardId);

  limitMaximumTask.value = board.limitMaximumTask;
  maximumTask.value = board.maximumTask;

  if (mode == "edit") {
    const taskDetail = await taskStore.loadTaskDetails(taskId, boardId);

    selectedTask.value = {
      ...taskDetail,
      statusId: taskDetail.status?.id ?? null,
      createdOn: formatDate(taskDetail.createdOn),
      updatedOn: formatDate(taskDetail.updatedOn),
      files: taskDetail.files.map((file) => ({
        fileName: file.fileName,
        fileData:
          file.fileData instanceof File
            ? file.fileData
            : new File([new Blob([file.fileData])], file.fileName, {
                type: file.contentType,
              }),
        contentType: file.contentType,
      })),
    };
    oldFilesLength.value = selectedTask.value.files.length;
    originalTaskData.value = { ...selectedTask.value };
    originalTaskData.value.files = [...selectedTask.value.files];
  } else if (mode == "add") {
    selectedTask.value.statusId = statusStore.getStatuses[0].id;
  }
});

const limitExceed = ref(false);
watch(
  selectedTask,
  (newValue) => {
    limitExceed.value =
      newValue.title.length > 100 ||
      newValue.description?.length > 500 ||
      newValue.assignees?.length > 30;
    if (mode === "edit") {
      isChanged.value = !(
        newValue.title === originalTaskData.value.title &&
        newValue.description === originalTaskData.value.description &&
        newValue.assignees === originalTaskData.value.assignees &&
        newValue.statusId === originalTaskData.value.statusId &&
        newValue.files.filter(
          (file) =>
            !originalTaskData.value.files.some(
              (originalFile) => originalFile.fileName === file.fileName
            )
        ).length === 0 &&
        newValue.files.length === originalTaskData.value.files.length
      );
    }
  },

  { deep: true }
);

const isButtonDisabled = computed(() => {
  return (
    !selectedTask.value.title ||
    (mode === "edit" && !isChanged.value) ||
    limitExceed.value
  );
});

const cancel = () => {
  selectedTask.value.files.forEach((file) => {
    if (newFiles.value.some((newFile) => newFile.fileName === file.fileName)) {
      removeFile(file);
    }
  });
  newFiles.value = [];
  router.push({ name: "board-task", params: { id: boardId } });
};

const save = async () => {
  if (mode === "edit" && taskId !== undefined) {
    outputTask.value = {
      title: selectedTask.value.title,
      description: selectedTask.value.description,
      assignees: selectedTask.value.assignees,
      statusId: selectedTask.value.statusId,
    };

    const res = await taskStore.editTaskWithFiles(
      taskId,
      outputTask.value,
      selectedTask.value.files
    );

    if (res.status === 200) {
      await taskStore.loadTasks(boardId);
      await statusStore.loadStatuses(boardId);
      router.push({ name: "board-task", params: { id: boardId } });
      taskStore.filterStatuses.length = 0;
    } else {
      return;
    }
  } else {
    outputTask.value = {
      title: selectedTask.value.title,
      description: selectedTask.value.description,
      assignees: selectedTask.value.assignees,
      statusId: selectedTask.value.statusId,
    };

    const res = await taskStore.addTask(outputTask.value);

    if (res.status === 201) {
      await taskStore.loadSortTasks(sortStore.getSortType);
      taskStore.filterStatuses.length = 0;
      router.push({ name: "board-task", params: { id: boardId } });
    } else {
      return;
    }
  }
};

const removeFile = (file) => {
  const index = selectedTask.value.files.findIndex(
    (f) => f.fileName === file.fileName
  );
  selectedTask.value.files.splice(index, 1);
  newFiles.value = newFiles.value.filter((f) => f.fileName !== file.fileName);
};

const onFileChanged = (e) => {
  const files = Array.from(e.target.files);
  const createFileObject = (file) => ({
    fileName: file.name,
    fileData: file,
    contentType: file.type,
  });

  let newFilesToAdd = [];
  let errorMessages = [];
  let oversizedFiles = []; // Array to track files that exceed size
  let excessFiles = []; // Array to track files that exceed max file limit

  files.forEach((file) => {
    const fileObject = createFileObject(file);
    newFiles.value.push(fileObject);
    const duplicateFileName = selectedTask.value.files.some(
      (existingFile) => fileObject.fileName === existingFile.fileName
    );
    // Check for duplicate file name
    const duplicateFileIndex = selectedTask.value.files.findIndex(
      (existingFile) => fileObject.fileName === existingFile.fileName
    );

    const exceedFileSize = fileObject.fileData.size > MAX_FILE_SIZE;

    const exceedFileLength =
      selectedTask.value.files.length + newFilesToAdd.length >= MAX_FILES;

    if (duplicateFileIndex !== -1) {
      // Remove the existing file with the same name
      selectedTask.value.files.splice(duplicateFileIndex, 1);
    }

    if (duplicateFileName) {
      errorMessages.push(
        `File with the same filename cannot be added or updated to the attachments. Please delete the attachment and add again to update the file.`
      );
    } else if (exceedFileSize) {
      oversizedFiles.push(fileObject.fileName); // Track oversized files
    } else if (exceedFileLength) {
      excessFiles.push(fileObject.fileName); // Track excess files
    } else {
      newFilesToAdd.push(fileObject);
    }
  });

  // Add error message for oversized files
  if (oversizedFiles.length > 0) {
    errorMessages.push(
      `Each file cannot be larger than ${
        MAX_FILE_SIZE / 1024 / 1024
      } MB. The following files are not added: ${oversizedFiles.join(", ")}`
    );
  }

  // Add error message for exceeding max file count
  if (excessFiles.length > 0) {
    errorMessages.push(
      `Each task can have at most ${MAX_FILES} files. The following files are not added: ${excessFiles.join(
        ", "
      )}`
    );
  }

  // Add valid files to the selected task
  if (newFilesToAdd.length > 0) {
    selectedTask.value.files.push(...newFilesToAdd);
    newFiles.value.push(...newFilesToAdd);
  }

  // Show error messages
  if (errorMessages.length > 0) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: errorMessages.map((msg) => `- ${msg}`).join("\n"),
      life: 3000,
    });
  }
};
</script>

<template>
  <ModalDetail
    :selectedTask="selectedTask"
    :mode="mode"
    :newFiles="newFiles"
    :originalTaskData="originalTaskData"
    class="itbkk-modal-task"
  >
    <template #title>
      <div class="flex justify-between text-black">
        <div>{{ mode == "add" ? "Add Task" : "Edit Task" }}</div>
        <div>
          <span
            :class="{
              'bg-red-200 text-red-800 dark:text-red-400 border border-red-400':
                limitMaximumTask === false,
              'bg-green-200 text-green-800 dark:text-green-400 border border-green-400':
                limitMaximumTask === true,
            }"
            class="text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700"
            >Limit {{ limitMaximumTask ? "On" : "Off" }}</span
          >
        </div>
      </div>
    </template>
    <div class="xl:mb-4 lg:mb-2 mb-2">
      <label
        for="default-input"
        class="block mb-2 text-base lg:text-base font-semibold text-black dark:text-gray-900 md-vertical:text-sm"
        >Title</label
      >
      <div class="px-3">
        <input
          type="text"
          id="default-input"
          class="itbkk-title bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model.trim="selectedTask.title"
        />
      </div>
    </div>
    <template #desc>
      <textarea
        class="itbkk-description block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
        :class="mode === 'edit' ? 'h-[127px]' : 'h-[210px]'"
        v-model.trim="selectedTask.description"
      ></textarea>
    </template>

    <template #attach>
      <div
        class="mt-2 text-black grid grid-cols-2 gap-3 relative pb-5"
        v-if="mode === 'edit'"
      >
        <div
          v-for="file in selectedTask.files"
          :title="file.fileName"
          class="bg-[#f3f3f3] tooltip grid grid-cols-[auto,1fr,auto] p-2 rounded-md hover:bg-[#e2e2e2] transition-all duration-200 ease-in-out cursor-pointer justify-start items-center"
          @click="openFile(file, taskId, newFiles)"
        >
          <div class="flex items-center">
            <img
              :src="getFileIcon(file.fileName)"
              alt="thumbnail"
              class="w-8 object-contain"
            />
          </div>
          <p class="px-2 text-xs truncate text-left">
            {{ file.fileName }}
          </p>
          <div
            class="w-8 h-8 flex justify-center items-center rounded-full hover:bg-red-300 transition-all duration-150 ease-in-out"
          >
            <img
              src="/attachments/trash.png"
              alt=""
              class="w-5 h-5 object-contain"
              @click.stop="removeFile(file)"
            />
          </div>
        </div>
      </div>
    </template>

    <template #assignees>
      <textarea
        class="itbkk-assignees block p-2.5 min-h-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full mobile:h-28 md-vertical:h-3/4"
        v-model.trim="selectedTask.assignees"
      ></textarea>
    </template>
    <template #status>
      <form class="px-3 pr-5 itbkk-status-wrapper">
        <select
          class="itbkk-status bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model="selectedTask.statusId"
        >
          <option
            class="list-status"
            :value="status.id"
            v-for="status in statusStore.getStatuses"
          >
            {{ status.name }}
          </option>
        </select>
      </form>
    </template>

    <template #time>
      <div
        class="xl:pt-2 lg:pt-3 pt-2"
        :class="mode == 'add' ? 'hidden' : 'visible'"
      >
        <span class="itbkk-timezone font-semibold">TimeZone</span> :
        {{ localTimeZone }} <br />
        <span class="itbkk-created-on font-semibold">Created On</span> :
        {{ selectedTask.createdOn }} <br />
        <span class="itbkk-updated-on font-semibold">Updated On</span> :
        {{ selectedTask.updatedOn }} <br />
      </div>
    </template>

    <template #addAttach>
      <label
        v-if="mode === 'edit'"
        for="fileInput"
        class="flex items-center ml-3 px-2 rounded-2xl hover:bg-[#eeeeee] border transition-all duration-200 ease-in-out cursor-pointer"
        :class="{
          'opacity-50 text-slate-500 disabled hover:cursor-not-allowed':
            selectedTask.files.length >= MAX_FILES,
        }"
        :disabled="selectedTask.files.length >= MAX_FILES"
      >
        <input
          id="fileInput"
          type="file"
          class="hidden"
          :disabled="selectedTask.files.length >= MAX_FILES"
          multiple
          @change="onFileChanged"
        />
        <img
          src="/attachments/attach-file.png"
          alt="Attach File"
          class="w-4 hover:text-[#1c2153]"
        />
        <p>Attach</p>
      </label>
    </template>

    <template #addAttachments>
      <div class="flex">
        <img src="/attachments/attach-file.png" alt="" class="w-6" />
        <div class="attach-text">Attach</div>
      </div>
    </template>

    <template #button-left>
      <buttonSubmit
        buttonType="cancel"
        class="itbkk-button-cancel"
        @click="cancel"
        >Cancel</buttonSubmit
      >
    </template>

    <template #button-right>
      <buttonSubmit
        class="itbkk-button-confirm w-20"
        :buttonType="isButtonDisabled ? 'disabled' : 'ok'"
        :disabled="isButtonDisabled"
        @click="save"
        >Save</buttonSubmit
      >
    </template>
  </ModalDetail>
</template>

<style scoped>
.attach-text {
  color: #0546a9;
}
</style>
