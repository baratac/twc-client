import { createApp } from 'vue'
import App from './App.vue'

import './index.css'

console.log("SERVER PORT AT", import.meta.env)

console.log("App", App);

createApp(App).mount('#app')
