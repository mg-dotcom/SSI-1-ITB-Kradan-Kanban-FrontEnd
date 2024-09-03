import "./assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import ToggleButton from "primevue/togglebutton";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import App from "./App.vue";
import router from "./router/page";
import { CAlert } from "@coreui/vue";
import EmojiPicker from "vue3-emoji-picker";

// Import PrimeVue theme and styles
import "primevue/resources/themes/aura-light-green/theme.css";
import "primevue/resources/primevue.min.css";

// Import CoreUI styles
import "./assets/main.css";
import Password from "primevue/password";

// Initialize FontAwesome library
library.add(fas);

// Create Vue app instance
const app = createApp(App);

// Register components globally
app.component("EmojiPicker", EmojiPicker);
app.component("Toast", Toast);
app.component("Password", Password);
app.component("CAlert", CAlert);
app.component("ToggleButton", ToggleButton);
app.component("Button", Button);
app.component("Dialog", Dialog);
app.component("fa", FontAwesomeIcon);

// Use plugins
app.use(PrimeVue, {
  pt: {
    toast: {
      detail: {
        class: "itbkk-message",
      },
      container: {
        class: "shadow-md",
      },
    },
  },
});
app.use(ToastService);
app.use(createPinia());
app.use(router);

// Mount the app
app.mount("#app");
