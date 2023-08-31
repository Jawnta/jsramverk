import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'leaflet/dist/leaflet.css'
import App from './App.vue'
import router from './router'
import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/styles.css' // vue3-openlayers version < 1.0.0-*
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(OpenLayersMap)
app.mount('#app')
