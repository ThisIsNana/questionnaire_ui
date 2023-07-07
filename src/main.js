import './stylesheet/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'


import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@fortawesome/fontawesome-free/css/all.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fab);
library.add(fas);

import App from './App.vue'
import router from './router'
import moment from 'moment'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const app = createApp(App)

//axios
app.config.globalProperties.$axios = axios

//font awesome
app.component('font-awesome-icon', FontAwesomeIcon);

//pinia
const pinia = createPinia()
app.use(createPinia())
app.use(pinia)
app.use(moment)

app.use(router)
app.use(VueSweetalert2);

app.mount('#app')
