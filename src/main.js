import "./assets/main.css";
import "primevue/resources/themes/aura-light-green/theme.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import PrimeVue from "primevue/config";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(PrimeVue);
app.use(createPinia());
app.use(ToastService);
app.use(router);
app.component("Toast", Toast);

app.mount("#app");
