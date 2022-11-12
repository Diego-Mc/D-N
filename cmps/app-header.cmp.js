import { utilService } from '../services/util.service.js'
import advancedSearch from '../cmps/advanced-search.cmp.js'
import { eventBus } from '../services/event-bus.service.js'

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
      <div v-else>
      <button>d</button>
      <advanced-search/>
      </div >
    
      <i class="bi bi-grid-fill"></i>
    </header>
  `,
  data() {
    return {
      appName: 'D&N',
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
