import { utilService } from '../services/util.service.js'
import advancedSearch from '../cmps/advanced-search.cmp.js'
import { eventBus } from '../services/event-bus.service.js'

import { emailService } from '../apps/mail/service/email.service.js'
import { booksService } from '../apps/book/js/services/books.service.js'
import { noteService } from '../apps/keep/services/note.service.js'
booksService
noteService

export default {
  props: [],
  template: `
    <header class="app-header col-full f-m">
      <span class="logo-wrapper">
          <img @click="$router.push('/')" src="assets/icons/logo-icon-dn.svg"/>
          <h1 class="logo-text logo">{{appName}}</h1>
      </span>
      <nav v-if="appName === 'D&N'">
        <router-link to="/maily">Maily</router-link>
        <router-link to="/keepy">Keepy</router-link>
        <router-link to="/booky">Booky</router-link>
        <router-link to="/about">temp</router-link>
      </nav>
      <advanced-search :service="services[appName]" v-else/>
      <i class="bi bi-grid-fill"></i>
    </header>
  `,
  data() {
    return {
      appName: 'D&N',
      services: {
        maily: emailService,
        keepy: noteService,
        booky: booksService,
      },
    }
  },
  methods: {},
  watch: {
    '$route.matched': {
      handler(val) {
        this.appName = val[0].name
      },
    },
  },
  components: {
    advancedSearch,
  },
}
