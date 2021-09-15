import { createApp } from 'vue'
import App from './App.vue'
import Toaster from "@meforma/vue-toaster";

import store from './store.js'
import {callFund, callGuess, subscribeToEvent} from './vitescripts.js'

const app = createApp(App).use(store)
app.config.globalProperties.$store = store;
app.config.globalProperties.$methods = {callFund, callGuess, subscribeToEvent};
app.use(Toaster);
app.mount('#app')
