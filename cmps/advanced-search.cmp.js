import radioBtn from '../cmps/radio-btn.cmp.js'
import checkBox from '../cmps/check-box.cmp.js'
import radioCheck from '../cmps/radio-check.cmp.js'

import { emailService } from '../apps/mail/service/email.service.js'
import { eventBus } from '../services/event-bus.service.js'

export default {
  props: ['service'],
  template: /* HTML */ `
    <div className="search-bg" v-if="isOpen" @click="closeSearch"></div>
    <form
      @submit.prevent="doSearch"
      ref="search"
      class="advanced-search"
      :class="{open:isOpen}">
      <input
        v-model="criteria.search"
        @click="onClick"
        class="advancedSearchInput f-m f-clr-dark"
        type="search"
        placeholder="Search..." />
      <i class="bi bi-search search-icon"></i>
      <section v-if="isOpen" class="filters">
        <component
          v-for="(cmp, idx) in searchOptions.cmps"
          :is="cmp.type"
          :info="cmp.info"
          :initialValue="criteria[cmp.info.key]"
          :key="cmp.info.key"
          @setVal="setAns">
        </component>
      </section>
      <button v-if="isOpen" class="filter-btn">Advanced Search</button>
    </form>
  `,
  data() {
    return {
      searchOptions: null,
      criteria: null,
      isOpen: false,
    }
  },
  created() {
    this.searchOptions = this.service.getAdvancedSearchOptions()
    this.setCriteria()
  },
  methods: {
    setAns({ key, ans }) {
      this.criteria[key] = ans
      this.$router.push({ query: { ...this.criteria } })
    },
    setCriteria() {
      const emptyCriteria = {}
      const params = this.$route.query
      if (params) {
        this.criteria = { ...params }
      } else this.criteria = emptyCriteria
    },
    doSearch() {
      console.log(this.criteria)
      eventBus.emit('advancedSearch', this.criteria)
      this.closeSearch()
    },
    onClick() {
      this.isOpen = true
      document.body.scrollIntoView(true)
    },
    closeSearch() {
      this.isOpen = false
    },
  },
  computed: {},
  components: {
    radioBtn,
    checkBox,
    radioCheck,
  },
}
