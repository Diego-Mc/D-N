import { emailService } from '../service/email.service.js'

import emailCompose from '../cmps/email-compose.cmp.js'
import emailFilter from '../cmps/email-filter.cmp.js'
import emailFolderList from '../cmps/email-folder-list.cmp.js'
import emailList from '../cmps/email-list.cmp.js'
import emailDetails from '../cmps/email-details.cmp.js'

export default {
  template: /* HTML */ `
    <main class="email-main">
      <email-folder-list />
      <email-list
        v-if="emails"
        @emailSelected="emailSelected"
        :emails="emails" />
      <email-compose @closeCompose="composeClose" v-if="isCompose" />
      <email-details v-else :email="selectedEmail" />
    </main>
  `,
  data() {
    return {
      emails: null,
      selectedEmail: null,
      isCompose: false,
      criteria: {
        state: '',
        search: '', // no need to support complex text search
        isRead: undefined, // (optional property, if missing: show all)
        isStared: undefined, // (optional property, if missing: show all)
        lables: [], // has any of the labels
      },
    }
  },
  created() {
    this.criteria.state = this.folderName
    if (!this.folderName) {
      this.$router.push('/maily/inbox')
      this.criteria.state = 'inbox'
    }
    this.getEmailsToShow().then(() => this.setIsCompose())
  },
  methods: {
    emailSelected(email) {
      this.composeClose()
      this.selectedEmail = email
    },
    composeClose() {
      this.$router.push({ query: {} })
      this.isCompose = false
    },
    getEmailsToShow() {
      console.log(this.criteria, this.folderName)
      return emailService
        .query(this.criteria)
        .then((emails) => (this.emails = emails))
    },
    setIsCompose() {
      const isComposing = this.$route.query.isCompose
      if (isComposing === 'true') this.isCompose = true
    },
  },
  computed: {
    folderName() {
      const route = this.$route.matched[1]
      if (!route) return ''
      return route.name
    },
  },
  watch: {
    folderName() {
      this.criteria.state = this.folderName
      this.getEmailsToShow()
    },
    '$route.query': {
      handler() {
        this.setIsCompose()
      },
      deep: true,
    },
  },
  components: {
    emailFolderList,
    emailList,
    emailDetails,
    emailCompose,
  },
}
