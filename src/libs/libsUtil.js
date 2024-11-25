import { ref } from "vue";
import router from "@/router/page.js";
import { useUserStore, useUserToken } from "@/stores/UserStore";
import { CookieUtil } from "./CookieUtil";
import { useTaskStore } from "@/stores/TaskStore";

const localTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);

const ICON_PATH =
  import.meta.env.VITE_APP_MODE === "production"
    ? "/ssi1/attachments"
    : "/attachments";

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleString("en-GB", { timeZone: localTimeZone.value });
};

const MAX_FILES = 10;
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const sortTasks = (tasks, sortType, filteredStatuses = []) => {
  console.log(tasks);

  // Filter tasks based on provided statuses
  const filteredTasks = filteredStatuses.length
    ? tasks.filter((task) => filteredStatuses.includes(task.status?.name || ""))
    : tasks;

  // Sort the filtered tasks
  if (sortType === "ascending") {
    filteredTasks.sort((a, b) => {
      const statusA = a.status?.name || "";
      const statusB = b.status?.name || "";
      return statusA.localeCompare(statusB);
    });
  } else if (sortType === "descending") {
    filteredTasks.sort((a, b) => {
      const statusA = a.status?.name || "";
      const statusB = b.status?.name || "";
      return statusB.localeCompare(statusA);
    });
  } else {
    // Default sort by ID
    filteredTasks.sort((a, b) => a.id - b.id);
  }

  return filteredTasks; // Return the sorted filtered tasks
};

const getFileIcon = (fileName) => {
  const extensions = {
    pdf: `${ICON_PATH}/pdf.png`,
    docx: `${ICON_PATH}/word.png`,
    ppt: `${ICON_PATH}/ppt.png`,
    pptx: `${ICON_PATH}/ppt.png`,
    txt: `${ICON_PATH}/txt-file.png`,
    zip: `${ICON_PATH}/zip.png`,
    html: `${ICON_PATH}/html.png`,
    svg: `${ICON_PATH}/svg.png`,
    gif: `${ICON_PATH}/gif.png`,
    jpg: `${ICON_PATH}/jpg.png`,
    jpeg: `${ICON_PATH}/jpg.png`,
    png: `${ICON_PATH}/png.png`,
    zip: `${ICON_PATH}/zip.png`,
    exe: `${ICON_PATH}/exe-file.png`,
  };

  const fileExtension = fileName.split(".").pop().toLowerCase();

  return extensions[fileExtension] || `${ICON_PATH}/documents.png`;
};

const byteToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

const openFile = async (file, taskId, fileInList) => {
  const taskStore = useTaskStore();
  const extension = file.fileName.split(".").pop().toLowerCase();
  const fileInListItem = fileInList.find(
    (item) => item.fileName === file.fileName
  );
  const handleFileOpening = (blob, fileName) => {
    const fileURL = URL.createObjectURL(blob);

    if (["pdf", "jpg", "png"].includes(extension)) {
      window.open(fileURL, "_blank");
    } else if (["txt", "rtf"].includes(extension)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = event.target.result;
        const textWindow = window.open(fileURL, "_blank");
        textWindow.document.write("<pre>" + textContent + "</pre>");
        textWindow.document.close();
      };
      reader.readAsText(blob, "UTF-8");
    } else {
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = fileName;
      link.click();
    }
  };
  if (fileInListItem) {
    handleFileOpening(fileInListItem.fileData, fileInListItem.fileName);
  } else {
    try {
      const res = await taskStore.fetchFilePreview(file.fileName, taskId);

      if (res.status === 200) {
        const blob = await res.blob();
        handleFileOpening(blob, file.fileName);
      } else {
        console.error("File not found on the server");
      }
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  }
};

export function handleResponseStatus(res) {
  if (router.currentRoute.value.name === "board-invitation") {
    return;
  }
  if (
    (!CookieUtil.get("access_token") && res.status === 401) ||
    res.status === 404
  ) {
    const userStore = useUserStore();
    // userStore.$reset()
    userStore.logout();
    alert("Session expired. Please login again.");
    router.push({ name: "login" });
  } else if (res.status === 403) {
    const userStore = useUserStore();
    if (useUserToken().value) {
      return router.push({ name: "access-denied" });
    } else {
      userStore.logout();
      router.push({ name: "access-denied" });
    }
  } else if (!CookieUtil.get("refresh_token") && res.status >= 400) {
    this.$toast.add({
      severity: "error",
      summary: "Error",
      detail: "An error occurred",
      life: 3000,
    });
  }
}
export const handleAuthenticationClearAndRedirect = () => {
  const userStore = useUserStore();
  userStore.$reset();
  alert("Session expired. Please login again.");
  router.push({ name: "login" });
};

export {
  formatDate,
  localTimeZone,
  sortTasks,
  getFileIcon,
  openFile,
  MAX_FILES,
  MAX_FILE_SIZE,
  byteToMB,
};
