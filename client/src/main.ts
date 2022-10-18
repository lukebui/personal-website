import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import { useSystemStore } from "./store/system";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

const systemStore = useSystemStore();

document.addEventListener("visibilitychange", () => {
  systemStore.loadDarkMode();
});
