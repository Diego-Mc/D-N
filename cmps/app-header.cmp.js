import { utilService } from '../services/util.service.js'
import advancedSearch from '../cmps/advanced-search.cmp.js'
import { eventBus } from '../services/event-bus.service.js'

export default {
  props: ['cmp'],
  template: `
    <header @click.stop="onCloseAdvancedSearch" class="app-header col-full f-m">
      <span class="logo-wrapper">
          <img @click="$router.push('/')" src="assets/icons/logo-icon-dn.svg"/>
          <h1 class="logo-text logo">{{appName}}</h1>
      </span>
      <nav v-if="component">
        <router-link to="/maily">Maily</router-link>
        <router-link to="/keepy">Keepy</router-link>
        <router-link to="/">Booky</router-link>
        <router-link to="/about">temp</router-link>
      </nav>
      <advanced-search/>
      <component v-if="component" :is="component" />

      <i class="bi bi-grid-fill"></i>
    </header>
  `,
  data() {
    return {
      appName: 'D&N',
      component: this.cmp,
    }
  },
  methods: {
    onCloseAdvancedSearch(ev) {
      eventBus.emit('closeAdvancedSearch', ev)
    },
  },
  watch: {
    '$route.path': {
      handler(val) {
        this.appName = utilService.toCapitalCase(val.slice(1)) || 'D&N'
      },
    },
  },
  components: {
    advancedSearch,
  },
}
