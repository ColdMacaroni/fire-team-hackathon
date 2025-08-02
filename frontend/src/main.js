import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/base.css'

// FontAwesome configuration
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faPlus,
  faHome,
  faCompass,
  faBookmark,
  faCheck,
  faTimes,
  faImage,
} from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faHome, faCompass, faBookmark, faCheck, faTimes, faImage)

const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(router)

app.mount('#app')
