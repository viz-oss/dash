import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { disableBrowserZoom } from '@/utils/screen'
import App from './App.vue'
import inobounce from 'inobounce'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
disableBrowserZoom()
inobounce.disable();
app.mount('#app')
