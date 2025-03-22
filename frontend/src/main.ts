import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedState from "pinia-plugin-persistedstate";

import Toast from "vue-toastification";
import '@fortawesome/fontawesome-free/css/all.css';
import "vue-toastification/dist/index.css";

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPersistedState);

app.use(pinia)
app.use(router)
app.use(Toast);

app.mount('#app')
