import './app.scss'
import 'bootstrap'
import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'

import { 
  faTrash, 
  faPlay, 
  faStop, 
  faSpinner 
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faTrash, 
  faPlay, 
  faStop, 
  faSpinner
)

createApp(App)
  .component('fai', FontAwesomeIcon)
  .mount('#app')