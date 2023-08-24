import { createSSRApp } from "vue";
import App from "./App.vue";
import { setupStore } from "./stores";
import { setupI18n } from "./locales";
export function createApp() {
  const app = createSSRApp(App);
  setupStore(app);
  setupI18n(app);
  return {
    app,
  };
}
