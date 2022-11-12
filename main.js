const { createApp } = Vue

import { router } from './routes.js'

import appHeader from './cmps/app-header.cmp.js'
import appFooter from './cmps/app-footer.cmp.js'
import userMsg from './cmps/user-msg.cmp.js'
import userModal from './cmps/user-modal.cmp.js'
import iconToggle from './cmps/icon-toggle.cmp.js'

const options = {
  template: `
        <app-header />
        <router-view class="col-full" />
        <app-footer class="col-full" />
        <user-msg />
        <user-modal />
    `,
  components: {
    appHeader,
    appFooter,
    userMsg,
    userModal,
  },
}

const app = createApp(options)
app.component('icon-toggle', iconToggle)
app.use(router)
app.mount('#app')
