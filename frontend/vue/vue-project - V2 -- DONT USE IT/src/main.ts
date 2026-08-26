import "./assets/scss/main.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";
import App from "./App.vue";
import router from "./router";
import Tooltip from "primevue/tooltip";

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue, { theme: { preset: Aura } });
app.use(ToastService);
app.use(router);
app.directive("tooltip", Tooltip);

app.mount("#app");
