import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ui from './components/library'
import 'normalize.css'
import '@/assets/styles/common.less'

createApp(App).use(ui).use(store).use(router).mount('#app')
