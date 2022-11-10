import { utilService } from '../services/util.service.js'

const navBar = {
  template: `
    <nav>
      <router-link to="/maily">Maily</router-link>
      <router-link to="/keepy">Keepy</router-link>
      <router-link to="/">Booky</router-link>
      <router-link to="/about">temp</router-link>
    </nav>
  `,
}

export default {
  props: ['cmp'],
  template: `
    <header class="app-header col-full f-m">
      <span class="logo-wrapper">
          <img @click="$router.push('/')" src="assets/icons/logo-icon-dn.svg"/>
          <h1 class="logo-text logo">{{appName}}</h1>
      </span>
      <component :is="component" />

      <i class="bi bi-grid-fill"></i>
    </header>
  `,
  data() {
    return {
      appName: 'D&N',
      component: this.cmp || navBar,
    }
  },
  watch: {
    '$route.path': {
      handler(val) {
        this.appName = utilService.toCapitalCase(val.slice(1)) || 'D&N'
      },
    },
  },
  components: {
    navBar,
  },
}
