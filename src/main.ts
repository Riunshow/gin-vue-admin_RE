import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/permission'

import ElementPlus, { ElMessage } from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

import 'normalize.css'
import '@/style/base.scss'

const app = createApp(App)

app.use(ElementPlus)
app.provide('$message', ElMessage)

app.use(store)
app.use(router)

app.mount('#app')
