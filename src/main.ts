import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import icons and add them to the Library */
import { faEnvelope, faCakeCandles, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

library.add(faEnvelope, faCakeCandles, faGithub, faBars, faXmark)

const app = createApp(App)
const pinia = createPinia()
app.use(pinia).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
