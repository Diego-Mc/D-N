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
      <email-list @emailSelected="emailSelected" :emails="emails" />
      <email-compose @sentEmail="emailSent" v-if="isCompose" />
      <email-details v-else :email="selectedEmail" />
    </main>
  `,
  data() {
    return {
      emails: null,
      selectedEmail: null,
      isCompose: true,
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
    this.getEmailsToShow()
  },
  methods: {
    emailSelected(email) {
      this.selectedEmail = email
    },
    emailSent(email) {
      this.isCompose = false
    },
    getEmailsToShow() {
      emailService.query(this.criteria).then((emails) => (this.emails = emails))
    },
  },
  computed: {
    folderName() {
      const path = this.$route.path
      if (path === '/maily') return ''
      return path.replace('/maily/', '')
    },
  },
  watch: {
    folderName() {
      this.criteria.state = this.folderName
      this.getEmailsToShow()
    },
  },
  components: {
    emailFolderList,
    emailList,
    emailDetails,
    emailCompose,
  },
}
