import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { setupI18n } from './locales';
import './assets/styles/index.scss';
import 'virtual:svg-icons-register';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

setupI18n(app);

app.mount('#app');
