import "./assets/main.css";
import { CAlert } from "@coreui/vue";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/aura-light-green/theme.css";
import "primevue/resources/primevue.min.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import ToggleButton from "primevue/togglebutton";
import App from "./App.vue";
import router from "./router/page";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const app = createApp(App);
app.component("Toast", Toast);
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
app.component("CAlert", CAlert);
app.component("ToggleButton", ToggleButton);
app.component("Button", Button);
app.use(ToastService);
app.component("Dialog", Dialog);
app.use(createPinia());
app.component("fa", FontAwesomeIcon);
library.add(fas);

app.use(router);

app.mount("#app");
