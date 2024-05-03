import "./assets/main.css";
import "primevue/resources/themes/aura-light-green/theme.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import router from "./router";
import Detail from "./components/Detail.vue";
import { root } from "postcss";

const app = createApp(App);
app.component("Toast", Toast);
app.use(PrimeVue, {
  pt: {
    toast: {
      detail: {
        class: "itbkk-message",
      },
    },
  },
});
app.use(ToastService);

app.use(createPinia());

app.use(router);

app.mount("#app");
