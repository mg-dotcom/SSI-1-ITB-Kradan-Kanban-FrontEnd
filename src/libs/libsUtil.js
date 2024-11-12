import { ref } from "vue";
import router from "@/router/page.js";
import { useUserStore, useUserToken } from "@/stores/UserStore";
import { CookieUtil } from "./CookieUtil";

const localTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleString("en-GB", { timeZone: localTimeZone.value });
};

const MAX_FILES = 10;
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const sortTasks = (tasks, sortType) => {
  if (sortType === "ascending") {
    tasks.sort((a, b) => a.status.localeCompare(b.status));
  } else if (sortType === "descending") {
    tasks.sort((a, b) => b.status.localeCompare(a.status));
  }
};

const getFileIcon = (fileName) => {
  const extensions = {
    pdf: "/attachments/pdf.png",
    docx: "/attachments/word.png",
    ppt: "/attachments/ppt.png",
    pptx: "/attachments/ppt.png",
    txt: "/attachments/txt-file.png",
    zip: "/attachments/zip.png",
    html: "/attachments/html.png",
    svg: "/attachments/svg.png",
    gif: "/attachments/gif.png",
    jpg: "/attachments/jpg.png",
    jpeg: "/attachments/jpg.png",
    png: "/attachments/png.png",
    zip: "/attachments/zip.png",
    exe: "/attachments/exe-file.png",
  };

  const fileExtension = fileName.split(".").pop().toLowerCase();

  return extensions[fileExtension] || "/attachments/documents.png";
};

const byteToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

const openFile = (file) => {
  try {
    let blob;
    if (typeof file.fileData === "string") {
      const byteArray = base64ToArrayBuffer(file.fileData);
      blob = new Blob([byteArray], { type: file.contentType });
    } else if (file.fileData instanceof Blob) {
      blob = file.fileData;
    } else {
      blob = new Blob([file.fileData], { type: file.contentType });
    }
    const fileURL = URL.createObjectURL(blob);
    const extension = file.fileName.split(".").pop().toLowerCase();
    if (extension === "txt" || extension === "rtf") {
      const reader = new FileReader();
      reader.readAsText(blob, "UTF-8");
      reader.onload = function (event) {
        const textContent = event.target.result;
        const textWindow = window.open("", "_blank");
        textWindow.document.write("<pre>" + textContent + "</pre>");
        textWindow.document.close();
      };
    } else if (["jpg", "png", "pdf"].includes(extension)) {
      const tabName = file.fileName;
      window.open(fileURL, tabName);
    } else if (["docx", "xlsx"].includes(extension)) {
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const downloadLink = document.createElement("a");
      downloadLink.href = fileURL;
      downloadLink.download = file.fileName;
      downloadLink.click();
    }
  } catch (error) {
    console.error("Error opening file:", error);
  }
};

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function handleResponseStatus(res) {
  if (router.currentRoute.value.name === 'board-invitation') {
    return
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
